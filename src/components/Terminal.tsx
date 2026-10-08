import { useCallback, useEffect, useRef, useState } from 'react'
import { terminalCommands, terminalScript } from '@/data/terminal'
import { socials } from '@/data/socials'
import { profile } from '@/data/profile'
import { EASTER_EGG_PHRASE } from '@/lib/constants'
import { useInViewOnce } from '@/hooks/useInViewOnce'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/utils'

type Line = { kind: 'cmd' | 'out' | 'err' | 'ok'; text: string }

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

/**
 * Interactive developer terminal. Auto-plays a short script when it enters
 * the viewport, then accepts real input.
 */
export function Terminal({ className }: { className?: string }) {
  const { ref, inView } = useInViewOnce<HTMLDivElement>()
  const reduced = useReducedMotion()
  const [lines, setLines] = useState<Line[]>([])
  const [typing, setTyping] = useState('')
  const [interactive, setInteractive] = useState(false)
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [histIdx, setHistIdx] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const started = useRef(false)

  const run = useCallback((raw: string): Line[] => {
    const cmd = raw.trim().toLowerCase()
    if (!cmd) return []
    if (cmd === 'clear') return [{ kind: 'out', text: '\u0000clear' }]
    if (cmd === EASTER_EGG_PHRASE) {
      window.dispatchEvent(new Event('easter-egg'))
      return [
        { kind: 'ok', text: 'ACCESS GRANTED ✓' },
        { kind: 'out', text: 'Developer detected. Let’s build something great.' },
      ]
    }
    if (cmd.startsWith('open ')) {
      const key = cmd.slice(5).trim()
      const s = socials.find((x) => x.id === key)
      if (s) {
        window.open(s.href, '_blank', 'noopener')
        return [{ kind: 'out', text: `Opening ${s.label} → ${s.handle}` }]
      }
      return [{ kind: 'err', text: `unknown target: ${key} (try github | linkedin | email)` }]
    }
    const found = terminalCommands.find((c) => c.cmd === cmd)
    if (found) return found.output.map((text) => ({ kind: 'out', text }))
    return [{ kind: 'err', text: `command not found: ${raw.trim()} — type \`help\`` }]
  }, [])

  // auto-play
  useEffect(() => {
    if (!inView || started.current) return
    started.current = true
    let cancelled = false
    ;(async () => {
      if (reduced) {
        const all: Line[] = []
        for (const c of terminalScript) {
          all.push({ kind: 'cmd', text: c }, ...run(c))
        }
        setLines(all)
        setInteractive(true)
        return
      }
      await sleep(350)
      for (const c of terminalScript) {
        if (cancelled) return
        for (let i = 1; i <= c.length; i++) {
          setTyping(c.slice(0, i))
          await sleep(38 + Math.random() * 40)
        }
        await sleep(160)
        setTyping('')
        setLines((prev) => [...prev, { kind: 'cmd', text: c }])
        const out = run(c)
        for (const line of out) {
          await sleep(60)
          setLines((prev) => [...prev, line])
        }
        await sleep(380)
      }
      setInteractive(true)
    })()
    return () => {
      cancelled = true
    }
  }, [inView, reduced, run])

  // scroll to bottom
  useEffect(() => {
    const el = bodyRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [lines, typing, input])

  const submit = () => {
    const value = input
    const out = run(value)
    setHistory((h) => [value, ...h].slice(0, 20))
    setHistIdx(-1)
    setInput('')
    if (out[0]?.text === '\u0000clear') {
      setLines([])
      return
    }
    setLines((prev) => [...prev, { kind: 'cmd', text: value }, ...out])
  }

  return (
    <div
      ref={ref}
      onClick={() => inputRef.current?.focus()}
      className={cn(
        'glass relative flex h-[26rem] flex-col overflow-hidden rounded-2xl text-[13px] leading-relaxed shadow-[0_30px_80px_-40px_rgba(0,0,0,0.8)] sm:h-[28rem]',
        className,
      )}
      data-cursor="hidden"
    >
      {/* chrome */}
      <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-3">
        <div className="flex items-center gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        </div>
        <span className="font-mono text-[10.5px] tracking-[0.18em] text-muted">{profile.handle}: ~</span>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-2">zsh</span>
      </div>

      {/* body */}
      <div ref={bodyRef} className="flex-1 overflow-y-auto px-4 py-4 font-mono sm:px-5" role="log" aria-live="polite">
        {lines.map((l, i) => (
          <div key={i} className={cn('whitespace-pre-wrap', l.kind === 'cmd' ? 'mt-3 first:mt-0' : 'pl-5')}>
            {l.kind === 'cmd' ? (
              <span>
                <span className="text-accent">$</span> <span className="text-fg">{l.text}</span>
              </span>
            ) : (
              <span className={cn(l.kind === 'out' && 'text-muted', l.kind === 'err' && 'text-red-400/90', l.kind === 'ok' && 'text-success')}>
                {l.text}
              </span>
            )}
          </div>
        ))}

        {typing && (
          <div className="mt-3">
            <span className="text-accent">$</span> <span className="caret text-fg">{typing}</span>
          </div>
        )}

        {interactive && (
          <form
            className="mt-3 flex items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault()
              submit()
            }}
          >
            <span className="text-accent">$</span>
            <label htmlFor="terminal-input" className="sr-only">
              Terminal command
            </label>
            <input
              id="terminal-input"
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowUp') {
                  e.preventDefault()
                  const next = Math.min(history.length - 1, histIdx + 1)
                  setHistIdx(next)
                  setInput(history[next] ?? '')
                } else if (e.key === 'ArrowDown') {
                  e.preventDefault()
                  const next = Math.max(-1, histIdx - 1)
                  setHistIdx(next)
                  setInput(next === -1 ? '' : (history[next] ?? ''))
                }
              }}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              placeholder="type `help`"
              className="flex-1 bg-transparent text-fg caret-accent outline-none placeholder:text-muted-2"
            />
          </form>
        )}
      </div>

      {/* footer */}
      <div className="flex items-center justify-between border-t border-white/[0.08] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-2">
        <span>{interactive ? 'interactive · try `projects`' : 'running intro…'}</span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-success" /> online
        </span>
      </div>
    </div>
  )
}
