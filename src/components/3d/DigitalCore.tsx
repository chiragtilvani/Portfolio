import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { damp } from 'maath/easing'
import { Particles } from './Particles'
import { buildNodeGraph, PANELS } from './particle-targets'
import { getGlowTexture } from './textures'
import { pointer, scrollState, story } from '@/lib/scene-store'
import { clamp } from '@/lib/utils'

const ACCENT = new THREE.Color('#4fc3ff')
const VIOLET = new THREE.Color('#8b7cf6')

interface DigitalCoreProps {
  particleCount: number
  pixelRatio: number
  reducedMotion: boolean
  isMobile: boolean
}

/** per-stage target values: [hero, nodes, panels, sphere] */
const S = {
  coreScale: [1, 0.55, 0.32, 0.0001],
  edgeOpacity: [0.7, 0.4, 0.2, 0],
  shellScale: [1.5, 2.15, 1.15, 1.1],
  shellOpacity: [0.09, 0.2, 0.04, 0],
  glassScale: [1.22, 0.7, 0.4, 0.0001],
  ringScale: [1, 1.32, 0.78, 1.42],
  ringOpacity: [0.55, 0.45, 0.25, 0.3],
  nodeScale: [0, 1, 0, 0],
  lineOpacity: [0, 0.32, 0, 0],
  panelScale: [0, 0, 1, 0],
  sphereScale: [0, 0, 0, 1],
  glowScale: [2.6, 1.8, 1.6, 4.2],
  glowOpacity: [0.55, 0.3, 0.25, 0.7],
}

const blend = (arr: number[], w: THREE.Vector4) => arr[0] * w.x + arr[1] * w.y + arr[2] * w.z + arr[3] * w.w

