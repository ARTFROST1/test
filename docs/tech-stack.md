# TechStack for RecastAI

**DATE:** 2026-02-24
**SOURCES:** PRD.md
**VERSION:** 1.0

---

## Architecture Overview

```
Browser (SPA/SSR) → Next.js on Vercel → Supabase (PostgreSQL + Auth + Storage) → OpenAI API / Stripe API
```

**High-level flow:**

1. **Presentation Layer** — Next.js 14 App Router with Server Components, Tailwind CSS, shadcn/ui
2. **API Layer** — Next.js API Routes (Vercel Serverless Functions) + Supabase Edge Functions
3. **Data Layer** — Supabase PostgreSQL with Row-Level Security, full-text search via `tsvector`
4. **AI Layer** — OpenAI GPT-4o via server-side API calls with SSE streaming
5. **Payments** — Stripe Checkout + Webhooks for subscription billing
6. **Infrastructure** — Vercel (hosting, CDN, serverless), Supabase (managed BaaS)

**Key NFRs driving tech choices:**

| Requirement | Target | Driving Decision |
|---|---|---|
| API response time (non-AI) | < 300ms median, < 800ms p95 | Vercel Edge Network + Supabase connection pooling |
| AI generation (4 platforms) | < 30 seconds end-to-end | SSE streaming, GPT-4o structured output |
| First post visible (streamed) | < 8 seconds | Server-Sent Events from API routes |
| Page load (LCP) | < 2 seconds on 4G | Next.js RSC, static generation where possible |
| Concurrent users | 1,000 without degradation | Vercel auto-scaling + Supabase Pro plan |
| Uptime | ≥ 99.5% monthly | Vercel + Supabase managed infrastructure |
| WCAG | Level AA | Radix UI primitives (accessible by default) |

---

## Technology Layers

### Presentation (Frontend)

| Technology | Version | Purpose | Justification |
|---|---|---|---|
| **Next.js** | 14.2+ (App Router) | Framework | Server Components reduce client JS; native streaming support for AI output; file-based routing; built-in API routes; excellent Vercel integration. LTS-aligned release. |
| **React** | 18.3+ | UI library | Required by Next.js; concurrent features enable streaming UI updates during AI generation. |
| **TypeScript** | 5.4+ | Language | Type safety across full stack; catches bugs at compile time; superior DX with IDE autocompletion; enforced on all files. |
| **Tailwind CSS** | 3.4+ | Styling | Utility-first approach speeds UI development; small production bundle via purging; consistent design tokens; excellent shadcn/ui integration. |
| **shadcn/ui** | latest (copy-paste) | Component library | Not a dependency — components are copied into the project and owned. Built on Radix UI primitives. Accessible, composable, fully customizable. No version lock-in. |
| **Radix UI** | latest | Accessible primitives | Unstyled, accessible-by-default primitives (Dialog, Dropdown, Tabs, Toast, etc.). Powers shadcn/ui. WCAG AA compliance built-in. |
| **Zustand** | 4.5+ | State management | Lightweight (< 1KB), no boilerplate, works with Server Components. Used for client-side UI state (platform selection, editor state, toast queue). React Context used for auth/session state via Supabase provider. |
| **Tiptap** | 2.6+ | Rich text editor | Headless, extensible rich text editor built on ProseMirror. Supports bold, italic, lists, links — exactly the formatting needed for inline post editing (FR-5.1–5.5). Lightweight, customizable toolbar. |
| **Lucide React** | 0.400+ | Icons | Tree-shakeable icon library; consistent with shadcn/ui defaults; MIT licensed. |
| **next-themes** | 0.3+ | Theme switching | Light/dark/system theme support per `user_preferences.theme` field. |

**Fallback option:** If Next.js App Router proves too unstable for streaming SSE, fall back to Pages Router with `getServerSideProps` + client-side SSE consumption.

**Documentation:**
- Next.js: https://nextjs.org/docs
- shadcn/ui: https://ui.shadcn.com
- Tiptap: https://tiptap.dev/docs
- Zustand: https://docs.pmnd.rs/zustand
- Tailwind CSS: https://tailwindcss.com/docs

---

### Backend

