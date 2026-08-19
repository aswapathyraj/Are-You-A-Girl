import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

/**
 * Tiny Web Audio sound engine.
 *
 * Every effect is synthesised on the fly, so the project ships with no audio
 * assets and makes no network requests. Sound starts OFF: the AudioContext is
 * only created once the user actually enables it, so nothing ever autoplays.
 */

const SoundContext = createContext(null)

function createNoiseBuffer(ctx) {
  const length = Math.floor(ctx.sampleRate * 2)
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < length; i += 1) data[i] = Math.random() * 2 - 1
  return buffer
}

export function SoundProvider({ children }) {
  const [enabled, setEnabled] = useState(false)
  const ref = useRef({ ctx: null, master: null, noise: null, scan: null })

  const ensure = useCallback(() => {
    const store = ref.current
    if (!store.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      if (!AudioCtx) return null
      store.ctx = new AudioCtx()
      store.master = store.ctx.createGain()
      store.master.gain.value = 0.85
      store.master.connect(store.ctx.destination)
    }
    if (store.ctx.state === 'suspended') store.ctx.resume().catch(() => {})
    return store.ctx
  }, [])

  const stopScan = useCallback(() => {
    const store = ref.current
    const scan = store.scan
    if (!scan || !store.ctx) return
    store.scan = null
    const now = store.ctx.currentTime
    try {
      scan.gain.gain.cancelScheduledValues(now)
      scan.gain.gain.setValueAtTime(scan.gain.gain.value, now)
      scan.gain.gain.linearRampToValueAtTime(0.0001, now + 0.25)
      scan.source.stop(now + 0.3)
      scan.lfo.stop(now + 0.3)
    } catch {
      /* already stopped */
    }
  }, [])

  const play = useCallback(
    (name, force = false) => {
      if (!enabled && !force) return
      const ctx = ensure()
      if (!ctx) return
      const master = ref.current.master
      const t = ctx.currentTime

      /** Simple pitched blip helper. */
      const blip = ({ type = 'sine', from, to, dur, gain, delay = 0, cutoff }) => {
        const start = t + delay
        const osc = ctx.createOscillator()
        const amp = ctx.createGain()
        osc.type = type
        osc.frequency.setValueAtTime(from, start)
        osc.frequency.exponentialRampToValueAtTime(Math.max(20, to), start + dur)
        amp.gain.setValueAtTime(0.0001, start)
        amp.gain.exponentialRampToValueAtTime(gain, start + 0.012)
        amp.gain.exponentialRampToValueAtTime(0.0001, start + dur)
        if (cutoff) {
          const filter = ctx.createBiquadFilter()
          filter.type = 'lowpass'
          filter.frequency.value = cutoff
          osc.connect(filter).connect(amp).connect(master)
        } else {
          osc.connect(amp).connect(master)
        }
        osc.start(start)
        osc.stop(start + dur + 0.05)
      }

      /** Short filtered noise burst. */
      const burst = ({ freq = 1200, q = 1, dur = 0.22, gain = 0.05, delay = 0 }) => {
        const store = ref.current
        if (!store.noise) store.noise = createNoiseBuffer(ctx)
        const start = t + delay
        const source = ctx.createBufferSource()
        source.buffer = store.noise
        const band = ctx.createBiquadFilter()
        band.type = 'bandpass'
        band.frequency.value = freq
        band.Q.value = q
        const amp = ctx.createGain()
        amp.gain.setValueAtTime(0.0001, start)
        amp.gain.exponentialRampToValueAtTime(gain, start + 0.02)
        amp.gain.exponentialRampToValueAtTime(0.0001, start + dur)
        source.connect(band).connect(amp).connect(master)
        source.start(start)
        source.stop(start + dur + 0.05)
      }

      try {
        switch (name) {
          case 'click':
            blip({ type: 'triangle', from: 660, to: 990, dur: 0.13, gain: 0.05 })
            blip({ type: 'sine', from: 1320, to: 1600, dur: 0.08, gain: 0.018 })
            break
          case 'tick':
            blip({ type: 'sine', from: 880, to: 1180, dur: 0.09, gain: 0.03 })
            break
          case 'error':
            blip({ type: 'square', from: 260, to: 130, dur: 0.17, gain: 0.042, cutoff: 1400 })
            blip({ type: 'square', from: 190, to: 110, dur: 0.14, gain: 0.024, cutoff: 1100, delay: 0.07 })
            break
          case 'force':
            blip({ type: 'sine', from: 540, to: 400, dur: 0.14, gain: 0.045 })
            blip({ type: 'sine', from: 400, to: 300, dur: 0.18, gain: 0.04, delay: 0.11 })
            burst({ freq: 2200, q: 2, dur: 0.1, gain: 0.02, delay: 0.02 })
            break
          case 'complete':
            blip({ type: 'sine', from: 784, to: 784, dur: 0.16, gain: 0.045 })
            blip({ type: 'sine', from: 1046, to: 1046, dur: 0.4, gain: 0.04, delay: 0.13 })
            break
          case 'reveal': {
            const start = t
            const osc = ctx.createOscillator()
            const sub = ctx.createOscillator()
            const filter = ctx.createBiquadFilter()
            const amp = ctx.createGain()
            osc.type = 'sawtooth'
            sub.type = 'sine'
            osc.frequency.setValueAtTime(146, start)
            osc.frequency.exponentialRampToValueAtTime(66, start + 1.1)
            sub.frequency.setValueAtTime(58, start)
            filter.type = 'lowpass'
            filter.frequency.setValueAtTime(260, start)
            filter.frequency.exponentialRampToValueAtTime(2200, start + 0.35)
            filter.frequency.exponentialRampToValueAtTime(400, start + 1.1)
            amp.gain.setValueAtTime(0.0001, start)
            amp.gain.exponentialRampToValueAtTime(0.075, start + 0.05)
            amp.gain.exponentialRampToValueAtTime(0.0001, start + 1.15)
            osc.connect(filter)
            sub.connect(filter)
            filter.connect(amp).connect(master)
            osc.start(start)
            sub.start(start)
            osc.stop(start + 1.2)
            sub.stop(start + 1.2)
            burst({ freq: 1400, q: 0.8, dur: 0.3, gain: 0.045 })
            break
          }
          case 'on':
            blip({ type: 'sine', from: 587, to: 880, dur: 0.16, gain: 0.045 })
            break
          default:
            break
        }
      } catch {
        /* audio is a nice-to-have; never let it break the page */
      }
    },
    [enabled, ensure],
  )

  const startScan = useCallback(() => {
    if (!enabled) return
    const ctx = ensure()
    if (!ctx) return
    const store = ref.current
    if (store.scan) return
    try {
      if (!store.noise) store.noise = createNoiseBuffer(ctx)
      const now = ctx.currentTime
      const source = ctx.createBufferSource()
      source.buffer = store.noise
      source.loop = true

      const band = ctx.createBiquadFilter()
      band.type = 'bandpass'
      band.frequency.value = 760
      band.Q.value = 1.4

      const lfo = ctx.createOscillator()
      const lfoGain = ctx.createGain()
      lfo.frequency.value = 0.38
      lfoGain.gain.value = 420
      lfo.connect(lfoGain).connect(band.frequency)

      const gain = ctx.createGain()
      gain.gain.setValueAtTime(0.0001, now)
      gain.gain.linearRampToValueAtTime(0.028, now + 0.7)

      source.connect(band).connect(gain).connect(store.master)
      source.start(now)
      lfo.start(now)
      store.scan = { source, lfo, gain }
    } catch {
      /* ignore */
    }
  }, [enabled, ensure])

  const toggle = useCallback(() => {
    const next = !enabled
    setEnabled(next)
    if (next) play('on', true)
    else stopScan()
  }, [enabled, play, stopScan])

  // Release audio resources if the app unmounts.
  useEffect(
    () => () => {
      stopScan()
      const store = ref.current
      if (store.ctx) store.ctx.close().catch(() => {})
      store.ctx = null
    },
    [stopScan],
  )

  const value = useMemo(
    () => ({ enabled, toggle, play, startScan, stopScan }),
    [enabled, toggle, play, startScan, stopScan],
  )

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
}

export function useSound() {
  const ctx = useContext(SoundContext)
  if (!ctx) throw new Error('useSound must be used inside <SoundProvider>')
  return ctx
}
