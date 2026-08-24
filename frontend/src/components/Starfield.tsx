import { useEffect, useRef } from 'react'

interface Star {
  x: number
  y: number
  radius: number
  baseAlpha: number
  twinkleSpeed: number
  phase: number
}

export default function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let stars: Star[] = []
    let width = 0
    let height = 0
    let animationId: number

    const resize = () => {
      width = window.innerWidth
      height = document.documentElement.scrollHeight
      canvas.width = width
      canvas.height = height

      const density = Math.min(220, Math.floor((width * height) / 9000))
      stars = Array.from({ length: density }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.3 + 0.2,
        baseAlpha: Math.random() * 0.6 + 0.25,
        twinkleSpeed: Math.random() * 0.015 + 0.004,
        phase: Math.random() * Math.PI * 2,
      }))
    }

    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height)
      for (const s of stars) {
        const alpha = prefersReducedMotion
          ? s.baseAlpha
          : s.baseAlpha * (0.55 + 0.45 * Math.sin(t * s.twinkleSpeed + s.phase))
        ctx.beginPath()
        ctx.fillStyle = `rgba(233, 231, 245, ${alpha})`
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2)
        ctx.fill()
      }
      if (!prefersReducedMotion) {
        animationId = requestAnimationFrame(draw)
      }
    }

    resize()
    draw(0)

    window.addEventListener('resize', resize)
    return () => {
      window.removeEventListener('resize', resize)
      if (animationId) cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-void">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />
      {/* nebula glows */}
      <div className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-magenta/20 blur-[140px]" />
      <div className="absolute top-1/3 -right-40 h-[600px] w-[600px] rounded-full bg-cyan/15 blur-[160px]" />
      <div className="absolute bottom-0 left-1/4 h-[400px] w-[400px] rounded-full bg-magenta/10 blur-[120px]" />
    </div>
  )
}
