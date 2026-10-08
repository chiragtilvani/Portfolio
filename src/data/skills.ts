/**
 * ──────────────────────────────────────────────────────────────
 * SKILLS — rendered as an interactive constellation.
 * Add / remove entries freely. `level` is only used for node size (1-3).
 * ──────────────────────────────────────────────────────────────
 */
export type SkillCategory = 'Frontend' | 'Backend' | 'Database' | 'Tools' | 'Concepts'

export interface Skill {
  name: string
  category: SkillCategory
  /** one-line role of this technology for you */
  role: string
  /** 2–3 short bullet points shown on hover */
  points: string[]
  /** 1 = supporting, 2 = regular, 3 = core strength */
  level: 1 | 2 | 3
}

export const skillCategories: { id: SkillCategory; label: string; hue: string }[] = [
  { id: 'Frontend', label: 'Frontend', hue: '#4fc3ff' },
  { id: 'Backend', label: 'Backend', hue: '#8b7cf6' },
  { id: 'Database', label: 'Database', hue: '#34d399' },
  { id: 'Tools', label: 'Tools', hue: '#f5f5f5' },
  { id: 'Concepts', label: 'Concepts', hue: '#f59e0b' },
]

export const skills: Skill[] = [
  // ── Frontend
  { name: 'HTML', category: 'Frontend', role: 'Semantic structure', points: ['Accessible markup', 'SEO-friendly documents'], level: 2 },
  { name: 'CSS', category: 'Frontend', role: 'Layout & motion', points: ['Flexbox & Grid', 'Animations & transitions', 'Responsive systems'], level: 2 },
  { name: 'JavaScript', category: 'Frontend', role: 'Language of the web', points: ['ES2023+', 'Async patterns', 'DOM & browser APIs'], level: 3 },
  { name: 'TypeScript', category: 'Frontend', role: 'Typed JavaScript', points: ['Strict typing', 'Generics & utility types', 'Safer refactoring'], level: 3 },
  { name: 'React', category: 'Frontend', role: 'Component UI', points: ['Hooks & composition', 'State management', 'Performance patterns'], level: 3 },
  { name: 'Angular', category: 'Frontend', role: 'Enterprise frontend', points: ['Components & services', 'RxJS', 'Reactive forms'], level: 3 },
  { name: 'Next.js', category: 'Frontend', role: 'React framework', points: ['App router', 'Server components', 'API routes'], level: 2 },
  { name: 'Tailwind CSS', category: 'Frontend', role: 'Utility styling', points: ['Design tokens', 'Rapid iteration', 'Consistent spacing'], level: 3 },
  { name: 'Bootstrap', category: 'Frontend', role: 'UI toolkit', points: ['Grid system', 'Prebuilt components'], level: 1 },

  // ── Backend
  { name: 'Java', category: 'Backend', role: 'Backend development', points: ['Object-oriented programming', 'Enterprise applications', 'Spring ecosystem'], level: 3 },
  { name: 'Spring Boot', category: 'Backend', role: 'Java web framework', points: ['REST controllers', 'Dependency injection', 'JPA & security'], level: 3 },
  { name: 'Node.js', category: 'Backend', role: 'JavaScript runtime', points: ['Event loop', 'Streams & file I/O', 'npm ecosystem'], level: 3 },
  { name: 'Express.js', category: 'Backend', role: 'Minimal web server', points: ['Routing & middleware', 'REST endpoints'], level: 2 },
  { name: 'Django', category: 'Backend', role: 'Python web framework', points: ['ORM & migrations', 'Admin & auth', 'MVT architecture'], level: 2 },
  { name: 'REST APIs', category: 'Backend', role: 'Service interfaces', points: ['Resource design', 'Status codes & errors', 'Versioning'], level: 3 },

  // ── Database
  { name: 'MySQL', category: 'Database', role: 'Relational database', points: ['Schema design', 'Joins & indexing', 'JDBC integration'], level: 3 },
  { name: 'PostgreSQL', category: 'Database', role: 'Relational database', points: ['Advanced SQL', 'Prisma / ORMs', 'Constraints & transactions'], level: 2 },
  { name: 'MongoDB', category: 'Database', role: 'Document database', points: ['Flexible schemas', 'Aggregation pipeline', 'Mongoose'], level: 2 },
  { name: 'SQLite', category: 'Database', role: 'Embedded database', points: ['Zero-config storage', 'Prototyping & desktop apps'], level: 2 },

  // ── Tools
  { name: 'Git', category: 'Tools', role: 'Version control', points: ['Branching strategies', 'Rebase & history'], level: 3 },
  { name: 'GitHub', category: 'Tools', role: 'Collaboration', points: ['Pull requests', 'Issues & actions'], level: 3 },
  { name: 'VS Code', category: 'Tools', role: 'Editor', points: ['Debugging', 'Extensions & snippets'], level: 2 },
  { name: 'Postman', category: 'Tools', role: 'API testing', points: ['Collections', 'Environment variables'], level: 2 },
  { name: 'Docker', category: 'Tools', role: 'Containers', points: ['Images & compose', 'Reproducible environments'], level: 1 },
  { name: 'npm', category: 'Tools', role: 'Package management', points: ['Scripts', 'Dependency management'], level: 2 },

  // ── Concepts
  { name: 'Object-Oriented Programming', category: 'Concepts', role: 'Design paradigm', points: ['Encapsulation & polymorphism', 'SOLID principles'], level: 3 },
  { name: 'Data Structures & Algorithms', category: 'Concepts', role: 'Problem solving', points: ['Complexity analysis', 'Graphs, trees, DP'], level: 3 },
  { name: 'REST Architecture', category: 'Concepts', role: 'API style', points: ['Statelessness', 'Resource modelling'], level: 2 },
  { name: 'Authentication', category: 'Concepts', role: 'Security', points: ['JWT & sessions', 'Role-based access'], level: 2 },
  { name: 'API Design', category: 'Concepts', role: 'Interfaces', points: ['Consistency', 'Documentation & contracts'], level: 2 },
  { name: 'Database Design', category: 'Concepts', role: 'Data modelling', points: ['Normalization', 'Indexing & relationships'], level: 2 },
]

/** Compact list used in the hero marquee / terminal. */
export const coreStack = ['Java', 'Spring Boot', 'Angular', 'React', 'Node.js', 'TypeScript', 'PostgreSQL', 'MongoDB', 'REST APIs']
