# Project Structure: RecastAI

> **Version:** 1.0
> **Date:** 2026-02-24
> **Status:** Draft
> **Depends on:** PRD.md (v1.0), TechStack.md (v1.0), DatabaseSchema.md (v1.0), UI_UX.md (v1.0)

---

## Table of Contents

1. [Overview](#1-overview)
2. [Root Directory](#2-root-directory)
3. [Full Directory Tree](#3-full-directory-tree)
4. [Configuration Files](#4-configuration-files)
5. [Source Directory — `src/`](#5-source-directory--src)
6. [App Router — `src/app/`](#6-app-router--srcapp)
7. [Components — `src/components/`](#7-components--srccomponents)
8. [Library & Utilities — `src/lib/`](#8-library--utilities--srclib)
9. [Type Definitions — `src/types/`](#9-type-definitions--srctypes)
10. [Stores — `src/stores/`](#10-stores--srcstores)
11. [Hooks — `src/hooks/`](#11-hooks--srchooks)
12. [Supabase — `supabase/`](#12-supabase--supabase)
13. [Tests — `tests/`](#13-tests--tests)
14. [CI/CD & Deployment](#14-cicd--deployment)
15. [Environment Variables](#15-environment-variables)
16. [Naming Conventions](#16-naming-conventions)
17. [Reconciliation Notes](#17-reconciliation-notes)

---

## 1. Overview

RecastAI is a Next.js 14+ (App Router) monolith deployed on Vercel with a Supabase backend. The project uses the `src/` directory layout with the `@/*` import alias. Package management is via pnpm.

**Key architectural decisions reflected in structure:**

| Decision | Structural Impact |
|---|---|
| Next.js App Router with `src/` dir | All application code under `src/app/`, file-based routing |
| shadcn/ui (copy-paste model) | Components owned in `src/components/ui/` |
| Supabase (Auth + DB + Storage) | Client utilities in `src/lib/supabase/`, migrations in `supabase/` |
| Feature-based component organization | Components grouped by domain (`auth`, `repurpose`, `library`, etc.) |
| Colocated API routes | API handlers in `src/app/api/` using Route Handlers |
| Zustand for client state | Stores in `src/stores/` |
| Vitest + Playwright testing | Tests in `tests/` at project root |
| GitHub Actions CI/CD | Workflows in `.github/workflows/` |

---

## 2. Root Directory

```
recast-ai/
├── .github/                    # GitHub Actions CI/CD workflows
├── .husky/                     # Git hooks (pre-commit)
├── docs/                       # Project documentation
├── public/                     # Static assets served by Next.js
├── src/                        # Application source code
├── supabase/                   # Supabase migrations, seed data, config
├── tests/                      # Test suites (unit, integration, e2e)
│
├── .env.example                # Environment variable template
├── .env.local                  # Local environment values (git-ignored)
├── .eslintrc.mjs               # ESLint flat config
├── .gitignore                  # Git ignore rules
├── .prettierrc                 # Prettier configuration
├── .prettierignore             # Prettier ignore rules
├── components.json             # shadcn/ui configuration
├── lint-staged.config.mjs      # lint-staged configuration
├── next.config.ts              # Next.js configuration
├── package.json                # Dependencies and scripts
├── pnpm-lock.yaml              # pnpm lockfile (committed)
├── postcss.config.mjs          # PostCSS configuration (Tailwind)
├── README.md                   # Project readme
├── sentry.client.config.ts     # Sentry client-side configuration
├── sentry.server.config.ts     # Sentry server-side configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
└── vitest.config.ts            # Vitest unit test configuration
```

### File Purposes — Root

| File | Purpose | Key Exports / Notes |
|---|---|---|
| `.env.example` | Template listing all required environment variables with placeholder values. Committed to repo. | — |
| `.env.local` | Actual local development secrets. **Never committed.** | — |
| `.eslintrc.mjs` | ESLint 9 flat config extending `eslint-config-next` and `@typescript-eslint`. | — |
| `.prettierrc` | Prettier config: `semi: true`, `singleQuote: true`, `trailingComma: "all"`, Tailwind plugin. | — |
| `.prettierignore` | Excludes `pnpm-lock.yaml`, `.next/`, `node_modules/`, `supabase/.temp/`. | — |
| `components.json` | shadcn/ui CLI config: component paths, Tailwind config, aliases (`@/components`, `@/lib/utils`). | — |
| `lint-staged.config.mjs` | Runs ESLint + Prettier on staged `*.{ts,tsx}` files via Husky pre-commit hook. | — |
| `next.config.ts` | Next.js config: Sentry integration, image domains (Supabase Storage), serverless function `maxDuration` settings. | — |
| `postcss.config.mjs` | PostCSS plugins: `tailwindcss`, `autoprefixer`. | — |
| `sentry.client.config.ts` | Sentry browser SDK initialization: DSN, tracing sample rate, replay config. | — |
| `sentry.server.config.ts` | Sentry server SDK initialization: DSN, traces sample rate. | — |
| `tailwind.config.ts` | Tailwind config: content paths, theme extensions (colors from CSS vars, fonts), darkMode `"class"`, plugins. | — |
| `tsconfig.json` | TypeScript config: `strict: true`, `paths: { "@/*": ["./src/*"] }`, `target: "ES2022"`, `jsx: "preserve"`. | — |
| `vitest.config.ts` | Vitest config: React plugin, path aliases, `test.include` patterns, coverage thresholds. | — |

---

## 3. Full Directory Tree

```
recast-ai/
│
├── .github/
│   ├── workflows/
│   │   ├── ci.yml                          # Main CI pipeline (lint, typecheck, test)
│   │   └── e2e.yml                         # E2E tests on merge to main
│   └── renovate.json                       # Renovate bot configuration
│
├── .husky/
│   └── pre-commit                          # Runs lint-staged before each commit
│
├── docs/
│   ├── PRD.md
│   ├── tech-stack.md
│   ├── db-schema.md
│   ├── ui-ux.md
│   └── project-structure.md
│
├── public/
│   ├── favicon.ico
│   ├── og-image.png                        # Open Graph social sharing image
│   ├── apple-touch-icon.png
│   └── robots.txt
│
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   ├── forgot-password/
│   │   │   │   └── page.tsx
│   │   │   ├── reset-password/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── (marketing)/
│   │   │   ├── page.tsx
│   │   │   ├── pricing/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── (app)/
│   │   │   ├── dashboard/
│   │   │   │   ├── page.tsx
│   │   │   │   └── loading.tsx
│   │   │   ├── repurpose/
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx
│   │   │   │       └── loading.tsx
│   │   │   ├── library/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── loading.tsx
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx
│   │   │   │       └── loading.tsx
│   │   │   ├── settings/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── voice/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── billing/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── team/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── layout.tsx
│   │   │   ├── layout.tsx
│   │   │   └── loading.tsx
│   │   │
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── signup/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── callback/
│   │   │   │   │   └── route.ts
│   │   │   │   └── confirm/
│   │   │   │       └── route.ts
│   │   │   ├── repurpose/
│   │   │   │   ├── route.ts
│   │   │   │   └── [sourceId]/
│   │   │   │       └── regenerate/
│   │   │   │           └── route.ts
│   │   │   ├── posts/
│   │   │   │   └── [postId]/
│   │   │   │       └── route.ts
│   │   │   ├── library/
│   │   │   │   └── route.ts
│   │   │   ├── usage/
│   │   │   │   └── route.ts
│   │   │   ├── extract-url/
│   │   │   │   └── route.ts
│   │   │   └── billing/
│   │   │       ├── create-checkout/
│   │   │           └── route.ts
│   │   │       └── webhook/
│   │   │           └── route.ts
│   │   │
│   │   ├── error.tsx
│   │   ├── not-found.tsx
│   │   ├── layout.tsx
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── ui/
│   │   │   ├── accordion.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── breadcrumb.tsx
│   │   │   ├── button.tsx
│   │   │   ├── calendar.tsx
│   │   │   ├── card.tsx
│   │   │   ├── checkbox.tsx
│   │   │   ├── command.tsx
│   │   │   ├── date-picker.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── form.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── popover.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── radio-group.tsx
│   │   │   ├── select.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── sheet.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── switch.tsx
│   │   │   ├── table.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── toast.tsx
│   │   │   └── tooltip.tsx
│   │   │
│   │   ├── icons/
│   │   │   ├── platform-icons.tsx
│   │   │   └── logo.tsx
│   │   │
│   │   ├── layout/
│   │   │   ├── app-sidebar.tsx
│   │   │   ├── sidebar-nav-item.tsx
│   │   │   ├── sidebar-user-menu.tsx
│   │   │   ├── sidebar-usage-indicator.tsx
│   │   │   ├── mobile-nav.tsx
│   │   │   ├── page-header.tsx
│   │   │   ├── top-bar.tsx
│   │   │   ├── marketing-navbar.tsx
│   │   │   └── footer.tsx
│   │   │
│   │   ├── auth/
│   │   │   ├── login-form.tsx
│   │   │   ├── register-form.tsx
│   │   │   ├── forgot-password-form.tsx
│   │   │   ├── reset-password-form.tsx
│   │   │   ├── oauth-button.tsx
│   │   │   ├── password-requirements.tsx
│   │   │   └── auth-card.tsx
│   │   │
│   │   ├── repurpose/
│   │   │   ├── step-indicator.tsx
│   │   │   ├── content-input-area.tsx
│   │   │   ├── url-input.tsx
│   │   │   ├── url-preview.tsx
│   │   │   ├── platform-selector.tsx
│   │   │   ├── platform-toggle-card.tsx
│   │   │   ├── voice-selector.tsx
│   │   │   ├── generation-progress.tsx
│   │   │   ├── results-view.tsx
│   │   │   ├── results-header.tsx
│   │   │   ├── platform-tabs.tsx
│   │   │   ├── generated-post-card.tsx
│   │   │   └── post-editor.tsx
│   │   │
│   │   ├── library/
│   │   │   ├── library-toolbar.tsx
│   │   │   ├── search-input.tsx
│   │   │   ├── platform-filter.tsx
│   │   │   ├── date-range-filter.tsx
│   │   │   ├── sort-select.tsx
│   │   │   ├── active-filters.tsx
│   │   │   ├── view-toggle.tsx
│   │   │   ├── content-library-item.tsx
│   │   │   ├── content-grid.tsx
│   │   │   ├── content-list.tsx
│   │   │   ├── content-detail-header.tsx
│   │   │   ├── source-preview.tsx
│   │   │   └── library-empty-state.tsx
│   │   │
│   │   ├── dashboard/
│   │   │   ├── stats-grid.tsx
│   │   │   ├── stat-card.tsx
│   │   │   ├── usage-banner.tsx
│   │   │   ├── recent-activity-card.tsx
│   │   │   ├── weekly-chart-card.tsx
│   │   │   ├── quick-start-card.tsx
│   │   │   └── tip-card.tsx
│   │   │
│   │   ├── settings/
│   │   │   ├── settings-nav.tsx
│   │   │   ├── profile-form.tsx
│   │   │   ├── avatar-upload.tsx
│   │   │   ├── theme-selector.tsx
│   │   │   ├── voice-preset-selector.tsx
│   │   │   ├── custom-voice-input.tsx
│   │   │   ├── voice-preview.tsx
│   │   │   ├── billing-current-plan.tsx
│   │   │   ├── billing-history-table.tsx
│   │   │   └── pricing-table.tsx
│   │   │
│   │   ├── team/
│   │   │   ├── team-member-list.tsx
│   │   │   ├── team-member-row.tsx
│   │   │   ├── invite-form.tsx
│   │   │   ├── pending-invitations.tsx
│   │   │   ├── brand-voice-card.tsx
│   │   │   └── create-voice-profile-dialog.tsx
│   │   │
│   │   ├── marketing/
│   │   │   ├── hero-section.tsx
│   │   │   ├── hero-visual.tsx
│   │   │   ├── social-proof-bar.tsx
│   │   │   ├── features-section.tsx
│   │   │   ├── feature-card.tsx
│   │   │   ├── how-it-works-section.tsx
│   │   │   ├── cta-section.tsx
│   │   │   └── faq-section.tsx
│   │   │
│   │   └── shared/
│   │       ├── confirm-dialog.tsx
│   │       ├── empty-state.tsx
│   │       ├── pagination.tsx
│   │       ├── platform-badge.tsx
│   │       ├── character-count.tsx
│   │       ├── export-dropdown.tsx
│   │       ├── copy-button.tsx
│   │       ├── upgrade-dialog.tsx
│   │       └── theme-toggle.tsx
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts
│   │   │   ├── server.ts
│   │   │   ├── admin.ts
│   │   │   └── middleware.ts
│   │   │
│   │   ├── ai/
│   │   │   ├── openai-client.ts
│   │   │   ├── prompts/
│   │   │   │   ├── system-prompt.ts
│   │   │   │   ├── twitter-prompt.ts
│   │   │   │   ├── linkedin-prompt.ts
│   │   │   │   ├── instagram-prompt.ts
│   │   │   │   ├── tiktok-prompt.ts
│   │   │   │   ├── bluesky-prompt.ts
│   │   │   │   └── email-prompt.ts
│   │   │   ├── generate.ts
│   │   │   └── stream.ts
│   │   │
│   │   ├── stripe/
│   │   │   ├── client.ts
│   │   │   ├── config.ts
│   │   │   └── webhooks.ts
│   │   │
│   │   ├── extraction/
│   │   │   └── extract-url.ts
│   │   │
│   │   ├── validators/
│   │   │   ├── auth.ts
│   │   │   ├── repurpose.ts
│   │   │   ├── posts.ts
│   │   │   ├── library.ts
│   │   │   ├── billing.ts
│   │   │   └── settings.ts
│   │   │
│   │   ├── services/
│   │   │   ├── repurpose-service.ts
│   │   │   ├── library-service.ts
│   │   │   ├── usage-service.ts
│   │   │   ├── profile-service.ts
│   │   │   ├── team-service.ts
│   │   │   └── voice-service.ts
│   │   │
│   │   ├── utils.ts
│   │   ├── constants.ts
│   │   ├── platform-config.ts
│   │   ├── rate-limit.ts
│   │   ├── errors.ts
│   │   ├── export.ts
│   │   └── env.ts
│   │
│   ├── types/
│   │   ├── database.ts
│   │   ├── api.ts
│   │   ├── platform.ts
│   │   └── index.ts
│   │
│   ├── stores/
│   │   ├── repurpose-store.ts
│   │   ├── editor-store.ts
│   │   └── platform-store.ts
│   │
│   ├── hooks/
│   │   ├── use-user.ts
│   │   ├── use-usage.ts
│   │   ├── use-repurpose.ts
│   │   ├── use-library.ts
│   │   ├── use-copy-clipboard.ts
│   │   ├── use-debounce.ts
│   │   └── use-media-query.ts
│   │
│   └── middleware.ts
│
├── supabase/
│   ├── config.toml
│   ├── seed.sql
│   └── migrations/
│       ├── 00001_create_enums.sql
│       ├── 00002_create_teams.sql
│       ├── 00003_create_profiles.sql
│       ├── 00004_create_team_invitations.sql
│       ├── 00005_create_brand_voice_profiles.sql
│       ├── 00006_create_source_contents.sql
│       ├── 00007_create_generated_posts.sql
│       ├── 00008_create_usage_records.sql
│       ├── 00009_create_user_preferences.sql
│       ├── 00010_create_indexes.sql
│       ├── 00011_enable_rls_policies.sql
│       ├── 00012_create_trigger_functions.sql
│       ├── 00013_create_triggers.sql
│       ├── 00014_create_views.sql
│       └── 00015_create_storage_buckets.sql
│
├── tests/
│   ├── unit/
│   │   ├── lib/
│   │   │   ├── utils.test.ts
│   │   │   ├── platform-config.test.ts
│   │   │   ├── export.test.ts
│   │   │   └── validators/
│   │   │       ├── auth.test.ts
│   │   │       └── repurpose.test.ts
│   │   ├── services/
│   │   │   ├── usage-service.test.ts
│   │   │   └── repurpose-service.test.ts
│   │   └── components/
│   │       ├── platform-selector.test.tsx
│   │       ├── character-count.test.tsx
│   │       └── generated-post-card.test.tsx
│   │
│   ├── integration/
│   │   ├── vitest.integration.config.ts
│   │   ├── api/
│   │   │   ├── repurpose.test.ts
│   │   │   ├── library.test.ts
│   │   │   ├── usage.test.ts
│   │   │   └── billing-webhook.test.ts
│   │   └── db/
│   │       ├── rls-policies.test.ts
│   │       └── triggers.test.ts
│   │
│   ├── e2e/
│   │   ├── playwright.config.ts
│   │   ├── auth.spec.ts
│   │   ├── repurpose-flow.spec.ts
│   │   ├── library.spec.ts
│   │   ├── upgrade.spec.ts
│   │   └── fixtures/
│   │       └── test-content.ts
│   │
│   ├── mocks/
│   │   ├── handlers.ts
│   │   ├── server.ts
│   │   ├── openai.ts
│   │   ├── stripe.ts
│   │   └── supabase.ts
│   │
│   └── setup.ts
│
├── .github/
│   ├── workflows/
│   │   ├── ci.yml
│   │   └── e2e.yml
│   └── renovate.json
│
├── .env.example
├── .eslintrc.mjs
├── .gitignore
├── .prettierrc
├── .prettierignore
├── components.json
├── lint-staged.config.mjs
├── next.config.ts
├── package.json
├── pnpm-lock.yaml
├── postcss.config.mjs
├── README.md
├── sentry.client.config.ts
├── sentry.server.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── vitest.config.ts
```

---

## 4. Configuration Files

### 4.1 `package.json` — Scripts

```jsonc
{
  "name": "recast-ai",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint . --ext .ts,.tsx",
    "lint:fix": "eslint . --ext .ts,.tsx --fix",
    "format": "prettier --write \"**/*.{ts,tsx,md,json}\"",
    "format:check": "prettier --check \"**/*.{ts,tsx,md,json}\"",
    "typecheck": "tsc --noEmit",
    "test:unit": "vitest run",
    "test:unit:watch": "vitest",
    "test:integration": "vitest run --config tests/integration/vitest.integration.config.ts",
    "test:e2e": "playwright test --config tests/e2e/playwright.config.ts",
    "test:e2e:ui": "playwright test --config tests/e2e/playwright.config.ts --ui",
    "db:start": "supabase start",
    "db:stop": "supabase stop",
    "db:reset": "supabase db reset",
    "db:migration:new": "supabase migration new",
    "db:push": "supabase db push",
    "db:seed": "supabase db reset --seed-only",
    "prepare": "husky"
  }
}
```

### 4.2 `tailwind.config.ts`

Extends Tailwind with CSS variable-based colors from the shadcn/ui design system defined in `globals.css`. Includes `darkMode: "class"` for next-themes integration and the `tailwindcss-animate` plugin used by shadcn/ui.

### 4.3 `tsconfig.json`

Key settings: `strict: true`, path alias `"@/*": ["./src/*"]`, `target: "ES2022"`, `moduleResolution: "bundler"`, `jsx: "preserve"`. Extends `next/core-web-vitals`.

### 4.4 `components.json` — shadcn/ui

Configures the shadcn/ui CLI with paths:

| Setting | Value |
|---|---|
| `style` | `"default"` |
| `tailwind.config` | `"tailwind.config.ts"` |
| `tailwind.css` | `"src/app/globals.css"` |
| `aliases.components` | `"@/components"` |
| `aliases.utils` | `"@/lib/utils"` |
| `rsc` | `true` (React Server Components) |

### 4.5 `next.config.ts`

Key configuration:

| Option | Value | Reason |
|---|---|---|
| `images.remotePatterns` | Supabase Storage domain | Avatar image loading |
| `experimental.serverActions` | `true` | Server Actions for form mutations |
| `sentry` | Sentry webpack plugin integration | Error tracking + source maps |

---

## 5. Source Directory — `src/`

```
src/
├── app/          # Next.js App Router (pages, layouts, API routes)
├── components/   # React components (UI primitives, feature modules, layout)
├── hooks/        # Custom React hooks
├── lib/          # Server/client utilities, services, AI, Supabase, Stripe
├── stores/       # Zustand client-side state stores
├── types/        # TypeScript type definitions
└── middleware.ts  # Next.js middleware (auth session refresh, route protection)
```

### `src/middleware.ts` — Next.js Middleware

**Purpose:** Runs on every request to refresh Supabase auth sessions and protect authenticated routes.

| Responsibility | Details |
|---|---|
| Session refresh | Uses `@supabase/ssr` to refresh JWT tokens via cookies on every request |
| Route protection | Redirects unauthenticated users from `(app)` routes to `/login` |
| Auth redirect | Redirects authenticated users from `(auth)` routes to `/dashboard` |

**Key exports:** `middleware` function, `config.matcher` array.

---

## 6. App Router — `src/app/`

### 6.1 Route Groups & Layouts

The app uses Next.js route groups to apply different layouts without affecting URL paths:

| Route Group | Layout | Purpose |
|---|---|---|
| `(marketing)` | Full-width, marketing navbar + footer | Public pages: landing, pricing |
| `(auth)` | Centered card, two-column on desktop | Auth pages: login, register, password reset |
| `(app)` | Sidebar + main content shell | Authenticated app pages: dashboard, repurpose, library, settings |

### 6.2 Root Files

```
src/app/
├── layout.tsx      # Root layout: html, body, providers (Supabase, Theme, Sonner Toaster, PostHog)
├── globals.css     # Global styles: CSS custom properties (color tokens), Tailwind directives
├── error.tsx       # Root error boundary (client component)
└── not-found.tsx   # Custom 404 page
```

| File | Purpose | Key Exports |
|---|---|---|
| `layout.tsx` | Root `<html>` and `<body>` wrapper. Wraps children with `ThemeProvider` (next-themes), `SupabaseProvider` (auth session context), and `Toaster` (Sonner). Sets metadata (title, description, OG tags). | `export default RootLayout`, `export const metadata` |
| `globals.css` | Defines `:root` and `.dark` CSS custom properties for the full color system (from UI/UX spec Section 1.1). Imports Tailwind `@tailwind base`, `@tailwind components`, `@tailwind utilities`. | — |
| `error.tsx` | `"use client"` — catches unhandled errors in any route. Renders user-friendly error message with "Try Again" button. Reports to Sentry. | `export default ErrorBoundary` |
| `not-found.tsx` | Custom 404 page with link back to dashboard or landing page. | `export default NotFound` |

### 6.3 Marketing Route Group — `(marketing)/`

```
src/app/(marketing)/
├── layout.tsx              # Marketing layout: MarketingNavbar + Footer
├── page.tsx                # Landing page (/)
└── pricing/
    └── page.tsx            # Pricing page (/pricing)
```

| File | Route | Purpose | Key Exports |
|---|---|---|---|
| `layout.tsx` | — | Wraps marketing pages with `MarketingNavbar` and `Footer`. Full-width, no sidebar. | `export default MarketingLayout` |
| `page.tsx` | `/` | Landing page: HeroSection, SocialProofBar, FeaturesSection, HowItWorksSection, PricingSection (embedded), CTASection. Static page — can be ISR or fully static. | `export default LandingPage`, `export const metadata` |
| `pricing/page.tsx` | `/pricing` | Standalone pricing page: PricingTable with billing toggle (monthly/yearly), FAQ accordion. | `export default PricingPage`, `export const metadata` |

### 6.4 Auth Route Group — `(auth)/`

```
src/app/(auth)/
├── layout.tsx              # Auth layout: centered card, brand panel
├── login/
│   └── page.tsx            # Login page (/login)
├── register/
│   └── page.tsx            # Register page (/register)
├── forgot-password/
│   └── page.tsx            # Forgot password (/forgot-password)
└── reset-password/
    └── page.tsx            # Reset password (/reset-password)
```

| File | Route | Purpose | Key Exports |
|---|---|---|---|
| `layout.tsx` | — | Two-column layout: BrandPanel (left, hidden mobile) + FormPanel (right). `bg-muted` background. Redirects to `/dashboard` if already authenticated. | `export default AuthLayout` |
| `login/page.tsx` | `/login` | Login form: Google OAuth button, email/password, "Forgot password?" link. Uses `LoginForm` component. | `export default LoginPage` |
| `register/page.tsx` | `/register` | Registration form: Google OAuth, name + email + password + confirm password + terms. Uses `RegisterForm` component. | `export default RegisterPage` |
| `forgot-password/page.tsx` | `/forgot-password` | Single email input form. Shows success state ("Check your email"). Uses `ForgotPasswordForm` component. | `export default ForgotPasswordPage` |
| `reset-password/page.tsx` | `/reset-password` | New password + confirm password form. Token validated from URL params. Redirects to login on success. Uses `ResetPasswordForm` component. | `export default ResetPasswordPage` |

### 6.5 App Route Group — `(app)/`

```
src/app/(app)/
├── layout.tsx              # App shell layout: sidebar + main content area
├── loading.tsx             # Global app loading skeleton
│
├── dashboard/
│   ├── page.tsx            # Dashboard page (/dashboard)
│   └── loading.tsx         # Dashboard skeleton
│
├── repurpose/
│   ├── new/
│   │   └── page.tsx        # New repurpose flow (/repurpose/new)
│   └── [id]/
│       ├── page.tsx        # Repurpose results (/repurpose/[id])
│       └── loading.tsx     # Results loading skeleton
│
├── library/
│   ├── page.tsx            # Content library (/library)
│   ├── loading.tsx         # Library skeleton
│   └── [id]/
│       ├── page.tsx        # Content detail (/library/[id])
│       └── loading.tsx     # Detail loading skeleton
│
└── settings/
    ├── layout.tsx          # Settings layout: side tabs navigation
    ├── page.tsx            # Profile settings (/settings)
    ├── voice/
    │   └── page.tsx        # Voice preferences (/settings/voice)
    ├── billing/
    │   └── page.tsx        # Billing & subscription (/settings/billing)
    └── team/
        └── page.tsx        # Team management (/settings/team)
```

| File | Route | Purpose | Key Exports |
|---|---|---|---|
| `layout.tsx` | — | App shell: `AppSidebar` (left) + main content area (right). Fetches user profile server-side. Provides sidebar context. | `export default AppLayout` |
| `loading.tsx` | — | Full-app skeleton loader (sidebar + content area skeleton). | `export default AppLoading` |
| `dashboard/page.tsx` | `/dashboard` | Dashboard: StatsGrid, UsageBanner (free tier), RecentActivityCard, WeeklyChartCard, QuickStartCard (empty state). Fetches usage data server-side. | `export default DashboardPage`, `export const metadata` |
| `dashboard/loading.tsx` | `/dashboard` | Dashboard skeleton: 4 stat card skeletons + chart skeleton. | `export default DashboardLoading` |
| `repurpose/new/page.tsx` | `/repurpose/new` | New repurpose: single-page stepped flow (ContentInput → PlatformSelector → Generation/Results). Client component using Zustand store for step state. | `export default NewRepurposePage`, `export const metadata` |
| `repurpose/[id]/page.tsx` | `/repurpose/[id]` | Repurpose results: fetches source content + generated posts by ID. Renders ResultsView with PlatformTabs and GeneratedPostCards. | `export default RepurposeResultsPage` |
| `repurpose/[id]/loading.tsx` | `/repurpose/[id]` | Results skeleton: tab bar skeleton + 5 post card skeletons. | `export default RepurposeLoading` |
| `library/page.tsx` | `/library` | Content library: LibraryToolbar (search, filters, sort, view toggle) + ContentGrid/ContentList + Pagination. Server-side data fetching with search params. | `export default LibraryPage`, `export const metadata` |
| `library/loading.tsx` | `/library` | Library skeleton: toolbar skeleton + 6 content item skeletons. | `export default LibraryLoading` |
| `library/[id]/page.tsx` | `/library/[id]` | Content detail: Breadcrumb, source preview (collapsible), PlatformTabs with GeneratedPostCards. Delete confirmation dialog. | `export default ContentDetailPage` |
| `library/[id]/loading.tsx` | `/library/[id]` | Detail skeleton: header + source preview + tab skeletons. | `export default ContentDetailLoading` |
| `settings/layout.tsx` | `/settings/*` | Settings shell: SettingsNav (vertical tabs desktop, horizontal mobile) + settings content area. | `export default SettingsLayout` |
| `settings/page.tsx` | `/settings` | Profile settings: ProfileForm (avatar, display name, email (disabled), theme, notifications). | `export default ProfileSettingsPage`, `export const metadata` |
| `settings/voice/page.tsx` | `/settings/voice` | Voice preferences (Pro+ gated): VoicePresetSelector, CustomVoiceInput, VoicePreview. Shows upgrade prompt for free users. | `export default VoiceSettingsPage` |
| `settings/billing/page.tsx` | `/settings/billing` | Billing: CurrentPlan card, PricingTable (if free), BillingHistoryTable. Stripe Customer Portal link for subscribed users. | `export default BillingPage` |
| `settings/team/page.tsx` | `/settings/team` | Team management (Team tier gated): TeamMemberList, InviteForm, PendingInvitations, BrandVoiceProfiles section. Shows upgrade prompt for non-team users. | `export default TeamPage` |

### 6.6 API Routes — `src/app/api/`

All API routes use Next.js Route Handlers (`route.ts` files with exported HTTP method functions). Authentication is enforced server-side by creating a Supabase server client and checking the session.

```
src/app/api/
├── auth/
│   ├── signup/route.ts             # POST — email/password registration
│   ├── callback/route.ts           # GET  — OAuth callback handler (Google)
│   └── confirm/route.ts            # GET  — email verification confirmation
│
├── repurpose/
│   ├── route.ts                    # POST — generate platform-specific posts (SSE streaming)
│   └── [sourceId]/
│       └── regenerate/route.ts     # POST — regenerate a single post
│
├── posts/
│   └── [postId]/route.ts           # PUT  — update generated post (inline edit)
│
├── library/route.ts                # GET  — list content library with search/filter/pagination
│
├── usage/route.ts                  # GET  — retrieve usage statistics
│
├── extract-url/route.ts            # POST — extract article content from URL
│
└── billing/
    ├── create-checkout/route.ts    # POST — create Stripe Checkout session
    └── webhook/route.ts            # POST — Stripe webhook handler (no auth, signature verification)
```

| Route | Method | Purpose | Auth | Key Behavior |
|---|---|---|---|---|
| `/api/auth/signup` | `POST` | Register new user via Supabase Auth (email/password) | No | Validates with `authSignupSchema` (Zod), calls `supabase.auth.signUp()`, returns 201 |
| `/api/auth/callback` | `GET` | Handles OAuth redirect from Google. Exchanges code for session. | No | Reads `code` from query params, calls `supabase.auth.exchangeCodeForSession()`, redirects to `/dashboard` |
| `/api/auth/confirm` | `GET` | Email verification link handler | No | Reads `token_hash` and `type` from params, calls `supabase.auth.verifyOtp()`, redirects to `/login` |
| `/api/repurpose` | `POST` | Core endpoint: generates AI posts from source content | Yes | Validates input (`repurposeSchema`), checks usage limits, calls OpenAI via `generate()`, streams results via SSE, persists to `source_contents` + `generated_posts`, logs to `usage_records`. `maxDuration: 60`. |
| `/api/repurpose/[sourceId]/regenerate` | `POST` | Regenerate a single post for a platform | Yes | Validates ownership, calls OpenAI for one replacement, updates `generated_posts` row, logs usage |
| `/api/posts/[postId]` | `PUT` | Update post content (inline editing) | Yes | Validates ownership, updates `content`, sets `is_edited: true`, recalculates `char_count` |
| `/api/library` | `GET` | Retrieve paginated content library | Yes | Accepts query params (`q`, `platform`, `from`, `to`, `page`, `limit`). Uses full-text search via `search_vector`. Returns via `v_content_library` view. |
| `/api/usage` | `GET` | Fetch usage statistics for dashboard | Yes | Queries `v_user_monthly_usage`, `v_user_all_time_stats`, `v_weekly_usage_history` views |
| `/api/extract-url` | `POST` | Extract article content from a URL | Yes | Fetches URL server-side, parses HTML with `cheerio`, extracts with `@mozilla/readability` + `jsdom`. Returns title, content, char_count. |
| `/api/billing/create-checkout` | `POST` | Create Stripe Checkout session for Pro/Team upgrade | Yes | Looks up or creates Stripe customer, creates checkout session with `success_url` and `cancel_url` |
| `/api/billing/webhook` | `POST` | Handle Stripe webhook events | No (Stripe sig) | Verifies `stripe-signature` header. Handles: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`. Updates `profiles.tier` and Stripe fields via admin Supabase client. |

---

## 7. Components — `src/components/`

Components are organized into the following directories:

| Directory | Purpose | Convention |
|---|---|---|
| `ui/` | shadcn/ui primitives (copy-pasted, project-owned) | Installed via `pnpm dlx shadcn@latest add <name>`. Do not modify unless customizing. |
| `icons/` | Custom SVG icon components (platform icons, logo) | React components returning `<svg>`. Accept `className` prop. |
| `layout/` | Application shell components (sidebar, navbar, footer, page header) | Used in layout files. Server or client components as needed. |
| `auth/` | Authentication forms and related components | Client components (forms with interactivity). |
| `repurpose/` | Repurpose flow components (input, platform selector, generation, results, editor) | Mix of client (forms, streaming) and server components. |
| `library/` | Content library components (toolbar, filters, grid/list, detail) | Mix of client (search, filters) and server (data display). |
| `dashboard/` | Dashboard-specific components (stats, charts, banners) | Mostly server components with client chart wrappers. |
| `settings/` | Settings page components (profile form, voice, billing, pricing) | Client components (forms). |
| `team/` | Team management components (members, invites, brand voices) | Client components (forms, mutations). |
| `marketing/` | Landing page sections and marketing components | Server components (static marketing content). |
| `shared/` | Reusable cross-feature components | Shared across multiple feature domains. |

### 7.1 `ui/` — shadcn/ui Primitives

All components from shadcn/ui (built on Radix UI). Installed via the shadcn CLI and automatically placed in `src/components/ui/`.

| Component | File | Radix Dependency | Usage |
|---|---|---|---|
| Accordion | `accordion.tsx` | `@radix-ui/react-accordion` | FAQ section, collapsible source preview |
| Badge | `badge.tsx` | — | Tier badges, platform labels, "Edited" indicator |
| Breadcrumb | `breadcrumb.tsx` | — | Content detail page navigation |
| Button | `button.tsx` | `@radix-ui/react-slot` | All clickable actions (CVA variants: default, secondary, outline, ghost, destructive, link) |
| Calendar | `calendar.tsx` | `react-day-picker` | Date range filter in library |
| Card | `card.tsx` | — | Content cards, stat cards, pricing cards |
| Checkbox | `checkbox.tsx` | `@radix-ui/react-checkbox` | Terms acceptance, filter checkboxes |
| Command | `command.tsx` | `cmdk` | Searchable select / combobox |
| DatePicker | `date-picker.tsx` | — (custom composition) | Library date range filter |
| Dialog | `dialog.tsx` | `@radix-ui/react-dialog` | Confirmations (delete, discard, revert) |
| DropdownMenu | `dropdown-menu.tsx` | `@radix-ui/react-dropdown-menu` | User menu, post action menu, export options |
| Form | `form.tsx` | `react-hook-form` integration | All forms (auth, settings, team) |
| Input | `input.tsx` | — | Text inputs across all forms |
| Label | `label.tsx` | `@radix-ui/react-label` | Form field labels |
| Popover | `popover.tsx` | `@radix-ui/react-popover` | Date picker container, tooltips |
| Progress | `progress.tsx` | `@radix-ui/react-progress` | Usage progress bar, generation progress |
| RadioGroup | `radio-group.tsx` | `@radix-ui/react-radio-group` | Voice preset selector, theme selector |
| Select | `select.tsx` | `@radix-ui/react-select` | Sort select, voice selector |
| Separator | `separator.tsx` | `@radix-ui/react-separator` | Form dividers ("or" separator in auth) |
| Sheet | `sheet.tsx` | `@radix-ui/react-dialog` | Mobile sidebar, mobile filter panel |
| Skeleton | `skeleton.tsx` | — | All loading states |
| Switch | `switch.tsx` | `@radix-ui/react-switch` | Notification toggle, billing toggle |
| Table | `table.tsx` | — | Billing history table |
| Tabs | `tabs.tsx` | `@radix-ui/react-tabs` | Platform output tabs, input mode toggle, settings nav |
| Textarea | `textarea.tsx` | — | Content input, voice description |
| Toast | `toast.tsx` | Sonner integration | All toast notifications |
| Tooltip | `tooltip.tsx` | `@radix-ui/react-tooltip` | Icon button labels, truncated text |

### 7.2 `icons/` — Custom Icons

| File | Purpose | Key Exports |
|---|---|---|
| `platform-icons.tsx` | SVG components for each social platform: `TwitterIcon`, `LinkedInIcon`, `InstagramIcon`, `TikTokIcon`, `BlueskyIcon`, `EmailIcon`. Rendered at 20px with platform-specific colors. | `TwitterIcon`, `LinkedInIcon`, `InstagramIcon`, `TikTokIcon`, `BlueskyIcon`, `EmailIcon` |
| `logo.tsx` | RecastAI logo as SVG component. Variants: full (logo + wordmark) and icon-only (for collapsed sidebar). | `Logo`, `LogoIcon` |

### 7.3 `layout/` — Application Shell

| File | Purpose | Key Exports |
|---|---|---|
| `app-sidebar.tsx` | Main sidebar: logo, nav items, usage indicator, user menu. Supports expanded (240px) and collapsed (64px) states. | `AppSidebar` |
| `sidebar-nav-item.tsx` | Individual sidebar navigation link with icon, label, and active state. | `SidebarNavItem` |
| `sidebar-user-menu.tsx` | User dropdown at sidebar bottom: avatar, name, tier badge, links to settings/billing, theme toggle, sign out. | `SidebarUserMenu` |
| `sidebar-usage-indicator.tsx` | Compact usage display: progress bar with "3/5" or "Unlimited (Pro)" text. | `SidebarUsageIndicator` |
| `mobile-nav.tsx` | Mobile hamburger trigger that opens sidebar as a Sheet overlay. | `MobileNav` |
| `page-header.tsx` | Reusable page header: title, optional breadcrumb, optional description, optional action buttons. | `PageHeader` |
| `top-bar.tsx` | Mobile top bar: hamburger button + logo + user avatar. Visible only below `lg` breakpoint. | `TopBar` |
| `marketing-navbar.tsx` | Public page navbar: logo, nav links (Features, Pricing), Login button, "Get Started" CTA. | `MarketingNavbar` |
| `footer.tsx` | Public page footer: logo, link groups (Product, Company, Legal), copyright. | `Footer` |

### 7.4 `auth/` — Authentication

| File | Purpose | Key Exports |
|---|---|---|
| `login-form.tsx` | Login form: OAuth button, email/password fields, submit, error display. Uses Zod validation. | `LoginForm` |
| `register-form.tsx` | Registration form: OAuth button, name, email, password, confirm, terms checkbox. Real-time password checklist. | `RegisterForm` |
| `forgot-password-form.tsx` | Forgot password form: email input, submit. Shows success state with "Check your email" message. | `ForgotPasswordForm` |
| `reset-password-form.tsx` | Reset password form: new password + confirm. Validates token from URL. | `ResetPasswordForm` |
| `oauth-button.tsx` | "Continue with Google" button. Initiates Supabase Google OAuth flow. | `OAuthButton` |
| `password-requirements.tsx` | Real-time password validation checklist (≥8 chars, ≥1 uppercase, ≥1 number). Green check / gray circle indicators. | `PasswordRequirements` |
| `auth-card.tsx` | Wrapper card used on all auth pages: card with header (logo, heading, description) and footer (alternate action link). | `AuthCard` |

### 7.5 `repurpose/` — Repurpose Flow

| File | Purpose | Key Exports |
|---|---|---|
| `step-indicator.tsx` | Horizontal step progress: circles + connecting lines. Active/completed/future states with primary color fill. | `StepIndicator` |
| `content-input-area.tsx` | Main content input with Text/URL tab toggle. Wraps Textarea and UrlInput. Shows character count and validation. | `ContentInputArea` |
| `url-input.tsx` | URL input field with "Extract" button. Shows inline spinner during extraction. | `UrlInput` |
| `url-preview.tsx` | Extracted URL content preview: title, excerpt, char count, "Edit" button to modify extracted text. | `UrlPreview` |
| `platform-selector.tsx` | Multi-select grid of 6 platform toggle cards. Handles free-tier 3-platform limit with lock overlay + upgrade prompt. Select All / Clear controls. | `PlatformSelector` |
| `platform-toggle-card.tsx` | Individual platform toggle: icon, name, checkmark. Selected/unselected/locked states with platform color accent. | `PlatformToggleCard` |
| `voice-selector.tsx` | Voice/tone selector (Pro+ only): dropdown with Default, My Voice, brand voice profiles. | `VoiceSelector` |
| `generation-progress.tsx` | Loading state during AI generation: animated shimmer, status text cycling platform names, streaming post previews. | `GenerationProgress` |
| `results-view.tsx` | Container for completed results: ResultsHeader + PlatformTabs with post grids. | `ResultsView` |
| `results-header.tsx` | Success banner ("Generated N posts across M platforms") + Export All dropdown. | `ResultsHeader` |
| `platform-tabs.tsx` | Tab component for switching between platform results. Uses platform icons + colors. | `PlatformTabs` |
| `generated-post-card.tsx` | Single post display: content text, post number, char count, "Edited" badge, action buttons (Edit, Regenerate, Copy). Transitions to edit mode. | `GeneratedPostCard` |
| `post-editor.tsx` | Tiptap-based inline editor: compact toolbar (bold, italic, list, link), editable content area, char count, Save/Discard/Revert actions. | `PostEditor` |

### 7.6 `library/` — Content Library

| File | Purpose | Key Exports |
|---|---|---|
| `library-toolbar.tsx` | Toolbar wrapper: search input, filters, sort, view toggle, active filter chips. | `LibraryToolbar` |
| `search-input.tsx` | Debounced (300ms) search input with search icon and clear button. Updates URL search params. | `SearchInput` |
| `platform-filter.tsx` | Multi-select dropdown for filtering by platform. Platform icons + checkboxes. | `PlatformFilter` |
| `date-range-filter.tsx` | Date range picker popover using shadcn Calendar. | `DateRangeFilter` |
| `sort-select.tsx` | Sort dropdown: Newest, Oldest, Most Posts. | `SortSelect` |
| `active-filters.tsx` | Renders active filter chips (dismissible badges) below toolbar. | `ActiveFilters` |
| `view-toggle.tsx` | Grid/List view toggle button group. | `ViewToggle` |
| `content-library-item.tsx` | Card/row for a source content item: title, excerpt, platform badges, post count, date. Clickable → `/library/[id]`. | `ContentLibraryItem` |
| `content-grid.tsx` | Grid layout (responsive columns) rendering ContentLibraryItem cards. | `ContentGrid` |
| `content-list.tsx` | List/table layout rendering ContentLibraryItem rows. | `ContentList` |
| `content-detail-header.tsx` | Content detail page header: breadcrumb, title, metadata, Export/Reuse/Delete action buttons. | `ContentDetailHeader` |
| `source-preview.tsx` | Collapsible source content preview (first 500 chars + "Show more" toggle). | `SourcePreview` |
| `library-empty-state.tsx` | Empty state component: "Your library is empty" or "No results found" with contextual CTA. | `LibraryEmptyState` |

### 7.7 `dashboard/` — Dashboard

| File | Purpose | Key Exports |
|---|---|---|
| `stats-grid.tsx` | Responsive 4-column grid rendering StatCard components. | `StatsGrid` |
| `stat-card.tsx` | Individual stat card: icon, large numeric value, label, optional trend indicator (up/down arrow + percentage). | `StatCard` |
| `usage-banner.tsx` | Free-tier usage banner: progress bar, "3 of 5 repurposes used", Upgrade CTA. Color-coded by usage level (warning at 80%, destructive at 100%). | `UsageBanner` |
| `recent-activity-card.tsx` | Card listing last 5 repurposes: title, platforms, date, link to detail. "View all in Library" footer link. | `RecentActivityCard` |
| `weekly-chart-card.tsx` | Recharts BarChart showing repurposes per week over last 12 weeks. Client component wrapper for chart rendering. | `WeeklyChartCard` |
| `quick-start-card.tsx` | Empty-state CTA for new users: "Create your first repurpose" with prominent button. | `QuickStartCard` |
| `tip-card.tsx` | Contextual tip card with lightbulb icon and rotating pro tips. | `TipCard` |

### 7.8 `settings/` — Settings Pages

| File | Purpose | Key Exports |
|---|---|---|
| `settings-nav.tsx` | Settings sub-navigation: vertical tabs (desktop) / horizontal tabs (mobile). Items: Profile, Voice, Subscription, Team. | `SettingsNav` |
| `profile-form.tsx` | Profile edit form: avatar upload, display name, email (readonly), theme, notification toggle. Save button. | `ProfileForm` |
| `avatar-upload.tsx` | Circular avatar preview with upload button. Uploads to Supabase `avatars` storage bucket. | `AvatarUpload` |
| `theme-selector.tsx` | Radio group: Light / Dark / System. Integrates with next-themes `useTheme()`. | `ThemeSelector` |
| `voice-preset-selector.tsx` | Card-style radio group: Professional, Casual, Witty, Inspirational, Educational. Each with description text. | `VoicePresetSelector` |
| `custom-voice-input.tsx` | Textarea for custom voice description (max 500 chars) with character count. | `CustomVoiceInput` |
| `voice-preview.tsx` | Generated sample post showing the currently selected voice settings applied. | `VoicePreview` |
| `billing-current-plan.tsx` | Current plan display: plan name + badge, feature list, next billing date, Manage Subscription (Stripe Portal) link. | `BillingCurrentPlan` |
| `billing-history-table.tsx` | Table of past billing events: date, description, amount, status/receipt link. | `BillingHistoryTable` |
| `pricing-table.tsx` | Reusable pricing grid (3 cards: Free, Pro, Team) with feature lists and CTAs. Used on pricing page and billing settings. | `PricingTable` |

### 7.9 `team/` — Team Management

| File | Purpose | Key Exports |
|---|---|---|
| `team-member-list.tsx` | List of current team members with avatars, names, roles. | `TeamMemberList` |
| `team-member-row.tsx` | Individual member row: avatar, name, email, role, remove button (admin only). | `TeamMemberRow` |
| `invite-form.tsx` | Email invite form with input + "Send Invite" button. | `InviteForm` |
| `pending-invitations.tsx` | List of pending/expired invitations: email, status, date, resend/cancel actions. | `PendingInvitations` |
| `brand-voice-card.tsx` | Card displaying a brand voice profile: name, description, tone keywords, edit/delete buttons. | `BrandVoiceCard` |
| `create-voice-profile-dialog.tsx` | Dialog form: name, description, tone keywords (tag input), example content, Create button. Enforces max 5 per team. | `CreateVoiceProfileDialog` |

### 7.10 `marketing/` — Landing Page

| File | Purpose | Key Exports |
|---|---|---|
| `hero-section.tsx` | Hero: headline with gradient keyword, subheading, CTA buttons, HeroVisual. | `HeroSection` |
| `hero-visual.tsx` | Animated or static visual showing content being transformed into platform cards. | `HeroVisual` |
| `social-proof-bar.tsx` | Metrics strip ("10,000+ posts generated") or logo strip. | `SocialProofBar` |
| `features-section.tsx` | Feature grid section: 6 FeatureCards in a 3-column grid. | `FeaturesSection` |
| `feature-card.tsx` | Single feature card: Lucide icon (32px primary background), title, description. | `FeatureCard` |
| `how-it-works-section.tsx` | Numbered 3-step flow: Paste → Select → Get posts. | `HowItWorksSection` |
| `cta-section.tsx` | Bottom CTA: heading, subheading, "Get Started Free" button. | `CTASection` |
| `faq-section.tsx` | FAQ accordion (5–8 items) using shadcn Accordion. | `FAQSection` |

### 7.11 `shared/` — Cross-Feature Components

| File | Purpose | Key Exports |
|---|---|---|
| `confirm-dialog.tsx` | Reusable confirmation dialog: configurable title, description, confirm/cancel buttons, destructive variant. | `ConfirmDialog` |
| `empty-state.tsx` | Reusable empty state: large muted icon, heading, description, optional CTA button. Dashed `bg-muted/50` container. | `EmptyState` |
| `pagination.tsx` | Page-based pagination: "Showing 1-20 of 94", Prev/Next buttons, page numbers. | `Pagination` |
| `platform-badge.tsx` | Small badge displaying a platform name with platform-specific color. | `PlatformBadge` |
| `character-count.tsx` | Character count display: `font-mono text-xs`. Color-coded (normal → warning at 90% → destructive at 100%). | `CharacterCount` |
| `export-dropdown.tsx` | Dropdown menu with Markdown and CSV export options. Triggers file download. | `ExportDropdown` |
| `copy-button.tsx` | Copy-to-clipboard button with icon swap animation (clipboard → checkmark for 2s) and toast. | `CopyButton` |
| `upgrade-dialog.tsx` | Upgrade prompt dialog: plan comparison, feature diff, CTA to Stripe Checkout. Shown at usage limit or feature gate. | `UpgradeDialog` |
| `theme-toggle.tsx` | Theme toggle: cycles Light → Dark → System. Icon button with sun/moon icons. | `ThemeToggle` |

---

## 8. Library & Utilities — `src/lib/`

### 8.1 `supabase/` — Supabase Clients

Four distinct Supabase client configurations for different runtime contexts:

| File | Purpose | Key Exports | Context |
|---|---|---|---|
| `client.ts` | Browser-side Supabase client using anon key. RLS-protected. Created via `createBrowserClient()` from `@supabase/ssr`. | `createClient()` | Client components |
| `server.ts` | Server-side Supabase client using anon key + cookie-based auth. Created via `createServerClient()` from `@supabase/ssr`. Reads/writes cookies for session management. | `createServerClient()` | Server components, Route Handlers, Server Actions |
| `admin.ts` | Server-side Supabase client using **service role key**. Bypasses RLS. Used for webhook handlers, admin operations, usage resets. | `createAdminClient()` | API routes (billing webhook, background tasks) |
| `middleware.ts` | Supabase client for Next.js middleware. Refreshes JWT session on every request. | `updateSession()` | `src/middleware.ts` |

### 8.2 `ai/` — AI Engine

| File | Purpose | Key Exports |
|---|---|---|
| `openai-client.ts` | Initializes OpenAI SDK client with API key from env. Singleton instance. | `openai` (OpenAI client instance) |
| `prompts/system-prompt.ts` | Base system prompt for RecastAI content generation (role, tone guidelines, general rules). | `SYSTEM_PROMPT` |
| `prompts/twitter-prompt.ts` | X/Twitter-specific prompt: 280-char limit, thread structure (3–7 tweets), hook-first, emoji usage. | `TWITTER_PROMPT` |
| `prompts/linkedin-prompt.ts` | LinkedIn-specific prompt: ≤3,000 chars, professional tone, hook + value + CTA structure. | `LINKEDIN_PROMPT` |
| `prompts/instagram-prompt.ts` | Instagram-specific prompt: ≤2,200 chars, hook-first, hashtag suggestions, visual storytelling. | `INSTAGRAM_PROMPT` |
| `prompts/tiktok-prompt.ts` | TikTok-specific prompt: ≤60s spoken script, hook-first, visual cues, casual tone. | `TIKTOK_PROMPT` |
| `prompts/bluesky-prompt.ts` | Bluesky-specific prompt: ≤300 chars, conversational tone. | `BLUESKY_PROMPT` |
| `prompts/email-prompt.ts` | Email-specific prompt: subject line, preview text, body ≤500 words. | `EMAIL_PROMPT` |
| `generate.ts` | Core generation orchestration: takes source content + platforms + voice settings, calls OpenAI for each platform. Manages retries (3x exponential backoff). Structures output for persistence. | `generatePlatformPosts()` |
| `stream.ts` | SSE streaming utilities: transforms OpenAI streaming responses into `ReadableStream` for Next.js Route Handler responses. | `createGenerationStream()`, `encodeSSEMessage()` |

### 8.3 `stripe/` — Stripe Integration

| File | Purpose | Key Exports |
|---|---|---|
| `client.ts` | Initializes Stripe SDK with secret key from env. | `stripe` (Stripe client instance) |
| `config.ts` | Stripe product/price IDs for Pro and Team tiers. Maps `subscription_tier` enum to Stripe price IDs. | `STRIPE_PRICE_IDS`, `TIER_FEATURES` |
| `webhooks.ts` | Webhook event processing logic: maps Stripe events to database operations (tier updates, payment failures). | `handleCheckoutCompleted()`, `handleSubscriptionUpdated()`, `handleSubscriptionDeleted()`, `handlePaymentFailed()` |

### 8.4 `extraction/` — URL Content Extraction

| File | Purpose | Key Exports |
|---|---|---|
| `extract-url.ts` | Fetches URL content, parses HTML with `cheerio`, creates DOM with `jsdom`, extracts article with `@mozilla/readability`. Returns title, content, char_count, meta_description. Handles errors and timeouts (10s). | `extractUrlContent()` |

### 8.5 `validators/` — Zod Schemas

All API input validation schemas and form validation schemas. Used on both client (form validation) and server (route handler validation).

| File | Purpose | Key Exports |
|---|---|---|
| `auth.ts` | Auth form schemas: signup (email, password, name), login (email, password), forgot-password (email), reset-password (password, confirm). Password policy: ≥8 chars, ≥1 uppercase, ≥1 digit. | `signupSchema`, `loginSchema`, `forgotPasswordSchema`, `resetPasswordSchema` |
| `repurpose.ts` | Repurpose input: content (100–50,000 chars) OR url, platforms (1–6 from `platform_type` enum), optional voice_profile_id. | `repurposeSchema`, `regenerateSchema` |
| `posts.ts` | Post update: content (string), validates char count within platform limits. | `updatePostSchema` |
| `library.ts` | Library query params: q (optional string), platform (optional enum array), from/to (optional ISO dates), page (optional int), limit (optional int, max 50). | `libraryQuerySchema` |
| `billing.ts` | Checkout creation: plan (`pro` or `team`). | `createCheckoutSchema` |
| `settings.ts` | Profile update: display_name, theme, email_notifications. Voice update: voice_preset, voice_custom (≤500 chars). Team invite: email. Brand voice: name, description, tone_keywords, example_content. | `profileUpdateSchema`, `voiceUpdateSchema`, `teamInviteSchema`, `brandVoiceSchema` |

### 8.6 `services/` — Business Logic

Data access and business logic functions. Called by API route handlers and server components.

| File | Purpose | Key Exports |
|---|---|---|
| `repurpose-service.ts` | Create source content record, persist generated posts, fetch repurpose by ID with posts. Interfaces with `source_contents` and `generated_posts` tables. | `createSourceContent()`, `saveGeneratedPosts()`, `getRepurposeById()` |
| `library-service.ts` | Fetch paginated content library with search/filter. Uses `v_content_library` view and full-text search. Soft-delete content. | `getLibraryItems()`, `getContentById()`, `softDeleteContent()` |
| `usage-service.ts` | Log usage records, check monthly limits, fetch usage stats. Uses `v_user_monthly_usage`, `v_user_all_time_stats`, `v_weekly_usage_history` views. | `logUsage()`, `checkUsageLimit()`, `getUsageStats()` |
| `profile-service.ts` | Fetch/update user profile, update preferences. | `getProfile()`, `updateProfile()`, `getPreferences()`, `updatePreferences()` |
| `team-service.ts` | Team CRUD, invite/remove members, manage invitations. | `createTeam()`, `inviteMember()`, `removeMember()`, `getTeamMembers()`, `getInvitations()` |
| `voice-service.ts` | Fetch/update voice settings, CRUD brand voice profiles. | `getVoiceSettings()`, `updateVoiceSettings()`, `getBrandVoices()`, `createBrandVoice()`, `updateBrandVoice()`, `deleteBrandVoice()` |

### 8.7 Standalone Utility Files

| File | Purpose | Key Exports |
|---|---|---|
| `utils.ts` | General utilities: `cn()` (clsx + tailwind-merge for className composition), date formatting helpers. | `cn()`, `formatDate()`, `formatRelativeDate()` |
| `constants.ts` | App-wide constants: app name, description, external URLs, pagination defaults, character limits per platform. | `APP_NAME`, `PLATFORM_CHAR_LIMITS`, `DEFAULT_PAGE_SIZE`, `FREE_TIER_LIMITS` |
| `platform-config.ts` | Platform metadata: display names, icons, colors, character limits, format descriptions. Array of platform config objects keyed by `platform_type` enum value. | `PLATFORMS`, `getPlatformConfig()`, `PlatformConfig` type |
| `rate-limit.ts` | Simple rate limiting utility for API routes. Uses in-memory store (suitable for serverless with short requests). 60 req/min general, 10 req/min AI generation. | `rateLimit()`, `aiRateLimit()` |
| `errors.ts` | Custom error classes and error response helpers. Maps errors to appropriate HTTP status codes and user-friendly messages. | `AppError`, `ValidationError`, `RateLimitError`, `UsageLimitError`, `handleApiError()` |
| `export.ts` | Export utilities: generates Markdown and CSV file content from generated posts grouped by platform. | `exportToMarkdown()`, `exportToCsv()` |
| `env.ts` | Environment variable validation using `@t3-oss/env-nextjs` and Zod. Validates all required env vars at build time. Exports type-safe `env` object. | `env` |

---

## 9. Type Definitions — `src/types/`

| File | Purpose | Key Exports |
|---|---|---|
| `database.ts` | TypeScript types generated from or aligned with the Supabase database schema. Includes: `Database` type (full Supabase schema), table row types (`Profile`, `SourceContent`, `GeneratedPost`, `UsageRecord`, `UserPreferences`, `Team`, `TeamInvitation`, `BrandVoiceProfile`), insert/update types, enum types (`PlatformType`, `SubscriptionTier`, `InputMethodType`, `UsageActionType`, `InvitationStatus`, `ThemeType`, `VoicePresetType`). | `Database`, `Profile`, `SourceContent`, `GeneratedPost`, `UsageRecord`, etc. |
| `api.ts` | API request/response types: types for each API route's request body and response shape. Generation stream event types. | `RepurposeRequest`, `RepurposeResponse`, `LibraryResponse`, `UsageResponse`, `ExtractUrlResponse`, etc. |
| `platform.ts` | Platform-related types: `PlatformConfig` (name, icon component, color, char limit), platform-specific metadata shapes for `generated_posts.metadata` JSONB field (e.g., `TwitterMetadata` with thread structure, `InstagramMetadata` with hashtags). | `PlatformConfig`, `TwitterMetadata`, `InstagramMetadata`, `TikTokMetadata`, `EmailMetadata` |
| `index.ts` | Barrel re-export of all types for convenient imports. | Re-exports all from `database.ts`, `api.ts`, `platform.ts` |

---

## 10. Stores — `src/stores/`

Zustand stores for client-side UI state. Used in client components. Not for server-side data.

| File | Purpose | Key State | Key Actions |
|---|---|---|---|
| `repurpose-store.ts` | Manages multi-step repurpose flow state | `currentStep` (1/2/3), `sourceContent` (text/URL), `inputMethod`, `selectedPlatforms`, `generationStatus`, `streamedPosts`, `error` | `setStep()`, `setContent()`, `togglePlatform()`, `startGeneration()`, `addStreamedPost()`, `reset()` |
| `editor-store.ts` | Manages inline post editor state | `editingPostId`, `originalContent`, `hasUnsavedChanges` | `openEditor()`, `closeEditor()`, `setUnsavedChanges()` |
| `platform-store.ts` | Caches platform selection preference across sessions | `selectedPlatforms`, `defaultPlatforms` | `setSelectedPlatforms()`, `loadDefaults()` |

---

## 11. Hooks — `src/hooks/`

Custom React hooks for shared client-side logic.

| File | Purpose | Key Exports |
|---|---|---|
| `use-user.ts` | Accesses the current authenticated user and profile from Supabase auth context. Provides user, profile, tier, loading state. | `useUser()` → `{ user, profile, tier, isLoading }` |
| `use-usage.ts` | Fetches and caches usage stats from `/api/usage`. Provides current month usage, limits, all-time stats. | `useUsage()` → `{ usage, isLoading, refresh }` |
| `use-repurpose.ts` | Handles the repurpose generation flow: submits to `/api/repurpose`, consumes SSE stream, updates store. | `useRepurpose()` → `{ generate, isGenerating, error }` |
| `use-library.ts` | Fetches library data with search/filter/pagination. Syncs URL search params with filters. | `useLibrary()` → `{ items, pagination, isLoading, setFilters }` |
| `use-copy-clipboard.ts` | Copies text to clipboard, manages "copied" state for UI feedback (2s timeout). | `useCopyClipboard()` → `{ copy, isCopied }` |
| `use-debounce.ts` | Debounces a value by a configurable delay (default 300ms). Used for search input. | `useDebounce(value, delay)` → `debouncedValue` |
| `use-media-query.ts` | Checks a CSS media query and returns boolean. Used for responsive behavior in JS. | `useMediaQuery(query)` → `boolean` |

---

## 12. Supabase — `supabase/`

```
supabase/
├── config.toml           # Supabase CLI local config (ports, project settings)
├── seed.sql              # Development seed data (test users, content, posts, usage)
└── migrations/           # Timestamped SQL migration files
    ├── 00001_create_enums.sql
    ├── 00002_create_teams.sql
    ├── 00003_create_profiles.sql
    ├── 00004_create_team_invitations.sql
    ├── 00005_create_brand_voice_profiles.sql
    ├── 00006_create_source_contents.sql
    ├── 00007_create_generated_posts.sql
    ├── 00008_create_usage_records.sql
    ├── 00009_create_user_preferences.sql
    ├── 00010_create_indexes.sql
    ├── 00011_enable_rls_policies.sql
    ├── 00012_create_trigger_functions.sql
    ├── 00013_create_triggers.sql
    ├── 00014_create_views.sql
    └── 00015_create_storage_buckets.sql
```

| File | Purpose |
|---|---|
| `config.toml` | Local Supabase CLI config: API port (54321), DB port (54322), Studio port (54323), project ref, auth settings. |
| `seed.sql` | Development seed data per DB schema spec: 2–3 test users (free/pro/team), 1 team with owner + member, 5–10 source content items per user, 30–50 generated posts, 3 months of usage records, 1–2 brand voice profiles. |
| `migrations/` | Ordered SQL migrations matching DatabaseSchema.md Section 12 migration order. Applied via `supabase db push` or `supabase db reset`. |

### Migration File Mapping

| Migration | Contents | DB Schema Reference |
|---|---|---|
| `00001_create_enums.sql` | All `CREATE TYPE` for enums: `platform_type`, `subscription_tier`, `input_method_type`, `usage_action_type`, `invitation_status`, `theme_type`, `voice_preset_type` | Section 4 |
| `00002_create_teams.sql` | `CREATE TABLE teams` with constraints | Section 5.2 |
| `00003_create_profiles.sql` | `CREATE TABLE profiles` with FK to `auth.users` and `teams` | Section 5.1 |
| `00004_create_team_invitations.sql` | `CREATE TABLE team_invitations` with FK to `teams` and `auth.users` | Section 5.3 |
| `00005_create_brand_voice_profiles.sql` | `CREATE TABLE brand_voice_profiles` with FK to `teams` | Section 5.4 |
| `00006_create_source_contents.sql` | `CREATE TABLE source_contents` with constraints, `search_vector` column | Section 5.5 |
| `00007_create_generated_posts.sql` | `CREATE TABLE generated_posts` with UNIQUE constraint, `search_vector` column | Section 5.6 |
| `00008_create_usage_records.sql` | `CREATE TABLE usage_records` (append-only) | Section 5.7 |
| `00009_create_user_preferences.sql` | `CREATE TABLE user_preferences` | Section 5.8 |
| `00010_create_indexes.sql` | All FK indexes, partial indexes, GIN full-text search indexes | Section 7 |
| `00011_enable_rls_policies.sql` | `ALTER TABLE ... ENABLE RLS` + all `CREATE POLICY` statements for all 8 tables | Section 8 |
| `00012_create_trigger_functions.sql` | `CREATE FUNCTION` for: `update_updated_at()`, `update_source_content_search_vector()`, `update_generated_post_search_vector()`, `handle_new_user()`, `enforce_brand_voice_limit()`, `enforce_team_member_limit()` | Section 9 |
| `00013_create_triggers.sql` | `CREATE TRIGGER` statements attaching functions to tables | Section 9 |
| `00014_create_views.sql` | `CREATE VIEW` for: `v_user_monthly_usage`, `v_content_library`, `v_user_all_time_stats`, `v_weekly_usage_history` | Section 10 |
| `00015_create_storage_buckets.sql` | `INSERT INTO storage.buckets` for `avatars` bucket + storage RLS policies | Section 11 |

---

## 13. Tests — `tests/`

```
tests/
├── setup.ts                            # Global test setup (MSW server, env mocks)
├── mocks/                              # MSW request handlers and mock data
│   ├── handlers.ts                     # Combined MSW handlers for all services
│   ├── server.ts                       # MSW server setup (setupServer)
│   ├── openai.ts                       # Mock OpenAI API responses
│   ├── stripe.ts                       # Mock Stripe API responses
│   └── supabase.ts                     # Mock Supabase client responses
│
├── unit/                               # Vitest unit tests
│   ├── lib/                            # Library/utility tests
│   │   ├── utils.test.ts
│   │   ├── platform-config.test.ts
│   │   ├── export.test.ts
│   │   └── validators/
│   │       ├── auth.test.ts
│   │       └── repurpose.test.ts
│   ├── services/                       # Service layer tests
│   │   ├── usage-service.test.ts
│   │   └── repurpose-service.test.ts
│   └── components/                     # React component tests (RTL)
│       ├── platform-selector.test.tsx
│       ├── character-count.test.tsx
│       └── generated-post-card.test.tsx
│
├── integration/                        # Integration tests (require local Supabase)
│   ├── vitest.integration.config.ts    # Separate Vitest config for integration tests
│   ├── api/                            # API route handler tests
│   │   ├── repurpose.test.ts
│   │   ├── library.test.ts
│   │   ├── usage.test.ts
│   │   └── billing-webhook.test.ts
│   └── db/                             # Database-level tests
│       ├── rls-policies.test.ts        # Verify RLS isolation between users
│       └── triggers.test.ts            # Verify trigger behaviors
│
└── e2e/                                # Playwright end-to-end tests
    ├── playwright.config.ts            # Playwright config: base URL, browsers, screenshots
    ├── auth.spec.ts                    # Signup, login, logout, password reset flows
    ├── repurpose-flow.spec.ts          # Full paste → generate → view results → copy flow
    ├── library.spec.ts                 # Library search, filter, content detail, export
    ├── upgrade.spec.ts                 # Free tier limit → Stripe checkout → Pro access
    └── fixtures/
        └── test-content.ts             # Sample content for E2E test inputs
```

### Test Tooling Summary

| Test Type | Tool | Config Location | Coverage Target |
|---|---|---|---|
| Unit (utilities, validators) | Vitest | `vitest.config.ts` (root) | ≥ 90% |
| Unit (API handlers) | Vitest + MSW | `vitest.config.ts` (root) | ≥ 85% |
| Unit (components) | Vitest + React Testing Library | `vitest.config.ts` (root) | ≥ 70% |
| Integration (API + DB) | Vitest + Supabase local | `tests/integration/vitest.integration.config.ts` | ≥ 80% |
| End-to-end | Playwright | `tests/e2e/playwright.config.ts` | Critical flows |
| Load | k6 (external) | Scripts not in repo (run ad-hoc) | NFR targets |

---

## 14. CI/CD & Deployment

### 14.1 GitHub Actions

```
.github/
├── workflows/
│   ├── ci.yml              # Runs on push/PR: typecheck, lint, format, unit tests, integration tests
│   └── e2e.yml             # Runs on merge to main: build + Playwright E2E tests
└── renovate.json           # Renovate bot config: weekly PRs, automerge patches
```

| Workflow | Trigger | Jobs | Purpose |
|---|---|---|---|
| `ci.yml` | `push`, `pull_request` | `quality` (typecheck, lint, format), `test` (unit + integration with local Supabase), `security` (pnpm audit) | Ensures code quality on every push/PR |
| `e2e.yml` | `push` to `main` | `e2e` (build + Playwright across Chrome, Firefox, Safari) | Validates critical flows before production deployment |

### 14.2 Deployment Flow

| Trigger | Action | Result |
|---|---|---|
| Push to `main` | Vercel auto-deploys | Production deployment |
| Push to PR branch | Vercel auto-deploys | Preview deployment (unique URL per PR) |
| CI failure | Branch protection blocks merge | No broken code reaches `main` |

---

## 15. Environment Variables

All environment variables defined in `.env.example` and validated at build time by `src/lib/env.ts` using `@t3-oss/env-nextjs`.

### Required Variables

| Variable | Type | Client-Safe | Purpose |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `string` (URL) | Yes | Supabase project API URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `string` | Yes | Supabase anonymous key (RLS-protected client queries) |
| `SUPABASE_SERVICE_ROLE_KEY` | `string` | **No** | Server-side Supabase access (bypasses RLS). Used in admin client and webhook handlers. |
| `OPENAI_API_KEY` | `string` | **No** | OpenAI API authentication for GPT-4o |
| `STRIPE_SECRET_KEY` | `string` | **No** | Stripe server-side API key |
| `STRIPE_WEBHOOK_SECRET` | `string` | **No** | Stripe webhook signature verification secret |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `string` | Yes | Stripe client-side publishable key |
| `NEXT_PUBLIC_APP_URL` | `string` (URL) | Yes | Application base URL (used for OAuth redirects, OG URLs, Stripe success/cancel URLs) |

### Optional / Monitoring Variables

| Variable | Type | Client-Safe | Purpose |
|---|---|---|---|
| `SENTRY_DSN` | `string` (URL) | Yes (in client config) | Sentry error tracking DSN |
| `SENTRY_AUTH_TOKEN` | `string` | **No** | Sentry source map upload token (CI only) |
| `NEXT_PUBLIC_POSTHOG_KEY` | `string` | Yes | PostHog analytics project API key |
| `NEXT_PUBLIC_POSTHOG_HOST` | `string` (URL) | Yes | PostHog instance URL |

### `.env.example` Template

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# OpenAI
OPENAI_API_KEY=sk-your-openai-key

# Stripe
STRIPE_SECRET_KEY=sk_test_your-stripe-secret
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Monitoring (optional)
SENTRY_DSN=https://your-sentry-dsn
SENTRY_AUTH_TOKEN=your-sentry-auth-token
NEXT_PUBLIC_POSTHOG_KEY=your-posthog-key
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

---

## 16. Naming Conventions

### Files & Directories

| Type | Convention | Example |
|---|---|---|
| Directories | `kebab-case` | `content-input-area/`, `extract-url/` |
| React components | `kebab-case.tsx` | `platform-selector.tsx`, `generated-post-card.tsx` |
| Utility/lib files | `kebab-case.ts` | `rate-limit.ts`, `platform-config.ts` |
| Route pages | `page.tsx` (Next.js convention) | `src/app/(app)/dashboard/page.tsx` |
| Route layouts | `layout.tsx` (Next.js convention) | `src/app/(app)/layout.tsx` |
| Route loading | `loading.tsx` (Next.js convention) | `src/app/(app)/dashboard/loading.tsx` |
| Route errors | `error.tsx` (Next.js convention) | `src/app/error.tsx` |
| API routes | `route.ts` (Next.js convention) | `src/app/api/repurpose/route.ts` |
| Test files | `*.test.ts` / `*.test.tsx` (Vitest) | `utils.test.ts` |
| E2E test files | `*.spec.ts` (Playwright) | `auth.spec.ts` |
| SQL migrations | `NNNNN_description.sql` | `00006_create_source_contents.sql` |
| Type definition files | `kebab-case.ts` | `database.ts`, `api.ts` |
| Zustand stores | `*-store.ts` | `repurpose-store.ts` |
| Custom hooks | `use-*.ts` | `use-user.ts`, `use-debounce.ts` |

### Code Naming

| Type | Convention | Example |
|---|---|---|
| React components | `PascalCase` | `PlatformSelector`, `GeneratedPostCard` |
| Functions / hooks | `camelCase` | `createServerClient()`, `useDebounce()` |
| Constants | `UPPER_SNAKE_CASE` | `PLATFORM_CHAR_LIMITS`, `FREE_TIER_LIMITS` |
| Type / Interface | `PascalCase` | `Profile`, `RepurposeRequest`, `PlatformConfig` |
| Enum values (TS) | `PascalCase` or mirror DB enums | `'twitter'`, `'linkedin'` (match DB `platform_type` values) |
| Zod schemas | `camelCase` + `Schema` suffix | `signupSchema`, `repurposeSchema` |
| Zustand stores | `use` + `PascalCase` + `Store` | `useRepurposeStore`, `useEditorStore` |
| CSS custom properties | `--kebab-case` | `--primary`, `--muted-foreground` |
| Environment variables | `UPPER_SNAKE_CASE`, `NEXT_PUBLIC_` prefix for client-safe | `OPENAI_API_KEY`, `NEXT_PUBLIC_SUPABASE_URL` |

### Import Aliases

All imports use the `@/` alias mapped to `src/`:

```typescript
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PlatformSelector } from "@/components/repurpose/platform-selector";
import { createServerClient } from "@/lib/supabase/server";
import type { Profile, GeneratedPost } from "@/types";
```

---

## 17. Reconciliation Notes

### PRD Feature → Module Mapping

| PRD Feature (Epic) | Corresponding Modules / Directories |
|---|---|
| Epic 1: Authentication (US-1.1–1.5) | `src/app/(auth)/`, `src/app/api/auth/`, `src/components/auth/`, `src/lib/supabase/`, `src/middleware.ts`, `src/lib/validators/auth.ts` |
| Epic 2: Content Input (US-2.1–2.2) | `src/components/repurpose/content-input-area.tsx`, `src/components/repurpose/url-input.tsx`, `src/components/repurpose/url-preview.tsx`, `src/app/api/extract-url/`, `src/lib/extraction/` |
| Epic 3: AI Repurposing Engine (US-3.1–3.3) | `src/lib/ai/`, `src/app/api/repurpose/`, `src/components/repurpose/generation-progress.tsx`, `src/components/repurpose/results-view.tsx`, `src/lib/services/repurpose-service.ts` |
| Epic 4: Content Editor (US-4.1–4.2) | `src/components/repurpose/post-editor.tsx`, `src/components/repurpose/generated-post-card.tsx`, `src/app/api/posts/`, `src/stores/editor-store.ts` |
| Epic 5: Content Library (US-5.1–5.3) | `src/app/(app)/library/`, `src/components/library/`, `src/app/api/library/`, `src/lib/services/library-service.ts` |
| Epic 6: Export & Sharing (US-6.1–6.2) | `src/components/shared/copy-button.tsx`, `src/components/shared/export-dropdown.tsx`, `src/lib/export.ts` |
| Epic 7: Usage Dashboard (US-7.1) | `src/app/(app)/dashboard/`, `src/components/dashboard/`, `src/app/api/usage/`, `src/lib/services/usage-service.ts` |
| Epic 8: Team Features (US-8.1–8.2) | `src/app/(app)/settings/team/`, `src/components/team/`, `src/lib/services/team-service.ts`, `src/lib/services/voice-service.ts` |
| Monetization (Section 13) | `src/app/api/billing/`, `src/lib/stripe/`, `src/components/settings/pricing-table.tsx`, `src/components/shared/upgrade-dialog.tsx`, `src/app/(marketing)/pricing/` |

### TechStack Framework Conventions

| TechStack Requirement | Structure Alignment |
|---|---|
| Next.js App Router with `--src-dir` | All code under `src/`, file-based routing in `src/app/` |
| shadcn/ui copy-paste model | Components in `src/components/ui/`, `components.json` configured |
| Supabase client/server/admin split | Three clients in `src/lib/supabase/` with distinct keys |
| `@supabase/ssr` middleware | Session refresh in `src/middleware.ts` using `src/lib/supabase/middleware.ts` |
| Zustand (client state) + React Context (auth) | Stores in `src/stores/`, auth via Supabase provider in root layout |
| Tiptap rich text editor | `src/components/repurpose/post-editor.tsx` |
| `@t3-oss/env-nextjs` | `src/lib/env.ts` validates all env vars |
| pnpm package manager | `pnpm-lock.yaml` committed, `--frozen-lockfile` in CI |
| ESLint 9 flat config + Prettier | `.eslintrc.mjs`, `.prettierrc` at root |
| Husky + lint-staged | `.husky/pre-commit`, `lint-staged.config.mjs` |
| Vitest + RTL + Playwright + MSW | `tests/` directory with unit/integration/e2e/mocks |
| GitHub Actions + Vercel | `.github/workflows/ci.yml` + `.github/workflows/e2e.yml` |
| Sentry + PostHog | `sentry.client.config.ts`, `sentry.server.config.ts`, PostHog init in root layout |

### DatabaseSchema Entity → Data Layer Mapping

| DB Entity | Type Definition | Service File | API Route |
|---|---|---|---|
| `profiles` | `src/types/database.ts` → `Profile` | `src/lib/services/profile-service.ts` | `src/app/api/auth/*` |
| `teams` | `src/types/database.ts` → `Team` | `src/lib/services/team-service.ts` | `src/app/(app)/settings/team/page.tsx` (Server Actions) |
| `team_invitations` | `src/types/database.ts` → `TeamInvitation` | `src/lib/services/team-service.ts` | `src/app/(app)/settings/team/page.tsx` (Server Actions) |
| `brand_voice_profiles` | `src/types/database.ts` → `BrandVoiceProfile` | `src/lib/services/voice-service.ts` | `src/app/(app)/settings/team/page.tsx` (Server Actions) |
| `source_contents` | `src/types/database.ts` → `SourceContent` | `src/lib/services/repurpose-service.ts` | `src/app/api/repurpose/route.ts`, `src/app/api/library/route.ts` |
| `generated_posts` | `src/types/database.ts` → `GeneratedPost` | `src/lib/services/repurpose-service.ts` | `src/app/api/posts/[postId]/route.ts` |
| `usage_records` | `src/types/database.ts` → `UsageRecord` | `src/lib/services/usage-service.ts` | `src/app/api/usage/route.ts` |
| `user_preferences` | `src/types/database.ts` → `UserPreferences` | `src/lib/services/profile-service.ts` | `src/app/(app)/settings/page.tsx` (Server Actions) |

### UI/UX Component → File Mapping

| UI/UX Component (Section 3–4) | File Path |
|---|---|
| PlatformSelector | `src/components/repurpose/platform-selector.tsx` |
| ContentInputArea | `src/components/repurpose/content-input-area.tsx` |
| GeneratedPostCard | `src/components/repurpose/generated-post-card.tsx` |
| UsageIndicator (sidebar) | `src/components/layout/sidebar-usage-indicator.tsx` |
| StatCard | `src/components/dashboard/stat-card.tsx` |
| ContentLibraryItem | `src/components/library/content-library-item.tsx` |
| Post Editor (Tiptap) | `src/components/repurpose/post-editor.tsx` |
| PricingTable | `src/components/settings/pricing-table.tsx` |
| SettingsNav | `src/components/settings/settings-nav.tsx` |
| TeamMemberList | `src/components/team/team-member-list.tsx` |
| BrandVoiceCard | `src/components/team/brand-voice-card.tsx` |
| HeroSection | `src/components/marketing/hero-section.tsx` |

### Unresolved Notes

| Item | Notes |
|---|---|
| **Supabase type generation** | Run `supabase gen types typescript` to auto-generate `src/types/database.ts` from the live schema. Manual types should be replaced once migrations are applied. |
| **Server Actions vs API Routes** | Settings mutations (profile update, voice update, team invite) may use Server Actions instead of dedicated API routes. The structure supports both approaches — service layer is reusable either way. |
| **Feature flags** | PostHog feature flags (`ff_team_features`, `ff_voice_customization`, `ff_bluesky_platform`, `ff_url_extraction`) should gate features at the component level. No dedicated feature-flag directory needed — PostHog SDK checks inline. |
| **Scalability** | The current monolithic structure supports the MVP and near-term scale (100K source records, 1M posts, 10K MAU). If microservice extraction is needed later, the `src/lib/services/` layer provides clean separation boundaries. |

---

## Change Log

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0 | 2026-02-24 | Project Structure Agent | Initial project structure specification |
