# TechStack for TaskPilot

**DATE:** February 24, 2026  
**VERSION:** 1.0  
**STATUS:** Approved  
**SOURCES:** PRD.md

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Client Layer                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                  │
│  │   Next.js   │  │   React 18  │  │  TypeScript │                  │
│  │   App Router│  │  Components │  │    Types    │                  │
│  └─────────────┘  └─────────────┘  └─────────────┘                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                  │
│  │ Tailwind CSS│  │  shadcn/ui  │  │   Zustand   │                  │
│  └─────────────┘  └─────────────┘  └─────────────┘                  │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         API Layer (Vercel)                          │
│  ┌─────────────────────┐  ┌─────────────────────┐                   │
│  │  Next.js API Routes │  │   Edge Functions    │                   │
│  │  (Serverless)       │  │   (Edge Runtime)    │                   │
│  └─────────────────────┘  └─────────────────────┘                   │
└─────────────────────────────────────────────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          ▼                   ▼                   ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│    Supabase     │  │   OpenAI API    │  │  Anthropic API  │
│  ┌───────────┐  │  │   (GPT-4)       │  │   (Claude)      │
│  │ PostgreSQL│  │  └─────────────────┘  └─────────────────┘
│  │   Auth    │  │           │
│  │  Storage  │  │           ▼
│  │ Realtime  │  │  ┌─────────────────┐
│  └───────────┘  │  │     Stripe      │
└─────────────────┘  │   (Payments)    │
                     └─────────────────┘
