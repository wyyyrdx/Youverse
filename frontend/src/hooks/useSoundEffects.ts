import { useCallback, useRef } from 'react'

export function useSoundEffects() {
  const audioCtxRef = useRef<AudioContext | null>(null)
  const isMutedRef = useRef<boolean>(true)

  const initAudio = () => {
    if (!audioCtxRef.current && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx()
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume()
    }
  }

  const playHoverTone = useCallback((freq = 440) => {
    if (isMutedRef.current) return
    initAudio()
    const ctx = audioCtxRef.current
    if (!ctx) return

    try {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + 0.12)

      gain.gain.setValueAtTime(0.04, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start()
      osc.stop(ctx.currentTime + 0.12)
    } catch (err) {
      // Audio is a non-critical enhancement; never let it break the UI.
      console.debug('playHoverTone failed silently:', err)
    }
  }, [])

  const playQuantumPulse = useCallback(() => {
    if (isMutedRef.current) return
    initAudio()
    const ctx = audioCtxRef.current
    if (!ctx) return

    try {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(180, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(540, ctx.currentTime + 0.4)

      gain.gain.setValueAtTime(0.06, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start()
      osc.stop(ctx.currentTime + 0.4)
    } catch (err) {
      console.debug('playQuantumPulse failed silently:', err)
    }
  }, [])

  const toggleMute = () => {
    isMutedRef.current = !isMutedRef.current
    return !isMutedRef.current
  }

  return {
    playHoverTone,
    playQuantumPulse,
    toggleMute,
    isMuted: isMutedRef.current,
  }
}
