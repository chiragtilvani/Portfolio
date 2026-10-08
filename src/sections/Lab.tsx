import { lazy, Suspense } from 'react'
import { motion } from 'motion/react'
import { experiments, type ExperimentKind } from '@/data/experiments'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Stagger } from '@/components/ui/Reveal'
import { staggerItem } from '@/lib/motion'
import { Tag } from '@/components/ui/Tag'
import { ParticleField } from '@/components/experiments/ParticleField'
import { AnimatedTypography } from '@/components/experiments/AnimatedTypography'
import { GlassCard } from '@/components/experiments/GlassCard'
import { MiniChart } from '@/components/experiments/MiniChart'
import { cn } from '@/lib/utils'

const RotatingObject = lazy(() => import('@/components/experiments/RotatingObject').then((m) => ({ default: m.RotatingObject })))

const SPAN: Record<ExperimentKind, string> = {
  particles: 'lg:col-span-2',
  object3d: '',
  typography: '',
  glass: '',
  dataviz: '',
}

function Experiment({ kind }: { kind: ExperimentKind }) {
  switch (kind) {
    case 'particles':
      return <ParticleField />
    case 'object3d':
      return (
        <Suspense fallback={<div className="h-full w-full" />}>
          <RotatingObject />
        </Suspense>
      )
    case 'typography':
      return <AnimatedTypography />
    case 'glass':
      return <GlassCard />
    case 'dataviz':
      return <MiniChart />
  }
}

export function Lab() {
  return (
    <section id="lab" className="section-pad relative" aria-labelledby="lab-heading">
      <div className="container-x">
        <SectionHeader
          index="07"
          label="Creative lab"
          title={<span id="lab-heading">Engineering meets design.</span>}
          subtitle="Small interactive experiments. Each one is a self-contained component built to explore motion, rendering and feel."
        />

        <Stagger className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
          {experiments.map((ex) => (
            <motion.article
              key={ex.kind}
              variants={staggerItem}
              className={cn('group flex flex-col overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.015] transition-colors duration-500 hover:border-white/20', SPAN[ex.kind])}
              aria-labelledby={`exp-${ex.kind}`}
            >
              <div className="relative h-64 border-b border-white/[0.06] bg-[#07070a] sm:h-72">
                <Experiment kind={ex.kind} />
                <span className="pointer-events-none absolute right-4 top-4 font-mono text-[10px] tracking-[0.2em] text-muted-2">EXP. {ex.index}</span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 id={`exp-${ex.kind}`} className="text-lg font-medium tracking-tight text-fg">
                  {ex.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{ex.description}</p>
                <div className="mt-auto flex flex-wrap gap-2 pt-5">
                  {ex.tech.map((t) => (
                    <Tag key={t}>{t}</Tag>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </Stagger>
      </div>
    </section>
  )
}

export default Lab
