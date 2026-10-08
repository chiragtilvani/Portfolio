import { Suspense, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Float, Lightformer } from '@react-three/drei'
import * as THREE from 'three'
import { useIsInView } from '@/hooks/useIsInView'
import { useDeviceCapabilities } from '@/hooks/useDeviceCapabilities'
import { ErrorBoundary } from '@/components/ErrorBoundary'

function Knot() {
  const mesh = useRef<THREE.Mesh>(null)
  const target = useRef({ x: 0, y: 0 })
  const [hover, setHover] = useState(false)
  useFrame((state, delta) => {
    const m = mesh.current
    if (!m) return
    const dt = Math.min(delta, 0.05)
    m.rotation.y += dt * (hover ? 0.9 : 0.35)
    m.rotation.x += (target.current.y - m.rotation.x) * dt * 3
    m.rotation.z += (target.current.x * 0.5 - m.rotation.z) * dt * 3
    const s = 1 + Math.sin(state.clock.elapsedTime * 1.2) * 0.02
    m.scale.setScalar(s)
  })
  return (
    <Float speed={1.4} rotationIntensity={0.4} floatIntensity={0.6}>
      <mesh
        ref={mesh}
        onPointerMove={(e) => {
          target.current = { x: e.point.x * 0.4, y: -e.point.y * 0.4 }
        }}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => {
          setHover(false)
          target.current = { x: 0, y: 0 }
        }}
      >
        <torusKnotGeometry args={[0.72, 0.22, 160, 24, 2, 3]} />
        <meshPhysicalMaterial
          color="#141c27"
          emissive="#0a1726"
          emissiveIntensity={0.6}
          metalness={0.4}
          roughness={0.2}
          clearcoat={1}
          clearcoatRoughness={0.1}
          envMapIntensity={1.8}
          sheen={0.6}
          sheenColor={new THREE.Color('#4fc3ff')}
        />
      </mesh>
    </Float>
  )
}

/** Small self-contained WebGL object; renders only while visible. */
export function RotatingObject() {
  const { ref, inView } = useIsInView<HTMLDivElement>('0px')
  const caps = useDeviceCapabilities()

  return (
    <div ref={ref} className="relative h-full w-full [touch-action:none]">
      {caps.webgl ? (
        inView && (
          <ErrorBoundary fallback={<CssCube />}>
            <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 3.4], fov: 40 }} gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }} frameloop="always">
              <Suspense fallback={null}>
                <ambientLight intensity={0.4} />
                <hemisphereLight args={['#9fd9ff', '#1a1030', 0.6]} />
                <directionalLight position={[3, 4, 5]} intensity={1.8} />
                <pointLight position={[3, 3, 3]} intensity={18} color="#4fc3ff" />
                <pointLight position={[-3, -2, 2]} intensity={10} color="#8b7cf6" />
                {caps.quality !== 'low' && (
                  <Environment resolution={64} frames={1}>
                    <Lightformer intensity={2} rotation-x={Math.PI / 2} position={[0, 4, -6]} scale={[8, 8, 1]} />
                    <Lightformer intensity={1} rotation-y={-Math.PI / 2} position={[6, 0, 0]} scale={[10, 2, 1]} color="#4fc3ff" />
                    <Lightformer intensity={0.8} rotation-y={Math.PI / 2} position={[-6, 0, 0]} scale={[10, 2, 1]} color="#8b7cf6" />
                  </Environment>
                )}
                <Knot />
              </Suspense>
            </Canvas>
          </ErrorBoundary>
        )
      ) : (
        <CssCube />
      )}
      <span className="pointer-events-none absolute bottom-3 left-4 font-mono text-[9.5px] uppercase tracking-[0.2em] text-muted-2">
        {caps.isTouch ? 'drag to spin' : 'hover to spin'}
      </span>
    </div>
  )
}

/** CSS-only wireframe cube used when WebGL is unavailable or fails. */
function CssCube() {
  return (
    <div className="flex h-full items-center justify-center [perspective:600px]">
      <div className="relative h-28 w-28 animate-spin-slow [transform-style:preserve-3d]">
        {['rotateY(0deg)', 'rotateY(90deg)', 'rotateY(180deg)', 'rotateY(-90deg)', 'rotateX(90deg)', 'rotateX(-90deg)'].map((t) => (
          <span key={t} className="absolute inset-0 border border-accent/50 bg-accent/5" style={{ transform: `${t} translateZ(56px)` }} />
        ))}
      </div>
    </div>
  )
}
