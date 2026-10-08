# Chirag Tilwani — Portfolio

A premium, interactive 3D developer portfolio built with React, TypeScript, Vite, Tailwind CSS v4, Three.js / React Three Fiber and Motion.

> **Positioning:** Computer Science Engineering student and aspiring Full-Stack Developer.
> **Brand line:** Engineering meets experience.

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build → dist/
npm run preview    # serve the production build
npm run lint       # oxlint
```

Requires **Node 18+** (developed on Node 24).

---

## What's inside

| Area | Implementation |
| --- | --- |
| **3D hero — "Digital Core"** | A persistent WebGL layer (`components/3d/Scene.tsx`) behind the whole page. The core morphs through four story stages as you scroll: Hero (compact core) → Skills (technology nodes) → Work (interface panels) → Contact (calm sphere). Particles morph on the GPU via a custom shader with four target positions. |
| Loading screen | `components/Loader.tsx` — ~1.2s count-up with a hard 2.6s ceiling. |
| Navigation | `components/Navbar.tsx` — floating glass pill, shrinks on scroll, animated full-screen mobile menu. |
| Custom cursor | `components/CustomCursor.tsx` — dot + lagging ring, expands on interactive elements, "View" label on project visuals. Disabled on touch devices. Magnetic buttons via `hooks/useMagnetic.ts`. |
| About | Copy + facts + an **interactive terminal** (`components/Terminal.tsx`) that auto-plays then accepts commands (`help`, `projects`, `open github`, …). |
| Skills | **Technology constellation** (`components/SkillConstellation.tsx`) — SVG graph of 5 systems × 30 technologies with hover/focus detail panel. Mobile falls back to grouped chips. |
| Projects | Six immersive case-study rows with generated product-style visuals (`components/projects/visuals.tsx`), cursor-tilt, following arrow, index→year flip, and a full-screen case-study modal (Problem / Approach / Technology / Challenge / Result). |
| Experience | Scroll-linked animated timeline. |
| Education | Degree card with live progress ring + semester strip + coursework modules. |
| Built in public | Demo contribution graph, stats count-up, language share, repo cards. **All demo data.** |
| Creative lab | Five experiments: canvas particle field, WebGL torus knot, scramble typography, tilt glass card, animated SVG chart. |
| Contact | Validated demo form (no backend) with success state. |
| Easter egg | Type `sudo hire chirag` anywhere (or in the terminal). |

### Performance & accessibility

- Lazy-loaded 3D scene and Lab section (`React.lazy` + `Suspense`), manual vendor chunks.
- Device-aware quality tiers (`lib/device.ts`): particle count, DPR, antialias. `PerformanceMonitor` lowers DPR / particle count under load.
- No WebGL → `components/3d/Fallback2D.tsx` (CSS-only animated background).
- `prefers-reduced-motion` respected throughout (reveals, cursor, 3D parallax, terminal typing, loader).
- Semantic landmarks, one `<h1>`, `<h2>` per section, skip link, focus-visible rings, keyboard-navigable constellation, modal focus trap.
- SEO: title, description, Open Graph, Twitter card, canonical, JSON-LD `Person` schema, favicon, OG image, `robots.txt`.

---

## Project structure

```
src/
  components/
    3d/              Scene, DigitalCore, Particles (shader), particle-targets, Fallback2D
    experiments/     ParticleField, RotatingObject, AnimatedTypography, GlassCard, MiniChart
    projects/        ProjectCard, ProjectModal, visuals (generated UI illustrations)
    ui/              Button, SectionHeader, Reveal, Tag, Modal, TextReveal, Decor, BrandIcons
    Navbar, Loader, CustomCursor, Footer, Terminal, EasterEgg, SkillConstellation
  sections/          Hero, About, Skills, Projects, Experience, Education, GitHub, Lab, Contact
  data/              ← EDIT THESE: profile, projects, skills, experience, education, socials, stats, github, terminal, experiments
  hooks/             useDeviceCapabilities, useSceneController, useActiveSection, useMagnetic, useEasterEgg, …
  lib/               utils, device, scene-store (frame-rate shared state), constants
  index.css          Tailwind v4 theme tokens + base styles + utilities
