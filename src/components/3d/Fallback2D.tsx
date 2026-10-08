/**
 * Premium animated 2D background used when WebGL is unavailable.
 * Pure CSS: layered radial gradients + a slow drifting ring.
 */
export function Fallback2D() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <div
        className="absolute left-1/2 top-[38%] h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 blur-3xl md:left-[70%]"
        style={{
          background: 'radial-gradient(circle at 40% 40%, rgba(79,195,255,0.35), rgba(139,124,246,0.18) 45%, transparent 70%)',
          animation: 'float 9s ease-in-out infinite',
        }}
      />
      <div
        className="absolute left-1/2 top-[38%] h-[52vmin] w-[52vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/20 md:left-[70%]"
        style={{ animation: 'spin 40s linear infinite' }}
      >
        <span className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_16px_4px_rgba(79,195,255,0.6)]" />
      </div>
      <div
        className="absolute left-1/2 top-[38%] h-[64vmin] w-[64vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet/15 md:left-[70%]"
        style={{ animation: 'spin 60s linear infinite reverse' }}
      />
    </div>
  )
}
