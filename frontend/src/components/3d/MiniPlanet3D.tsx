import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function MiniPlanetMesh({ color, glowColor }: { color: string; glowColor: string }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const auraRef = useRef<THREE.Mesh>(null)

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.4
      meshRef.current.rotation.x += delta * 0.1
    }
  })

  return (
    <group>
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 4, 4]} intensity={1.5} />
      <pointLight position={[0, 0, 0]} intensity={1.2} color={color} />

      <mesh ref={meshRef}>
        <sphereGeometry args={[1.4, 48, 48]} />
        <meshStandardMaterial
          color="#060919"
          emissive={color}
          emissiveIntensity={1.1}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      <mesh ref={auraRef}>
        <sphereGeometry args={[1.65, 32, 32]} />
        <meshBasicMaterial
          color={glowColor || color}
          transparent
          opacity={0.3}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  )
}

export default function MiniPlanet3D({
  color = '#2fe4ff',
  glowColor = '#e63cff',
  className = 'w-32 h-32 md:w-44 md:h-44',
}: {
  color?: string
  glowColor?: string
  className?: string
}) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <MiniPlanetMesh color={color} glowColor={glowColor} />
      </Canvas>
    </div>
  )
}
