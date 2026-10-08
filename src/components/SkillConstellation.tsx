import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { skillCategories, skills, type Skill, type SkillCategory } from '@/data/skills'
import { cn } from '@/lib/utils'
import { Tag } from '@/components/ui/Tag'

const W = 1000
const H = 700
const CX = W / 2
const CY = H / 2

interface Node extends Skill {
  x: number
  y: number
  r: number
  hub: { x: number; y: number }
}

/** Lay the skills out as clusters around five category hubs on an ellipse. */
function useLayout() {
  return useMemo(() => {
    const hubs = skillCategories.map((cat, i) => {
      const angle = (-90 + i * 72) * (Math.PI / 180)
      return { ...cat, angle, x: CX + Math.cos(angle) * 300, y: CY + Math.sin(angle) * 185 }
    })
    const nodes: Node[] = []
    for (const hub of hubs) {
      const items = skills.filter((s) => s.category === hub.id)
      const ring1 = items.slice(0, 6)
      const ring2 = items.slice(6)
      const place = (list: Skill[], radius: number, spread: number) => {
        const n = list.length
        list.forEach((s, k) => {
          const t = n === 1 ? 0.5 : k / (n - 1)
          const a = hub.angle + (t - 0.5) * spread
          nodes.push({
            ...s,
            x: hub.x + Math.cos(a) * radius,
            y: hub.y + Math.sin(a) * radius * 0.82,
            r: s.level === 3 ? 7 : s.level === 2 ? 5.5 : 4.2,
            hub: { x: hub.x, y: hub.y },
          })
        })
      }
      place(ring1, 118, Math.PI * 0.95)
      if (ring2.length) place(ring2, 185, Math.PI * 0.6)
    }
    return { hubs, nodes }
  }, [])
}

interface Props {
  selected: Skill | null
  onSelect: (s: Skill | null) => void
  filter: SkillCategory | null
}

