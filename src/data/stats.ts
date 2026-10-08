/**
 * ──────────────────────────────────────────────────────────────
 * STATS — shown in the "Built in public" section.
 * ⚠ DEMO / PLACEHOLDER DATA. These are NOT verified numbers.
 * [REPLACE_WITH_REAL_DATA] Replace with real figures (or wire up the GitHub API).
 * ──────────────────────────────────────────────────────────────
 */
export interface Stat {
  value: number
  suffix: string
  label: string
}

export const stats: Stat[] = [
  { value: 15, suffix: '+', label: 'Projects' },
  { value: 500, suffix: '+', label: 'Commits' },
  { value: 20, suffix: '+', label: 'Repositories' },
  { value: 10, suffix: '+', label: 'Technologies' },
]

export const STATS_ARE_PLACEHOLDER = true
