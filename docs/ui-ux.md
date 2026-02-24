# UI/UX Specification: RecastAI

> **Version:** 1.0
> **Date:** 2026-02-24
> **Status:** Draft
> **Input Documents:** PRD.md, TechStack.md
> **Tech Foundation:** Next.js 14 App Router, Tailwind CSS 3.4, shadcn/ui (Radix UI), Tiptap, Recharts

---

## Table of Contents

1. [Design System](#1-design-system)
2. [Layout & Navigation Structure](#2-layout--navigation-structure)
3. [Component Library](#3-component-library)
4. [Page Specifications](#4-page-specifications)
5. [User Flows](#5-user-flows)
6. [Interaction Patterns](#6-interaction-patterns)
7. [Accessibility](#7-accessibility)
8. [Responsive Design](#8-responsive-design)
9. [Dark Mode](#9-dark-mode)
10. [Animation & Transitions](#10-animation--transitions)
11. [Reconciliation Notes](#11-reconciliation-notes)

---

## 1. Design System

### 1.1 Color System

Built on Tailwind CSS color tokens using CSS custom properties for theme switching. Colors are defined using the HSL format in `globals.css` and consumed via Tailwind's `theme.extend.colors` config, consistent with the shadcn/ui convention.

#### Brand Colors

| Token | Light Mode (HSL) | Dark Mode (HSL) | Usage |
|---|---|---|---|
| `--primary` | `252 85% 60%` | `252 85% 65%` | Primary actions, CTAs, active states, brand identity |
| `--primary-foreground` | `0 0% 100%` | `0 0% 100%` | Text/icons on primary background |
| `--secondary` | `215 20% 95%` | `215 20% 15%` | Secondary buttons, subtle backgrounds |
| `--secondary-foreground` | `215 25% 27%` | `215 20% 90%` | Text on secondary background |
| `--accent` | `167 72% 48%` | `167 72% 55%` | Success states, positive callouts, upgrade badges |
| `--accent-foreground` | `0 0% 100%` | `0 0% 100%` | Text on accent background |

#### Semantic Colors

| Token | Light Mode (HSL) | Dark Mode (HSL) | Usage |
|---|---|---|---|
| `--background` | `0 0% 100%` | `224 71% 4%` | Page background |
| `--foreground` | `224 71% 4%` | `210 20% 98%` | Primary text |
| `--card` | `0 0% 100%` | `224 50% 8%` | Card surfaces |
| `--card-foreground` | `224 71% 4%` | `210 20% 98%` | Text on cards |
| `--muted` | `220 15% 96%` | `220 15% 14%` | Disabled backgrounds, subtle fills |
| `--muted-foreground` | `220 10% 46%` | `220 10% 60%` | Secondary text, placeholders, captions |
| `--border` | `220 13% 91%` | `220 13% 18%` | Borders, dividers |
| `--input` | `220 13% 91%` | `220 13% 18%` | Input field borders |
| `--ring` | `252 85% 60%` | `252 85% 65%` | Focus ring |

#### State Colors

| Token | Light Mode (HSL) | Dark Mode (HSL) | Usage |
|---|---|---|---|
| `--destructive` | `0 84% 60%` | `0 84% 60%` | Error states, delete actions, destructive CTAs |
| `--destructive-foreground` | `0 0% 100%` | `0 0% 100%` | Text on destructive background |
| `--success` | `142 72% 42%` | `142 72% 50%` | Success feedback, completion indicators |
| `--warning` | `38 92% 50%` | `38 92% 55%` | Warning banners, limit approaching |

#### Platform Colors

Used for platform badges, tabs, and icons throughout the app.

| Platform | Color (HSL) | Tailwind Approx. | Usage |
|---|---|---|---|
| X / Twitter | `0 0% 0%` / `0 0% 100%` (dark) | `black` / `white` | Platform icon, tab accent |
| LinkedIn | `210 85% 43%` | `blue-700` | Platform icon, tab accent |
| Instagram | `330 70% 55%` | `pink-500` | Platform icon, tab accent (gradient in icon) |
| TikTok | `170 100% 50%` | `teal-400` | Platform icon, tab accent |
| Bluesky | `210 100% 55%` | `sky-500` | Platform icon, tab accent |
| Email | `252 85% 60%` | `violet-500` | Platform icon, tab accent (matches brand) |

### 1.2 Typography

Using the system font stack via Tailwind's `font-sans` for performance (no web font download), with `font-mono` for character counts and code-like elements.

| Role | Tailwind Class | Size / Weight | Usage |
|---|---|---|---|
| Display | `text-4xl font-bold tracking-tight` | 36px / 700 | Landing page hero headline |
| H1 | `text-3xl font-bold tracking-tight` | 30px / 700 | Page titles (Dashboard, Library, Settings) |
| H2 | `text-2xl font-semibold tracking-tight` | 24px / 600 | Section headers within pages |
| H3 | `text-xl font-semibold` | 20px / 600 | Card titles, subsection headers |
| H4 | `text-lg font-medium` | 18px / 500 | Widget headers, group labels |
| Body | `text-base font-normal` | 16px / 400 | General body text, form labels |
| Body Small | `text-sm font-normal` | 14px / 400 | Secondary text, table cells, metadata |
| Caption | `text-xs font-medium` | 12px / 500 | Badges, timestamps, helper text |
| Mono | `text-sm font-mono` | 14px / 400 | Character counts, code, data values |

**Line heights:** Tailwind defaults (`leading-normal` = 1.5 for body, `leading-tight` = 1.25 for headings).

**Max content width:** Prose content uses `max-w-prose` (65ch) for optimal readability.

### 1.3 Spacing System

Follows Tailwind's 4px base scale. Consistent spacing tokens used across all components.

| Token | Value | Usage |
|---|---|---|
| `space-1` | 4px | Inline icon gaps, tight padding |
| `space-2` | 8px | Button icon gap, compact padding |
| `space-3` | 12px | Input padding, small card padding |
| `space-4` | 16px | Default card padding, form field gap |
| `space-5` | 20px | Section internal padding |
| `space-6` | 24px | Card padding, section gap |
| `space-8` | 32px | Section separation, page section gap |
| `space-10` | 40px | Major section dividers |
| `space-12` | 48px | Page-level vertical rhythm |
| `space-16` | 64px | Hero section padding |

**Consistent patterns:**
- Card internal padding: `p-6` (24px)
- Page content padding: `px-4 md:px-6 lg:px-8`
- Stack gap between form fields: `space-y-4`
- Stack gap between sections: `space-y-8`
- Grid gap: `gap-4` (16px) or `gap-6` (24px)

### 1.4 Border Radius

| Token | Value | Usage |
|---|---|---|
| `rounded-sm` | 4px | Small badges, tags |
| `rounded-md` | 6px | Buttons, inputs, dropdowns |
| `rounded-lg` | 8px | Cards, dialogs, popovers |
| `rounded-xl` | 12px | Large cards, feature sections |
| `rounded-full` | 9999px | Avatars, circular buttons, pills |

### 1.5 Elevation & Shadows

| Level | Tailwind Class | Usage |
|---|---|---|
| Level 0 | `shadow-none` | Flat elements, inline content |
| Level 1 | `shadow-sm` | Cards, inputs on focus |
| Level 2 | `shadow-md` | Dropdowns, popovers, floating elements |
| Level 3 | `shadow-lg` | Modals, dialogs |
| Level 4 | `shadow-xl` | Toast notifications |

In dark mode, shadows are reduced in intensity and borders (`border`) are used more prominently for separation.

### 1.6 Iconography

Using **Lucide React** (tree-shakeable, MIT licensed, consistent with shadcn/ui defaults).

**Guidelines:**
- Default icon size: 16px (`w-4 h-4`) inline with text, 20px (`w-5 h-5`) for standalone actions
- Navigation icons: 20px (`w-5 h-5`)
- Hero / feature icons: 24px–32px (`w-6 h-6` to `w-8 h-8`)
- Color: inherits `currentColor` from parent text
- Stroke width: 2px (Lucide default)
- Always pair actionable icons with accessible labels (visible or `sr-only`)

**Platform icons:** Custom SVG icons for X/Twitter, LinkedIn, Instagram, TikTok, Bluesky, and Email. Stored in `src/components/icons/` as React components. Rendered at consistent 20px size with platform-specific colors.

---

## 2. Layout & Navigation Structure

### 2.1 Application Shell

The application uses a **sidebar + main content** layout for authenticated pages and a **full-width** layout for public pages (landing, auth, pricing).

```
┌──────────────────────────────────────────────────────────────┐
│  Top Bar (mobile only): hamburger + logo + user avatar       │
├──────────┬───────────────────────────────────────────────────┤
│          │                                                   │
│ Sidebar  │  Main Content Area                                │
│ (240px)  │                                                   │
│          │  ┌─────────────────────────────────────────────┐  │
│ Logo     │  │  Page Header (title + actions)              │  │
│          │  ├─────────────────────────────────────────────┤  │
│ Nav      │  │                                             │  │
│ Items    │  │  Page Content                               │  │
│          │  │  (max-w-6xl mx-auto for most pages)         │  │
│          │  │                                             │  │
│          │  │                                             │  │
│          │  └─────────────────────────────────────────────┘  │
│          │                                                   │
│ ──────── │                                                   │
│ User     │                                                   │
│ Menu     │                                                   │
├──────────┴───────────────────────────────────────────────────┤
│  (Footer only on public pages)                               │
└──────────────────────────────────────────────────────────────┘
```

### 2.2 Sidebar Navigation

**Width:** 240px expanded, 64px collapsed (icon-only). Collapsible via toggle button.

**Structure (top to bottom):**

| Position | Item | Icon | Route | Badge |
|---|---|---|---|---|
| Header | RecastAI Logo + wordmark | — | `/dashboard` | — |
| — | Collapse toggle | `PanelLeftClose` / `PanelLeftOpen` | — | — |
| Nav Group | **New Repurpose** | `Plus` | `/repurpose/new` | — (primary CTA styling) |
| Nav Group | Dashboard | `LayoutDashboard` | `/dashboard` | — |
| Nav Group | Content Library | `Library` | `/library` | — |
| Nav Group | Settings | `Settings` | `/settings` | — |
| Divider | — | — | — | — |
| Bottom | Usage indicator | `Gauge` | — | "3/5" or "Pro" pill |
| Bottom | User dropdown | `Avatar` | — | Tier badge |

**Sidebar behavior:**
- Desktop (≥ 1024px): Sidebar visible by default, collapsible
- Tablet (768–1023px): Sidebar collapsed by default (icon-only), expandable
- Mobile (< 768px): Sidebar hidden, accessible via hamburger menu as a slide-over sheet

**User dropdown menu items:**
- Profile & Settings → `/settings`
- Subscription → `/settings/billing`
- Theme toggle (Light / Dark / System)
- Sign out

### 2.3 Page Header Pattern

Each authenticated page has a consistent header structure:

```
┌─────────────────────────────────────────────────────────┐
│  [Breadcrumb (optional)]                                │
│  Page Title                          [Action Button(s)] │
│  Description text (optional)                            │
└─────────────────────────────────────────────────────────┘
```

Components: shadcn `Breadcrumb`, custom `PageHeader` wrapper.

### 2.4 Route Map

| Route | Page | Layout | Auth Required |
|---|---|---|---|
| `/` | Landing Page | Public (full-width) | No |
| `/pricing` | Pricing Page | Public (full-width) | No |
| `/login` | Login | Auth layout (centered card) | No |
| `/register` | Register | Auth layout (centered card) | No |
| `/forgot-password` | Forgot Password | Auth layout (centered card) | No |
| `/reset-password` | Reset Password | Auth layout (centered card) | No |
| `/dashboard` | Dashboard | App shell (sidebar) | Yes |
| `/repurpose/new` | New Repurpose | App shell (sidebar) | Yes |
| `/repurpose/[id]` | Repurpose Results | App shell (sidebar) | Yes |
| `/library` | Content Library | App shell (sidebar) | Yes |
| `/library/[id]` | Content Detail | App shell (sidebar) | Yes |
| `/settings` | Settings (Profile) | App shell (sidebar) | Yes |
| `/settings/voice` | Voice Preferences | App shell (sidebar) | Yes (Pro+) |
| `/settings/billing` | Billing & Subscription | App shell (sidebar) | Yes |
| `/settings/team` | Team Management | App shell (sidebar) | Yes (Team) |

---

## 3. Component Library

All components are built on **shadcn/ui** (copy-paste, Radix UI primitives). Below defines component hierarchy, states, and interaction rules.

### 3.1 Atomic Components

#### Button

Base: shadcn `Button` with `class-variance-authority` variants.

| Variant | Class | Usage |
|---|---|---|
| `default` | Primary bg, white text | Primary actions (Generate, Save, Upgrade) |
| `secondary` | Secondary bg, dark text | Secondary actions (Cancel, Back) |
| `outline` | Border only, transparent bg | Tertiary actions (Filter, Export) |
| `ghost` | No bg, hover bg | Navigation items, icon-only actions |
| `destructive` | Destructive bg, white text | Delete, Remove |
| `link` | Underline text, no bg | Inline links |

**Sizes:** `sm` (h-8, text-xs), `default` (h-10, text-sm), `lg` (h-12, text-base), `icon` (h-10, w-10)

**States:**
- Default → Hover (slight darken/lighten) → Active (pressed scale `scale-[0.98]`) → Disabled (50% opacity, `pointer-events-none`)
- Loading: Replace label with `Loader2` spinner icon (animated spin) + "Loading..." text

#### Input / Textarea

Base: shadcn `Input` and `Textarea`.

**States:**
- Default: `border-input` border
- Focus: `ring-2 ring-ring ring-offset-2` (primary color focus ring)
- Error: `border-destructive` + error message below in `text-destructive text-sm`
- Disabled: `opacity-50 cursor-not-allowed`

**Textarea (content input):** Uses `min-h-[200px]` with auto-resize. Character count shown bottom-right in `font-mono text-xs text-muted-foreground`. Count turns `text-warning` at 90% of limit, `text-destructive` at 100%.

#### Card

Base: shadcn `Card`, `CardHeader`, `CardContent`, `CardFooter`.

- Default padding: `p-6`
- Border: `border rounded-lg`
- Hover variant (clickable cards): `hover:shadow-md hover:border-primary/20 transition-all cursor-pointer`

#### Badge

Base: shadcn `Badge`.

| Variant | Usage |
|---|---|
| `default` (primary) | Tier badges (Pro, Team), platform labels |
| `secondary` | Metadata tags, counts |
| `outline` | Filter chips (removable) |
| `destructive` | Error badges, overdue |
| Custom `success` | Success states, "Edited" indicator |

#### Dialog / Sheet

- **Dialog** (shadcn `Dialog`): Centered modal for confirmations (delete, discard changes)
- **Sheet** (shadcn `Sheet`): Slide-over panel for mobile sidebar, filter panels
- Both use Radix primitives → accessible by default (focus trap, Escape to close, aria-labels)

#### Toast

Using **Sonner** (integrated with shadcn/ui).

| Type | Icon | Duration | Usage |
|---|---|---|---|
| Success | `Check` (green) | 3 seconds | "Copied!", "Saved", "Exported" |
| Error | `X` (red) | 5 seconds | API errors, validation failures |
| Warning | `AlertTriangle` (amber) | 4 seconds | Approaching limits, extraction issues |
| Info | `Info` (blue) | 3 seconds | Informational messages |

Position: Bottom-right on desktop, bottom-center on mobile.

#### Tabs

Base: shadcn `Tabs` (Radix).

Used for:
- Platform output tabs on repurpose results
- Input mode toggle (Text / URL)
- Settings sub-navigation

Styling: Underline variant for page-level tabs, pill variant for inline toggles.

#### Dropdown Menu

Base: shadcn `DropdownMenu` (Radix).

Used for: User menu, post action menu (Edit, Regenerate, Copy, Delete), sort options.

#### Tooltip

Base: shadcn `Tooltip` (Radix). Side: `top` by default. Delay: 300ms.

Used for: Icon-only buttons, truncated text, feature explanations.

#### Select / Combobox

Base: shadcn `Select` (Radix) for simple lists, `Command` (cmdk) for searchable/filterable.

#### Skeleton

Base: shadcn `Skeleton`. Pulsing animation.

Used for: Loading states on cards, table rows, stat widgets, generated posts.

### 3.2 Composite Components

#### PlatformSelector

A custom multi-select grid component for choosing target platforms.

```
┌─────────────────────────────────────────────────────────┐
│  Select Platforms                  [Select All] [Clear] │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │ [X icon] │  │ [LI icon]│  │ [IG icon]│              │
│  │ X/Twitter│  │ LinkedIn │  │Instagram │              │
│  │    ✓     │  │    ✓     │  │          │              │
│  └──────────┘  └──────────┘  └──────────┘              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │ [TT icon]│  │ [BS icon]│  │ [Em icon]│              │
│  │ TikTok   │  │ Bluesky  │  │  Email   │              │
│  │          │  │    🔒    │  │          │              │
│  └──────────┘  └──────────┘  └──────────┘              │
│                                                         │
│  Free: 3 platforms max · Upgrade for all 6 →            │
└─────────────────────────────────────────────────────────┘
```

- Each platform is a toggle card with icon, name, and checkmark state
- Selected state: `border-primary bg-primary/5` with checkmark
- Unselected state: `border-border bg-card` 
- Locked state (free tier, > 3 selected): `opacity-50` with lock icon overlay
- Platform colors accent the icon in selected state
- Mobile: 2-column grid. Desktop: 3-column or 6-column single row

#### ContentInputArea

The main content input with text/URL toggle.

```
┌─────────────────────────────────────────────────────────┐
│  [Text]  [URL]                                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Paste your long-form content here...                   │
│                                                         │
│                                                         │
│                                                         │
│                                                         │
│                                                         │
│                                                  0/50k  │
├─────────────────────────────────────────────────────────┤
│  [Clear]                              [Continue →]      │
└─────────────────────────────────────────────────────────┘
```

- Tab toggle between Text and URL modes (shadcn `Tabs`)
- Text mode: Large textarea with character counter
- URL mode: Single input field with "Extract" button → shows preview of extracted content below
- Warning badge when content < 100 chars
- Error state when content > 50,000 chars

#### GeneratedPostCard

Displays a single generated post within the results view.

```
┌─────────────────────────────────────────────────────────┐
│  Post 1 of 5              [Edited]    [···] ▾           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  "Here's what I learned building my first SaaS in       │
│  2026: Thread 🧵                                        │
│                                                         │
│  Most founders skip the boring parts..."                │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  245/280 chars    │  [Edit] [Regenerate ↻] [Copy 📋]   │
└─────────────────────────────────────────────────────────┘
```

- Header: post number, "Edited" badge (if edited), overflow menu (⋯)
- Body: Generated content text, rendered with line breaks preserved
- Footer: Character count (mono font) + action buttons
- Character count color: `text-muted-foreground` (normal), `text-warning` (90%+), `text-destructive` (over limit)
- Overflow menu: Regenerate, Edit, Copy, Revert to Original (if edited)
- Edit mode: Inline Tiptap editor replaces text display (see Post Editor section)

#### UsageIndicator

Shows in sidebar and dashboard.

**Sidebar (compact):**
```
┌──────────────────────┐
│ ████████░░  3/5      │
│ repurposes this month│
└──────────────────────┘
```

**Dashboard (expanded):**
```
┌─────────────────────────────────┐
│  Repurposes This Month          │
│  ████████████░░░░░░  3 of 5     │
│                                 │
│  [Upgrade for Unlimited →]      │
└─────────────────────────────────┘
```

- Progress bar: `bg-primary` fill on `bg-muted` track
- Turns `bg-warning` at 80% (4/5), `bg-destructive` at 100% (5/5)
- Pro/Team users see: "Unlimited" with a checkmark icon

#### StatCard

Used on the Dashboard for key metrics.

```
┌────────────────────┐
│  [icon]            │
│  24                │
│  Total Repurposes  │
│  ↑ 12% from last   │
│  month             │
└────────────────────┘
```

- shadcn `Card` with icon (top-left), large numeric value, label, and optional trend indicator
- Trend: green up arrow for positive, red down arrow for negative
- Skeleton loader while data loads

#### ContentLibraryItem

A card/row for each source content item in the library.

**Grid view:**
```
┌─────────────────────────────────────┐
│  How to Build a SaaS in 2026        │
│                                     │
│  "First 100 chars of source..."     │
│                                     │
│  [X] [LinkedIn] [Instagram]         │
│  12 posts · Feb 20, 2026            │
└─────────────────────────────────────┘
```

**List view:**
```
┌────────────────────────────────────────────────────────────────────┐
│  How to Build a SaaS...  │ [X][LI][IG] │ 12 posts │ Feb 20, 2026 │
└────────────────────────────────────────────────────────────────────┘
```

- Clickable → navigates to `/library/[id]`
- Platform badges use platform colors
- Hover: `shadow-md` elevation
- Supports grid (cards) and list (rows) toggle

---

## 4. Page Specifications

### 4.1 Landing Page (`/`)

**Purpose:** Marketing, conversion, first impression. Public page, full-width layout.

**Layout:** Full-width, no sidebar. Top navigation bar with: Logo, Features (anchor), Pricing (anchor), Login, "Get Started" CTA button.

**Component Hierarchy:**

```
LandingPage
├── NavBar
│   ├── Logo
│   ├── NavLinks (Features, Pricing)
│   ├── ThemeToggle
│   ├── Button (Login, ghost)
│   └── Button (Get Started, primary)
├── HeroSection
│   ├── Badge ("AI-Powered Content Repurposing")
│   ├── Heading (display size)
│   ├── Subheading (muted-foreground, max-w-2xl)
│   ├── CTAGroup
│   │   ├── Button (Get Started Free, primary, lg)
│   │   └── Button (See How It Works, outline, lg)
│   └── HeroVisual (text-based mockup of the repurpose flow)
├── SocialProofBar
│   └── LogoStrip / metrics ("10,000+ posts generated")
├── FeaturesSection
│   ├── SectionHeader
│   └── FeatureGrid (3-column)
│       ├── FeatureCard (Paste & Generate)
│       ├── FeatureCard (6 Platforms)
│       ├── FeatureCard (Voice Matching)
│       ├── FeatureCard (Content Library)
│       ├── FeatureCard (Inline Editor)
│       └── FeatureCard (Export Anywhere)
├── HowItWorksSection
│   ├── SectionHeader
│   └── StepList (numbered, 3 steps)
│       ├── Step 1: Paste your content
│       ├── Step 2: Select platforms
│       └── Step 3: Get platform-perfect posts
├── PricingSection (reuses PricingTable component)
│   ├── SectionHeader
│   └── PricingTable
├── CTASection
│   ├── Heading ("Start repurposing in seconds")
│   ├── Subheading
│   └── Button (Get Started Free, primary, lg)
└── Footer
    ├── Logo
    ├── LinkGroups (Product, Company, Legal)
    └── Copyright
```

**Key design decisions:**
- Hero uses a large headline with a gradient text effect on the key word (e.g., "Repurpose" in gradient from primary to accent)
- HeroVisual: An animated or static text-based representation of content being transformed into platform cards — not an image, described as a component with staggered card appearance
- Features use Lucide icons at 32px with primary-tinted backgrounds
- Footer uses `bg-muted` background with minimal link structure

### 4.2 Auth Pages (`/login`, `/register`, `/forgot-password`, `/reset-password`)

**Layout:** Centered card on a `bg-muted` background. Two-column on desktop (left: brand illustration/copy, right: form card). Single column on mobile.

**Component Hierarchy (Login):**

```
AuthLayout
├── BrandPanel (left, hidden on mobile)
│   ├── Logo
│   ├── Tagline
│   └── FeatureList (3 bullet points)
└── FormPanel (right, centered on mobile)
    └── Card
        ├── CardHeader
        │   ├── Logo (mobile only)
        │   ├── Heading ("Welcome back")
        │   └── Description ("Sign in to your account")
        ├── CardContent
        │   ├── Button (Continue with Google, outline, full-width)
        │   ├── Separator ("or")
        │   ├── Form
        │   │   ├── FormField (Email, Input)
        │   │   ├── FormField (Password, Input type=password)
        │   │   ├── Link ("Forgot password?", right-aligned)
        │   │   └── Button (Sign In, primary, full-width)
        │   └── ErrorMessage (conditional)
        └── CardFooter
            └── Text ("Don't have an account?" + Link to /register)
```

**Register page** adds: display name field, password requirements hint (shown on focus), confirm password field, terms checkbox.

**Forgot Password page:** Single email input + submit button. Success state shows "Check your email" message with email icon.

**Reset Password page:** New password + confirm password fields. Success state redirects to login with toast.

**Validation behavior:**
- Client-side validation via Zod schemas on blur and on submit
- Password requirements shown as a checklist that updates in real-time (✓ green / ○ gray):
  - At least 8 characters
  - At least 1 uppercase letter
  - At least 1 number
- Email field validates format on blur
- Generic error for invalid credentials (no enumeration): "Invalid email or password"
- Google OAuth button is visually prominent (top of form, above email/password)

### 4.3 Dashboard (`/dashboard`)

**Purpose:** Overview hub. Shows recent activity, usage stats, and quick actions.

**Component Hierarchy:**

```
DashboardPage
├── PageHeader
│   ├── Heading ("Dashboard")
│   └── Button (New Repurpose, primary) → /repurpose/new
├── StatsGrid (4 columns on desktop, 2 on tablet, 1 on mobile)
│   ├── StatCard (Repurposes This Month: 3/5 or "Unlimited")
│   ├── StatCard (Posts Generated: 36)
│   ├── StatCard (Platforms Used: 4)
│   └── StatCard (Library Items: 12)
├── UsageBanner (free tier only)
│   ├── ProgressBar
│   ├── Text ("3 of 5 repurposes used")
│   └── Button (Upgrade to Pro, accent)
├── ContentGrid (2 columns)
│   ├── RecentActivityCard
│   │   ├── CardHeader ("Recent Repurposes")
│   │   ├── CardContent
│   │   │   └── List (last 5 repurposes)
│   │   │       └── ActivityItem (title, platforms, date, → link)
│   │   └── CardFooter
│   │       └── Link ("View all in Library →")
│   └── WeeklyChartCard
│       ├── CardHeader ("Activity (Last 12 Weeks)")
│       └── CardContent
│           └── BarChart (Recharts, repurposes per week)
├── QuickStartCard (shown only when 0 repurposes — empty state)
│   ├── Illustration (text-based, sparkle icon)
│   ├── Heading ("Create your first repurpose")
│   ├── Description ("Paste your content and get posts for 6 platforms")
│   └── Button (Get Started, primary, lg)
└── TipCard (contextual tip, rotated daily)
    ├── LightbulbIcon
    └── Text ("Pro tip: Select 3+ platforms for maximum reach")
```

**Empty state (new user):** The entire content area is replaced by `QuickStartCard` — a large centered CTA with visual emphasis. Stats cards show "0" values with muted styling.

**Usage banner:** Only shows for free tier users. Sticky at top of main content when usage ≥ 60% (≥ 3/5). Uses `bg-warning/10 border-warning` at 80%, `bg-destructive/10 border-destructive` at 100%.

### 4.4 New Repurpose Flow (`/repurpose/new`)

**Purpose:** Core value delivery. Multi-step flow: Input → Platforms → Generate → Results.

**Flow type:** Single-page with stepped progression (not separate pages). Uses a progress bar or step indicator at the top.

**Component Hierarchy:**

```
RepurposePage
├── PageHeader
│   ├── Heading ("New Repurpose")
│   └── StepIndicator (Step 1 of 3)
├── StepContent
│   ├── Step1_ContentInput (active)
│   │   ├── ContentInputArea
│   │   │   ├── Tabs (Text | URL)
│   │   │   ├── Textarea (text mode) OR UrlInput (url mode)
│   │   │   ├── CharacterCount
│   │   │   └── ValidationMessages
│   │   ├── UrlPreview (if URL extracted, shows title + excerpt + edit option)
│   │   └── StepActions
│   │       ├── Button (Clear, ghost)
│   │       └── Button (Continue, primary)
│   │
│   ├── Step2_PlatformSelect (after Continue)
│   │   ├── PlatformSelector (grid of 6 platform toggles)
│   │   ├── FreeTierNotice (if applicable: "Select up to 3 platforms")
│   │   ├── VoiceSelector (Pro+ only)
│   │   │   └── Select (Default Voice | My Voice | Brand Voice 1...)
│   │   └── StepActions
│   │       ├── Button (Back, outline)
│   │       └── Button (Generate, primary, lg)
│   │
│   └── Step3_Results (after Generate)
│       ├── GenerationProgress (during generation)
│       │   ├── Spinner / animated progress
│       │   ├── StatusText ("Generating X/Twitter posts...")
│       │   └── StreamingPostPreview (posts appear as they stream in)
│       └── ResultsView (after generation complete)
│           ├── ResultsHeader
│           │   ├── SuccessBanner ("✓ Generated 15 posts across 3 platforms")
│           │   └── ActionBar
│           │       ├── Button (Export All, outline)
│           │       └── DropdownMenu (Export Markdown | Export CSV)
│           ├── PlatformTabs (one tab per selected platform)
│           │   ├── Tab: X/Twitter
│           │   ├── Tab: LinkedIn
│           │   └── Tab: Instagram (etc.)
│           └── PostGrid (within each tab)
│               ├── GeneratedPostCard (post 1)
│               ├── GeneratedPostCard (post 2)
│               └── ... (5-7 posts per platform)
```

**Step Indicator:** Horizontal stepper with circles and connecting lines. Active step: primary color filled circle. Completed step: primary outline with checkmark. Future step: muted border circle.

**Generation progress state:**
- Animated gradient background or shimmer effect on the card area
- Platform-specific status messages cycle: "Crafting X/Twitter threads...", "Writing LinkedIn posts...", etc.
- Posts appear incrementally as they stream in via SSE — each post card animates in with a fade + slide-up
- A progress bar shows estimated completion

**Results view:**
- Platform tabs use platform icons and colors as tab indicators
- Each tab shows the posts for that platform in a vertical stack
- "Export All" exports across all platforms; per-platform export available in each tab

### 4.5 Content Library (`/library`)

**Purpose:** Browse, search, and manage all past repurposed content.

**Component Hierarchy:**

```
LibraryPage
├── PageHeader
│   ├── Heading ("Content Library")
│   └── Button (New Repurpose, primary)
├── Toolbar
│   ├── SearchInput (with search icon, debounced)
│   ├── FilterGroup
│   │   ├── PlatformFilter (multi-select dropdown)
│   │   ├── DateRangeFilter (date picker)
│   │   └── SortSelect (Newest / Oldest / Most Posts)
│   ├── ActiveFilters (removable badge chips)
│   └── ViewToggle (Grid | List)
├── ContentGrid or ContentList
│   ├── ContentLibraryItem (repeated)
│   └── ... (20 per page)
├── Pagination
│   ├── PageInfo ("Showing 1-20 of 94")
│   └── PageControls (Prev, 1, 2, 3, ..., Next)
└── EmptyState (when no content or no results)
    ├── Icon (Search or Library icon, large, muted)
    ├── Heading ("No content found" or "Your library is empty")
    ├── Description (contextual: "Try different search terms" or "Create your first repurpose")
    └── Button (conditional CTA)
```

**Search behavior:**
- Debounced (300ms) full-text search across source content and generated posts
- Results highlight matching terms (bold in excerpts)
- Search clears with an "X" button inside the input

**Filter behavior:**
- Platform filter: Multi-select dropdown with platform icons + checkboxes
- Date range: Popover with calendar date picker (shadcn `DatePickerWithRange`)
- Active filters show as dismissible badge chips below the toolbar
- All filters are composable (AND logic)

**Pagination:** Standard page-based navigation. 20 items per page. Shows total count.

### 4.6 Content Detail (`/library/[id]`)

**Purpose:** View all generated posts for a specific source content item.

**Component Hierarchy:**

```
ContentDetailPage
├── PageHeader
│   ├── Breadcrumb (Library > "Article Title")
│   ├── Heading (source title or "Untitled")
│   ├── Metadata (date, platform count, post count, input method)
│   └── ActionBar
│       ├── Button (Export, outline)
│       ├── Button (Reuse as Source, ghost) → /repurpose/new?source=id
│       └── Button (Delete, destructive ghost)
├── SourcePreview
│   ├── Collapsible (collapsed by default)
│   └── Text (first 500 chars of source) + "Show more" toggle
├── PlatformTabs
│   ├── Tab per platform
│   └── PostList (within each tab)
│       ├── GeneratedPostCard (with Edit, Copy, Regenerate)
│       └── ...
└── DeleteConfirmDialog
    ├── Warning text
    ├── Button (Cancel, outline)
    └── Button (Delete, destructive)
```

### 4.7 Post Editor (Inline)

**Purpose:** Edit generated posts inline using Tiptap rich text editor.

**Trigger:** Clicking "Edit" on any `GeneratedPostCard` transitions the card into edit mode.

**Component Hierarchy:**

```
GeneratedPostCard (Edit Mode)
├── CardHeader
│   ├── PostNumber
│   ├── Badge ("Editing")
│   └── PlatformCharLimit ("280 char limit for X/Twitter")
├── TiptapEditor
│   ├── Toolbar (compact)
│   │   ├── BoldButton
│   │   ├── ItalicButton
│   │   ├── BulletListButton
│   │   ├── LinkButton
│   │   └── Separator
│   └── EditorContent (editable rich text area)
├── EditorFooter
│   ├── CharacterCount (real-time, color-coded)
│   ├── Button (Discard, ghost)
│   ├── Button (Revert to Original, outline) — if previously edited
│   └── Button (Save, primary)
└── ValidationWarning (if over character limit)
```

**Editor behavior:**
- Tiptap editor replaces the static text area of the card
- Toolbar is compact (icon-only buttons with tooltips)
- Character count updates in real-time as user types
- Save is disabled if content is over platform character limit
- "Discard" returns to view mode without saving
- "Revert to Original" restores the AI-generated version (requires confirmation dialog)
- After save, card returns to view mode with "Edited" badge

### 4.8 Settings Pages

#### Profile Settings (`/settings`)

```
SettingsPage
├── PageHeader ("Settings")
├── SettingsNav (vertical tabs on desktop, horizontal tabs on mobile)
│   ├── Profile
│   ├── Voice Preferences (Pro+)
│   ├── Subscription
│   └── Team (Team tier)
└── SettingsContent
    └── ProfileForm
        ├── AvatarUpload (circular preview + upload button)
        ├── FormField (Display Name, Input)
        ├── FormField (Email, Input, disabled)
        ├── ThemeSelector (Radio group: Light / Dark / System)
        ├── NotificationToggle (Email notifications, Switch)
        └── Button (Save Changes, primary)
```

#### Voice Preferences (`/settings/voice`)

```
VoiceSettingsPage
├── SectionHeader ("Voice & Tone")
├── Description text
├── PresetSelector
│   └── RadioGroup (card-style radio buttons)
│       ├── Option: Professional
│       ├── Option: Casual
│       ├── Option: Witty
│       ├── Option: Inspirational
│       └── Option: Educational
├── CustomVoiceInput
│   ├── Label ("Describe your voice")
│   ├── Textarea (max 500 chars)
│   ├── CharacterCount
│   └── HelpText ("Describe how you want your content to sound")
├── VoicePreview (generated sample based on settings)
│   └── Card (example generated post with current voice applied)
└── Button (Save Voice Settings, primary)
```

- Gated behind Pro/Team tier. Free users see an upgrade prompt.
- Preset selector uses large card-style radio buttons with descriptions
- Custom voice description is optional, complements preset selection

#### Billing (`/settings/billing`)

```
BillingPage
├── CurrentPlan
│   ├── Card
│   │   ├── PlanName + Badge (Free / Pro / Team)
│   │   ├── PlanDetails (features list)
│   │   ├── Next billing date (if subscribed)
│   │   └── Button (Manage Subscription, outline) → Stripe Customer Portal
│   └── Button (Upgrade, primary) — if on free tier
├── PricingTable (if on free tier, shows upgrade options)
│   └── (Same PricingTable component as landing page)
└── BillingHistory
    └── Table
        ├── Column (Date)
        ├── Column (Description)
        ├── Column (Amount)
        └── Column (Status / Receipt link)
```

#### Team Management (`/settings/team`)

```
TeamPage
├── SectionHeader ("Team")
├── TeamMembers
│   ├── MemberList
│   │   └── MemberRow (avatar, name, email, role, remove button)
│   └── InviteForm
│       ├── Input (Email)
│       └── Button (Send Invite, primary)
├── PendingInvitations
│   └── InvitationRow (email, status, date, resend/cancel)
├── BrandVoiceProfiles
│   ├── ProfileList
│   │   └── VoiceProfileCard (name, description, tone keywords, edit/delete)
│   └── Button (Add Voice Profile, outline) — max 5
└── CreateVoiceProfileDialog
    ├── FormField (Name)
    ├── FormField (Description, Textarea)
    ├── FormField (Tone Keywords, tag input)
    ├── FormField (Example Content, Textarea)
    └── Button (Create, primary)
```

### 4.9 Pricing Page (`/pricing`)

**Layout:** Public page, full-width. Also embedded as a section on the landing page.

**Component Hierarchy:**

```
PricingPage
├── NavBar (same as landing)
├── SectionHeader
│   ├── Heading ("Simple, transparent pricing")
│   └── Description ("Start free. Upgrade when you're ready.")
├── BillingToggle (Monthly / Yearly — yearly with % discount badge)
├── PricingGrid (3 columns, centered)
│   ├── PricingCard (Free)
│   │   ├── PlanName
│   │   ├── Price ("$0/month")
│   │   ├── Description
│   │   ├── FeatureList (with check/x icons)
│   │   │   ├── ✓ 5 repurposes/month
│   │   │   ├── ✓ 3 platforms per repurpose
│   │   │   ├── ✓ Content library
│   │   │   ├── ✓ Export (Markdown/CSV)
│   │   │   ├── ✗ Voice customization
│   │   │   └── ✗ Team features
│   │   └── Button (Get Started, outline)
│   ├── PricingCard (Pro — highlighted "Most Popular")
│   │   ├── Badge ("Most Popular")
│   │   ├── PlanName
│   │   ├── Price ("$12/month")
│   │   ├── Description
│   │   ├── FeatureList
│   │   │   ├── ✓ Unlimited repurposes
│   │   │   ├── ✓ All 6 platforms
│   │   │   ├── ✓ Voice/tone customization
│   │   │   ├── ✓ Priority generation
│   │   │   ├── ✓ Content library
│   │   │   └── ✓ Export (Markdown/CSV)
│   │   └── Button (Upgrade to Pro, primary)
│   └── PricingCard (Team)
│       ├── PlanName
│       ├── Price ("$29/month")
│       ├── Description
│       ├── FeatureList
│       │   ├── ✓ Everything in Pro
│       │   ├── ✓ Up to 4 team members
│       │   ├── ✓ Shared content library
│       │   ├── ✓ 5 brand voice profiles
│       │   └── ✓ Team management
│       └── Button (Upgrade to Team, outline)
├── FAQSection
│   └── Accordion (shadcn) — 5-8 common questions
└── Footer
```

**Pro card highlight:** Uses `border-primary border-2` with a "Most Popular" badge overlapping the top edge. Slightly larger scale or `shadow-lg` to draw attention.

---

## 5. User Flows

### 5.1 First-Time User Activation Flow

```
[Landing Page]
    │
    ├─ Click "Get Started Free"
    ▼
[Register Page]
    │
    ├─ Option A: Click "Continue with Google"
    │   └─ Google OAuth popup → auto-create account → redirect to Dashboard
    │
    ├─ Option B: Fill email + password + name → Submit
    │   └─ "Check your email for verification" screen
    │       └─ Click verification link → redirect to Dashboard
    ▼
[Dashboard (Empty State)]
    │
    ├─ Prominent CTA: "Create your first repurpose"
    ▼
[New Repurpose — Step 1: Content Input]
    │
    ├─ Paste text OR paste URL → extract
    ├─ Click "Continue"
    ▼
[New Repurpose — Step 2: Platform Select]
    │
    ├─ Select 1-3 platforms (free tier)
    ├─ Click "Generate"
    ▼
[New Repurpose — Step 3: Generating]
    │
    ├─ Loading/streaming state (5-20 sec)
    ├─ Posts appear incrementally
    ▼
[New Repurpose — Step 3: Results]
    │
    ├─ Browse platform tabs
    ├─ Click "Copy" on a post → toast "Copied!"
    ├─ Paste into target platform
    ▼
[Value Delivered ✓]
    │
    ├─ User returns to Dashboard (now shows activity)
    └─ User explores Content Library
```

**Target:** First repurpose completed within 3 minutes of signup.

### 5.2 Edit & Export Flow

```
[Results View (any repurpose)]
    │
    ├─ Click "Edit" on a generated post
    ▼
[Inline Editor Active]
    │
    ├─ Modify text using Tiptap toolbar
    ├─ Character count updates in real-time
    │
    ├─ Option A: Click "Save" → card shows "Edited" badge → return to view mode
    ├─ Option B: Click "Discard" → return to view mode, no changes
    ▼
[Results View]
    │
    ├─ Click "Export All" → dropdown (Markdown | CSV)
    ├─ Select format → file downloads
    ▼
[File Downloaded ✓]
```

### 5.3 Content Library Search & Retrieval Flow

```
[Sidebar: Click "Content Library"]
    ▼
[Library Page (default: newest first)]
    │
    ├─ Type search query → debounced search (300ms)
    │   └─ Results update in-place with highlighted matches
    │
    ├─ Optionally add filters:
    │   ├─ Platform: select LinkedIn from dropdown
    │   └─ Date range: select last 2 weeks
    │
    ├─ Active filters shown as removable chips
    ▼
[Filtered Results]
    │
    ├─ Click on content item card
    ▼
[Content Detail Page]
    │
    ├─ View all generated posts by platform tab
    ├─ Copy, edit, regenerate, or export
    ▼
[Content Found ✓]
```

**Target:** Content found within 10 seconds.

### 5.4 Upgrade to Pro Flow

```
[Any Page — trigger: usage limit hit OR click upgrade CTA]
    │
    ├─ Trigger A: Free user clicks "Generate" at 5/5 usage
    │   └─ UpgradeDialog appears with plan comparison
    │
    ├─ Trigger B: Free user selects > 3 platforms
    │   └─ Inline upgrade prompt below platform selector
    │
    ├─ Trigger C: Free user clicks "Upgrade" from sidebar/dashboard/settings
    │   └─ Navigate to /settings/billing
    ▼
[Upgrade Prompt / Pricing Display]
    │
    ├─ Click "Upgrade to Pro" ($12/mo)
    ▼
[Stripe Checkout (external)]
    │
    ├─ Complete payment
    ▼
[Redirect back to RecastAI]
    │
    ├─ Toast: "Welcome to Pro! 🎉"
    ├─ Sidebar badge updates to "Pro"
    ├─ Usage shows "Unlimited"
    ├─ All 6 platforms unlocked
    ▼
[Pro Access Active ✓]
```

**Target:** Upgrade completed in < 60 seconds from intent.

### 5.5 URL Content Extraction Flow

```
[New Repurpose — Step 1]
    │
    ├─ Select "URL" tab
    ├─ Paste URL into input field
    ├─ Click "Extract" (or auto-extract on paste)
    ▼
[Extraction in Progress]
    │
    ├─ Loading spinner on input / extraction indicator
    ├─ (Completes within 10 seconds)
    │
    ├─ Success Path:
    │   ├─ Preview card shows: extracted title, excerpt (first 300 chars), char count
    │   ├─ "Edit Extracted Content" button → opens full text in editable textarea
    │   ├─ Click "Continue" → proceed to platform selection
    │
    ├─ Failure Path:
    │   ├─ Error message: "Unable to extract content from this URL"
    │   ├─ Suggestion: "Please paste the text directly instead"
    │   ├─ "Switch to Text" button → toggles to text tab (preserves any URL)
    ▼
[Continue to Step 2]
```

---

## 6. Interaction Patterns

### 6.1 Loading States

Every data-fetching view has defined loading patterns:

| Context | Pattern | Implementation |
|---|---|---|
| Page initial load | Skeleton loaders matching content layout | shadcn `Skeleton` components in same layout as real content |
| Dashboard stats | 4 skeleton cards in stats grid | `Skeleton` rectangles matching `StatCard` dimensions |
| Library list | 6 skeleton rows/cards | Skeleton `ContentLibraryItem` shapes |
| AI generation | Animated progress with streaming posts | Custom progress component + incremental post card reveals |
| Button action (copy, save) | Button shows spinner, disables | `Loader2` icon replaces label, `disabled` state |
| URL extraction | Input shows inline spinner | Spinner icon inside input field, right side |
| Navigation | Instant transition, data loads in-place | Next.js App Router handles transitions; skeleton on data boundary |

**Skeleton design:** Uses `bg-muted animate-pulse rounded-md` blocks. Skeleton shapes match the exact layout of the content they replace (same heights, widths, grid structure).

### 6.2 Error States

| Context | Error Type | UI Response |
|---|---|---|
| Form validation | Client-side | Inline error text below field in `text-destructive text-sm`. Field border turns `border-destructive`. Error icon inside field. |
| API request failure | Server error | Toast notification (error variant, 5s). Retry option in toast or inline. |
| AI generation failure | After retries | Full-width error card in results area: icon + message + "Try Again" button. Partial results shown if available. |
| URL extraction failure | Extraction error | Inline error below URL input + "Switch to text input" link. |
| Network offline | Connection lost | Top banner: "You're offline. Changes will sync when you reconnect." (sticky, dismissable when online) |
| Auth session expired | 401 response | Redirect to `/login` with toast: "Session expired. Please sign in again." Return URL preserved. |
| Rate limit hit | 429 response | Toast: "Too many requests. Please wait a moment." with countdown. |
| Usage limit reached | 402 response | UpgradeDialog with plan comparison and CTA. |

**Error message principles:**
- User-friendly language, never raw error codes or stack traces
- Actionable: always tell the user what they can do next
- Non-technical: "Something went wrong" > "500 Internal Server Error"
- Security-safe: No credential enumeration ("Invalid email or password", not "Password incorrect")

### 6.3 Empty States

| Context | Heading | Description | CTA |
|---|---|---|---|
| Dashboard (new user) | "Welcome to RecastAI" | "Transform your content into platform-perfect posts in seconds." | "Create Your First Repurpose" → `/repurpose/new` |
| Content Library (no items) | "Your library is empty" | "Generated content will appear here after your first repurpose." | "Create a Repurpose" → `/repurpose/new` |
| Library search (no results) | "No content found" | "Try different search terms or adjust your filters." | "Clear Filters" button |
| Usage chart (no data) | "No activity yet" | "Your repurposing activity will be charted here." | — |
| Team members (no invites) | "No team members yet" | "Invite up to 3 team members to share your content library." | "Invite Member" button |

**Empty state design:** Centered vertically in content area. Large muted icon (48px), heading, description, and optional CTA button. Soft `bg-muted/50 rounded-xl` container with dashed border.

### 6.4 Confirmation Patterns

| Action | Confirmation Type | Details |
|---|---|---|
| Delete content | Dialog | "Delete this content and all 12 generated posts? This can be recovered within 30 days." + Cancel/Delete buttons |
| Discard edits | Dialog | "Discard unsaved changes?" + Discard/Keep Editing buttons |
| Revert to original | Dialog | "Revert to the original AI-generated version? Your edits will be lost." + Cancel/Revert buttons |
| Sign out | None | Immediate action (low consequence) |
| Remove team member | Dialog | "Remove [Name] from team? They'll lose access to shared content." + Cancel/Remove buttons |
| Upgrade plan | Redirect | Direct redirect to Stripe Checkout (no intermediary confirmation — Stripe handles it) |

### 6.5 Copy to Clipboard

- Click "Copy" button on any post card
- Button briefly changes to checkmark + "Copied!" (2 seconds)
- Sonner toast: "Copied to clipboard" (success, 3 seconds)
- Text copied includes platform formatting (thread separators for X, line breaks preserved)
- Fallback for older browsers: Select-all in a hidden textarea

### 6.6 Keyboard Shortcuts

| Shortcut | Action | Context |
|---|---|---|
| `Cmd/Ctrl + Enter` | Submit/Generate | Content input, forms |
| `Cmd/Ctrl + K` | Open search | Global (library search) |
| `Escape` | Close dialog/sheet/editor | Dialogs, sheets, inline editor |
| `Tab` | Navigate between interactive elements | Global |
| `Enter/Space` | Activate element | Buttons, toggles, checkboxes |

---

## 7. Accessibility

### 7.1 WCAG 2.1 AA Compliance

RecastAI targets **WCAG 2.1 Level AA** compliance per NFR-5.1. shadcn/ui (built on Radix UI) provides accessible primitives by default.

### 7.2 Color & Contrast

- All text meets **4.5:1 contrast ratio** against its background (AA for normal text)
- Large text (≥ 18px bold or ≥ 24px) meets **3:1 ratio** (AA for large text)
- Interactive elements (buttons, links) meet **3:1 ratio** against adjacent colors
- Color is **never the sole indicator** of state — always paired with icons, text, or patterns
  - Error: red color + error icon + error text
  - Success: green color + checkmark icon + success text
  - Platform selection: checkmark overlay + border change (not just color)
- Focus ring: `ring-2 ring-ring ring-offset-2` — visible on all interactive elements in both themes

### 7.3 Keyboard Navigation

- **Full keyboard operability** for all interactive elements (Per NFR-5.2)
- Tab order follows visual reading order (left-to-right, top-to-bottom)
- Focus trap in modals/dialogs (Radix handles this automatically)
- Skip-to-content link at top of every page (visually hidden until focused)
- Platform selector cards are keyboard-navigable via arrow keys + Space to toggle
- Tiptap editor supports standard rich text keyboard shortcuts (Cmd+B for bold, etc.)
- Sidebar navigation navigable via Tab + Enter/Space

### 7.4 Screen Reader Support

- All interactive elements have appropriate ARIA labels (Per NFR-5.3)
- Images/icons: Decorative icons use `aria-hidden="true"`, meaningful icons have `aria-label`
- Form fields: All inputs have associated `<label>` elements (visible or `sr-only`)
- Error messages: Linked to inputs via `aria-describedby`, announced with `aria-live="polite"`
- Loading states: `aria-busy="true"` on loading containers, screen reader text announces loading
- Platform selector: `role="checkbox"` for each platform toggle, `aria-checked` state
- Tabs: Radix `Tabs` provides full ARIA tab pattern (`role="tablist"`, `role="tab"`, `role="tabpanel"`)
- Toasts: `role="status"` for success, `role="alert"` for errors
- Progress bars: `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
- Dynamic content updates: `aria-live="polite"` regions for streaming AI output, search results

### 7.5 Motion & Reduced Motion

- All animations respect `prefers-reduced-motion: reduce`
- When reduced motion is preferred: transitions become instant, skeleton pulse is replaced with static gray, streaming posts appear without animation
- Implementation: Tailwind's `motion-reduce:` variant applied to all animated elements

### 7.6 Touch Targets

- Minimum touch target size: 44x44px (per WCAG 2.5.5)
- Buttons: Minimum `h-10` (40px) with padding ensuring 44px touch area
- Icon-only buttons: `h-10 w-10` (40px) minimum, with adequate spacing
- Mobile navigation items: `min-h-[44px]` with `py-3` padding

---

## 8. Responsive Design

### 8.1 Breakpoint System

Using Tailwind's default breakpoints, mobile-first approach.

| Breakpoint | Prefix | Min Width | Typical Devices |
|---|---|---|---|
| Default | (none) | 0px | Small phones |
| `sm` | `sm:` | 640px | Large phones (landscape) |
| `md` | `md:` | 768px | Tablets (portrait) |
| `lg` | `lg:` | 1024px | Tablets (landscape), small laptops |
| `xl` | `xl:` | 1280px | Laptops, desktops |
| `2xl` | `2xl:` | 1536px | Large desktops |

### 8.2 Mobile-First Approach

All styles are written **mobile-first**, adding complexity at larger breakpoints.

**Core principles:**
- Base styles target the smallest viewport (≥ 375px per NFR-6.2)
- Progressive enhancement: features and layout complexity increase with viewport size
- Touch-friendly defaults: large tap targets, appropriate spacing
- No horizontal scrolling at any breakpoint

### 8.3 Layout Adaptations

#### Application Shell

| Viewport | Sidebar | Main Content | Page Padding |
|---|---|---|---|
| Mobile (< 768px) | Hidden; hamburger menu opens Sheet overlay | Full width | `px-4` |
| Tablet (768–1023px) | Collapsed (64px, icons only) | Fills remaining width | `px-6` |
| Desktop (≥ 1024px) | Expanded (240px, full labels) | Fills remaining width | `px-8` |

#### Stats Grid (Dashboard)

| Viewport | Columns | Card Size |
|---|---|---|
| Mobile | 1 column (stacked) | Full width |
| Tablet | 2 columns | Half width |
| Desktop | 4 columns | Quarter width |

Implementation: `grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4`

#### Content Library Grid

| Viewport | Grid View | List View |
|---|---|---|
| Mobile | 1 column cards | Simplified rows (truncated) |
| Tablet | 2 column cards | Full rows |
| Desktop | 3 column cards | Full rows with all columns |

Implementation: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`

#### Platform Selector

| Viewport | Layout |
|---|---|
| Mobile | 2 columns |
| Tablet | 3 columns |
| Desktop | 6 columns (single row) |

Implementation: `grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3`

#### Pricing Cards

| Viewport | Layout |
|---|---|
| Mobile | Stacked (1 column), Pro card on top |
| Tablet+ | 3 columns side by side |

Implementation: `grid grid-cols-1 md:grid-cols-3 gap-6`

#### New Repurpose Flow

| Viewport | Layout |
|---|---|
| Mobile | Full-width steps, stacked actions |
| Tablet+ | Centered content area (`max-w-3xl mx-auto`) |

#### Post Editor

| Viewport | Toolbar | Layout |
|---|---|---|
| Mobile | Horizontal scroll or wrapped, icon-only | Full-width card |
| Desktop | Single row, icon + label option | Card within content area |

#### Auth Pages

| Viewport | Layout |
|---|---|
| Mobile | Single column, card centered |
| Tablet+ | Two columns (brand panel + form panel) |

### 8.4 Responsive Typography

| Element | Mobile | Desktop |
|---|---|---|
| Display (hero) | `text-3xl` (30px) | `text-4xl md:text-5xl lg:text-6xl` |
| H1 (page title) | `text-2xl` (24px) | `text-3xl` (30px) |
| H2 (section) | `text-xl` (20px) | `text-2xl` (24px) |
| Body | `text-base` (16px) | `text-base` (16px) — no change |

### 8.5 Mobile-Specific Patterns

- **Bottom action bar:** On mobile repurpose results, a sticky bottom bar with "Copy" and "Next Post" actions
- **Swipe between platform tabs:** On mobile, platform tabs in results view support horizontal swipe navigation
- **Pull-to-refresh:** On library page (if using infinite scroll variant)
- **Floating Action Button:** On mobile library view, a floating "+" button for new repurpose (bottom-right, `fixed bottom-6 right-6`)
- **Collapsible filters:** On mobile library, filters collapse into a Sheet overlay triggered by a "Filters" button

---

## 9. Dark Mode

### 9.1 Implementation

Using **next-themes** for theme switching (per TechStack.md). Three modes: Light, Dark, System.

- Theme preference stored in `user_preferences.theme` (synced to database)
- `next-themes` applies `class="dark"` to `<html>` element
- All colors defined as CSS custom properties in `globals.css` under `:root` (light) and `.dark` (dark)
- Tailwind's `darkMode: 'class'` configuration

### 9.2 Dark Mode Color Adjustments

| Principle | Light Mode | Dark Mode |
|---|---|---|
| Background | White (`hsl(0 0% 100%)`) | Near-black (`hsl(224 71% 4%)`) |
| Cards | White | Slightly lighter than bg (`hsl(224 50% 8%)`) |
| Borders | Light gray | Dark gray (more prominent for separation) |
| Text (primary) | Near-black | Near-white |
| Text (secondary) | Medium gray | Light gray |
| Primary actions | Saturated primary | Slightly lighter + more saturated |
| Shadows | Subtle shadows | Reduced/removed; rely on borders |
| Success/Error colors | Standard | Slight brightness boost for readability |
| Platform colors | Standard | Slight brightness boost |

### 9.3 Dark Mode Guidelines

- Never use pure black (`#000`) for backgrounds — use very dark blue/gray for depth
- Never use pure white (`#FFF`) for text on dark backgrounds — use off-white (`hsl(210 20% 98%)`)
- Reduce shadow usage in dark mode; prefer border-based separation
- Increase spacing slightly in dark mode for visual breathing room (optional, per design testing)
- Ensure all images/illustrations use transparent backgrounds or have dark mode variants
- Platform icon colors may be adjusted for contrast on dark backgrounds
- Charts (Recharts) use a dark-mode-aware color palette
- Code/mono text uses `bg-muted` background which adapts automatically

### 9.4 Theme Toggle

- Located in: sidebar user dropdown menu + settings page
- Options: Light ☀️ / Dark 🌙 / System 💻
- Toggle type: Radio group (in settings), icon button cycle (in user menu)
- Transition: `transition-colors duration-200` on body for smooth theme switch
- Respects `prefers-color-scheme` when set to System

---

## 10. Animation & Transitions

### 10.1 Core Principles

- **Purposeful:** Animations convey meaning (state change, attention, feedback) — never purely decorative
- **Subtle:** Duration 150–300ms for UI transitions, max 500ms for entrance animations
- **Performant:** Use `transform` and `opacity` only (GPU-composited properties). No `width`, `height`, `top/left` animations.
- **Respectful:** All animations honor `prefers-reduced-motion: reduce`

### 10.2 Transition Specifications

| Element | Trigger | Animation | Duration | Easing |
|---|---|---|---|---|
| Page transitions | Route change | Fade in | 200ms | `ease-out` |
| Sidebar collapse | Toggle click | Width slide | 200ms | `ease-in-out` |
| Sidebar mobile | Hamburger click | Slide from left + overlay fade | 300ms | `ease-out` |
| Dialog open | Trigger click | Fade + scale (95% → 100%) | 200ms | `ease-out` |
| Dialog close | Close/Escape | Fade + scale (100% → 95%) | 150ms | `ease-in` |
| Sheet (mobile) | Open/close | Slide from edge + overlay fade | 300ms | `ease-out` |
| Dropdown menu | Open | Fade + slide down (4px) | 150ms | `ease-out` |
| Toast enter | Trigger | Slide up from bottom + fade | 300ms | `spring` |
| Toast exit | Timeout/dismiss | Slide right + fade | 200ms | `ease-in` |
| Button hover | Mouse enter | Background color change | 150ms | `ease-in-out` |
| Button press | Mouse down | Scale to 0.98 | 100ms | `ease-in` |
| Card hover | Mouse enter | Shadow increase + subtle border change | 200ms | `ease-out` |
| Tab switch | Tab click | Underline slide + content fade | 200ms | `ease-in-out` |
| Skeleton pulse | Constant | Opacity 50% → 100% → 50% | 1500ms | `ease-in-out` (loop) |
| Focus ring | Tab focus | Ring appears | 0ms | Instant |

### 10.3 Repurpose-Specific Animations

| Element | Animation | Duration | Details |
|---|---|---|---|
| Step transition | Current step slides out left, new step slides in from right | 300ms | Step indicator also animates (circle fills) |
| Generation progress | Gradient shimmer across progress area | Continuous | Subtle left-to-right gradient sweep |
| Streaming post appear | Fade in + slide up (12px) | 400ms | Each post card staggers by 100ms delay |
| Post card expand (edit) | Height expansion with content fade | 250ms | Smooth height auto with `grid-template-rows` trick |
| Copy button feedback | Icon swap (clipboard → checkmark) | 150ms crossfade | Checkmark stays for 2 seconds then swaps back |
| Character count warning | Color transition + subtle scale bounce | 200ms | Count text scales to 1.05 then back to 1.0 |
| Platform select toggle | Border + background color transition + checkmark fade | 150ms | Checkmark scales in from 0 to 1 |

### 10.4 Loading Animation (Generation)

During AI generation, a special loading state provides feedback:

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│       [Animated RecastAI logo / spinner]                │
│                                                         │
│       Generating your X/Twitter posts...                │
│       ───────────████░░░░░░░░────────                   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │  [Post 1 — just appeared, subtle glow]          │    │
│  │  "Here's what I learned building..."            │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │  [Post 2 — appearing now, fade in]              │    │
│  │  ░░░░░░░░░░░░░░░░░░░░░░░░░                     │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
│  ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐    │
│  │  [Skeleton placeholder for upcoming posts]      │    │
│  └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

- Status text rotates through platform names as generation progresses
- Posts stream in and appear with staggered animation
- A skeleton placeholder shows where the next post will appear
- Completed posts are fully interactive (copyable, scrollable) even while generation continues
- Total generation: < 30 seconds (per NFR-1.2), first post visible in < 8 seconds (per NFR-1.3)

### 10.5 Reduced Motion Behavior

When `prefers-reduced-motion: reduce` is active:

- All transitions become instant (0ms duration)
- Skeleton pulse replaced with static `bg-muted` fill
- Streaming posts appear instantly without slide/fade
- Page transitions are instant cuts
- Toasts appear/disappear without slide
- Hover effects still apply (non-motion, color changes only)

Implementation: `motion-reduce:transition-none motion-reduce:animate-none` Tailwind utilities.

---

## 11. Reconciliation Notes

### PRD ↔ UI/UX Alignment

| PRD Reference | UI/UX Coverage | Status |
|---|---|---|
| Journey 1: First-Time Repurpose | Section 5.1: Full activation flow documented | ✅ Covered |
| Journey 2: Refine & Export | Section 5.2: Edit & Export flow documented | ✅ Covered |
| Journey 3: Content Library Retrieval | Section 5.3: Library search flow documented | ✅ Covered |
| Journey 4: Upgrade to Pro | Section 5.4: Upgrade flow documented | ✅ Covered |
| Journey 5: URL-Based Input | Section 5.5: URL extraction flow documented | ✅ Covered |
| US-1.1–1.5: Authentication | Section 4.2: Auth pages with all flows | ✅ Covered |
| US-2.1–2.2: Content Input | Section 4.4: ContentInputArea component | ✅ Covered |
| US-3.1–3.3: AI Engine | Section 4.4: Generation and results view | ✅ Covered |
| US-4.1–4.2: Content Editor | Section 4.7: Post Editor specification | ✅ Covered |
| US-5.1–5.3: Content Library | Section 4.5–4.6: Library pages | ✅ Covered |
| US-6.1–6.2: Export & Sharing | Section 6.5: Copy + export patterns | ✅ Covered |
| US-7.1: Usage Dashboard | Section 4.3: Dashboard with stats/charts | ✅ Covered |
| US-8.1–8.2: Team Features | Section 4.8: Team management page | ✅ Covered |
| NFR-5.1–5.3: Accessibility | Section 7: Full WCAG 2.1 AA coverage | ✅ Covered |
| NFR-6.1–6.2: Browser & Mobile | Section 8: Responsive design system | ✅ Covered |

### TechStack ↔ UI/UX Alignment

| Tech Choice | UI/UX Design Support | Status |
|---|---|---|
| shadcn/ui (Radix UI) | All components built on shadcn/ui primitives | ✅ Aligned |
| Tailwind CSS 3.4 | Color system, spacing, typography all use Tailwind tokens | ✅ Aligned |
| Tiptap 2.6 | Post editor specification uses Tiptap | ✅ Aligned |
| Recharts | Dashboard chart specified as Recharts BarChart | ✅ Aligned |
| Lucide React | All icons specified as Lucide | ✅ Aligned |
| next-themes | Dark mode implementation via next-themes | ✅ Aligned |
| Sonner | Toast system uses Sonner | ✅ Aligned |
| Zustand | UI state (platform selection, editor state) managed by Zustand | ✅ Aligned |
| Next.js App Router | Route map follows App Router file conventions | ✅ Aligned |
| SSE Streaming | Generation UI supports streaming incremental display | ✅ Aligned |

### Data Model ↔ UI/UX Alignment

| Data Entity | UI Component | Status |
|---|---|---|
| `profiles` | Settings/Profile page, sidebar user menu | ✅ Aligned |
| `source_contents` | Library items, content detail page | ✅ Aligned |
| `generated_posts` | GeneratedPostCard, editor, platform tabs | ✅ Aligned |
| `usage_records` | Dashboard stats, usage indicator, charts | ✅ Aligned |
| `user_preferences` | Settings (theme, default platforms, notifications) | ✅ Aligned |
| `teams` | Team management page | ✅ Aligned |
| `team_invitations` | Team invite flow, pending invitations list | ✅ Aligned |
| `brand_voice_profiles` | Voice preferences, team brand voices | ✅ Aligned |

### Open Design Decisions

| Item | Options | Recommendation | Notes |
|---|---|---|---|
| Library view default | Grid vs. List | Grid | More visual, shows platform badges well; let user toggle to list |
| Results layout | Tabs vs. Accordion vs. Columns | Tabs | Most scalable for 6 platforms; familiar pattern; mobile-friendly |
| Content input step flow | Multi-page vs. Single-page stepped | Single-page stepped | Faster perceived flow; no page loads; easy back/forward |
| Sidebar default (desktop) | Expanded vs. Collapsed | Expanded | Shows navigation labels; can be collapsed by user preference |
| Generation loading | Skeleton + stream vs. Full spinner | Skeleton + stream | Aligns with SSE streaming requirement; reduces perceived wait |

---

## Change Log

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0 | 2026-02-24 | UI/UX Agent | Initial UI/UX specification |
