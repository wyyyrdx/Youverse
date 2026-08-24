import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  z: number
  baseX: number
  baseY: number
  size: number
  alpha: number
  speed: number
  phase: number
  tint: 'white' | 'violet' | 'cyan'
}

export default function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouse = useRef({ x: 0.5, y: 0.5 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let particles: Particle[] = []
    let w = 0
    let h = 0
    let raf = 0
    let t0 = performance.now()

    const spawn = () => {
      w = window.innerWidth
      h = Math.max(window.innerHeight, document.documentElement.scrollHeight)
      canvas.width = w
      canvas.height = h

      const count = Math.min(650, Math.floor((w * h) / 2800))
      particles = Array.from({ length: count }, () => {
        const z = Math.random()
        const r = Math.random()
        const tint: Particle['tint'] =
          r > 0.92 ? 'violet' : r > 0.84 ? 'cyan' : 'white'
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          z,
          baseX: 0,
          baseY: 0,
          size: z > 0.85 ? Math.random() * 2.2 + 0.8 : Math.random() * 1.2 + 0.2,
          alpha: z * 0.55 + 0.15 + (tint !== 'white' ? 0.15 : 0),
          speed: 0.003 + z * 0.012,
          phase: Math.random() * Math.PI * 2,
          tint,
        }
      })
      particles.forEach((p) => {
        p.baseX = p.x
        p.baseY = p.y
      })
    }

    const onMove = (e: MouseEvent) => {
      mouse.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      }
    }

    const color = (p: Particle, a: number) => {
      if (p.tint === 'violet') return `rgba(200, 140, 255, ${a})`
      if (p.tint === 'cyan') return `rgba(120, 220, 255, ${a})`
      return `rgba(233, 231, 245, ${a})`
    }

    const draw = (now: number) => {
      const t = (now - t0) / 1000
      ctx.clearRect(0, 0, w, h)

      // faint nebula washes
      const g1 = ctx.createRadialGradient(w * 0.3, h * 0.4, 0, w * 0.3, h * 0.4, w * 0.45)
      g1.addColorStop(0, 'rgba(90, 40, 140, 0.08)')
      g1.addColorStop(1, 'transparent')
      ctx.fillStyle = g1
      ctx.fillRect(0, 0, w, h)

      const g2 = ctx.createRadialGradient(w * 0.75, h * 0.55, 0, w * 0.75, h * 0.55, w * 0.4)
      g2.addColorStop(0, 'rgba(30, 80, 140, 0.06)')
      g2.addColorStop(1, 'transparent')
      ctx.fillStyle = g2
      ctx.fillRect(0, 0, w, h)

      const mx = (mouse.current.x - 0.5) * 2
      const my = (mouse.current.y - 0.5) * 2

      for (const p of particles) {
        const parallax = reduced ? 0 : p.z * 36
        const driftX = reduced ? 0 : Math.sin(t * p.speed + p.phase) * (2 + p.z * 4)
        const driftY = reduced ? 0 : Math.cos(t * p.speed * 0.7 + p.phase) * (1.5 + p.z * 3)

        p.x = p.baseX + mx * parallax + driftX
        p.y = p.baseY + my * parallax + driftY

        const twinkle = reduced
          ? p.alpha
          : p.alpha * (0.55 + 0.45 * Math.sin(t * (0.8 + p.speed * 20) + p.phase))

        ctx.beginPath()
        ctx.fillStyle = color(p, twinkle)
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()

        if (p.size > 1.4 && twinkle > 0.5) {
          ctx.beginPath()
          ctx.fillStyle = color(p, twinkle * 0.35)
          ctx.arc(p.x, p.y, p.size * 2.4, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      if (!reduced) raf = requestAnimationFrame(draw)
    }

    spawn()
    draw(performance.now())
    window.addEventListener('resize', spawn)
    window.addEventListener('mousemove', onMove, { passive: true })

    return () => {
      window.removeEventListener('resize', spawn)
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-void pointer-events-none">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />
    </div>
  )
}
