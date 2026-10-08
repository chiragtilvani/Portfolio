import { seededRandom } from '@/lib/utils'

/**
 * ──────────────────────────────────────────────────────────────
 * GITHUB — demo data for the "Built in public" section.
 * ⚠ DEMO / PLACEHOLDER DATA generated deterministically. Not real activity.
 * [REPLACE_WITH_REAL_DATA] Replace `repos` and (optionally) fetch the real
 * contribution calendar from the GitHub GraphQL API.
 * ──────────────────────────────────────────────────────────────
 */
export interface Repo {
  name: string
  description: string
  language: string
  languageColor: string
  stars: number
  forks: number
  updated: string
  url: string
}

export const repos: Repo[] = [
  {
    name: 'finflow',
    description: 'Personal finance dashboard with insights and category analytics.',
    language: 'TypeScript',
    languageColor: '#3178c6',
    stars: 24,
    forks: 6,
    updated: 'Updated 3 days ago',
    url: 'https://github.com/chiragtilwani/finflow',
  },
  {
    name: 'marketnest',
    description: 'Multi-vendor marketplace: Angular + ASP.NET Core + SQL Server.',
    language: 'C#',
    languageColor: '#178600',
    stars: 18,
    forks: 4,
    updated: 'Updated last week',
    url: 'https://github.com/chiragtilwani/marketnest',
  },
  {
    name: 'techprice',
    description: 'ML pipeline predicting tech product prices with scikit-learn.',
    language: 'Python',
    languageColor: '#3572A5',
    stars: 31,
    forks: 9,
    updated: 'Updated 2 weeks ago',
    url: 'https://github.com/chiragtilwani/techprice',
  },
  {
    name: 'devboard',
    description: 'Developer collaboration workspace built with Next.js and Prisma.',
    language: 'TypeScript',
    languageColor: '#3178c6',
    stars: 12,
    forks: 2,
    updated: 'Updated yesterday',
    url: 'https://github.com/chiragtilwani/devboard',
  },
  {
    name: 'spring-api-starter',
    description: 'Opinionated Spring Boot REST starter with JWT auth and JPA.',
    language: 'Java',
    languageColor: '#b07219',
    stars: 15,
    forks: 5,
    updated: 'Updated last month',
    url: 'https://github.com/chiragtilwani/spring-api-starter',
  },
  {
    name: 'dsa-playground',
    description: 'Data structures & algorithms practice with explanations.',
    language: 'Java',
    languageColor: '#b07219',
    stars: 9,
    forks: 1,
    updated: 'Updated 3 weeks ago',
    url: 'https://github.com/chiragtilwani/dsa-playground',
  },
]

export const languageShare: { name: string; percent: number; color: string }[] = [
  { name: 'TypeScript', percent: 34, color: '#3178c6' },
  { name: 'Java', percent: 28, color: '#b07219' },
  { name: 'Python', percent: 14, color: '#3572A5' },
  { name: 'JavaScript', percent: 12, color: '#f1e05a' },
  { name: 'C#', percent: 7, color: '#178600' },
  { name: 'Other', percent: 5, color: '#8a8a8a' },
]

/** 52 weeks × 7 days of demo contribution intensity (0–4). Deterministic. */
export function generateContributions(seed = 2026): number[][] {
  const rand = seededRandom(seed)
  const weeks: number[][] = []
  for (let w = 0; w < 52; w++) {
    const week: number[] = []
    // Seasonal ramp: more activity in recent months
    const season = 0.35 + 0.65 * (w / 52)
    for (let d = 0; d < 7; d++) {
      const weekend = d === 0 || d === 6 ? 0.55 : 1
      const r = rand() * season * weekend
      let v = 0
      if (r > 0.18) v = 1
      if (r > 0.38) v = 2
      if (r > 0.58) v = 3
      if (r > 0.78) v = 4
      week.push(v)
    }
    weeks.push(week)
  }
  return weeks
}

export const GITHUB_DATA_IS_PLACEHOLDER = true