| Technology | Version | Purpose | Justification |
|---|---|---|---|
| **Next.js API Routes** | 14.2+ | Primary API layer | Colocated with frontend; serverless on Vercel; handles all `/api/*` routes (auth, repurpose, library, billing, usage). Zero server management. |
| **Supabase Edge Functions** | Deno runtime | Background/webhook processing | Used for Stripe webhook handling and scheduled tasks (e.g., monthly usage reset, soft-delete cleanup). Runs on Deno at the edge. |
| **OpenAI Node SDK** | 4.60+ | AI integration | Official SDK for GPT-4o API; supports streaming responses, structured outputs, function calling. Server-side only. |
| **Stripe Node SDK** | 16.0+ | Payment integration | Official SDK; handles Checkout Sessions, Customer Portal, webhook signature verification, subscription lifecycle. |
| **Zod** | 3.23+ | Input validation | Runtime schema validation for all API route inputs. Type-safe; generates TypeScript types from schemas. Used on both client and server. |
| **@supabase/supabase-js** | 2.45+ | Supabase client | Official JS client for Auth, Database (PostgREST), Storage, and Realtime. Used server-side with service role key and client-side with anon key + RLS. |
| **@supabase/ssr** | 0.5+ | SSR auth helpers | Server-side cookie-based session management for Next.js App Router. Handles JWT refresh in middleware. |

**URL Content Extraction (server-side):**

| Technology | Version | Purpose | Justification |
|---|---|---|---|
| **@mozilla/readability** | 0.5+ | Article extraction | Mozilla's Readability algorithm — battle-tested in Firefox Reader View. Extracts article title, body, excerpt from arbitrary HTML. Handles WordPress, Ghost, Substack, Medium, custom blogs. |
| **cheerio** | 1.0+ | HTML parsing | Fast, lightweight jQuery-like HTML parser for Node.js. Used to pre-process HTML before passing to Readability. No browser engine dependency. |
| **jsdom** | 24.0+ | DOM environment | Provides the DOM implementation required by `@mozilla/readability`. Lightweight compared to Puppeteer/Playwright for server-side HTML parsing. |

**Fallback option:** If `@mozilla/readability` extraction rate falls below 90% for target platforms, evaluate adding a headless browser step (Playwright) for JavaScript-rendered pages via a dedicated Supabase Edge Function.

**Documentation:**
- OpenAI SDK: https://platform.openai.com/docs
- Stripe SDK: https://docs.stripe.com/api
- Supabase JS: https://supabase.com/docs/reference/javascript
- Zod: https://zod.dev
- Readability: https://github.com/mozilla/readability

---

### Database

| Technology | Version | Purpose | Justification |
|---|---|---|---|
| **Supabase (PostgreSQL)** | PostgreSQL 15+ (Supabase managed) | Primary database | Managed PostgreSQL with built-in Auth, RLS, Storage, and Realtime. Eliminates need for separate auth service, file storage, and database hosting. RLS enforces data isolation at the DB level (NFR-3.2). Full-text search via `tsvector` indexes handles content library search (FR-6.2) without an external search service. |
| **Supabase Auth** | Integrated | Authentication | Email/password + Google OAuth. JWT-based sessions with 7-day expiry and auto-refresh. No custom auth implementation needed (NFR-3.1). |
| **Supabase Storage** | Integrated | File/blob storage | For user avatars and potential future file uploads. S3-compatible; RLS-protected buckets. |
| **Supabase Realtime** | Integrated | Live updates (future) | Available for future features like real-time collaboration. Not used in MVP but included in the platform at no cost. |

**Key database features used:**
- **Row-Level Security (RLS):** All tables enforce user-scoped access. Team content shared via `team_id` policy.
- **Full-text search:** GIN indexes on `source_contents` and `generated_posts` using `to_tsvector('english', ...)`.
- **JSONB columns:** `generated_posts.metadata` for platform-specific data (thread structure, hashtags, subject lines).
- **Array columns:** `source_contents.platforms`, `brand_voice_profiles.tone_keywords` for multi-value fields.
- **Soft delete:** `is_deleted` + `deleted_at` columns with 30-day recovery window.
- **Point-in-time recovery:** Enabled on Supabase Pro plan for data durability (NFR-2.3).

**Connection pooling:** Supabase uses PgBouncer in transaction mode. Vercel serverless functions connect via the pooled connection string to avoid connection exhaustion.

