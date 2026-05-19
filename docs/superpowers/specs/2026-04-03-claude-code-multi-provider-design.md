# Claude Code Multi-Provider Support Design

## Overview

Modify the extracted Claude Code source to support 50+ LLM API providers beyond Anthropic, using an adapter pattern with minimal invasion to existing code.

## Key Decisions

- **Protocol strategy**: OpenAI-compatible adapter covers 90%+ providers; Gemini gets a dedicated adapter; Anthropic logic stays untouched
- **Provider selection**: Interactive `/provider` command with preset provider list; `custom` option for arbitrary OpenAI-compatible endpoints
- **Capability degradation**: Best-effort mapping (e.g., OpenAI function calling ↔ Anthropic tool_use, DeepSeek reasoning_content ↔ thinking), silent skip for unsupported features
- **Code organization**: Independent `src/providers/` adapter layer; only 4 existing files modified
- **Target**: Open source project with good developer experience

## Architecture

### Unified Interface

```typescript
// src/providers/types.ts

interface LLMProvider {
  name: string
  displayName: string
  createStreamingRequest(
    params: UnifiedRequestParams,
    signal?: AbortSignal
  ): AsyncGenerator<UnifiedStreamEvent>
  capabilities(): ProviderCapabilities
}

interface ProviderCapabilities {
  thinking: boolean
  toolUse: boolean
  promptCaching: boolean
  vision: boolean
  maxOutputTokens: number
}

interface UnifiedRequestParams {
  model: string
  messages: UnifiedMessage[]
  systemPrompt: string
  tools?: UnifiedToolSchema[]
  maxTokens: number
  thinking?: { enabled: boolean; budgetTokens?: number }
  temperature?: number
}

type UnifiedStreamEvent =
  | { type: 'message_start'; messageId: string }
  | { type: 'text_delta'; text: string }
  | { type: 'tool_use_start'; id: string; name: string }
  | { type: 'tool_input_delta'; delta: string }
  | { type: 'tool_use_end' }
  | { type: 'thinking_delta'; thinking: string }
  | { type: 'message_end'; usage: TokenUsage; stopReason: StopReason }
```

### Provider Registry

```typescript
// src/providers/registry.ts

interface ProviderEntry {
  id: string                    // 'openai', 'deepseek', 'groq', ...
  name: string                  // Display name
  protocol: 'anthropic' | 'openai-compat' | 'gemini'
  baseUrl: string               // Default API endpoint
  defaultModel: string          // Default model name
  envKey?: string               // Env var for API key (e.g., OPENAI_API_KEY)
  models?: string[]             // Available models for interactive selection
}
```

Preset providers include: OpenAI, DeepSeek, Groq, Together.ai, Fireworks, Cerebras, xAI, SiliconFlow, Kimi, MiniMax, Mistral, Cloudflare, DeepInfra, Replicate, Hyperbolic, FriendliAI, Upstage, Nebius, StepFun, Baseten, SambaNova, Parasail, Novita, Alibaba Cloud, Xiaomi, Google Gemini, and a `custom` option for any OpenAI-compatible endpoint.

### Three Adapters

**AnthropicAdapter** (`src/providers/adapters/anthropic.ts`):
- Thinnest layer — wraps existing `getAnthropicClient()` and `queryModel()` logic
- Maps Anthropic native stream events to `UnifiedStreamEvent`
- Zero changes to existing Anthropic code paths

**OpenAICompatAdapter** (`src/providers/adapters/openai-compat.ts`):
- Uses raw `fetch` + SSE parsing (no openai SDK dependency)
- Covers all OpenAI-compatible providers via configurable `baseUrl`
- Format conversion:

| Anthropic | OpenAI |
|---|---|
| `system` param | `messages[0].role = "system"` |
| `tool_use` content block | `tool_calls[]` in assistant message |
| `tool_result` message | `role: "tool"` with `tool_call_id` |
| `thinking` content block | `reasoning_content` (DeepSeek) / skipped |
| `image` content block | `image_url` content part |
| `stop_reason: "tool_use"` | `finish_reason: "tool_calls"` |
| `stop_reason: "end_turn"` | `finish_reason: "stop"` |

**GeminiAdapter** (`src/providers/adapters/gemini.ts`):
- Uses raw `fetch` + SSE for `streamGenerateContent`
- Converts to Gemini's `contents[].parts[]` message format
- Maps `functionDeclarations[]` for tool use
- Supports Gemini thinking via `thinkingConfig`

