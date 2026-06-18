import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // 忽略构建产物、本地 worktree 副本、Unity 生成代码（避免 lint 噪声淹没真实问题）
  globalIgnores(['dist', '.claude', 'public/game', '梆鼓咚webGL', '.playwright-mcp']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
  {
    // Vercel serverless 函数与 Vite 配置运行在 Node 环境
    files: ['api/**/*.js', 'vite.config.js'],
    languageOptions: {
      globals: globals.node,
    },
  },
])