```

### Key NFRs from PRD
- **Latency:** Page Load <2s @ 95th percentile, API Response <300ms (read), <500ms (write)
- **Uptime:** ≥99.5% monthly
- **Scalability:** 1,000 → 10,000 concurrent users (6 months)
- **Security:** AES-256 encryption at rest, TLS 1.3 in transit, RLS in Supabase
- **Compliance:** GDPR, CCPA

---

## Technology Layers

### 1. Presentation (Frontend)

| Technology | Version | Purpose | Justification |
|------------|---------|---------|---------------|
| **Next.js** | 14.2.x | Framework | App Router, RSC, built-in optimization, Vercel integration |
| **React** | 18.3.x | UI Library | Latest concurrent features, Suspense, Server Components |
| **TypeScript** | 5.4.x | Type Safety | Compile-time error detection, better DX, refactoring support |
| **Tailwind CSS** | 3.4.x | Styling | Utility-first, JIT compilation, excellent performance |
| **shadcn/ui** | latest | Component Library | Radix primitives, accessible, customizable, no bundle bloat |
| **Zustand** | 4.5.x | Global State | Lightweight (2KB), simple API, no boilerplate |
| **TanStack Query** | 5.x | Server State | Caching, background refetch, optimistic updates |
| **React Hook Form** | 7.51.x | Forms | Minimal re-renders, excellent performance |
| **Zod** | 3.23.x | Validation | TypeScript-first, runtime validation, schema inference |

**Documentation:**
- Next.js: https://nextjs.org/docs
- React: https://react.dev
- Tailwind: https://tailwindcss.com/docs
- shadcn/ui: https://ui.shadcn.com

---

### 2. Backend

| Technology | Version | Purpose | Justification |
|------------|---------|---------|---------------|
| **Next.js API Routes** | 14.2.x | REST API | Serverless, co-located with frontend, automatic scaling |
| **Edge Functions** | (Vercel) | Low-latency APIs | Global edge network, <50ms cold start |
| **next-safe-action** | 7.x | Server Actions | Type-safe mutations, validation, error handling |

**API Architecture:**
- REST endpoints for CRUD operations
- Server Actions for mutations with real-time feedback
- Edge Functions for latency-critical paths (auth verification)

**Documentation:**
- Next.js API Routes: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
- Vercel Edge Functions: https://vercel.com/docs/functions/edge-functions

---

### 3. Database & Backend Services (Supabase)

| Technology | Version | Purpose | Justification |
|------------|---------|---------|---------------|
| **Supabase** | latest | BaaS Platform | All-in-one: DB + Auth + Storage + Realtime |
| **PostgreSQL** | 15.x | Primary Database | ACID compliance, pgvector for embeddings, mature ecosystem |
| **Supabase Auth** | latest | Authentication | JWT, OAuth providers, RLS integration |
| **Supabase Storage** | latest | File Storage | S3-compatible, CDN, resumable uploads |
| **Supabase Realtime** | latest | WebSockets | Task progress updates, presence |
| **pgvector** | 0.6.x | Vector DB | Semantic search for knowledge base |

**Database Configuration:**
- Connection pooling: Supavisor (PgBouncer alternative)
- Row Level Security (RLS) for all user tables
- Database backups: Point-in-time recovery (PITR)

**Documentation:**
- Supabase: https://supabase.com/docs
- pgvector: https://github.com/pgvector/pgvector

---

### 4. AI Integration

| Technology | Version/Model | Purpose | Justification |
|------------|---------------|---------|---------------|
| **OpenAI API** | GPT-4-turbo | Task decomposition, content generation | Best quality for complex reasoning |
| **OpenAI API** | text-embedding-ada-002 | Document embeddings | Cost-effective, 1536 dimensions |
| **Anthropic API** | Claude 3.5 Sonnet | Alternative LLM | Better for long-form content, safety |
| **AI SDK (Vercel)** | 3.x | AI Integration | Streaming, model switching, edge-ready |

**AI Architecture:**
- Primary: GPT-4-turbo for task decomposition and execution
- Fallback: Claude 3.5 Sonnet for rate limits or specific tasks
- Embeddings: text-embedding-ada-002 for knowledge base RAG

**Rate Limits & Costs:**
| Model | Rate Limit | Cost (Input/Output) |
|-------|------------|---------------------|
| GPT-4-turbo | 10K TPM | $0.01/$0.03 per 1K tokens |
| Claude 3.5 Sonnet | 4K RPM | $0.003/$0.015 per 1K tokens |
| ada-002 | 3M TPM | $0.0001 per 1K tokens |

**Documentation:**
- OpenAI: https://platform.openai.com/docs
- Anthropic: https://docs.anthropic.com
- Vercel AI SDK: https://sdk.vercel.ai/docs

---

### 5. Payments

| Technology | Version | Purpose | Justification |
|------------|---------|---------|---------------|
| **Stripe** | API v2024-01 | Payments & Subscriptions | Industry standard, SaaS billing |
| **@stripe/stripe-js** | 3.x | Client SDK | Secure card collection |
| **stripe** | 14.x | Server SDK | Subscription management |

**Features Used:**
- Checkout Sessions (hosted payment page)
- Customer Portal (self-serve billing)
- Webhooks (subscription events)
- Usage-based billing (task metering)

**Documentation:**
- Stripe: https://stripe.com/docs

---

### 6. Infrastructure & Hosting

| Technology | Purpose | Justification |
|------------|---------|---------------|
| **Vercel** | Hosting & CDN | Zero-config Next.js deployment, global edge network |
| **Vercel Analytics** | Performance monitoring | RUM, Web Vitals tracking |
| **Vercel Blob** | Large file storage | Fallback for files >50MB |

**Deployment Configuration:**
- Production: `main` branch auto-deploy
- Preview: PR-based deployments
- Edge Regions: Global (auto-selected)
- Build: Incremental Static Regeneration (ISR)

**Documentation:**
- Vercel: https://vercel.com/docs

---

### 7. Development Tools

| Category | Tool | Version | Purpose |
|----------|------|---------|---------|
| **Package Manager** | pnpm | 9.x | Fast, disk-efficient, strict mode |
| **Linter** | ESLint | 8.x | Code quality, Next.js config |
| **Formatter** | Prettier | 3.x | Consistent code style |
| **Type Checker** | TypeScript | 5.4.x | Static type checking |
| **Git Hooks** | Husky | 9.x | Pre-commit validation |
| **Commit Lint** | commitlint | 19.x | Conventional commits |
| **Testing (Unit)** | Vitest | 1.x | Fast, ESM-native, Jest-compatible |
| **Testing (E2E)** | Playwright | 1.42.x | Cross-browser, reliable |
| **Testing (Component)** | Testing Library | 15.x | React component tests |

**Documentation:**
- pnpm: https://pnpm.io
- Vitest: https://vitest.dev
- Playwright: https://playwright.dev

---

### 8. CI/CD

| Platform | Purpose |
|----------|---------|
| **GitHub Actions** | CI pipeline |
| **Vercel** | CD (auto-deploy) |

**Pipeline Jobs:**

```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  install:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile

  lint:
    needs: install
    runs-on: ubuntu-latest
    steps:
      - run: pnpm lint

  typecheck:
    needs: install
    runs-on: ubuntu-latest
    steps:
      - run: pnpm typecheck

  test:
    needs: install
    runs-on: ubuntu-latest
    steps:
      - run: pnpm test:unit
      - run: pnpm test:e2e

  security:
    needs: install
    runs-on: ubuntu-latest
    steps:
      - run: pnpm audit --audit-level=high
