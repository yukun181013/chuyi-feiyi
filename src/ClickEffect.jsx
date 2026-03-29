import { useCallback, useEffect, useState } from 'react'

// ── CSS keyframe animations injected once into <head> ─────────────────────────
const STYLES = `
  @keyframes ce-ink-ring {
    0%   { transform: translate(-50%, -50%) scale(0); opacity: 0.85; }
    55%  { opacity: 0.45; }
    100% { transform: translate(-50%, -50%) scale(9); opacity: 0; }
  }
  @keyframes ce-ink-ring-gold {
    0%   { transform: translate(-50%, -50%) scale(0); opacity: 0.7; }
    50%  { opacity: 0.35; }
    100% { transform: translate(-50%, -50%) scale(6); opacity: 0; }
  }
  @keyframes ce-ink-dot {
    0%   { transform: translate(-50%, -50%) scale(0); opacity: 1; }
    30%  { transform: translate(-50%, -50%) scale(1.1); opacity: 0.9; }
    100% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
  }
  @keyframes ce-petal {
    0%   { opacity: 0.92; transform: translate(-50%, -50%) translate(0px, 0px) rotate(0deg) scale(1); }
    100% { opacity: 0;    transform: translate(-50%, -50%) translate(var(--tx), var(--ty)) rotate(var(--tr)) scale(0.2); }
  }
  @keyframes ce-spark {
    0%   { opacity: 1;  transform: translate(-50%, -50%) translate(0px, 0px) scale(1.2); }
    40%  { opacity: 0.9; }
    100% { opacity: 0;  transform: translate(-50%, -50%) translate(var(--tx), var(--ty)) scale(0); }
  }
  @keyframes ce-char {
    0%   { opacity: 0;   transform: translate(-50%, -50%) translateY(6px) scale(0.5); }
    18%  { opacity: 1;   transform: translate(-50%, -50%) translateY(-4px) scale(1.2); }
    60%  { opacity: 0.9; }
    100% { opacity: 0;   transform: translate(-50%, -50%) translateY(-65px) scale(0.7); }
  }
`

// ── Constants ─────────────────────────────────────────────────────────────────
const AUSPICIOUS_CHARS = ['福', '寿', '吉', '喜', '安', '兴', '祥', '瑞', '和', '顺']
const PETAL_COLORS = ['#C0392B', '#CC2C4A', '#8B1A12', '#D03535', '#A82020', '#B83040']
const SPARK_COLORS = ['#C8A415', '#E0B010', '#FFD700', '#D4A820', '#F0C030']

function rand(min, max) {
  return min + Math.random() * (max - min)
}

// ── Generate all random effect data (called outside of render) ─────────────────
function generateEffectData() {
  const petals = Array.from({ length: 6 }, (_, i) => {
    const angle = (360 / 6) * i + rand(-22, 22)
    const dist = rand(36, 74)
    const rad = (angle * Math.PI) / 180
    return {
      tx: Math.cos(rad) * dist,
      ty: Math.sin(rad) * dist,
      tr: rand(-520, 520),
      color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
      w: Math.round(rand(8, 14)),
      h: Math.round(rand(12, 20)),
      dur: Math.round(rand(820, 1100)),
      delay: Math.round(rand(0, 90)),
    }
  })

  const sparks = Array.from({ length: 5 }, (_, i) => {
    const angle = (360 / 5) * i + rand(-25, 25)
    const dist = rand(16, 40)
    const rad = (angle * Math.PI) / 180
    return {
      tx: Math.cos(rad) * dist,
      ty: Math.sin(rad) * dist,
      color: SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)],
      size: Math.round(rand(3, 6)),
      dur: Math.round(rand(480, 720)),
      delay: Math.round(rand(0, 70)),
    }
  })

  const showChar = Math.random() < 0.25
  const char = AUSPICIOUS_CHARS[Math.floor(Math.random() * AUSPICIOUS_CHARS.length)]

  return { petals, sparks, showChar, char }
}

