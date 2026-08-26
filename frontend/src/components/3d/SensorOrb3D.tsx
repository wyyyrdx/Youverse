import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function SensorOrbMesh({ motionActive = false }: { motionActive?: boolean }) {
  const sphereRef = useRef<THREE.Mesh>(null)
  const wireRef = useRef<THREE.Mesh>(null)

  useFrame((state, delta) => {
    const speed = motionActive ? delta * 1.5 : delta * 0.4
    if (sphereRef.current) {
      sphereRef.current.rotation.y += speed
    }
    if (wireRef.current) {
      wireRef.current.rotation.y -= speed * 0.7
      wireRef.current.rotation.z += speed * 0.3
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.06
      wireRef.current.scale.set(pulse, pulse, pulse)
    }
  })

  return (
    <group>
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 3, 3]} intensity={1.8} />
      <pointLight position={[0, 0, 0]} intensity={2.0} color="#7bffb0" />

      <mesh ref={sphereRef}>
        <sphereGeometry args={[1.2, 36, 36]} />
        <meshStandardMaterial
          color="#040d1a"
          emissive={motionActive ? '#7bffb0' : '#2fe4ff'}
          emissiveIntensity={1.4}
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>

      <mesh ref={wireRef}>
        <sphereGeometry args={[1.45, 24, 24]} />
        <meshStandardMaterial
          color="#e63cff"
          emissive="#ffd166"
          emissiveIntensity={0.8}
          wireframe
          transparent
          opacity={0.4}
        />
      </mesh>
    </group>
  )
}

export default function SensorOrb3D({
  motionActive = false,
  className = 'w-28 h-28',
}: {
  motionActive?: boolean
  className?: string
}) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 3.8], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <SensorOrbMesh motionActive={motionActive} />
      </Canvas>
    </div>
  )
}
