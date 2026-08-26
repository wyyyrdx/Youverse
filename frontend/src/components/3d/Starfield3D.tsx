import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Starfield3D({ count = 1800 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null)

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const cols = new Float32Array(count * 3)

    const colorChoices = [
      new THREE.Color('#ffffff'),
      new THREE.Color('#e9e7f5'),
      new THREE.Color('#2fe4ff'),
      new THREE.Color('#e63cff'),
      new THREE.Color('#7bffb0'),
      new THREE.Color('#ffd166'),
    ]

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      // Distribute in a spherical shell with depth
      const radius = 15 + Math.random() * 70
      const theta = 2 * Math.PI * Math.random()
      const phi = Math.acos(2 * Math.random() - 1)

      pos[i3] = radius * Math.sin(phi) * Math.cos(theta)
      pos[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      pos[i3 + 2] = radius * Math.cos(phi)

      const color = colorChoices[Math.floor(Math.random() * colorChoices.length)]
      cols[i3] = color.r
      cols[i3 + 1] = color.g
      cols[i3 + 2] = color.b
    }

    return [pos, cols]
  }, [count])

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.015
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.04
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.14}
        vertexColors
        transparent
        opacity={0.85}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}