**Fallback option:** If Supabase PostgreSQL full-text search proves insufficient at scale (> 100K records), add Typesense or Meilisearch as a managed search layer.

**Documentation:**
- Supabase: https://supabase.com/docs
- PostgreSQL FTS: https://www.postgresql.org/docs/15/textsearch.html
- Supabase RLS: https://supabase.com/docs/guides/auth/row-level-security

---

### Infrastructure & Deployment

| Technology | Version/Tier | Purpose | Justification |
|---|---|---|---|
| **Vercel** | Pro plan | Hosting (frontend + API) | Native Next.js support; automatic preview deployments per PR; auto-scaling serverless functions; global Edge Network for static assets and ISR; built-in analytics. Cost-effective at MVP scale. |
| **Supabase** | Pro plan ($25/mo) | Backend-as-a-Service | PostgreSQL, Auth, Storage, Edge Functions in one platform. Pro plan provides: 8GB DB, 250K MAU auth, 100GB storage, daily backups, point-in-time recovery. |
| **Vercel Serverless Functions** | Node.js 20 runtime | API execution | Runs Next.js API routes. `maxDuration` set to 60s for AI generation routes (handles GPT-4o streaming). Auto-scales with traffic. |
| **Vercel Edge Network** | Included | CDN / caching | Serves static assets, ISR pages, and edge-cached responses globally. LCP < 2s target (NFR-1.4). |
| **GitHub** | Team plan | Source control | Git-based version control; PR-based workflow; branch protection; integrates with Vercel for auto-deploy. |
| **GitHub Actions** | Included | CI/CD pipeline | Automated test runs, linting, type-checking on every PR. Deployment handled by Vercel Git integration. |

**Environment variables (managed via Vercel + Supabase Dashboard):**

| Variable | Location | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Vercel env | Supabase project URL (client-safe) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Vercel env | Supabase anon key for RLS-protected client queries |
| `SUPABASE_SERVICE_ROLE_KEY` | Vercel env (secret) | Server-side Supabase access bypassing RLS |
| `OPENAI_API_KEY` | Vercel env (secret) | OpenAI API authentication |
| `STRIPE_SECRET_KEY` | Vercel env (secret) | Stripe server-side operations |
| `STRIPE_WEBHOOK_SECRET` | Vercel env (secret) | Stripe webhook signature verification |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Vercel env | Stripe client-side key |
| `NEXT_PUBLIC_APP_URL` | Vercel env | Application base URL for redirects |

**Documentation:**
- Vercel: https://vercel.com/docs
- Vercel Serverless Functions: https://vercel.com/docs/functions
- Supabase Self-Hosting (escape hatch): https://supabase.com/docs/guides/self-hosting

---

### Development Tools

| Technology | Version | Purpose | Justification |
|---|---|---|---|
| **pnpm** | 9.0+ | Package manager | Fast, disk-efficient (content-addressable store); strict dependency resolution prevents phantom dependencies; excellent monorepo support if needed later. |
| **ESLint** | 9.0+ (flat config) | Linter | Catches code quality issues, enforces consistent style. Uses `eslint-config-next` + `@typescript-eslint`. |
| **Prettier** | 3.3+ | Code formatter | Opinionated formatting; eliminates style debates. Integrated with ESLint via `eslint-config-prettier`. |
| **Husky** | 9.0+ | Git hooks | Runs linting and type-checking on pre-commit. Prevents broken code from entering the repository. |
| **lint-staged** | 15.2+ | Staged file linting | Runs ESLint + Prettier only on staged files for fast pre-commit checks. |
| **T3 Env** | 0.11+ (`@t3-oss/env-nextjs`) | Environment variable validation | Runtime validation of environment variables at build time. Prevents deployment with missing or invalid config. Uses Zod schemas. |

**Documentation:**
- pnpm: https://pnpm.io
- ESLint: https://eslint.org/docs/latest
- Prettier: https://prettier.io/docs

---

### Testing