```

---

### 9. Observability

| Category | Tool | Purpose |
|----------|------|---------|
| **Error Tracking** | Sentry | 8.x | Exception monitoring, source maps |
| **Logging** | Vercel Logs | Request & function logs |
| **Analytics** | Vercel Analytics | Web Vitals, page views |
| **Monitoring** | Supabase Dashboard | DB metrics, API usage |
| **Uptime** | Better Uptime / Checkly | External monitoring, alerts |

**Documentation:**
- Sentry: https://docs.sentry.io/platforms/javascript/guides/nextjs/

---

## Compatibility Matrix

| Component A | Component B | Status | Notes |
|-------------|-------------|--------|-------|
| Next.js 14.2 | React 18.3 | ✅ OK | Native support |
| Next.js 14.2 | TypeScript 5.4 | ✅ OK | Built-in support |
| React 18.3 | Zustand 4.5 | ✅ OK | Full compatibility |
| React 18.3 | TanStack Query 5 | ✅ OK | RSC support included |
| Next.js 14.2 | Tailwind 3.4 | ✅ OK | Via PostCSS |
| Supabase JS | Next.js 14 SSR | ✅ OK | @supabase/ssr package |
| Vercel AI SDK 3 | Next.js 14 | ✅ OK | Edge runtime support |
| Stripe 14 | Next.js 14 | ✅ OK | Server Actions support |
| Node.js 20 | All packages | ✅ OK | LTS version |
| pnpm 9 | All packages | ✅ OK | Strict mode compatible |

---

## Dependencies

### Frontend Dependencies

```json
{
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "@supabase/supabase-js": "^2.42.0",
    "@supabase/ssr": "^0.3.0",
    "@tanstack/react-query": "^5.32.0",
    "zustand": "^4.5.0",
    "tailwindcss": "^3.4.0",
    "react-hook-form": "^7.51.0",
    "zod": "^3.23.0",
    "@hookform/resolvers": "^3.3.0",
    "ai": "^3.0.0",
    "@stripe/stripe-js": "^3.3.0",
    "lucide-react": "^0.370.0",
    "date-fns": "^3.6.0",
    "react-markdown": "^9.0.0",
    "rehype-highlight": "^7.0.0",
    "jspdf": "^2.5.0"
  }
}
```

**Install command:**
```bash
pnpm add next@^14.2.0 react@^18.3.0 react-dom@^18.3.0 @supabase/supabase-js@^2.42.0 @supabase/ssr@^0.3.0 @tanstack/react-query@^5.32.0 zustand@^4.5.0 react-hook-form@^7.51.0 zod@^3.23.0 @hookform/resolvers@^3.3.0 ai@^3.0.0 @stripe/stripe-js@^3.3.0 lucide-react@^0.370.0 date-fns@^3.6.0 react-markdown@^9.0.0 rehype-highlight@^7.0.0 jspdf@^2.5.0
```

### Backend Dependencies

```json
{
  "dependencies": {
    "stripe": "^14.21.0",
    "openai": "^4.38.0",
    "@anthropic-ai/sdk": "^0.20.0",
    "next-safe-action": "^7.1.0"
  }
}
```

**Install command:**
```bash
pnpm add stripe@^14.21.0 openai@^4.38.0 @anthropic-ai/sdk@^0.20.0 next-safe-action@^7.1.0
```

### UI Components (shadcn/ui)

```bash
# Initialize shadcn/ui
pnpm dlx shadcn-ui@latest init

# Add required components
pnpm dlx shadcn-ui@latest add button card input textarea select dialog dropdown-menu tabs toast progress avatar badge skeleton form
```

### Dev Dependencies

```json
{
  "devDependencies": {
    "typescript": "^5.4.0",
    "@types/node": "^20.12.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "eslint": "^8.57.0",
    "eslint-config-next": "^14.2.0",
    "prettier": "^3.2.0",
    "prettier-plugin-tailwindcss": "^0.5.0",
    "vitest": "^1.5.0",
    "@vitejs/plugin-react": "^4.2.0",
    "@testing-library/react": "^15.0.0",
    "@testing-library/jest-dom": "^6.4.0",
    "playwright": "^1.42.0",
    "@playwright/test": "^1.42.0",
    "husky": "^9.0.0",
    "@commitlint/cli": "^19.0.0",
    "@commitlint/config-conventional": "^19.0.0",
    "@sentry/nextjs": "^8.0.0"
  }
}
```

**Install command:**
```bash
pnpm add -D typescript@^5.4.0 @types/node@^20.12.0 @types/react@^18.3.0 @types/react-dom@^18.3.0 postcss@^8.4.0 autoprefixer@^10.4.0 eslint@^8.57.0 eslint-config-next@^14.2.0 prettier@^3.2.0 prettier-plugin-tailwindcss@^0.5.0 vitest@^1.5.0 @vitejs/plugin-react@^4.2.0 @testing-library/react@^15.0.0 @testing-library/jest-dom@^6.4.0 playwright@^1.42.0 @playwright/test@^1.42.0 husky@^9.0.0 @commitlint/cli@^19.0.0 @commitlint/config-conventional@^19.0.0 @sentry/nextjs@^8.0.0
```

---

## Lockfiles & CI Strategy

### Lockfile Management
- **Primary:** `pnpm-lock.yaml` (committed to repository)
- **Policy:** `--frozen-lockfile` in CI/CD
- **Updates:** Weekly via Renovate Bot

### Renovate Configuration

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": ["config:base"],
  "schedule": ["before 5am on Monday"],
  "automerge": true,
  "automergeType": "pr",
  "packageRules": [
    {
      "matchUpdateTypes": ["patch", "minor"],
      "automerge": true
    },
    {
      "matchUpdateTypes": ["major"],
      "automerge": false
    }
  ]
}
```

