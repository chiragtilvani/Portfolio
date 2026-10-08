import * as THREE from 'three'
import { seededRandom } from '@/lib/utils'

/**
 * Pre-computed particle positions for every story stage. The shader blends
 * between them using per-stage weights, so morphing is free on the CPU.
 */
export interface ParticleTargets {
  hero: Float32Array
  nodes: Float32Array
  panels: Float32Array
  sphere: Float32Array
  rand: Float32Array
}

/** Evenly distributed points on a sphere (Fibonacci lattice). */
export function fibonacciSphere(count: number, radius: number): THREE.Vector3[] {
  const pts: THREE.Vector3[] = []
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / Math.max(1, count - 1)) * 2
    const r = Math.sqrt(1 - y * y)
    const theta = golden * i
    pts.push(new THREE.Vector3(Math.cos(theta) * r * radius, y * radius, Math.sin(theta) * r * radius))
  }
  return pts
}

export const NODE_COUNT = 26
export const NODE_RADIUS = 2.05

export interface PanelSpec {
  position: [number, number, number]
  rotation: [number, number, number]
  size: [number, number]
}

export const PANELS: PanelSpec[] = [
  { position: [-0.95, 0.35, -0.5], rotation: [0.05, 0.55, 0.02], size: [1.5, 0.95] },
  { position: [0.25, -0.25, 0.25], rotation: [-0.05, 0.1, -0.02], size: [1.6, 1.0] },
  { position: [1.15, 0.55, -0.9], rotation: [0.08, -0.5, 0.03], size: [1.3, 0.85] },
]

/** Node centers and the index pairs connecting each node to its nearest neighbours. */
export function buildNodeGraph() {
  const centers = fibonacciSphere(NODE_COUNT, NODE_RADIUS)
  const edges: [number, number][] = []
  const seen = new Set<string>()
  centers.forEach((c, i) => {
    const dists = centers
      .map((o, j) => ({ j, d: c.distanceTo(o) }))
      .filter((x) => x.j !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, 3)
    for (const { j } of dists) {
      const key = i < j ? `${i}-${j}` : `${j}-${i}`
      if (!seen.has(key)) {
        seen.add(key)
        edges.push([i, j])
      }
    }
  })
  return { centers, edges }
}

export function buildParticleTargets(count: number, seed = 7): ParticleTargets {
  const rand = seededRandom(seed)
  const hero = new Float32Array(count * 3)
  const nodes = new Float32Array(count * 3)
  const panels = new Float32Array(count * 3)
  const sphere = new Float32Array(count * 3)
  const randAttr = new Float32Array(count)

  const { centers, edges } = buildNodeGraph()

  const panelMatrices = PANELS.map((p) => {
    const m = new THREE.Matrix4()
    const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(...p.rotation))
    m.compose(new THREE.Vector3(...p.position), q, new THREE.Vector3(1, 1, 1))
    return m
  })

  const v = new THREE.Vector3()

  for (let i = 0; i < count; i++) {
    randAttr[i] = rand()

    // ── HERO: spherical shell around the core, denser near the equator band
    {
      const r = 1.35 + Math.pow(rand(), 1.6) * 1.5
      const theta = rand() * Math.PI * 2
      const phi = Math.acos(2 * rand() - 1)
      const squash = 0.55 + rand() * 0.45 // flatten into a loose disc
      v.set(r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi) * squash, r * Math.sin(phi) * Math.sin(theta))
      hero.set([v.x, v.y, v.z], i * 3)
    }

    // ── NODES: 65% clustered around node centres, 35% along edges
    {
      if (rand() < 0.65) {
        const c = centers[Math.floor(rand() * centers.length)]
        v.set(c.x + (rand() - 0.5) * 0.28, c.y + (rand() - 0.5) * 0.28, c.z + (rand() - 0.5) * 0.28)
      } else {
        const [a, b] = edges[Math.floor(rand() * edges.length)]
        v.lerpVectors(centers[a], centers[b], rand())
        v.multiplyScalar(0.98 + rand() * 0.04)
      }
      nodes.set([v.x, v.y, v.z], i * 3)
    }

    // ── PANELS: outline + sparse grid of three floating screens
    {
      const pi = i % PANELS.length
      const [w, h] = PANELS[pi].size
      if (rand() < 0.7) {
        // perimeter
        const t = rand() * 2 * (w + h)
        if (t < w) v.set(-w / 2 + t, h / 2, 0)
        else if (t < w + h) v.set(w / 2, h / 2 - (t - w), 0)
        else if (t < 2 * w + h) v.set(w / 2 - (t - w - h), -h / 2, 0)
        else v.set(-w / 2, -h / 2 + (t - 2 * w - h), 0)
      } else {
        // interior "ui rows"
        const rows = 5
        const row = Math.floor(rand() * rows)
        v.set(-w / 2 + 0.1 + rand() * (w - 0.2), h / 2 - 0.15 - (row / (rows - 1)) * (h - 0.3), 0)
      }
      v.z += (rand() - 0.5) * 0.02
      v.applyMatrix4(panelMatrices[pi])
      panels.set([v.x, v.y, v.z], i * 3)
    }

    // ── SPHERE: calm, even shell
    {
      const r = 1.12 + rand() * 0.06
      const theta = rand() * Math.PI * 2
      const phi = Math.acos(2 * rand() - 1)
      v.set(r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta))
      sphere.set([v.x, v.y, v.z], i * 3)
    }
  }

  return { hero, nodes, panels, sphere, rand: randAttr }
}