| Technology | Version | Purpose | Justification |
|---|---|---|---|
| **Vitest** | 2.0+ | Unit + integration tests | Fast, Vite-native test runner; ESM-first; compatible with Jest API; built-in code coverage via v8/istanbul. |
| **React Testing Library** | 16.0+ | Component testing | Tests components from user perspective; encourages accessible markup; widely adopted standard. |
| **Playwright** | 1.45+ | End-to-end testing | Cross-browser E2E tests (Chrome, Firefox, Safari); reliable auto-waiting; supports Stripe test mode flows. |
| **MSW (Mock Service Worker)** | 2.4+ | API mocking | Intercepts network requests at the service worker level for tests. Mocks OpenAI, Stripe, and Supabase responses without modifying application code. |
| **k6** | 0.52+ | Load testing | Scriptable load testing tool; validates NFR-4.1 (1,000 concurrent users) and AI generation latency under load. |
| **Supabase CLI** | 1.200+ | Local development DB | Local PostgreSQL + Auth for integration testing. Schema migrations, seed data, RLS policy testing. |

**Coverage targets (from PRD Section 15):**

| Area | Target |
|---|---|
| Utility functions | ≥ 90% |
| API route handlers | ≥ 85% |
| Database queries | ≥ 80% |
| React components | ≥ 70% |

**Documentation:**
- Vitest: https://vitest.dev
- Playwright: https://playwright.dev
- MSW: https://mswjs.io

---

### CI/CD Pipeline

**Platform:** GitHub Actions + Vercel Git Integration

**Pipeline stages:**

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm typecheck        # tsc --noEmit
      - run: pnpm lint              # eslint
      - run: pnpm format:check      # prettier --check

  test:
    runs-on: ubuntu-latest
    needs: quality
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - uses: supabase/setup-cli@v1
      - run: supabase start          # local Supabase for integration tests
      - run: pnpm install --frozen-lockfile
      - run: pnpm test:unit          # vitest run
      - run: pnpm test:integration   # vitest run --config vitest.integration.config.ts

  e2e:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm exec playwright install --with-deps
      - run: pnpm build
      - run: pnpm test:e2e           # playwright test

  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - run: pnpm install --frozen-lockfile
      - run: pnpm audit              # dependency vulnerability scan
