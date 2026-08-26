import { Canvas, useThree } from '@react-three/fiber'
import { Suspense, useEffect, type ReactNode } from 'react'

interface UniverseCanvasProps {
  children: ReactNode
  className?: string
}

// The scene's orbit system is authored for a comfortable desktop aspect
// ratio. A fixed vertical FOV means horizontal FOV shrinks sharply on
// narrow/portrait viewports, pushing orbit nodes (and their HTML labels)
// outside the visible frame and clipping them against the canvas's
// rounded, overflow-hidden container. This component dollies the camera
// back on narrow viewports so the full orbit system stays in frame.
function ResponsiveCamera() {
  const { camera, size } = useThree()

  useEffect(() => {
    const aspect = size.width / size.height
    // Baseline distance (14) is tuned for aspect ratios >= ~1.4 (desktop).
    // As aspect narrows below that, pull the camera back proportionally.
    const baseline = 1.4
    const distance = aspect < baseline ? 14 * (baseline / Math.max(aspect, 0.45)) : 14
    camera.position.setZ(distance)
    camera.updateProjectionMatrix()
  }, [camera, size])

  return null
}

export default function UniverseCanvas({ children, className = '' }: UniverseCanvasProps) {
  return (
    <div className={`relative w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 14], fov: 45, near: 0.1, far: 1000 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
      >
        <Suspense fallback={null}>
          <ResponsiveCamera />
          <ambientLight intensity={0.35} />
          <directionalLight position={[10, 10, 8]} intensity={1.5} color="#ffffff" />
          <pointLight position={[-10, -10, -5]} intensity={0.8} color="#e63cff" />
          <pointLight position={[0, 0, 0]} intensity={1.2} color="#2fe4ff" />
          {children}
        </Suspense>
      </Canvas>
    </div>
  )
}