export function SkillConstellation({ selected, onSelect, filter }: Props) {
  const { hubs, nodes } = useLayout()
  const [hover, setHover] = useState<Skill | null>(null)
  const active = hover ?? selected
  const activeCat = active?.category ?? filter

  const isDim = (cat: SkillCategory) => (activeCat ? cat !== activeCat : false)
  const hue = (cat: SkillCategory) => skillCategories.find((c) => c.id === cat)?.hue ?? '#fff'

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full overflow-visible select-none"
      role="group"
      aria-label="Technology constellation. Use Tab to move between technologies."
      onPointerLeave={() => setHover(null)}
    >
      <defs>
        <filter id="glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="centerGlow">
          <stop offset="0" stopColor="#4fc3ff" stopOpacity="0.35" />
          <stop offset="1" stopColor="#4fc3ff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* center core */}
      <circle cx={CX} cy={CY} r="90" fill="url(#centerGlow)" />
      <circle cx={CX} cy={CY} r="4" fill="#f5f5f5" />
      <circle cx={CX} cy={CY} r="14" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1">
        <animate attributeName="r" values="12;18;12" dur="4s" repeatCount="indefinite" />
        <animate attributeName="stroke-opacity" values="0.4;0.05;0.4" dur="4s" repeatCount="indefinite" />
      </circle>

      {/* hub links to center */}
      {hubs.map((h) => (
        <line
          key={h.id}
          x1={CX}
          y1={CY}
          x2={h.x}
          y2={h.y}
          stroke={h.hue}
          strokeOpacity={isDim(h.id) ? 0.06 : 0.22}
          strokeWidth="1"
          strokeDasharray="2 6"
          className="transition-all duration-500"
        />
      ))}

      {/* node → hub links */}
      {nodes.map((n) => {
        const on = active?.name === n.name
        return (
          <line
            key={`l-${n.name}`}
            x1={n.hub.x}
            y1={n.hub.y}
            x2={n.x}
            y2={n.y}
            stroke={hue(n.category)}
            strokeOpacity={isDim(n.category) ? 0.05 : on ? 0.9 : 0.25}
            strokeWidth={on ? 1.4 : 1}
            className="transition-all duration-500"
          />
        )
      })}

      {/* hubs */}
      {hubs.map((h) => (
        <g key={`hub-${h.id}`} className={cn('transition-opacity duration-500', isDim(h.id) && 'opacity-30')}>
          <circle cx={h.x} cy={h.y} r="22" fill={h.hue} fillOpacity="0.08" />
          <circle cx={h.x} cy={h.y} r="9" fill="#050505" stroke={h.hue} strokeWidth="1.5" />
          <circle cx={h.x} cy={h.y} r="3" fill={h.hue} />
          <text
            x={h.x}
            y={h.y - 32}
            textAnchor="middle"
            className="fill-fg font-mono text-[12px] uppercase"
            style={{ letterSpacing: '0.22em' }}
          >
            {h.label}
          </text>
        </g>
      ))}

      {/* skill nodes */}
      {nodes.map((n) => {
        const on = active?.name === n.name
        const dim = isDim(n.category)
        const left = n.x < CX
        const labelX = n.x + (left ? -(n.r + 10) : n.r + 10)
        return (
          <g
            key={n.name}
            role="button"
            tabIndex={0}
            aria-label={`${n.name}: ${n.role}`}
            aria-pressed={selected?.name === n.name}
            data-cursor="hover"
            className={cn('cursor-pointer outline-none transition-opacity duration-500 focus-visible:[&>circle]:stroke-white', dim && 'opacity-25')}
            onPointerEnter={(e) => e.pointerType === 'mouse' && setHover(n)}
            onFocus={() => setHover(n)}
            onBlur={() => setHover(null)}
            onClick={() => onSelect(selected?.name === n.name ? null : n)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onSelect(selected?.name === n.name ? null : n)
              }
            }}
          >
            <circle cx={n.x} cy={n.y} r={n.r + 14} fill="transparent" />
            {on && <circle cx={n.x} cy={n.y} r={n.r + 8} fill={hue(n.category)} fillOpacity="0.18" filter="url(#glow)" />}
            <circle
              cx={n.x}
              cy={n.y}
              r={on ? n.r + 1.5 : n.r}
              fill={on ? hue(n.category) : '#0a0a0d'}
              stroke={hue(n.category)}
              strokeOpacity={on ? 1 : 0.8}
              strokeWidth="1.5"
              className="transition-all duration-300"
            />
            <text
              x={labelX}
              y={n.y + 4}
              textAnchor={left ? 'end' : 'start'}
              className={cn('font-sans text-[14px] transition-colors duration-300', on ? 'fill-fg' : 'fill-muted')}
            >
              {n.name}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

/** Detail panel shown next to the constellation. */
export function SkillDetail({ skill }: { skill: Skill | null }) {
  return (
    <div className="glass relative min-h-[14rem] rounded-2xl p-6">
      <AnimatePresence mode="wait">
        {skill ? (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center justify-between">
              <span className="label">{skill.category}</span>
              <span className="flex gap-1" aria-label={`Level ${skill.level} of 3`}>
                {[1, 2, 3].map((i) => (
                  <span key={i} className={cn('h-1 w-4 rounded-full', i <= skill.level ? 'bg-accent' : 'bg-white/10')} />
                ))}
              </span>
            </div>
            <h3 className="mt-3 text-2xl font-medium tracking-tight text-fg">{skill.name}</h3>
            <p className="mt-1 text-sm text-muted">{skill.role}</p>
            <ul className="mt-5 space-y-2" role="list">
              {skill.points.map((p) => (
                <li key={p} className="flex items-start gap-2.5 text-[14px] text-fg/85">
                  <span className="mt-[9px] h-px w-3 shrink-0 bg-accent" aria-hidden />
                  {p}
                </li>
              ))}
            </ul>
          </motion.div>
        ) : (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <span className="label">Constellation</span>
            <h3 className="mt-3 text-2xl font-medium tracking-tight text-fg">Hover a node</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Each node is a technology I work with, grouped into five systems. Select one to see where it fits.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {skillCategories.map((c) => (
                <Tag key={c.id}>
                  <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full" style={{ background: c.hue }} />
                  {c.label}
                </Tag>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
