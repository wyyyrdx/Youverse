import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import type { FutureSelf } from '../../types'

interface FutureNode3DProps {
  self: FutureSelf
  orbitRadius: number
  orbitDuration: number
  orbitOffset: number
  isActive: boolean
  onHover: (id: string | null) => void
  onSelect: (self: FutureSelf) => void
}

export default function FutureNode3D({
  self,
  orbitRadius,
  orbitDuration,
  orbitOffset,
  isActive,
  onHover,
  onSelect,
}: FutureNode3DProps) {
  const nodeRef = useRef<THREE.Group>(null)
  const sphereRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  // Scale factor to map 2D px orbit radius to 3D world space
  const worldRadius = (orbitRadius / 400) * 5.4 + 1.2

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const speed = (2 * Math.PI) / (orbitDuration * 0.8)
    const angle = (orbitOffset * Math.PI) / 180 + t * speed

    // Elliptical planar position with tilt
    const x = Math.cos(angle) * worldRadius
    const z = Math.sin(angle) * worldRadius

    // Rotate along tilted orbit plane (Math.PI / 3.6)
    const tilt = Math.PI / 3.6
    const rotX = x
    const rotY = -z * Math.sin(tilt)
    const rotZ = z * Math.cos(tilt)

    if (nodeRef.current) {
      nodeRef.current.position.set(rotX, rotY, rotZ)
    }

    if (sphereRef.current) {
      sphereRef.current.rotation.y += 0.02
    }
  })

  const isHighlighted = isActive || hovered

  return (
    <group ref={nodeRef}>
      {/* Clickable Sphere Node */}
      <mesh
        ref={sphereRef}
        scale={isHighlighted ? 1.35 : 1.0}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(true)
          onHover(self.id)
        }}
        onPointerOut={(e) => {
          e.stopPropagation()
          setHovered(false)
          onHover(null)
        }}
        onClick={(e) => {
          e.stopPropagation()
          onSelect(self)
        }}
      >
        <sphereGeometry args={[0.32, 32, 32]} />
        <meshStandardMaterial
          color={self.color}
          emissive={self.color}
          emissiveIntensity={isHighlighted ? 1.8 : 0.8}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Atmospheric Halo */}
      <mesh scale={isHighlighted ? 1.8 : 1.35}>
        <sphereGeometry args={[0.32, 16, 16]} />
        <meshBasicMaterial
          color={self.color}
          transparent
          opacity={isHighlighted ? 0.35 : 0.12}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Dynamic 3D Floating HTML Label */}
      <Html
        position={[0, 0.55, 0]}
        center
        distanceFactor={11}
        className="pointer-events-none select-none transition-opacity duration-300"
        style={{
          opacity: isHighlighted ? 1 : 0.65,
        }}
      >
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono whitespace-nowrap backdrop-blur-md transition-all duration-300 ${
            isHighlighted
              ? 'bg-void-panel/95 border border-white/30 scale-105 shadow-lg'
              : 'bg-void/70 border border-white/10'
          }`}
          style={{
            borderColor: isHighlighted ? self.color : 'rgba(255,255,255,0.1)',
            boxShadow: isHighlighted ? `0 0 16px ${self.glow}` : 'none',
          }}
        >
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: self.color }}
          />
          <span className="font-medium text-mist">{self.name}</span>
          <span className="text-mist-faint">·</span>
          <span className="font-bold" style={{ color: self.color }}>
            {self.score}%
          </span>
        </div>
      </Html>
    </group>
  )
}