### CI Validation Flow
1. `pnpm install --frozen-lockfile` — Verify lockfile integrity
2. `pnpm lint` — ESLint validation
3. `pnpm typecheck` — TypeScript compilation
4. `pnpm test:unit` — Vitest unit tests
5. `pnpm test:e2e` — Playwright E2E tests
6. `pnpm audit --audit-level=high` — Security audit

---

## Environment Variables

```bash
# .env.local (development)
# .env.production (production - set in Vercel)

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# AI APIs
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App
NEXT_PUBLIC_APP_URL=https://app.taskpilot.com

# Sentry
SENTRY_DSN=https://xxx@sentry.io/xxx
SENTRY_AUTH_TOKEN=sntrys_...
```

---

## Reconciliation Notes

| Area | PRD Requirement | TechStack Decision | Resolution |
|------|-----------------|-------------------|------------|
| State Management | Not specified | Zustand + TanStack Query | Zustand for client state, TanStack Query for server state — optimal separation |
| PDF Export | FR-6.2 | jsPDF library | Client-side PDF generation, no server cost |
| Document Parsing | FR-4.1 (PDF, DOCX) | Server-side extraction in Supabase Edge Functions | Will use pdf-parse, mammoth libraries |
| Rate Limiting | NFR-4.5 | Vercel Edge Config + Upstash Redis | Upstash for distributed rate limiting if needed |
| Embeddings Storage | Data Model | pgvector in Supabase | Native PostgreSQL extension, no additional service |

---

## Security Considerations

| Layer | Implementation |
|-------|----------------|
| **Authentication** | Supabase Auth (JWT, httpOnly cookies, secure token refresh) |
| **Authorization** | Row Level Security (RLS) policies on all tables |
| **API Security** | Input validation (Zod), CSRF protection, rate limiting |
| **Data Encryption** | AES-256 at rest (Supabase), TLS 1.3 in transit |
| **Secrets Management** | Vercel Environment Variables (encrypted) |
| **Dependency Security** | Weekly `pnpm audit`, Renovate security updates |
| **Headers** | CSP, X-Frame-Options, X-Content-Type-Options via next.config.js |

---

## Assumptions

1. **Traffic:** MVP will handle ≤10,000 DAU; Vercel free tier sufficient initially
2. **AI Costs:** Average task consumes ~2,000 tokens → budget $0.06/task for GPT-4
3. **Storage:** Average user uploads ≤50MB; Supabase free tier adequate for MVP
4. **Realtime:** Supabase Realtime sufficient for task progress (≤100 concurrent connections per task)
5. **Browser Support:** Modern evergreen browsers only (Chrome, Firefox, Safari, Edge - last 2 versions)

---

## Technical Decisions Log

| Decision | Rationale | Alternatives Considered |
|----------|-----------|-------------------------|
| Next.js App Router over Pages | RSC performance, streaming, layouts | Remix (less Vercel integration) |
| Supabase over Firebase | PostgreSQL, RLS, open-source, pgvector | Firebase (NoSQL limitations), PlanetScale (no realtime) |
| Zustand over Redux | Minimal boilerplate, small bundle | Redux Toolkit (overkill), Jotai (less familiar) |
| pnpm over npm/yarn | Speed, disk efficiency, strict mode | npm (slower), yarn (similar but pnpm faster) |
| Vitest over Jest | ESM native, faster, watch mode | Jest (slower, CJS focused) |
| shadcn/ui over MUI | No bundle bloat, full customization | MUI (large bundle), Chakra (less flexible) |

---

## Sources

- Next.js Documentation: https://nextjs.org/docs
- React Documentation: https://react.dev
- Supabase Documentation: https://supabase.com/docs
- Vercel Documentation: https://vercel.com/docs
- OpenAI API Reference: https://platform.openai.com/docs
- Anthropic API Reference: https://docs.anthropic.com
- Stripe Documentation: https://stripe.com/docs
- Tailwind CSS: https://tailwindcss.com/docs
- shadcn/ui: https://ui.shadcn.com
- Vercel AI SDK: https://sdk.vercel.ai/docs
- pgvector: https://github.com/pgvector/pgvector
