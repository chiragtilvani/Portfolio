import { useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { RefreshCw } from 'lucide-react'
import { seededRandom } from '@/lib/utils'

const W = 320
const H = 160
const N = 24

function makeSeries(seed: number) {
  const rand = seededRandom(seed)
  let v = 40 + rand() * 20
  const out: number[] = []
  for (let i = 0; i < N; i++) {
    v += (rand() - 0.45) * 14
    v = Math.max(8, Math.min(95, v))
    out.push(v)
  }
  return out
}

function toPath(values: number[], close = false) {
  const step = W / (N - 1)
  const pts = values.map((v, i) => [i * step, H - (v / 100) * (H - 20) - 10] as const)
  let d = `M${pts[0][0]},${pts[0][1]}`
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1]
    const [x1, y1] = pts[i]
    const cx = (x0 + x1) / 2
    d += ` C${cx},${y0} ${cx},${y1} ${x1},${y1}`
  }
  if (close) d += ` L${W},${H} L0,${H} Z`
  return d
}

/** Animated SVG line chart with hover readout and regenerate action. */
export function MiniChart() {
  const [seed, setSeed] = useState(11)
  const [hover, setHover] = useState<number | null>(null)
  const values = useMemo(() => makeSeries(seed), [seed])
  const line = useMemo(() => toPath(values), [values])
  const area = useMemo(() => toPath(values, true), [values])
  const step = W / (N - 1)
  const idx = hover ?? N - 1
  const hx = idx * step
  const hy = H - (values[idx] / 100) * (H - 20) - 10

  return (
    <div className="flex h-full w-full flex-col p-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-muted-2">throughput · req/s</span>
          <div className="mt-0.5 text-2xl font-medium tracking-tight text-fg tabular-nums">
            {Math.round(values[idx] * 12.4)}
            <span className="ml-1 text-xs text-muted">{hover === null ? 'now' : `t-${N - 1 - idx}`}</span>
          </div>
        </div>
        <button
          onClick={() => setSeed((s) => s + 1)}
          data-cursor="hover"
          aria-label="Regenerate data"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-muted transition-colors hover:border-white/30 hover:text-fg"
        >
          <RefreshCw size={13} />
        </button>
      </div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="mt-3 w-full flex-1"
        preserveAspectRatio="none"
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect()
          const x = ((e.clientX - r.left) / r.width) * W
          setHover(Math.max(0, Math.min(N - 1, Math.round(x / step))))
        }}
        onMouseLeave={() => setHover(null)}
        role="img"
        aria-label="Demo line chart"
      >
        <defs>
          <linearGradient id="miniArea" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#4fc3ff" stopOpacity="0.35" />
            <stop offset="1" stopColor="#4fc3ff" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((f) => (
          <line key={f} x1="0" x2={W} y1={H * f} y2={H * f} stroke="rgba(255,255,255,0.06)" strokeDasharray="2 4" />
        ))}
        <motion.path d={area} fill="url(#miniArea)" animate={{ d: area }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }} />
        <motion.path
          d={line}
          fill="none"
          stroke="#4fc3ff"
          strokeWidth="1.8"
          vectorEffect="non-scaling-stroke"
          animate={{ d: line }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        />
        <motion.line x1={hx} x2={hx} y1="0" y2={H} stroke="rgba(255,255,255,0.25)" animate={{ x1: hx, x2: hx }} transition={{ duration: 0.15 }} />
        <motion.circle r="4" fill="#050505" stroke="#4fc3ff" strokeWidth="2" animate={{ cx: hx, cy: hy }} transition={{ duration: 0.15 }} />
      </svg>
    </div>
  )
}
