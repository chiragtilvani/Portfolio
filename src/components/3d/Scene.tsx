import { Suspense, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer, PerformanceMonitor } from '@react-three/drei'
import * as THREE from 'three'
import { DigitalCore } from './DigitalCore'
import { pointer, story } from '@/lib/scene-store'
import type { DeviceCapabilities } from '@/lib/device'

/** Subtle camera parallax following the pointer. */
function CameraRig({ enabled }: { enabled: boolean }) {
  const { camera } = useThree()
  const target = useRef(new THREE.Vector3(0, 0, 0))
  useFrame((_, delta) => {
    if (!enabled) return
    const dt = Math.min(delta, 0.05)
    const tx = pointer.x * 0.35
    const ty = pointer.y * 0.25
    camera.position.x += (tx - camera.position.x) * dt * 2.2
    camera.position.y += (ty - camera.position.y) * dt * 2.2
    camera.lookAt(target.current)
  })
  return null
}

/** Writes the story opacity to the canvas wrapper so dense sections stay legible. */
function OpacityDriver({ el, isMobile }: { el: React.RefObject<HTMLDivElement | null>; isMobile: boolean }) {
  const current = useRef(1)
  useFrame((_, delta) => {
    if (!el.current) return
    // On small screens the object sits behind the copy, so keep it quieter
    // everywhere except the hero and the contact finale.
    const focus = story.section === 'hero' || story.section === 'contact'
    const target = story.opacity * (isMobile ? (focus ? 0.85 : 0.6) : 1)
    current.current += (target - current.current) * Math.min(1, delta * 3)
    el.current.style.opacity = current.current.toFixed(3)
  })
  return null
}

interface SceneProps {
  caps: DeviceCapabilities
}

const PARTICLES: Record<DeviceCapabilities['quality'], number> = { low: 500, medium: 1100, high: 2200 }

/**
 * Persistent full-screen WebGL layer behind the page. The Digital Core
 * morphs through the story stages as the user scrolls.
 */
export function Scene({ caps }: SceneProps) {
  const wrapper = useRef<HTMLDivElement>(null)
  const maxDpr = caps.quality === 'high' ? Math.min(2, caps.pixelRatio) : caps.quality === 'medium' ? 1.5 : 1
  const [dpr, setDpr] = useState(maxDpr)
  const [degraded, setDegraded] = useState(false)
  const particleCount = degraded ? PARTICLES.low : PARTICLES[caps.quality]

  return (
    <div
      ref={wrapper}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden
      style={{ contain: 'strict' }}
    >
      <Canvas
        dpr={dpr}
        camera={{ position: [0, 0, 6.2], fov: 38, near: 0.1, far: 40 }}
        gl={{
          antialias: caps.quality !== 'low',
          alpha: true,
          powerPreference: caps.isMobile ? 'default' : 'high-performance',
          stencil: false,
          failIfMajorPerformanceCaveat: false,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0)
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 1.1
        }}
        frameloop="always"
      >
        <PerformanceMonitor
          onDecline={() => setDpr(1)}
          onIncline={() => setDpr(maxDpr)}
          flipflops={3}
          onFallback={() => {
            setDpr(1)
            setDegraded(true)
          }}
        />
        <Suspense fallback={null}>
          {/* Direct lights carry the look on their own, so the object stays
              readable even if a mobile GPU cannot render the environment map. */}
          <ambientLight intensity={0.35} />
          <hemisphereLight args={['#9fd9ff', '#1a1030', 0.7]} />
          <directionalLight position={[4, 6, 5]} intensity={2.2} color="#ffffff" />
          <directionalLight position={[-5, -3, 4]} intensity={0.9} color="#8b7cf6" />
          <pointLight position={[3, 2.5, 3]} intensity={30} color="#4fc3ff" distance={14} decay={2} />
          <pointLight position={[-4, -2, 2]} intensity={18} color="#8b7cf6" distance={14} decay={2} />
          {caps.quality !== 'low' && (
            <Environment resolution={caps.isMobile ? 64 : 128} frames={1}>
              <Lightformer intensity={2} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={[10, 10, 1]} />
              <Lightformer intensity={1.2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={[10, 2, 1]} color="#8b7cf6" />
              <Lightformer intensity={1.5} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={[20, 2, 1]} color="#4fc3ff" />
              <Lightformer intensity={0.6} position={[0, -5, 0]} rotation-x={-Math.PI / 2} scale={[10, 10, 1]} />
            </Environment>
          )}
          <DigitalCore
            particleCount={particleCount}
            pixelRatio={dpr}
            reducedMotion={caps.prefersReducedMotion}
            isMobile={caps.isMobile}
          />
          <CameraRig enabled={!caps.prefersReducedMotion && !caps.isTouch} />
          <OpacityDriver el={wrapper} isMobile={caps.isMobile} />
        </Suspense>
      </Canvas>
    </div>
  )
}

export default Scene
