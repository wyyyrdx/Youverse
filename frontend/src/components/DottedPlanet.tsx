import { useEffect, useRef } from 'react'

/** Wireframe dotted sphere that parallax-tracks the mouse */
export default function DottedPlanet() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouse = useRef({ x: 0.5, y: 0.5 })
  const target = useRef({ x: 0.5, y: 0.5 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0
    let w = 0
    let h = 0
    let rot = 0

    // Fibonacci sphere points
    const N = 420
    const points: { x: number; y: number; z: number }[] = []
    const golden = Math.PI * (3 - Math.sqrt(5))
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2
      const radius = Math.sqrt(1 - y * y)
      const theta = golden * i
      points.push({
        x: Math.cos(theta) * radius,
        y,
        z: Math.sin(theta) * radius,
      })
    }

    const resize = () => {
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w
      canvas.height = h
    }

    const onMove = (e: MouseEvent) => {
      target.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)

      // smooth follow
      mouse.current.x += (target.current.x - mouse.current.x) * 0.04
      mouse.current.y += (target.current.y - mouse.current.y) * 0.04

      if (!reduced) rot += 0.0018

      const cx = w * 0.72 + (mouse.current.x - 0.5) * 40
      const cy = h * 0.48 + (mouse.current.y - 0.5) * 30
      const R = Math.min(w, h) * 0.28

      const tiltX = (mouse.current.y - 0.5) * 0.35
      const tiltY = (mouse.current.x - 0.5) * 0.45 + rot

      for (const p of points) {
        // rotate around Y then X
        let x = p.x
        let y = p.y
        let z = p.z

        const cosY = Math.cos(tiltY)
        const sinY = Math.sin(tiltY)
        const x1 = x * cosY - z * sinY
        const z1 = x * sinY + z * cosY
        x = x1
        z = z1

        const cosX = Math.cos(tiltX)
        const sinX = Math.sin(tiltX)
        const y1 = y * cosX - z * sinX
        const z2 = y * sinX + z * cosX
        y = y1
        z = z2

        // perspective
        const scale = 1.4 / (1.6 + z)
        const sx = cx + x * R * scale
        const sy = cy + y * R * scale
        const depth = (z + 1) / 2 // 0 back, 1 front
        const alpha = 0.12 + depth * 0.55
        const size = 0.6 + depth * 1.6

        ctx.beginPath()
        ctx.fillStyle = `rgba(240, 238, 255, ${alpha})`
        ctx.arc(sx, sy, size, 0, Math.PI * 2)
        ctx.fill()
      }

      raf = requestAnimationFrame(draw)
    }

    resize()
    draw()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMove, { passive: true })

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden
    />
  )
}