```

**Deployment flow:**
1. Push to `main` → Vercel production deployment (auto)
2. Push to PR branch → Vercel preview deployment (auto)
3. CI must pass before merge (branch protection rule)

**Lockfile strategy:**
- `pnpm-lock.yaml` committed to repository
- `--frozen-lockfile` enforced in CI
- Renovate Bot for automated dependency updates (weekly PRs)

---

### Observability & Monitoring

| Technology | Purpose | Justification |
|---|---|---|
| **Vercel Analytics** | Core Web Vitals, page performance | Built-in with Vercel; tracks LCP, FID, CLS; zero-config. |
| **Sentry** (via `@sentry/nextjs`) | Error tracking, exception monitoring | Industry standard; captures unhandled errors in both client and server; source maps support; alerting on error rate spikes. |
| **PostHog** (Cloud) | Product analytics, feature flags, funnels | Open-source-friendly analytics; event tracking for activation rate, conversion funnels, feature adoption; built-in feature flags for `ff_team_features`, `ff_voice_customization`, etc. |
| **Supabase Dashboard** | Database monitoring | Connection pool utilization, query performance, storage usage — built into Supabase Pro plan. |
| **Stripe Dashboard** | Payment monitoring | Subscription metrics, webhook delivery status, failed payment alerts — built into Stripe. |
| **UptimeRobot** (Free tier) | Uptime monitoring | External ping monitoring; alerts on downtime > 5 minutes; validates NFR-2.1 (≥ 99.5% uptime). |
| **OpenAI Dashboard** | API usage/spend monitoring | Token consumption, rate limit tracking, daily spend alerts (threshold: $50/day). |

**Alert thresholds (from PRD Section 16):**

| Metric | Threshold | Channel |
|---|---|---|
| API error rate | > 5% over 5 minutes | Sentry → Slack |
| AI generation p95 latency | > 45 seconds | PostHog → Slack |
| AI generation failure rate | > 10% | Sentry → Slack/Email |
| Supabase DB pool utilization | > 80% | Supabase → Email |
| Stripe webhook failure | Any failure | Stripe → Email |
| OpenAI daily spend | > $50 | OpenAI → Email |
| Downtime | > 5 minutes | UptimeRobot → Slack/Email |

---

## Compatibility Matrix

| Component A | Component B | Status | Notes |
|---|---|---|---|
| Next.js 14.2 | React 18.3 | ✅ OK | App Router requires React 18+ for Server Components |
| Next.js 14.2 | TypeScript 5.4 | ✅ OK | Built-in TypeScript support |
| Next.js 14.2 | Tailwind CSS 3.4 | ✅ OK | First-class support via `postcss` |
| Next.js 14.2 | Vercel (Node 20) | ✅ OK | Native deployment target |
| Next.js 14.2 | `@supabase/ssr` 0.5 | ✅ OK | Designed for Next.js App Router middleware |
| React 18.3 | Zustand 4.5 | ✅ OK | React 18 compatible; supports concurrent features |
| React 18.3 | Radix UI (latest) | ✅ OK | React 18 peer dependency satisfied |
| React 18.3 | Tiptap 2.6 | ✅ OK | React 18 compatible via `@tiptap/react` |
| `@supabase/supabase-js` 2.45 | Supabase PostgreSQL 15 | ✅ OK | Client matches server version |
| OpenAI Node SDK 4.60 | Node.js 20 | ✅ OK | Requires Node 18+; streaming API compatible |
| Stripe Node SDK 16.0 | Node.js 20 | ✅ OK | Requires Node 12+; webhook signing verified |
| Zod 3.23 | TypeScript 5.4 | ✅ OK | Full TS inference support |
| Vitest 2.0 | TypeScript 5.4 | ✅ OK | Native TS support via esbuild |
| Playwright 1.45 | Next.js 14.2 | ✅ OK | Supports local dev server and preview URLs |
| ESLint 9.0 | `eslint-config-next` | ✅ OK | Flat config supported in Next.js 14+ |
| Prettier 3.3 | ESLint 9.0 | ✅ OK | Via `eslint-config-prettier` |
| pnpm 9.0 | Node.js 20 | ✅ OK | Requires Node 18+ |
| `@mozilla/readability` 0.5 | jsdom 24.0 | ✅ OK | Requires DOMParser implementation from jsdom |
| cheerio 1.0 | Node.js 20 | ✅ OK | Pure JS HTML parser |
| Sentry (`@sentry/nextjs`) | Next.js 14.2 | ✅ OK | Dedicated Next.js SDK with App Router support |
| PostHog (`posthog-js`) | Next.js 14.2 | ✅ OK | Client-side SDK; server-side via `posthog-node` |

---

## Dependencies

### Backend Dependencies

| Package | Version | Install | License | Purpose |
|---|---|---|---|---|
| `next` | ^14.2.0 | `pnpm add next` | MIT | Framework |
| `react` | ^18.3.0 | `pnpm add react react-dom` | MIT | UI library |
| `typescript` | ^5.4.0 | `pnpm add -D typescript @types/react @types/node` | Apache-2.0 | Language |
| `@supabase/supabase-js` | ^2.45.0 | `pnpm add @supabase/supabase-js` | MIT | Supabase client |
| `@supabase/ssr` | ^0.5.0 | `pnpm add @supabase/ssr` | MIT | SSR auth helpers |
| `openai` | ^4.60.0 | `pnpm add openai` | Apache-2.0 | OpenAI SDK |
| `stripe` | ^16.0.0 | `pnpm add stripe` | MIT | Stripe SDK |
| `zod` | ^3.23.0 | `pnpm add zod` | MIT | Validation |
| `@mozilla/readability` | ^0.5.0 | `pnpm add @mozilla/readability` | Apache-2.0 | Article extraction |
| `cheerio` | ^1.0.0 | `pnpm add cheerio` | MIT | HTML parsing |
| `jsdom` | ^24.0.0 | `pnpm add jsdom` | MIT | DOM environment |
| `@t3-oss/env-nextjs` | ^0.11.0 | `pnpm add @t3-oss/env-nextjs` | MIT | Env validation |

### Frontend Dependencies

| Package | Version | Install | License | Purpose |
|---|---|---|---|---|
| `tailwindcss` | ^3.4.0 | `pnpm add -D tailwindcss postcss autoprefixer` | MIT | Utility CSS |
| `@radix-ui/react-*` | latest | `pnpm add @radix-ui/react-dialog @radix-ui/react-dropdown-menu ...` | MIT | UI primitives |
| `zustand` | ^4.5.0 | `pnpm add zustand` | MIT | State management |
| `@tiptap/react` | ^2.6.0 | `pnpm add @tiptap/react @tiptap/starter-kit @tiptap/extension-link` | MIT | Rich text editor |
| `lucide-react` | ^0.400.0 | `pnpm add lucide-react` | ISC | Icons |
| `next-themes` | ^0.3.0 | `pnpm add next-themes` | MIT | Theme switching |
| `class-variance-authority` | ^0.7.0 | `pnpm add class-variance-authority` | Apache-2.0 | Component variants (shadcn/ui) |
| `clsx` | ^2.1.0 | `pnpm add clsx` | MIT | Conditional classes |
| `tailwind-merge` | ^2.5.0 | `pnpm add tailwind-merge` | MIT | Tailwind class merging |
| `recharts` | ^2.12.0 | `pnpm add recharts` | MIT | Usage dashboard charts |
| `sonner` | ^1.5.0 | `pnpm add sonner` | MIT | Toast notifications |
| `date-fns` | ^3.6.0 | `pnpm add date-fns` | MIT | Date formatting/manipulation |

### Dev Dependencies

| Package | Version | Install | License | Purpose |
|---|---|---|---|---|
| `vitest` | ^2.0.0 | `pnpm add -D vitest @vitejs/plugin-react` | MIT | Test runner |
| `@testing-library/react` | ^16.0.0 | `pnpm add -D @testing-library/react @testing-library/jest-dom` | MIT | Component testing |
| `playwright` | ^1.45.0 | `pnpm add -D @playwright/test` | Apache-2.0 | E2E testing |
| `msw` | ^2.4.0 | `pnpm add -D msw` | MIT | API mocking |
| `eslint` | ^9.0.0 | `pnpm add -D eslint eslint-config-next @typescript-eslint/eslint-plugin` | MIT | Linting |
| `prettier` | ^3.3.0 | `pnpm add -D prettier eslint-config-prettier prettier-plugin-tailwindcss` | MIT | Formatting |
| `husky` | ^9.0.0 | `pnpm add -D husky` | MIT | Git hooks |
| `lint-staged` | ^15.2.0 | `pnpm add -D lint-staged` | MIT | Staged file linting |
| `supabase` | ^1.200.0 | `pnpm add -D supabase` | Apache-2.0 | Local dev + migrations |

### Full install command (bootstrapping):

```bash
# Initialize project
pnpm create next-app@latest recast-ai --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