```

### Design tokens (`src/index.css`)

| Token | Value |
| --- | --- |
| `--color-bg` | `#050505` |
| `--color-bg-2` | `#0A0A0D` |
| `--color-fg` | `#F5F5F5` |
| `--color-muted` | `#8A8A8A` |
| `--color-line` | `rgba(255,255,255,0.10)` |
| `--color-accent` | `#4FC3FF` (electric blue) |
| `--color-violet` | `#8B7CF6` |
| Fonts | Space Grotesk (UI), JetBrains Mono (labels) |

### Tuning the 3D story

`src/lib/scene-store.ts` → `STORY_ANCHORS` controls, per section, the morph stage (0–3), horizontal position, vertical offset, scale and opacity of the Digital Core. `components/3d/DigitalCore.tsx` → `S` holds the per-stage values for each sub-object.

---

## PERSONALIZATION CHECKLIST

Search the codebase for **`[REPLACE_WITH_REAL_DATA]`** to find every placeholder. Then work through this list:

- [ ] **Profile photo** — none is used today (by design). If you want one, add it to `/public` and place it in `sections/About.tsx`.
- [ ] **Email** — `src/data/socials.ts` (`chirag@example.com`) and the structured data in `index.html`.
- [ ] **GitHub URL** — `src/data/socials.ts`, `src/data/projects.ts` (per project), `src/data/github.ts` (repo URLs), `index.html` (`sameAs`).
- [ ] **LinkedIn URL** — `src/data/socials.ts`, `index.html`.
- [ ] **Actual projects** — `src/data/projects.ts`: titles, descriptions, technologies, features, case-study copy, `github` and `live` links. Pick a `visual` per project or add your own in `components/projects/visuals.tsx`.
- [ ] **Project screenshots** — the visuals are generated UI illustrations. To use real screenshots, add images to `/public/projects/` and render them inside `ProjectVisual` (keep the device frame).
- [ ] **Actual experience** — `src/data/experience.ts` (all three entries are placeholders).
- [ ] **Resume** — put `resume.pdf` in `/public` and set `profile.resumeUrl` in `src/data/profile.ts`; add a link in the Navbar/Hero/Footer if desired.
- [ ] **Education** — `src/data/education.ts`: institution name, CGPA/honours, coursework.
- [ ] **Achievements** — add to `education.highlights` or create a new section.
- [ ] **Skills** — `src/data/skills.ts`: add/remove technologies, adjust `level` (1–3) and the hover `points`.
- [ ] **Statistics** — `src/data/stats.ts` (15+ / 500+ / 20+ / 10+ are **demo numbers**). Set `STATS_ARE_PLACEHOLDER = false` once real.
- [ ] **GitHub activity** — `src/data/github.ts`: repos, language share, and `generateContributions()` (replace with real data from the GitHub GraphQL API if you like). Set `GITHUB_DATA_IS_PLACEHOLDER = false` to hide the "Demo data" badge.
- [ ] **Contact form** — `sections/Contact.tsx` currently simulates submission. Wire `onSubmit` to Formspree, EmailJS, or your own endpoint.
- [ ] **Contact information / location** — `src/data/profile.ts` (`location`, `coordinates`, `timezone`, `availability`).
- [ ] **Domain** — replace `https://chiragtilwani.dev/` in `index.html` (canonical, OG, JSON-LD) and `public/robots.txt`.
- [ ] **OG image** — replace `public/og-image.svg` with a 1200×630 PNG/JPG and update the meta tags.
- [ ] **Hero copy** — `src/data/profile.ts` → `hero` (an alternative headline "Code. Design. Experience." is included).
- [ ] **Terminal** — `src/data/terminal.ts` commands and outputs.

---

## Deployment

Static output in `dist/`. Deploy to Vercel, Netlify, Cloudflare Pages or GitHub Pages. No server required.

---

Designed & built with curiosity. © Chirag Tilwani
