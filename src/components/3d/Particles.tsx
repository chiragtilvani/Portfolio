import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { buildParticleTargets } from './particle-targets'

const vertexShader = /* glsl */ `
  attribute vec3 aHero;
  attribute vec3 aNodes;
  attribute vec3 aPanels;
  attribute vec3 aSphere;
  attribute float aRand;

  uniform vec4 uW;
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;

  varying float vAlpha;
  varying float vRand;

  void main() {
    vec3 p = aHero * uW.x + aNodes * uW.y + aPanels * uW.z + aSphere * uW.w;
    float t = uTime * 0.35 + aRand * 6.2831;
    // gentle organic drift
    p += vec3(sin(t * 1.3), cos(t * 0.9), sin(t * 1.1)) * (0.02 + 0.03 * uW.x);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = uSize * (0.5 + aRand * 0.9) * uPixelRatio * (3.2 / -mv.z);
    gl_Position = projectionMatrix * mv;
    vAlpha = 0.3 + 0.7 * aRand;
    vRand = aRand;
  }
`

const fragmentShader = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uOpacity;
  varying float vAlpha;
  varying float vRand;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.08, d);
    vec3 col = mix(uColorA, uColorB, smoothstep(0.3, 0.9, vRand));
    gl_FragColor = vec4(col, a * vAlpha * uOpacity);
  }
`

interface ParticlesProps {
  count: number
  /** shared per-frame weights (hero, nodes, panels, sphere) */
  weights: THREE.Vector4
  pixelRatio: number
}

/**
 * GPU-morphing particle cloud. Each particle carries four target positions
 * and the vertex shader blends them with the current stage weights.
 */
export function Particles({ count, weights, pixelRatio }: ParticlesProps) {
  const matRef = useRef<THREE.ShaderMaterial>(null)

  const geometry = useMemo(() => {
    const t = buildParticleTargets(count)
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(t.hero.slice(), 3))
    g.setAttribute('aHero', new THREE.BufferAttribute(t.hero, 3))
    g.setAttribute('aNodes', new THREE.BufferAttribute(t.nodes, 3))
    g.setAttribute('aPanels', new THREE.BufferAttribute(t.panels, 3))
    g.setAttribute('aSphere', new THREE.BufferAttribute(t.sphere, 3))
    g.setAttribute('aRand', new THREE.BufferAttribute(t.rand, 1))
    g.computeBoundingSphere()
    if (g.boundingSphere) g.boundingSphere.radius = 4
    return g
  }, [count])

  const uniforms = useMemo(
    () => ({
      uW: { value: weights },
      uTime: { value: 0 },
      uSize: { value: 3.2 },
      uPixelRatio: { value: pixelRatio },
      uColorA: { value: new THREE.Color('#4fc3ff') },
      uColorB: { value: new THREE.Color('#b9a8ff') },
      uOpacity: { value: 1 },
    }),
    // weights is a stable ref object mutated per-frame
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pixelRatio],
  )

  useFrame((state) => {
    if (!matRef.current) return
    matRef.current.uniforms.uTime.value = state.clock.elapsedTime
  })

  useEffect(() => () => geometry.dispose(), [geometry])

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
