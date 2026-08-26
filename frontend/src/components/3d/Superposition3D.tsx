import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { FutureSelf } from '../../types'
import OrbitRing3D from './OrbitRing3D'
import FutureNode3D from './FutureNode3D'

interface Superposition3DProps {
  futureSelves: FutureSelf[]
  activeId: string | null
  onHoverNode: (id: string | null) => void
  onSelectNode: (self: FutureSelf) => void
  onSelectPresent: () => void
}

export default function Superposition3D({
  futureSelves,
  activeId,
  onHoverNode,
  onSelectNode,
  onSelectPresent,
}: Superposition3DProps) {
  const groupRef = useRef<THREE.Group>(null)
  const presentCoreRef = useRef<THREE.Mesh>(null)
  const auraRef = useRef<THREE.Mesh>(null)

  useFrame((state, delta) => {
    if (presentCoreRef.current) {
      presentCoreRef.current.rotation.y += delta * 0.25
    }
    if (auraRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05
      auraRef.current.scale.set(scale, scale, scale)
    }

    // Subtle natural tilt
    if (groupRef.current) {
      const targetY = (state.pointer.x * Math.PI) / 12
      const targetX = (-state.pointer.y * Math.PI) / 16
      groupRef.current.rotation.y += (targetY - groupRef.current.rotation.y) * 0.04
      groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * 0.04
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* ================================================================= */}
      {/* 1. CENTRAL PRESENT PLANET (THE PRESENT SELF)                      */}
      {/* ================================================================= */}
      <group
        onClick={(e) => {
          e.stopPropagation()
          onSelectPresent()
        }}
        onPointerOver={() => onHoverNode('present')}
        onPointerOut={() => onHoverNode(null)}
      >
        {/* Present Core Mesh */}
        <mesh ref={presentCoreRef}>
          <sphereGeometry args={[0.9, 48, 48]} />
          <meshStandardMaterial
            color="#081024"
            emissive="#2fe4ff"
            emissiveIntensity={1.2}
            roughness={0.25}
            metalness={0.8}
          />
        </mesh>

        {/* Present Pulsing Energy Aura */}
        <mesh ref={auraRef}>
          <sphereGeometry args={[1.05, 32, 32]} />
          <meshBasicMaterial
            color="#e63cff"
            transparent
            opacity={0.25}
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Present Outer Atmospheric Glow */}
        <mesh>
          <sphereGeometry args={[1.3, 32, 32]} />
          <meshBasicMaterial
            color="#2fe4ff"
            transparent
            opacity={0.1}
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>

      {/* ================================================================= */}
      {/* 2. CONCENTRIC 3D ORBITAL RINGS                                    */}
      {/* ================================================================= */}
      {futureSelves.map((self) => {
        const worldRadius = (self.orbitRadius / 400) * 5.4 + 1.2
        return (
          <OrbitRing3D
            key={`ring-${self.id}`}
            radius={worldRadius}
            color={self.color}
            isActive={activeId === self.id}
          />
        )
      })}

      {/* ================================================================= */}
      {/* 3. ORBITING FUTURE NODES                                          */}
      {/* ================================================================= */}
      {futureSelves.map((self) => (
        <FutureNode3D
          key={`node-${self.id}`}
          self={self}
          orbitRadius={self.orbitRadius}
          orbitDuration={self.orbitDuration}
          orbitOffset={self.orbitOffset}
          isActive={activeId === self.id}
          onHover={onHoverNode}
          onSelect={onSelectNode}
        />
      ))}
    </group>
  )
}
