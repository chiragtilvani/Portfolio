import type { CSSProperties } from 'react'
import type { ProjectVisual as VisualKind } from '@/data/projects'
import { cn } from '@/lib/utils'

/**
 * Generated, product-like UI illustrations for each project.
 * Pure CSS/SVG – no images. The project's accent is exposed as `--accent`.
 */

interface VisualProps {
  kind: VisualKind
  accent: string
  className?: string
  /** compact = card (fewer details), full = modal */
  mode?: 'card' | 'full'
}

export function ProjectVisual({ kind, accent, className, mode = 'card' }: VisualProps) {
  const style = { '--accent': accent } as CSSProperties
  return (
    <div
      style={style}
      className={cn(
        'relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-white/[0.08] bg-[#07070a] text-[10px] text-muted shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]',
        className,
      )}
      aria-hidden
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(60% 50% at 80% 0%, color-mix(in srgb, var(--accent) 18%, transparent), transparent 70%)' }}
      />
      {kind === 'finance' && <Finance mode={mode} />}
      {kind === 'marketplace' && <Marketplace mode={mode} />}
      {kind === 'prediction' && <Prediction mode={mode} />}
      {kind === 'campus' && <Campus mode={mode} />}
      {kind === 'kanban' && <Kanban mode={mode} />}
      {kind === 'library' && <Library mode={mode} />}
    </div>
  )
}

/* ───────────────────────── shared bits ───────────────────────── */

function Chrome({ title }: { title: string }) {
  return (
    <div className="flex h-7 items-center gap-2 border-b border-white/[0.07] px-3">
      <span className="h-1.5 w-1.5 rounded-full bg-white/15" />
      <span className="h-1.5 w-1.5 rounded-full bg-white/15" />
      <span className="h-1.5 w-1.5 rounded-full bg-white/15" />
      <span className="ml-2 font-mono text-[8.5px] tracking-[0.15em] text-muted-2">{title}</span>
    </div>
  )
}

function Bar({ w, className }: { w: string; className?: string }) {
  return <span className={cn('block h-1.5 rounded-full bg-white/10', className)} style={{ width: w }} />
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('rounded-lg border border-white/[0.07] bg-white/[0.025] p-2.5', className)}>{children}</div>
}

/* ───────────────────────── 01 FINFLOW ───────────────────────── */