### Interactive Selection (`/provider` command)

```
/provider        → Interactive: choose provider → enter API key → select model
/provider list   → Show current provider + configured providers
/provider set <id> → Quick switch to pre-configured provider
```

- API key resolution: environment variable first, then interactive input
- Keys persisted to `~/.claude/providers.json` with obfuscation (base64 + XOR, not security-critical since local file; users who need stronger protection should use environment variables instead)
- On first launch without Anthropic key, auto-trigger provider selection
- After switching, display capability summary (tools ✓, thinking ✓, vision ✗)

### Capability Mapping & Degradation

Capabilities determined per-model (not just per-provider):
- `deepseek-reasoner` → thinking: true (via `reasoning_content`)
- `o3`, `o4-mini` → thinking: true (via OpenAI reasoning tokens)
- Most OpenAI-compat models → thinking: false
- All OpenAI-compat → promptCaching: false (skip `cache_control` fields)
- Vision support: assume true, degrade on error

`query.ts` checks `provider.capabilities()` before adding thinking params, cache controls, etc.

## Existing Code Modifications

### `src/services/api/client.ts` (~20 lines added)
- New `getProvider()` function dispatching to adapter based on active provider's protocol

### `src/services/api/claude.ts` (~30 lines changed)
- `queryModel()` gains an `if/else` branch: Anthropic path unchanged, non-Anthropic path calls adapter then `toInternalEvent()` to convert back to existing internal event format
- Critical: `toInternalEvent()` ensures all downstream code (query.ts, tools, UI, compaction) sees identical event format

### `src/utils/model/model.ts` (~10 lines changed)
- `getDefaultModel()` returns provider's default model for non-Anthropic providers
- `normalizeModelStringForAPI()` skips `[1m]` tag cleanup for non-Anthropic models

### `src/commands.ts` (1 line)
- Register `/provider` command

### Files NOT modified
- `src/query.ts` — internal event format unchanged
- `src/tools/` — tool execution is provider-agnostic
- `src/components/` — UI consumes internal message format
- `src/services/compact/` — compaction operates on internal messages
- `src/utils/permissions/` — permission system is model-agnostic
- `src/cost-tracker.ts` — only needs a provider-dimension rate table addition

## New File Structure

```
src/providers/
  types.ts                    — LLMProvider interface, UnifiedStreamEvent, etc.
  registry.ts                 — BUILTIN_PROVIDERS, getActiveProvider(), setActiveProvider()
  storage.ts                  — API key persistence (~/.claude/providers.json)
  capabilities.ts             — Per-model capability lookup table
  sse.ts                      — Generic SSE stream parser (fetch ReadableStream → async generator)
  adapters/
    anthropic.ts              — Wraps existing logic → UnifiedStreamEvent
    openai-compat.ts          — fetch + SSE, format conversion
    gemini.ts                 — Gemini native API adapter
  converters/
    to-openai.ts              — Internal format → OpenAI request format
    from-openai.ts            — OpenAI SSE chunk → UnifiedStreamEvent
    to-gemini.ts              — Internal format → Gemini request format
    from-gemini.ts            — Gemini SSE chunk → UnifiedStreamEvent
    to-internal.ts            — UnifiedStreamEvent → existing internal event format
    from-internal.ts          — Existing internal params → UnifiedRequestParams
src/commands/
  provider.ts                 — /provider command implementation
```

## Implementation Phases

**Phase 1: Foundation**
1. `types.ts` — interface definitions
2. `registry.ts` + `storage.ts` — provider registration and persistence
3. `sse.ts` — SSE stream parser

**Phase 2: OpenAI-Compatible Adapter** (highest coverage)
4. `to-openai.ts` + `from-openai.ts` — format converters
5. `openai-compat.ts` — adapter implementation
6. `to-internal.ts` + `from-internal.ts` — bridge to existing code

**Phase 3: Integration**
7. `client.ts` modification — `getProvider()`
8. `claude.ts` modification — `queryModel()` branch
9. `model.ts` modification — model name passthrough
10. `provider.ts` command + `commands.ts` registration

**Phase 4: Completion**
11. `anthropic.ts` — wrap existing logic
12. `gemini.ts` + converters
13. `capabilities.ts` — capability lookup table

End-to-end testing possible after Phase 3 with any OpenAI-compatible provider.
