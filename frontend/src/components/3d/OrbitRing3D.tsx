import { useMemo } from 'react'
import * as THREE from 'three'

interface OrbitRing3DProps {
  radius: number
  color: string
  isActive?: boolean
}

export default function OrbitRing3D({ radius, color, isActive = false }: OrbitRing3DProps) {
  const points = useMemo(() => {
    const pts: THREE.Vector3[] = []
    const segments = 128
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2
      pts.push(new THREE.Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius))
    }
    return pts
  }, [radius])

  const lineGeometry = useMemo(() => {
    const geom = new THREE.BufferGeometry().setFromPoints(points)
    return geom
  }, [points])

  // `<line>` is intentionally excluded from @react-three/fiber's typed
  // JSX elements (it would collide with the DOM/SVG `line` element), so we
  // build the THREE.Line objects imperatively and mount them via
  // `<primitive>` to keep this fully typed and TS-clean.
  const primaryLine = useMemo(() => {
    const material = new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity: isActive ? 0.8 : 0.2,
      linewidth: 1,
      blending: THREE.AdditiveBlending,
    })
    return new THREE.Line(lineGeometry, material)
  }, [lineGeometry, color, isActive])

  const glowLine = useMemo(() => {
    const material = new THREE.LineBasicMaterial({
      color: '#ffffff',
      transparent: true,
      opacity: 0.5,
      linewidth: 2,
      blending: THREE.AdditiveBlending,
    })
    return new THREE.Line(lineGeometry, material)
  }, [lineGeometry])

  return (
    <group rotation={[Math.PI / 3.6, 0, 0]}>
      {/* Primary Orbit Line */}
      <primitive object={primaryLine} />

      {/* Glow Halo when active */}
      {isActive && <primitive object={glowLine} />}
    </group>
  )
}
