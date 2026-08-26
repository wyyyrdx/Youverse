import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function HeroPlanet3D() {
  const planetRef = useRef<THREE.Group>(null)
  const coreMeshRef = useRef<THREE.Mesh>(null)
  const cloudMeshRef = useRef<THREE.Mesh>(null)
  const ringRef = useRef<THREE.Mesh>(null)

  useFrame((state, delta) => {
    if (coreMeshRef.current) {
      coreMeshRef.current.rotation.y += delta * 0.12
    }
    if (cloudMeshRef.current) {
      cloudMeshRef.current.rotation.y -= delta * 0.06
      cloudMeshRef.current.rotation.x += delta * 0.02
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.04
    }

    // Subtle pointer parallax tilt
    if (planetRef.current) {
      const targetX = (state.pointer.x * Math.PI) / 8
      const targetY = (-state.pointer.y * Math.PI) / 8
      planetRef.current.rotation.y += (targetX - planetRef.current.rotation.y) * 0.04
      planetRef.current.rotation.x += (targetY - planetRef.current.rotation.x) * 0.04
    }
  })

  return (
    <group ref={planetRef} position={[0, 0, 0]}>
      {/* Outer Atmospheric Fresnel Glow */}
      <mesh>
        <sphereGeometry args={[2.7, 48, 48]} />
        <meshBasicMaterial
          color="#2fe4ff"
          transparent
          opacity={0.12}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Secondary Magenta Aura */}
      <mesh>
        <sphereGeometry args={[2.9, 32, 32]} />
        <meshBasicMaterial
          color="#e63cff"
          transparent
          opacity={0.06}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Main Celestial Core */}
      <mesh ref={coreMeshRef}>
        <sphereGeometry args={[2.4, 64, 64]} />
        <meshStandardMaterial
          color="#0c122b"
          emissive="#122550"
          emissiveIntensity={0.6}
          roughness={0.35}
          metalness={0.7}
        />
      </mesh>

      {/* Quantum Lattice / Atmosphere Clouds */}
      <mesh ref={cloudMeshRef}>
        <sphereGeometry args={[2.48, 40, 40]} />
        <meshStandardMaterial
          color="#2fe4ff"
          emissive="#e63cff"
          emissiveIntensity={0.4}
          wireframe
          transparent
          opacity={0.28}
        />
      </mesh>

      {/* Equator Energy Ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2.3, 0.2, 0]}>
        <torusGeometry args={[3.6, 0.02, 16, 100]} />
        <meshStandardMaterial
          color="#2fe4ff"
          emissive="#2fe4ff"
          emissiveIntensity={1.8}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Floating Spark Particles */}
      <points>
        <sphereGeometry args={[3.2, 24, 24]} />
        <pointsMaterial
          size={0.04}
          color="#7bffb0"
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  )
}