export function DigitalCore({ particleCount, pixelRatio, reducedMotion, isMobile }: DigitalCoreProps) {
  const root = useRef<THREE.Group>(null)
  const spin = useRef<THREE.Group>(null)
  const core = useRef<THREE.Mesh>(null)
  const edges = useRef<THREE.LineSegments>(null)
  const glass = useRef<THREE.Mesh>(null)
  const glassEdges = useRef<THREE.LineSegments>(null)
  const shell = useRef<THREE.Mesh>(null)
  const ringA = useRef<THREE.Mesh>(null)
  const ringB = useRef<THREE.Mesh>(null)
  const nodesGroup = useRef<THREE.Group>(null)
  const lines = useRef<THREE.LineSegments>(null)
  const panelsGroup = useRef<THREE.Group>(null)
  const sphere = useRef<THREE.Mesh>(null)
  const glow = useRef<THREE.Sprite>(null)
  const innerCore = useRef<THREE.Mesh>(null)

  const { viewport } = useThree()
  const weights = useMemo(() => new THREE.Vector4(1, 0, 0, 0), [])
  const smooth = useRef({ stage: 0, x: 1.8, y: 0.05, scale: 0.82, rotX: 0, rotY: 0, vel: 0, intro: 0, init: false })

  const { centers, edges: nodeEdges } = useMemo(() => buildNodeGraph(), [])

  const lineGeometry = useMemo(() => {
    const pos = new Float32Array(nodeEdges.length * 6)
    nodeEdges.forEach(([a, b], i) => {
      pos.set([centers[a].x, centers[a].y, centers[a].z, centers[b].x, centers[b].y, centers[b].z], i * 6)
    })
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    return g
  }, [centers, nodeEdges])

  const coreGeo = useMemo(() => new THREE.IcosahedronGeometry(1, 1), [])
  const edgeGeo = useMemo(() => new THREE.EdgesGeometry(coreGeo, 12), [coreGeo])
  const glassGeo = useMemo(() => new THREE.IcosahedronGeometry(1, 0), [])
  const panelGeos = useMemo(() => PANELS.map((p) => new THREE.BoxGeometry(p.size[0], p.size[1], 0.02)), [])
  const panelEdgeGeos = useMemo(() => panelGeos.map((g) => new THREE.EdgesGeometry(g)), [panelGeos])
  const glowTex = useMemo(() => getGlowTexture(), [])

  // Dispose GPU resources we created manually when the scene unmounts.
  useEffect(() => {
    return () => {
      coreGeo.dispose()
      edgeGeo.dispose()
      glassGeo.dispose()
      lineGeometry.dispose()
      panelGeos.forEach((g) => g.dispose())
      panelEdgeGeos.forEach((g) => g.dispose())
    }
  }, [coreGeo, edgeGeo, glassGeo, lineGeometry, panelGeos, panelEdgeGeos])

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05)
    const s = smooth.current
    const g = root.current
    if (!g) return

    // intro: scale in once
    s.intro = Math.min(1, s.intro + dt * 0.9)
    const intro = 1 - Math.pow(1 - s.intro, 3)

    // ── stage weights
    damp(s, 'stage', story.stage, 0.6, dt)
    const st = s.stage
    weights.set(
      clamp(1 - Math.abs(st - 0)),
      clamp(1 - Math.abs(st - 1)),
      clamp(1 - Math.abs(st - 2)),
      clamp(1 - Math.abs(st - 3)),
    )

    // ── position: follow story.x across the viewport, centered on mobile
    const halfW = viewport.width / 2
    // On mobile the object lives in the top band of the hero (above the copy)
    // and sits centred, smaller, behind later sections.
    const targetX = isMobile ? 0 : story.x * halfW * 0.62
    const targetY = isMobile ? 1.3 * weights.x + 0.35 * (1 - weights.x) : story.y
    if (!s.init) {
      // Start exactly where this device wants the object: no flight-in from a
      // desktop default on phones (or on throttled frame rates).
      s.init = true
      s.x = targetX
      s.y = targetY
      s.scale = story.scale
      s.stage = story.stage
    }
    damp(s, 'x', targetX, 0.8, dt)
    damp(s, 'y', targetY, 0.8, dt)
    g.position.x = s.x
    g.position.y = s.y

    // ── global scale (smaller on mobile)
    const base = isMobile ? 0.5 : 1
    damp(s, 'scale', story.scale, 0.8, dt)
    g.scale.setScalar(base * s.scale * intro)

    // ── rotation: slow spin + pointer influence + scroll velocity
    const sp = spin.current
    if (sp) {
      const speed = reducedMotion ? 0.03 : 0.12
      damp(s, 'vel', scrollState.velocity, 0.3, dt)
      scrollState.velocity *= 0.9
      sp.rotation.y += dt * speed + s.vel * 0.0006
      const px = reducedMotion ? 0 : pointer.x
      const py = reducedMotion ? 0 : pointer.y
      damp(s, 'rotX', -py * 0.28 + scrollState.progress * 0.6, 0.9, dt)
      damp(s, 'rotY', px * 0.35, 0.9, dt)
      sp.rotation.x = s.rotX
      sp.rotation.z = s.rotY * 0.4
      g.rotation.y = s.rotY
    }

    // ── per-part blends
    const cs = blend(S.coreScale, weights)
    core.current?.scale.setScalar(cs)
    if (innerCore.current) innerCore.current.scale.setScalar(Math.max(0.0001, cs * 0.4 * (1 + Math.sin(state.clock.elapsedTime * 1.6) * 0.06)))
    if (edges.current) {
      edges.current.scale.setScalar(cs * 1.002)
      ;(edges.current.material as THREE.LineBasicMaterial).opacity = blend(S.edgeOpacity, weights)
    }
    if (glass.current) {
      const gs = blend(S.glassScale, weights)
      glass.current.scale.setScalar(gs)
      glass.current.rotation.y = -state.clock.elapsedTime * 0.08
      glass.current.rotation.x = state.clock.elapsedTime * 0.05
      if (glassEdges.current) {
        glassEdges.current.scale.setScalar(gs * 1.001)
        glassEdges.current.rotation.copy(glass.current.rotation)
        ;(glassEdges.current.material as THREE.LineBasicMaterial).opacity = 0.16 * (gs > 0.3 ? 1 : 0)
      }
    }
    if (shell.current) {
      shell.current.scale.setScalar(blend(S.shellScale, weights))
      ;(shell.current.material as THREE.MeshBasicMaterial).opacity = blend(S.shellOpacity, weights)
      shell.current.rotation.y = -state.clock.elapsedTime * 0.04
    }
    const rs = blend(S.ringScale, weights)
    const ro = blend(S.ringOpacity, weights)
    if (ringA.current) {
      ringA.current.scale.setScalar(rs)
      ;(ringA.current.material as THREE.MeshBasicMaterial).opacity = ro
      ringA.current.rotation.z = state.clock.elapsedTime * 0.1
    }
    if (ringB.current) {
      ringB.current.scale.setScalar(rs * 1.18)
      ;(ringB.current.material as THREE.MeshBasicMaterial).opacity = ro * 0.6
      ringB.current.rotation.z = -state.clock.elapsedTime * 0.07
    }
    if (nodesGroup.current) {
      const ns = blend(S.nodeScale, weights)
      nodesGroup.current.visible = ns > 0.01
      nodesGroup.current.scale.setScalar(Math.max(0.0001, ns))
    }
    if (lines.current) {
      const lo = blend(S.lineOpacity, weights)
      lines.current.visible = lo > 0.005
      ;(lines.current.material as THREE.LineBasicMaterial).opacity = lo
    }
    if (panelsGroup.current) {
      const ps = blend(S.panelScale, weights)
      panelsGroup.current.visible = ps > 0.01
      panelsGroup.current.scale.setScalar(Math.max(0.0001, ps))
      panelsGroup.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.08
    }
    if (sphere.current) {
      const ss = blend(S.sphereScale, weights)
      sphere.current.visible = ss > 0.01
      sphere.current.scale.setScalar(Math.max(0.0001, ss * (1 + Math.sin(state.clock.elapsedTime * 0.8) * 0.015)))
    }
    if (glow.current) {
      glow.current.scale.setScalar(blend(S.glowScale, weights))
      ;(glow.current.material as THREE.SpriteMaterial).opacity = blend(S.glowOpacity, weights)
    }
  })

  return (
    <group ref={root} position={[1.6, 0, 0]}>
      {/* soft back glow */}
      <sprite ref={glow} position={[0, 0, -1.2]}>
        <spriteMaterial map={glowTex} color={ACCENT} transparent opacity={0.5} depthWrite={false} blending={THREE.AdditiveBlending} />
      </sprite>

      <group ref={spin}>
        {/* faceted dark core */}
        <mesh ref={core} geometry={coreGeo} castShadow={false} receiveShadow={false}>
          <meshPhysicalMaterial
            color="#0b0f14"
            metalness={0.9}
            roughness={0.22}
            clearcoat={1}
            clearcoatRoughness={0.12}
            envMapIntensity={1.4}
            flatShading
          />
        </mesh>
        {/* glowing edges */}
        <lineSegments ref={edges} geometry={edgeGeo}>
          <lineBasicMaterial color={ACCENT} transparent opacity={0.7} depthWrite={false} />
        </lineSegments>
        {/* inner light */}
        <mesh ref={innerCore}>
          <sphereGeometry args={[1, 24, 24]} />
          <meshBasicMaterial color="#dff4ff" toneMapped={false} />
        </mesh>
        {/* crystalline glass shell */}
        <mesh ref={glass}>
          <icosahedronGeometry args={[1, 0]} />
          <meshPhysicalMaterial
            color="#9fd9ff"
            metalness={0}
            roughness={0.18}
            clearcoat={0.6}
            transparent
            opacity={0.055}
            side={THREE.DoubleSide}
            depthWrite={false}
            envMapIntensity={0.7}
          />
        </mesh>
        <lineSegments ref={glassEdges}>
          <edgesGeometry args={[glassGeo]} />
          <lineBasicMaterial color="#9fd9ff" transparent opacity={0.16} depthWrite={false} />
        </lineSegments>
        {/* outer wireframe lattice */}
        <mesh ref={shell}>
          <icosahedronGeometry args={[1, 2]} />
          <meshBasicMaterial color="#9fd9ff" wireframe transparent opacity={0.08} depthWrite={false} />
        </mesh>

        {/* technology nodes (skills stage) */}
        <group ref={nodesGroup} visible={false}>
          {centers.map((c, i) => (
            <mesh key={i} position={c}>
              <sphereGeometry args={[i % 5 === 0 ? 0.075 : 0.045, 12, 12]} />
              <meshBasicMaterial color={i % 3 === 0 ? VIOLET : ACCENT} toneMapped={false} />
            </mesh>
          ))}
        </group>
        <lineSegments ref={lines} geometry={lineGeometry} visible={false}>
          <lineBasicMaterial color={ACCENT} transparent opacity={0} depthWrite={false} />
        </lineSegments>

        {/* interface panels (work stage) */}
        <group ref={panelsGroup} visible={false}>
          {PANELS.map((p, i) => (
            <group key={i} position={p.position} rotation={p.rotation}>
              <mesh geometry={panelGeos[i]}>
                <meshPhysicalMaterial
                  color="#0a0d12"
                  metalness={0.6}
                  roughness={0.3}
                  clearcoat={1}
                  transparent
                  opacity={0.85}
                  envMapIntensity={1.2}
                />
              </mesh>
              <lineSegments geometry={panelEdgeGeos[i]}>
                <lineBasicMaterial color={i === 1 ? ACCENT : VIOLET} transparent opacity={0.8} />
              </lineSegments>
              {/* header bar */}
              <mesh position={[0, p.size[1] / 2 - 0.08, 0.012]}>
                <planeGeometry args={[p.size[0] - 0.12, 0.05]} />
                <meshBasicMaterial color={i === 1 ? ACCENT : VIOLET} transparent opacity={0.5} toneMapped={false} />
              </mesh>
            </group>
          ))}
        </group>

        {/* calm sphere (contact stage) */}
        <mesh ref={sphere} visible={false}>
          <sphereGeometry args={[1.05, 48, 48]} />
          <meshPhysicalMaterial
            color="#0a141c"
            emissive={ACCENT}
            emissiveIntensity={0.14}
            metalness={0.35}
            roughness={0.28}
            clearcoat={1}
            clearcoatRoughness={0.25}
            envMapIntensity={1.1}
          />
        </mesh>
      </group>

      {/* energy rings (outside spin so they keep their own motion) */}
      <mesh ref={ringA} rotation={[Math.PI / 2.4, 0.3, 0]}>
        <torusGeometry args={[1.95, 0.006, 8, 160]} />
        <meshBasicMaterial color={ACCENT} transparent opacity={0.55} depthWrite={false} toneMapped={false} />
      </mesh>
      <mesh ref={ringB} rotation={[Math.PI / 1.7, -0.5, 0.4]}>
        <torusGeometry args={[1.95, 0.004, 8, 160]} />
        <meshBasicMaterial color={VIOLET} transparent opacity={0.35} depthWrite={false} toneMapped={false} />
      </mesh>

      <Particles count={particleCount} weights={weights} pixelRatio={pixelRatio} />
    </group>
  )
}