function Finance({ mode }: { mode: 'card' | 'full' }) {
  const bars = [38, 52, 44, 68, 58, 80, 64, 90, 72, 86, 95, 78]
  return (
    <div className="flex h-full flex-col">
      <Chrome title="finflow.app / overview" />
      <div className="flex min-h-0 flex-1">
        <aside className="hidden w-10 flex-col items-center gap-3 border-r border-white/[0.07] py-3 sm:flex">
          <span className="h-5 w-5 rounded-md bg-[var(--accent)]/80" />
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className={cn('h-3.5 w-3.5 rounded-[4px]', i === 0 ? 'bg-white/30' : 'bg-white/10')} />
          ))}
        </aside>
        <div className="flex min-w-0 flex-1 flex-col gap-2.5 p-3">
          <div className="flex items-end justify-between">
            <div>
              <Bar w="54px" className="mb-1.5 bg-white/[0.08]" />
              <span className="text-[15px] font-medium tracking-tight text-fg sm:text-lg">₹1,24,560</span>
            </div>
            <span className="rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/10 px-2 py-0.5 font-mono text-[8px] text-[var(--accent)]">
              +12.4% MoM
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {['Income', 'Spent', 'Saved'].map((l, i) => (
              <Card key={l}>
                <span className="font-mono text-[7.5px] uppercase tracking-[0.15em] text-muted-2">{l}</span>
                <div className="mt-1 text-[11px] font-medium text-fg">{['₹86k', '₹41k', '₹45k'][i]}</div>
              </Card>
            ))}
          </div>
          <div className="grid min-h-0 flex-1 grid-cols-3 gap-2">
            <Card className="col-span-2 flex flex-col">
              <span className="font-mono text-[7.5px] uppercase tracking-[0.15em] text-muted-2">Monthly spend</span>
              <div className="mt-2 flex flex-1 items-end gap-[3px]">
                {bars.map((h, i) => (
                  <span
                    key={i}
                    className={cn('flex-1 rounded-sm', i === bars.length - 2 ? 'bg-[var(--accent)]' : 'bg-white/[0.12]')}
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </Card>
            <Card className="flex flex-col items-center justify-center">
              <svg viewBox="0 0 36 36" className="h-14 w-14">
                <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
                <circle cx="18" cy="18" r="14" fill="none" stroke="var(--accent)" strokeWidth="4" strokeDasharray="88" strokeDashoffset="30" strokeLinecap="round" transform="rotate(-90 18 18)" />
                <circle cx="18" cy="18" r="14" fill="none" stroke="#8b7cf6" strokeWidth="4" strokeDasharray="88" strokeDashoffset="70" strokeLinecap="round" transform="rotate(145 18 18)" />
              </svg>
              <span className="mt-1 font-mono text-[7.5px] uppercase tracking-[0.15em] text-muted-2">By category</span>
            </Card>
          </div>
          {mode === 'full' && (
            <Card>
              {['Groceries', 'Transport', 'Subscriptions'].map((t, i) => (
                <div key={t} className="flex items-center justify-between py-1 text-[9px]">
                  <span className="text-fg/80">{t}</span>
                  <span className="font-mono text-muted">{['-₹2,340', '-₹860', '-₹499'][i]}</span>
                </div>
              ))}
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

/* ───────────────────────── 02 MARKETNEST ───────────────────────── */

function Marketplace({ mode }: { mode: 'card' | 'full' }) {
  const products = [
    { h: 'from-sky-400/40 to-indigo-500/30', p: '₹2,499' },
    { h: 'from-violet-400/40 to-fuchsia-500/30', p: '₹1,199' },
    { h: 'from-emerald-400/40 to-teal-500/30', p: '₹899' },
    { h: 'from-amber-400/40 to-orange-500/30', p: '₹3,250' },
    { h: 'from-rose-400/40 to-pink-500/30', p: '₹1,799' },
    { h: 'from-cyan-400/40 to-blue-500/30', p: '₹649' },
  ]
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-8 items-center gap-3 border-b border-white/[0.07] px-3">
        <span className="font-mono text-[9px] tracking-[0.2em] text-fg">MARKETNEST</span>
        <span className="ml-auto flex h-4 w-32 items-center rounded-full border border-white/10 bg-white/[0.03] px-2 sm:w-44">
          <Bar w="40%" className="h-1 bg-white/10" />
        </span>
        <span className="h-4 w-4 rounded-full bg-[var(--accent)]/70" />
      </div>
      <div className="flex min-h-0 flex-1">
        <aside className="hidden w-20 flex-col gap-2 border-r border-white/[0.07] p-2.5 sm:flex">
          <span className="font-mono text-[7.5px] uppercase tracking-[0.15em] text-muted-2">Filters</span>
          {[1, 2, 3, 4, 5].map((i) => (
            <span key={i} className="flex items-center gap-1.5">
              <span className={cn('h-2 w-2 rounded-[3px] border border-white/20', i < 3 && 'bg-[var(--accent)]/70 border-transparent')} />
              <Bar w={`${30 + i * 7}px`} className="h-1 bg-white/[0.08]" />
            </span>
          ))}
        </aside>
        <div className="grid flex-1 grid-cols-3 gap-2 p-2.5">
          {products.slice(0, mode === 'full' ? 6 : 6).map((pr, i) => (
            <div key={i} className="flex flex-col overflow-hidden rounded-lg border border-white/[0.07] bg-white/[0.02]">
              <div className={cn('h-10 bg-gradient-to-br sm:h-12', pr.h)} />
              <div className="flex flex-1 flex-col gap-1 p-1.5">
                <Bar w="70%" className="h-1 bg-white/[0.1]" />
                <div className="mt-auto flex items-center justify-between">
                  <span className="font-mono text-[8px] text-fg">{pr.p}</span>
                  <span className="h-3 w-3 rounded-[3px] bg-[var(--accent)]/70" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <aside className="hidden w-24 flex-col border-l border-white/[0.07] p-2.5 md:flex">
          <span className="font-mono text-[7.5px] uppercase tracking-[0.15em] text-muted-2">Cart · 2</span>
          <div className="mt-2 space-y-1.5">
            {[0, 1].map((i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className={cn('h-5 w-5 rounded bg-gradient-to-br', products[i].h)} />
                <Bar w="60%" className="h-1 bg-white/[0.1]" />
              </div>
            ))}
          </div>
          <div className="mt-auto rounded-md bg-[var(--accent)] py-1 text-center font-mono text-[7.5px] font-medium text-bg">CHECKOUT</div>
        </aside>
      </div>
    </div>
  )
}

/* ───────────────────────── 03 TECHPRICE ───────────────────────── */

function Prediction({ mode }: { mode: 'card' | 'full' }) {
  const pts = Array.from({ length: 34 }, (_, i) => {
    const x = 20 + i * 8.2
    const base = 160 - i * 3.4
    const noise = Math.sin(i * 1.7) * 14 + Math.cos(i * 0.6) * 9
    return { x, y: base + noise }
  })
  return (
    <div className="flex h-full flex-col">
      <Chrome title="techprice · model: gradient-boosting v3" />
      <div className="grid min-h-0 flex-1 grid-cols-3 gap-2.5 p-3">
        <Card className="col-span-2 relative overflow-hidden">
          <svg viewBox="0 0 320 180" className="h-full w-full">
            <defs>
              <linearGradient id="pg" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="var(--accent)" stopOpacity="0.35" />
                <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[0, 1, 2, 3, 4].map((i) => (
              <line key={i} x1="0" x2="320" y1={20 + i * 36} y2={20 + i * 36} stroke="rgba(255,255,255,0.06)" />
            ))}
            <path d="M20 160 L300 44 L300 180 L20 180Z" fill="url(#pg)" />
            <line x1="20" y1="160" x2="300" y2="44" stroke="var(--accent)" strokeWidth="1.5" />
            <line x1="20" y1="148" x2="300" y2="32" stroke="var(--accent)" strokeOpacity="0.25" strokeDasharray="3 4" />
            <line x1="20" y1="172" x2="300" y2="56" stroke="var(--accent)" strokeOpacity="0.25" strokeDasharray="3 4" />
            {pts.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r="2.2" fill={i % 5 === 0 ? '#8b7cf6' : '#f5f5f5'} fillOpacity={i % 5 === 0 ? 0.9 : 0.55} />
            ))}
            <circle cx="236" cy="72" r="5" fill="none" stroke="var(--accent)" strokeWidth="1.5">
              <animate attributeName="r" values="4;9;4" dur="2.4s" repeatCount="indefinite" />
              <animate attributeName="stroke-opacity" values="1;0;1" dur="2.4s" repeatCount="indefinite" />
            </circle>
          </svg>
          <span className="absolute left-3 top-2 font-mono text-[7.5px] uppercase tracking-[0.15em] text-muted-2">price vs. spec score</span>
        </Card>
        <div className="flex flex-col gap-2">
          <Card>
            <span className="font-mono text-[7.5px] uppercase tracking-[0.15em] text-muted-2">Predicted</span>
            <div className="mt-1 text-[14px] font-medium tracking-tight text-fg sm:text-base">₹68,400</div>
            <span className="font-mono text-[8px] text-[var(--accent)]">± 3.1% · R² 0.91</span>
          </Card>
          <Card className="flex-1">
            <span className="font-mono text-[7.5px] uppercase tracking-[0.15em] text-muted-2">Feature importance</span>
            <div className="mt-2 space-y-1.5">
              {[
                ['GPU tier', 92],
                ['RAM', 71],
                ['Brand', 48],
                ['Age', 36],
              ]
                .slice(0, mode === 'full' ? 4 : 3)
                .map(([l, v]) => (
                  <div key={l as string}>
                    <div className="flex justify-between text-[7.5px]">
                      <span>{l}</span>
                      <span className="font-mono">{v}</span>
                    </div>
                    <div className="mt-0.5 h-1 rounded-full bg-white/[0.08]">
                      <div className="h-full rounded-full bg-[var(--accent)]" style={{ width: `${v}%` }} />
                    </div>
                  </div>
                ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

/* ───────────────────────── 04 CAMPUSHUB ───────────────────────── */

function Campus({ mode }: { mode: 'card' | 'full' }) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
  const blocks: Record<number, { r: number; h: number; c: string }[]> = {
    0: [{ r: 0, h: 2, c: 'bg-[var(--accent)]/60' }, { r: 3, h: 1, c: 'bg-violet/50' }],
    1: [{ r: 1, h: 2, c: 'bg-violet/50' }],
    2: [{ r: 0, h: 1, c: 'bg-white/15' }, { r: 2, h: 2, c: 'bg-[var(--accent)]/60' }],
    3: [{ r: 1, h: 1, c: 'bg-white/15' }, { r: 3, h: 1, c: 'bg-violet/50' }],
    4: [{ r: 0, h: 2, c: 'bg-violet/50' }],
  }
  return (
    <div className="flex h-full flex-col">
      <Chrome title="campushub / admin / dashboard" />
      <div className="grid min-h-0 flex-1 grid-cols-3 gap-2.5 p-3">
        <div className="col-span-2 flex flex-col gap-2">
          <div className="grid grid-cols-3 gap-2">
            {[
              ['Students', '2,340'],
              ['Faculty', '148'],
              ['Courses', '96'],
            ].map(([l, v]) => (
              <Card key={l}>
                <span className="font-mono text-[7.5px] uppercase tracking-[0.15em] text-muted-2">{l}</span>
                <div className="mt-0.5 text-[12px] font-medium text-fg">{v}</div>
              </Card>
            ))}
          </div>
          <Card className="flex-1">
            <div className="grid h-full grid-cols-5 gap-1.5">
              {days.map((d, i) => (
                <div key={d} className="flex flex-col gap-1">
                  <span className="text-center font-mono text-[7px] uppercase text-muted-2">{d}</span>
                  <div className="relative grid flex-1 grid-rows-4 gap-1">
                    {[0, 1, 2, 3].map((r) => (
                      <span key={r} className="rounded-sm border border-dashed border-white/[0.06]" />
                    ))}
                    {blocks[i].map((b, k) => (
                      <span
                        key={k}
                        className={cn('absolute left-0 right-0 rounded-sm', b.c)}
                        style={{ top: `${b.r * 25}%`, height: `calc(${b.h * 25}% - 3px)` }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
        <Card className="flex flex-col">
          <span className="font-mono text-[7.5px] uppercase tracking-[0.15em] text-muted-2">Notices</span>
          <div className="mt-2 space-y-2">
            {[80, 60, 72, 50].slice(0, mode === 'full' ? 4 : 3).map((w, i) => (
              <div key={i} className="flex items-start gap-1.5">
                <span className={cn('mt-0.5 h-1.5 w-1.5 rounded-full', i === 0 ? 'bg-[var(--accent)]' : 'bg-white/20')} />
                <div className="flex-1 space-y-1">
                  <Bar w={`${w}%`} className="h-1 bg-white/[0.12]" />
                  <Bar w={`${w - 25}%`} className="h-1 bg-white/[0.06]" />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-auto rounded-md border border-white/10 py-1 text-center font-mono text-[7.5px] uppercase tracking-[0.15em] text-muted">
            View records
          </div>
        </Card>
      </div>
    </div>
  )
}

/* ───────────────────────── 05 DEVBOARD ───────────────────────── */

function Kanban({ mode }: { mode: 'card' | 'full' }) {
  const cols = [
    { t: 'Backlog', n: 4, cards: [['Auth refresh flow', 'api'], ['Docs: onboarding', 'docs'], ['Rate limiting', 'infra']] },
    { t: 'In progress', n: 2, cards: [['Board drag & drop', 'ui'], ['Prisma migration', 'db']] },
    { t: 'Done', n: 7, cards: [['Workspace model', 'db'], ['Dark theme tokens', 'ui'], ['CI pipeline', 'infra']] },
  ]
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-8 items-center gap-2 border-b border-white/[0.07] px-3">
        <span className="h-3.5 w-3.5 rounded bg-[var(--accent)]" />
        <span className="font-mono text-[9px] tracking-[0.12em] text-fg">devboard / core-platform</span>
        <div className="ml-auto flex -space-x-1">
          {['bg-sky-400/70', 'bg-violet-400/70', 'bg-emerald-400/70'].map((c) => (
            <span key={c} className={cn('h-4 w-4 rounded-full border border-[#07070a]', c)} />
          ))}
        </div>
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-3 gap-2.5 p-3">
        {cols.map((col, ci) => (
          <div key={col.t} className="flex min-h-0 flex-col rounded-lg border border-white/[0.06] bg-white/[0.015] p-2">
            <div className="mb-2 flex items-center justify-between px-0.5">
              <span className="font-mono text-[7.5px] uppercase tracking-[0.15em] text-muted">{col.t}</span>
              <span className="font-mono text-[7.5px] text-muted-2">{col.n}</span>
            </div>
            <div className="space-y-1.5">
              {col.cards.slice(0, mode === 'full' ? 3 : ci === 1 ? 2 : 3).map(([title, tag], i) => (
                <div
                  key={title}
                  className={cn(
                    'rounded-md border border-white/[0.07] bg-white/[0.03] p-1.5',
                    ci === 1 && i === 0 && 'border-[var(--accent)]/50 shadow-[0_0_0_1px_color-mix(in_srgb,var(--accent)_30%,transparent)]',
                  )}
                >
                  <span className="block text-[8.5px] text-fg/85">{title}</span>
                  <div className="mt-1.5 flex items-center justify-between">
                    <span className="rounded-sm bg-white/[0.06] px-1 font-mono text-[6.5px] uppercase tracking-[0.1em] text-muted">{tag}</span>
                    <span className="h-3 w-3 rounded-full bg-white/15" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ───────────────────────── 06 LIBRARYX ───────────────────────── */

function Library({ mode }: { mode: 'card' | 'full' }) {
  const rows = [
    ['LX-0412', 'Clean Code', 'R. C. Martin', 'Issued'],
    ['LX-0098', 'Effective Java', 'J. Bloch', 'Available'],
    ['LX-0231', 'Design Patterns', 'GoF', 'Issued'],
    ['LX-0333', 'Database Systems', 'Silberschatz', 'Available'],
    ['LX-0150', 'Algorithms', 'CLRS', 'Overdue'],
  ]
  return (
    <div className="flex h-full flex-col font-mono">
      <div className="flex h-7 items-center justify-between border-b border-white/[0.1] bg-white/[0.04] px-2.5">
        <span className="text-[8.5px] text-fg">LibraryX — Catalogue</span>
        <span className="flex gap-1.5 text-[8px] text-muted">
          <span>—</span>
          <span>▢</span>
          <span>✕</span>
        </span>
      </div>
      <div className="flex h-6 items-center gap-3 border-b border-white/[0.07] px-2.5 text-[8px] text-muted">
        {['File', 'Edit', 'Catalogue', 'Members', 'Reports', 'Help'].map((m) => (
          <span key={m}>{m}</span>
        ))}
      </div>
      <div className="flex h-7 items-center gap-1.5 border-b border-white/[0.07] px-2.5">
        {['Issue', 'Return', 'Add book', 'Search'].map((b, i) => (
          <span key={b} className={cn('rounded-[3px] border px-1.5 py-0.5 text-[7.5px]', i === 0 ? 'border-[var(--accent)]/50 bg-[var(--accent)]/15 text-fg' : 'border-white/10 text-muted')}>
            {b}
          </span>
        ))}
      </div>
      <div className="min-h-0 flex-1 p-2.5">
        <div className="overflow-hidden rounded-[4px] border border-white/[0.1]">
          <div className="grid grid-cols-[1fr_2fr_1.6fr_1fr] gap-2 border-b border-white/[0.1] bg-white/[0.05] px-2 py-1 text-[7.5px] uppercase tracking-[0.1em] text-muted">
            <span>ID</span>
            <span>Title</span>
            <span>Author</span>
            <span>Status</span>
          </div>
          {rows.slice(0, mode === 'full' ? 5 : 4).map((r, i) => (
            <div
              key={r[0]}
              className={cn('grid grid-cols-[1fr_2fr_1.6fr_1fr] gap-2 px-2 py-[5px] text-[8px]', i === 0 ? 'bg-[var(--accent)]/15 text-fg' : i % 2 ? 'bg-white/[0.02]' : '')}
            >
              <span className="text-muted">{r[0]}</span>
              <span className="truncate">{r[1]}</span>
              <span className="truncate text-muted">{r[2]}</span>
              <span className={cn(r[3] === 'Overdue' && 'text-red-400/80', r[3] === 'Available' && 'text-success/80')}>{r[3]}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex h-5 items-center justify-between border-t border-white/[0.1] px-2.5 text-[7.5px] text-muted-2">
        <span>Connected · jdbc:mysql://localhost:3306/libraryx</span>
        <span>1,284 records</span>
      </div>
    </div>
  )
}