// ── Single effect burst at one click point ────────────────────────────────────
// All random data is pre-generated and passed via props — this component is pure.
function EffectGroup({ x, y, petals, sparks, showChar, char }) {
  const ABS = { position: 'absolute', left: 0, top: 0 }

  return (
    <div style={{ position: 'fixed', left: x, top: y, pointerEvents: 'none' }}>

      {/* ── Outer crimson ink ring ──────────────────────────────────────────── */}
      <div style={{
        ...ABS,
        width: 30,
        height: 30,
        borderRadius: '50%',
        border: '2.5px solid #C0392B',
        animation: 'ce-ink-ring 0.8s ease-out forwards',
      }} />

      {/* ── Inner gold ink ring (offset timing) ────────────────────────────── */}
      <div style={{
        ...ABS,
        width: 18,
        height: 18,
        borderRadius: '50%',
        border: '1.5px solid rgba(200, 164, 21, 0.75)',
        animation: 'ce-ink-ring-gold 0.6s ease-out 30ms forwards',
      }} />

      {/* ── Center cinnabar dot ─────────────────────────────────────────────── */}
      <div style={{
        ...ABS,
        width: 10,
        height: 10,
        borderRadius: '50%',
        background: 'radial-gradient(circle at 38% 38%, #E04030 0%, #8B1A12 100%)',
        boxShadow: '0 0 8px rgba(192, 57, 43, 0.7)',
        animation: 'ce-ink-dot 0.55s ease-out forwards',
      }} />

      {/* ── Plum blossom petals (梅花瓣) ────────────────────────────────────── */}
      {petals.map((p, i) => (
        <div
          key={i}
          style={{
            ...ABS,
            width: p.w,
            height: p.h,
            '--tx': `${p.tx}px`,
            '--ty': `${p.ty}px`,
            '--tr': `${p.tr}deg`,
            animation: `ce-petal ${p.dur}ms cubic-bezier(.22,.61,.36,1) ${p.delay}ms forwards`,
          }}
        >
          <svg width={p.w} height={p.h} viewBox="0 0 14 20" style={{ display: 'block' }}>
            {/* Petal shape: curved leaf symmetric around vertical axis */}
            <path
              d="M7,19 C2,13 1,6 7,0 C13,6 12,13 7,19 Z"
              fill={p.color}
              opacity="0.87"
            />
            {/* Subtle vein line */}
            <line x1="7" y1="0" x2="7" y2="19" stroke="rgba(255,255,255,0.22)" strokeWidth="0.6" />
          </svg>
        </div>
      ))}

      {/* ── Gold sparks (金星) ───────────────────────────────────────────────── */}
      {sparks.map((s, i) => (
        <div
          key={i}
          style={{
            ...ABS,
            width: s.size,
            height: s.size,
            borderRadius: '50%',
            background: s.color,
            boxShadow: `0 0 ${s.size + 2}px ${s.color}`,
            '--tx': `${s.tx}px`,
            '--ty': `${s.ty}px`,
            animation: `ce-spark ${s.dur}ms ease-out ${s.delay}ms forwards`,
          }}
        />
      ))}

      {/* ── Floating auspicious character (吉祥字) ──────────────────────────── */}
      {showChar && (
        <div style={{
          ...ABS,
          color: '#C8A415',
          fontFamily: "'Noto Serif SC', 'STSong', '华文行楷', serif",
          fontSize: 22,
          fontWeight: 700,
          lineHeight: 1,
          textShadow: '0 0 12px rgba(200,164,21,0.8), 0 0 4px rgba(200,164,21,0.5), 0 2px 6px rgba(0,0,0,0.4)',
          whiteSpace: 'nowrap',
          userSelect: 'none',
          animation: 'ce-char 1.15s ease-out forwards',
        }}>
          {char}
        </div>
      )}
    </div>
  )
}

// ── Main export: mounts once, listens to all clicks ───────────────────────────
export default function ClickEffect() {
  const [effects, setEffects] = useState([])

  // Inject keyframe styles once
  useEffect(() => {
    if (document.getElementById('ce-keyframes')) return
    const el = document.createElement('style')
    el.id = 'ce-keyframes'
    el.textContent = STYLES
    document.head.appendChild(el)
    return () => el.remove()
  }, [])

  const handleClick = useCallback((e) => {
    // Generate all random data here (event handler, not during render)
    const id = Date.now() + Math.random()
    const data = generateEffectData()
    setEffects(prev => [...prev, { id, x: e.clientX, y: e.clientY, ...data }])
    // Clean up after animation completes
    setTimeout(() => setEffects(prev => prev.filter(ef => ef.id !== id)), 1400)
  }, [])

  useEffect(() => {
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [handleClick])

  if (!effects.length) return null

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      pointerEvents: 'none',
      zIndex: 9999,
      overflow: 'hidden',
    }}>
      {effects.map(ef => (
        <EffectGroup
          key={ef.id}
          x={ef.x}
          y={ef.y}
          petals={ef.petals}
          sparks={ef.sparks}
          showChar={ef.showChar}
          char={ef.char}
        />
      ))}
    </div>
  )
}