cd recast-ai

# Core dependencies
pnpm add @supabase/supabase-js @supabase/ssr openai stripe zod \
  @mozilla/readability cheerio jsdom @t3-oss/env-nextjs

# Frontend dependencies
pnpm add zustand @tiptap/react @tiptap/starter-kit @tiptap/extension-link \
  lucide-react next-themes class-variance-authority clsx tailwind-merge \
  recharts sonner date-fns

# Dev dependencies
pnpm add -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom \
  @playwright/test msw prettier eslint-config-prettier prettier-plugin-tailwindcss \
  husky lint-staged supabase @types/jsdom

# shadcn/ui initialization
pnpm dlx shadcn@latest init
```

---

## Lockfiles & CI

| Layer | Lockfile | Strategy |
|---|---|---|
| Application | `pnpm-lock.yaml` | Committed to repo; `--frozen-lockfile` in CI |
| Supabase schema | `supabase/migrations/*.sql` | Versioned SQL migrations via Supabase CLI |
| Environment | `.env.local` (local), Vercel Dashboard (prod) | `.env.example` committed; actual secrets never in repo |

**Dependency update strategy:**
- **Renovate Bot** configured for weekly dependency update PRs
- Automerge enabled for patch updates with passing CI
- Major version updates require manual review
- Security updates merged immediately (Renovate auto-detects CVEs)

**CI validation pipeline (every PR):**
1. `pnpm install --frozen-lockfile` — reproducible installs
2. `pnpm typecheck` — TypeScript compilation check
3. `pnpm lint` — ESLint rules
4. `pnpm format:check` — Prettier formatting
5. `pnpm test:unit` — Vitest unit tests
6. `pnpm test:integration` — Vitest integration tests (with local Supabase)
7. `pnpm audit` — Dependency vulnerability scan
8. `pnpm test:e2e` — Playwright E2E tests (on merge to `main`)

---

## Reconciliation Notes

| Topic | Resolution |
|---|---|
| **State management: Zustand vs React Context** | Use both. Zustand for complex client-side UI state (editor state, generation progress, platform selection cache). React Context for Supabase auth session propagation. This avoids prop drilling while keeping auth state close to the Supabase provider. |
| **Rich text editor: Tiptap vs alternatives** | Tiptap selected over Slate.js and Quill. Tiptap is headless (style with Tailwind), MIT-licensed, and has better React 18 support. Slate has a steeper learning curve; Quill has opinionated styling that conflicts with shadcn/ui aesthetics. |
| **URL extraction: cheerio vs Readability** | Use both in tandem. `cheerio` handles initial HTML parsing and pre-cleaning; `@mozilla/readability` extracts the article content from the cleaned DOM. This layered approach maximizes extraction success rate (target ≥ 90% per FR-2.3). |
| **OpenAI model: GPT-4o vs GPT-4o-mini** | Use GPT-4o as the primary model for content generation quality. Evaluate GPT-4o-mini for simpler platforms (e.g., Bluesky at 300 chars) to reduce cost per generation. A/B test quality vs. cost tradeoffs post-launch (Risk R-3). |
| **Supabase Edge Functions vs Next.js API Routes** | Default to Next.js API Routes for all user-facing endpoints. Use Supabase Edge Functions only for Stripe webhooks (benefits from Supabase's direct DB access) and scheduled cron tasks. Avoids splitting business logic across two runtimes. |
| **Vercel serverless function timeout** | AI generation routes require up to 60 seconds. Vercel Pro plan supports `maxDuration: 60` for serverless functions. SSE streaming keeps the connection alive and delivers incremental results, so users see content well before the timeout. |
| **Database full-text search vs external search** | PostgreSQL `tsvector` with GIN indexes is sufficient for MVP scale (up to 100K source records and 1M generated posts per NFR-4.2). Avoids adding infrastructure complexity. Will re-evaluate if search latency exceeds 2 seconds at scale. |
| **Node.js runtime version** | Vercel serverless functions use Node.js 20 LTS. All dependencies confirmed compatible. Node 20 provides native `fetch`, improved performance, and LTS support through April 2026. |

---

## Assumptions

1. **Supabase Pro plan** ($25/month) is sufficient for MVP traffic (1,000 concurrent users, 100K content records). Will upgrade to Team/Enterprise if connection pool or storage limits are reached.
2. **Vercel Pro plan** ($20/month) provides adequate serverless function invocations and bandwidth for MVP. The 60-second `maxDuration` covers AI generation timeout requirements.
3. **OpenAI GPT-4o** pricing remains stable near current rates (~$2.50/1M input tokens, ~$10/1M output tokens). Cost per repurpose estimated at $0.02–0.08 depending on content length and platform count.
4. **Stripe** standard pricing (2.9% + $0.30 per transaction) is acceptable for MVP. No volume discount negotiation needed until MRR > $50K.
5. **English-only** at launch. Internationalization is out of scope per PRD Section 19.
6. **No native mobile apps** at launch. Responsive web design sufficient for target personas.
7. **Browser support** targets latest 2 versions of Chrome, Firefox, Safari, and Edge per NFR-6.1. No IE11 support.
8. **Single-region deployment** (US) is acceptable for MVP. Vercel CDN provides global static asset delivery; Supabase region selected as US East.

---

## Sources

- Next.js Documentation: https://nextjs.org/docs
- Supabase Documentation: https://supabase.com/docs
- OpenAI API Reference: https://platform.openai.com/docs/api-reference
- Stripe API Documentation: https://docs.stripe.com/api
- Tailwind CSS Documentation: https://tailwindcss.com/docs
- shadcn/ui Documentation: https://ui.shadcn.com
- Radix UI Documentation: https://www.radix-ui.com/docs/primitives
- Tiptap Documentation: https://tiptap.dev/docs
- Zustand Documentation: https://docs.pmnd.rs/zustand
- Vitest Documentation: https://vitest.dev
- Playwright Documentation: https://playwright.dev
- Sentry Next.js SDK: https://docs.sentry.io/platforms/javascript/guides/nextjs
- PostHog Documentation: https://posthog.com/docs
- Mozilla Readability: https://github.com/mozilla/readability
- Zod Documentation: https://zod.dev
- Vercel Documentation: https://vercel.com/docs
- pnpm Documentation: https://pnpm.io
