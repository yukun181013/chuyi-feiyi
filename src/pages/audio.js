/**
 * 音频工具函数 - 梆鼓咚乐器音效
 */

// 音频上下文引用
const audioCtxRef = { current: null }

// 获取或创建 AudioContext
export function getAudioCtx() {
  if (!audioCtxRef.current) {
    audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)()
  }
  const ctx = audioCtxRef.current
  if (ctx.state === 'suspended') {
    ctx.resume()
  }
  return ctx
}

// 播放鼓声
export function playDrum() {
  const ctx = getAudioCtx()
  const t = ctx.currentTime

  // 低频鼓声
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(150, t)
  osc.frequency.exponentialRampToValueAtTime(40, t + 0.15)
  gain.gain.setValueAtTime(0.8, t)
  gain.gain.exponentialRampToValueAtTime(0.01, t + 0.4)
  osc.connect(gain).connect(ctx.destination)
  osc.start(t)
  osc.stop(t + 0.4)

  // 噪声层
  const buf = ctx.createBuffer(1, ctx.sampleRate * 0.08, ctx.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.3
  }
  const noise = ctx.createBufferSource()
  const ng = ctx.createGain()
  noise.buffer = buf
  ng.gain.setValueAtTime(0.5, t)
  ng.gain.exponentialRampToValueAtTime(0.01, t + 0.08)
  noise.connect(ng).connect(ctx.destination)
  noise.start(t)
}

// 播放梆子声
export function playBangzi() {
  const ctx = getAudioCtx()
  const t = ctx.currentTime

  // 高频木质敲击
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'square'
  osc.frequency.setValueAtTime(800, t)
  osc.frequency.exponentialRampToValueAtTime(300, t + 0.06)
  gain.gain.setValueAtTime(0.4, t)
  gain.gain.exponentialRampToValueAtTime(0.01, t + 0.12)
  osc.connect(gain).connect(ctx.destination)
  osc.start(t)
  osc.stop(t + 0.12)

  // 木质谐波
  const osc2 = ctx.createOscillator()
  const g2 = ctx.createGain()
  osc2.type = 'triangle'
  osc2.frequency.setValueAtTime(1200, t)
  osc2.frequency.exponentialRampToValueAtTime(600, t + 0.05)
  g2.gain.setValueAtTime(0.25, t)
  g2.gain.exponentialRampToValueAtTime(0.01, t + 0.08)
  osc2.connect(g2).connect(ctx.destination)
  osc2.start(t)
  osc2.stop(t + 0.08)
}

// 播放竹板声
export function playZhuban() {
  const ctx = getAudioCtx()
  const t = ctx.currentTime

  // 快板音效
  const clack = (time, vol) => {
    const len = Math.floor(ctx.sampleRate * 0.015) // 15ms 极短
    const buf = ctx.createBuffer(1, len, ctx.sampleRate)
    const d = buf.getChannelData(0)
    for (let i = 0; i < len; i++) {
      const env = Math.exp(-i / (len * 0.15))
      d[i] = (Math.random() * 2 - 1) * env
    }
    const src = ctx.createBufferSource()
    src.buffer = buf

    // 高通滤波
    const hp = ctx.createBiquadFilter()
    hp.type = 'highpass'
    hp.frequency.value = 4000

    // 峰值滤波
    const peak = ctx.createBiquadFilter()
    peak.type = 'peaking'
    peak.frequency.value = 6000
    peak.gain.value = 8
    peak.Q.value = 3

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(vol, time)
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.025)
    src.connect(hp).connect(peak).connect(gain).connect(ctx.destination)
    src.start(time)
  }

  // 经典节奏
  clack(t, 0.9)
  clack(t + 0.1, 0.55)
  clack(t + 0.16, 0.55)
  clack(t + 0.28, 0.85)
}

// 播放醒木声
export function playXingmu() {
  const ctx = getAudioCtx()
  const t = ctx.currentTime

  // 短促木块敲击
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'square'
  osc.frequency.setValueAtTime(500, t)
  osc.frequency.exponentialRampToValueAtTime(200, t + 0.04)
  gain.gain.setValueAtTime(0.6, t)
  gain.gain.exponentialRampToValueAtTime(0.01, t + 0.08)
  osc.connect(gain).connect(ctx.destination)
  osc.start(t)
  osc.stop(t + 0.08)

  // 击打噪声
  const buf = ctx.createBuffer(1, ctx.sampleRate * 0.03, ctx.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.5
  }
  const noise = ctx.createBufferSource()
  const ng = ctx.createGain()
  noise.buffer = buf
  ng.gain.setValueAtTime(0.5, t)
  ng.gain.exponentialRampToValueAtTime(0.01, t + 0.03)
  noise.connect(ng).connect(ctx.destination)
  noise.start(t)
}

// 乐器映射
export const INSTR_SOUNDS = {
  drum: playDrum,
  'sm-drum': playDrum,
  bangzi: playBangzi,
  'sm-bang': playBangzi,
  zhuban: playZhuban,
  xingmu: playXingmu,
}

export const INSTR_NAMES = {
  drum: '鼓',
  'sm-drum': '小鼓',
  bangzi: '梆子',
  'sm-bang': '梆子',
  zhuban: '竹板',
  xingmu: '醒木',
}

export default {
  getAudioCtx,
  playDrum,
  playBangzi,
  playZhuban,
  playXingmu,
  INSTR_SOUNDS,
  INSTR_NAMES
}
