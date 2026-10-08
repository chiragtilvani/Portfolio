/**
 * ──────────────────────────────────────────────────────────────
 * PROJECTS — Selected work.
 * [REPLACE_WITH_REAL_DATA] Replace descriptions, links and case-study copy.
 * `visual` selects which generated UI illustration is rendered (see components/projects/visuals).
 * ──────────────────────────────────────────────────────────────
 */
export type ProjectVisual = 'finance' | 'marketplace' | 'prediction' | 'campus' | 'kanban' | 'library'

export interface Project {
  id: string
  index: string
  title: string
  category: string
  year: string
  description: string
  technologies: string[]
  features: string[]
  visual: ProjectVisual
  /** accent used for glows / gradients of this project */
  accent: string
  caseStudy: {
    problem: string
    approach: string
    technology: string
    challenge: string
    result: string
  }
  github: string
  live: string
}

export const projects: Project[] = [
  {
    id: 'finflow',
    index: '01',
    title: 'FinFlow',
    category: 'Personal Finance Platform',
    year: '2025',
    description:
      'A modern financial management platform designed to help users track expenses, manage budgets and understand their financial habits.',
    technologies: ['React', 'Node.js', 'MongoDB', 'Tailwind CSS'],
    features: ['Expense tracking', 'Categories', 'Dashboard', 'Financial insights', 'Responsive interface'],
    visual: 'finance',
    accent: '#4fc3ff',
    caseStudy: {
      problem:
        'Most budgeting tools either overwhelm with features or hide the information that matters. People want to answer one question quickly: where is my money going?',
      approach:
        'Started from the dashboard, not the database. Designed the three views a user opens most (overview, categories, monthly trend) and built the data model to serve them. Kept the entry flow to a single screen so logging an expense takes under five seconds.',
      technology:
        'React with a small set of custom hooks for data fetching and caching, an Express/Node.js REST API with MongoDB aggregation pipelines for category and time-series insights, and Tailwind CSS for a consistent design system.',
      challenge:
        'Computing rolling insights (month-over-month change, category share, anomalies) efficiently. Solved with pre-aggregated monthly documents updated on write instead of recomputing over every transaction on read.',
      result:
        'A responsive platform with sub-second dashboard loads, clear category insights and an expense flow that feels immediate. [REPLACE_WITH_REAL_DATA: add real metrics or screenshots]',
    },
    github: 'https://github.com/chiragtilwani/finflow', // [REPLACE_WITH_REAL_DATA]
    live: '#', // [REPLACE_WITH_REAL_DATA]
  },
  {
    id: 'marketnest',
    index: '02',
    title: 'MarketNest',
    category: 'Multi-Vendor Marketplace',
    year: '2025',
    description:
      'A full-stack marketplace platform designed around vendors, products, customers and order management.',
    technologies: ['Angular', 'ASP.NET Core', 'SQL Server', 'JWT'],
    features: ['Authentication', 'Vendor dashboard', 'Product management', 'Cart', 'Orders', 'Role-based access'],
    visual: 'marketplace',
    accent: '#8b7cf6',
    caseStudy: {
      problem:
        'A marketplace has three very different users: customers browsing, vendors managing inventory, and admins keeping everything honest. One interface rarely serves all three well.',
      approach:
        'Modelled the system around roles first. Each role gets its own Angular feature module with lazy loading, while a shared core handles auth, API access and UI primitives. The order lifecycle (cart → checkout → fulfilment) was mapped as an explicit state machine.',
      technology:
        'Angular with feature modules and RxJS state, ASP.NET Core Web API with layered architecture (controllers, services, repositories), SQL Server with EF Core, and JWT with refresh tokens plus role claims for authorization.',
      challenge:
        'Keeping cart and inventory consistent when multiple customers buy the last unit at the same time. Implemented optimistic concurrency on stock updates with clear user feedback when a reservation fails.',
      result:
        'A role-aware marketplace with secure auth, vendor tooling and a complete order flow. [REPLACE_WITH_REAL_DATA: add real metrics or screenshots]',
    },
    github: 'https://github.com/chiragtilwani/marketnest', // [REPLACE_WITH_REAL_DATA]
    live: '#',
  },
  {
    id: 'techprice',
    index: '03',
    title: 'TechPrice',
    category: 'Machine Learning / Prediction',
    year: '2025',
    description:
      'A machine-learning based platform that predicts technology product prices using historical and product-level data.',
    technologies: ['Python', 'Pandas', 'NumPy', 'Scikit-learn', 'React'],
    features: ['Price prediction', 'Feature importance', 'Historical trends', 'Interactive explorer'],
    visual: 'prediction',
    accent: '#34d399',
    caseStudy: {
      problem:
        'Tech product prices are noisy: specs, brand, release age and demand all pull in different directions. Buyers and resellers lack a quick, data-backed estimate.',
      approach:
        'Built a reproducible pipeline: clean and normalise product-level data, engineer features (spec tiers, release age, brand encoding), compare baseline and ensemble models, then expose the best model behind a simple API and a React explorer.',
      technology:
        'Pandas and NumPy for preparation, Scikit-learn pipelines for preprocessing + models (linear baselines, gradient boosting), cross-validation for model selection, and a React frontend for the interactive explorer.',
      challenge:
        'Avoiding leakage and over-fitting on a modest dataset. Used strict train/validation splits by product family and favoured interpretable features over brittle gains.',
      result:
        'A prediction tool with explainable outputs and visible feature importance. [REPLACE_WITH_REAL_DATA: add real metrics or screenshots]',
    },
    github: 'https://github.com/chiragtilwani/techprice', // [REPLACE_WITH_REAL_DATA]
    live: '#',
  },
  {
    id: 'campushub',
    index: '04',
    title: 'CampusHub',
    category: 'University Management System',
    year: '2024',
    description: 'A centralized university management platform connecting students, faculty and administrators.',
    technologies: ['Django', 'Python', 'SQLite'],
    features: ['Student management', 'Faculty management', 'Records', 'Authentication', 'Administration'],
    visual: 'campus',
    accent: '#f59e0b',
    caseStudy: {
      problem:
        'University data lives in spreadsheets, notice boards and group chats. Students, faculty and administrators each see a different, partial picture.',
      approach:
        'Centralised the core entities (students, faculty, courses, records) into one relational model and built role-specific dashboards on top. Reused Django’s admin for back-office tasks instead of rebuilding them.',
      technology:
        'Django with class-based views and the ORM, Django auth with groups and permissions for roles, SQLite for a zero-setup deployment, and server-rendered templates with progressive enhancement.',
      challenge:
        'Designing a records schema flexible enough for different departments while keeping queries simple. Settled on a normalised core with a small set of typed attribute tables.',
      result:
        'A single source of truth for campus data with role-aware access. [REPLACE_WITH_REAL_DATA: add real metrics or screenshots]',
    },
    github: 'https://github.com/chiragtilwani/campushub', // [REPLACE_WITH_REAL_DATA]
    live: '#',
  },
  {
    id: 'devboard',
    index: '05',
    title: 'DevBoard',
    category: 'Developer Collaboration Platform',
    year: '2026',
    description:
      'A collaborative workspace for developers to manage projects, tasks, documentation and technical workflows.',
    technologies: ['Next.js', 'TypeScript', 'PostgreSQL', 'Prisma'],
    features: ['Kanban boards', 'Task management', 'Docs', 'Workflows', 'Team workspaces'],
    visual: 'kanban',
    accent: '#4fc3ff',
    caseStudy: {
      problem:
        'Small developer teams juggle a task board, a wiki and a chat. Context is lost between them, and nobody wants another heavyweight tool.',
      approach:
        'Designed around one object: the task. Docs attach to tasks, workflows move tasks, and boards are just views over tasks. Kept the UI fast with optimistic updates and server actions.',
      technology:
        'Next.js App Router with server components and server actions, TypeScript end to end, PostgreSQL with Prisma for a typed schema and migrations, and a lightweight drag-and-drop implementation.',
      challenge:
        'Making drag-and-drop reordering feel instant while staying consistent across users. Used fractional ordering keys to avoid re-indexing whole columns on every move.',
      result:
        'A focused collaboration workspace with typed data from database to UI. [REPLACE_WITH_REAL_DATA: add real metrics or screenshots]',
    },
    github: 'https://github.com/chiragtilwani/devboard', // [REPLACE_WITH_REAL_DATA]
    live: '#',
  },
  {
    id: 'libraryx',
    index: '06',
    title: 'LibraryX',
    category: 'Java Application',
    year: '2024',
    description:
      'A desktop-based library management system built around object-oriented programming and relational database integration.',
    technologies: ['Java', 'JDBC', 'MySQL', 'Swing'],
    features: ['Catalogue', 'Members', 'Issue & return', 'Fines', 'Reports'],
    visual: 'library',
    accent: '#f5f5f5',
    caseStudy: {
      problem:
        'A small library needed to replace paper registers with something reliable that works offline on a single machine.',
      approach:
        'Applied a clean OOP structure: domain models, a DAO layer over JDBC, and a Swing UI separated from business logic. Every operation (issue, return, fine) is a transaction.',
      technology:
        'Java with Swing for the desktop UI, JDBC with prepared statements for data access, and MySQL with a normalised schema for books, members and transactions.',
      challenge:
        'Keeping the UI responsive during database calls. Moved queries off the Event Dispatch Thread with SwingWorker and added simple loading states.',
      result:
        'A dependable desktop system that demonstrates OOP design and relational data integration. [REPLACE_WITH_REAL_DATA: add real metrics or screenshots]',
    },
    github: 'https://github.com/chiragtilwani/libraryx', // [REPLACE_WITH_REAL_DATA]
    live: '#',
  },
]
