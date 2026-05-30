let _ctx = null
let _muted = localStorage.getItem('zapfy_muted') === 'true'

function ac() {
  if (!_ctx) _ctx = new (window.AudioContext || window.webkitAudioContext)()
  return _ctx
}

function tone(freq, dur, type = 'sine', vol = 0.35) {
  if (_muted) return
  try {
    const ctx = ac()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = type
    osc.frequency.setValueAtTime(freq, ctx.currentTime)
    gain.gain.setValueAtTime(vol, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur + 0.02)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + dur + 0.05)
  } catch (_) {}
}

export function playCorrect() {
  tone(523, 0.08)
  setTimeout(() => tone(659, 0.12), 85)
}

export function playWrong() {
  tone(220, 0.18, 'sawtooth', 0.28)
  setTimeout(() => tone(185, 0.14, 'sawtooth', 0.18), 90)
}

export function playComplete() {
  tone(523, 0.14)
  setTimeout(() => tone(659, 0.14), 155)
  setTimeout(() => tone(784, 0.26), 310)
}

export function playTap() {
  tone(820, 0.04, 'square', 0.12)
}

export function isMuted() { return _muted }

export function setMuted(val) {
  _muted = val
  localStorage.setItem('zapfy_muted', val ? 'true' : 'false')
}
