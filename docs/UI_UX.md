# UI/UX Specification: TaskPilot

**Version:** 1.0  
**Date:** February 24, 2026  
**Status:** Draft  
**Design System:** Tailwind CSS + shadcn/ui

---

## Table of Contents

1. [Design System](#design-system)
2. [Design Tokens](#design-tokens)
3. [Component Library](#component-library)
4. [Screen Specifications](#screen-specifications)
5. [User Flows](#user-flows)
6. [Responsive Design](#responsive-design)
7. [Accessibility](#accessibility)
8. [Motion & Animation](#motion--animation)
9. [Reconciliation Notes](#reconciliation-notes)

---

## Design System

### Design Philosophy

TaskPilot использует **минималистичный современный подход** с акцентом на:
- **Clarity** — чистые интерфейсы без визуального шума
- **Efficiency** — минимум кликов до результата
- **Feedback** — постоянная обратная связь о состоянии системы
- **Delight** — микроанимации и приятные детали

### Framework & Tools

| Component | Technology |
|-----------|------------|
| CSS Framework | Tailwind CSS 3.4+ |
| Component Library | shadcn/ui |
| Icons | Lucide Icons |
| Fonts | Inter (UI), JetBrains Mono (code) |
| Theme | Dark/Light mode support |

### Grid System

```
┌────────────────────────────────────────────────────────────┐
│  Container: max-w-7xl (1280px) mx-auto px-4 sm:px-6 lg:px-8│
├────────────────────────────────────────────────────────────┤
│  12-column grid: grid-cols-12 gap-4 md:gap-6 lg:gap-8      │
└────────────────────────────────────────────────────────────┘
```

---

## Design Tokens

### Color Palette

#### Brand Colors

| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| `--primary` | `hsl(222 47% 11%)` | `hsl(210 40% 98%)` | Primary actions, links |
| `--primary-foreground` | `hsl(210 40% 98%)` | `hsl(222 47% 11%)` | Text on primary |
| `--accent` | `hsl(210 100% 50%)` | `hsl(210 100% 60%)` | Highlights, focus states |
| `--accent-foreground` | `hsl(0 0% 100%)` | `hsl(0 0% 100%)` | Text on accent |

#### Semantic Colors

| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| `--background` | `hsl(0 0% 100%)` | `hsl(224 71% 4%)` | Page background |
| `--foreground` | `hsl(222 47% 11%)` | `hsl(210 40% 98%)` | Primary text |
| `--card` | `hsl(0 0% 100%)` | `hsl(224 71% 4%)` | Card backgrounds |
| `--card-foreground` | `hsl(222 47% 11%)` | `hsl(210 40% 98%)` | Card text |
| `--muted` | `hsl(210 40% 96%)` | `hsl(215 28% 17%)` | Muted backgrounds |
| `--muted-foreground` | `hsl(215 16% 47%)` | `hsl(217 10% 65%)` | Secondary text |
| `--border` | `hsl(214 32% 91%)` | `hsl(215 28% 17%)` | Borders |
| `--input` | `hsl(214 32% 91%)` | `hsl(215 28% 17%)` | Input borders |
| `--ring` | `hsl(210 100% 50%)` | `hsl(210 100% 60%)` | Focus rings |

#### Status Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--success` | `hsl(142 76% 36%)` | Success states, completion |
| `--success-foreground` | `hsl(0 0% 100%)` | Text on success |
| `--warning` | `hsl(38 92% 50%)` | Warnings, pending states |
| `--warning-foreground` | `hsl(0 0% 0%)` | Text on warning |
| `--destructive` | `hsl(0 84% 60%)` | Errors, destructive actions |
| `--destructive-foreground` | `hsl(0 0% 100%)` | Text on destructive |
| `--info` | `hsl(199 89% 48%)` | Informational messages |
| `--info-foreground` | `hsl(0 0% 100%)` | Text on info |

### Typography

#### Font Stack

```css
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

#### Type Scale

| Token | Size | Line Height | Weight | Usage |
|-------|------|-------------|--------|-------|
| `text-xs` | 12px | 16px | 400 | Captions, labels |
| `text-sm` | 14px | 20px | 400 | Secondary text |
| `text-base` | 16px | 24px | 400 | Body text |
| `text-lg` | 18px | 28px | 500 | Large body |
| `text-xl` | 20px | 28px | 600 | Subheadings |
| `text-2xl` | 24px | 32px | 600 | Section titles |
| `text-3xl` | 30px | 36px | 700 | Page titles |
| `text-4xl` | 36px | 40px | 700 | Hero headings |
| `text-5xl` | 48px | 48px | 800 | Display headings |

#### Font Weights

| Token | Value | Usage |
|-------|-------|-------|
| `font-normal` | 400 | Body text |
| `font-medium` | 500 | Emphasis, buttons |
| `font-semibold` | 600 | Headings |
| `font-bold` | 700 | Strong emphasis |
| `font-extrabold` | 800 | Hero text |

### Spacing Scale

```css
--space-0: 0px;
--space-1: 4px;    /* 0.25rem */
--space-2: 8px;    /* 0.5rem */
--space-3: 12px;   /* 0.75rem */
--space-4: 16px;   /* 1rem */
--space-5: 20px;   /* 1.25rem */
--space-6: 24px;   /* 1.5rem */
--space-8: 32px;   /* 2rem */
--space-10: 40px;  /* 2.5rem */
--space-12: 48px;  /* 3rem */
--space-16: 64px;  /* 4rem */
--space-20: 80px;  /* 5rem */
--space-24: 96px;  /* 6rem */
```

### Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `rounded-sm` | 4px | Small elements, tags |
| `rounded` | 6px | Buttons, inputs |
| `rounded-md` | 8px | Cards, modals |
| `rounded-lg` | 12px | Large cards |
| `rounded-xl` | 16px | Feature cards |
| `rounded-2xl` | 24px | Hero sections |
| `rounded-full` | 9999px | Avatars, pills |

### Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Subtle depth |
| `shadow` | `0 1px 3px rgba(0,0,0,0.1)` | Default cards |
| `shadow-md` | `0 4px 6px rgba(0,0,0,0.1)` | Elevated cards |
| `shadow-lg` | `0 10px 15px rgba(0,0,0,0.1)` | Dropdowns, popovers |
| `shadow-xl` | `0 20px 25px rgba(0,0,0,0.1)` | Modals |

### Z-Index Scale

| Token | Value | Usage |
|-------|-------|-------|
| `z-0` | 0 | Base layer |
| `z-10` | 10 | Sticky elements |
| `z-20` | 20 | Dropdowns |
| `z-30` | 30 | Fixed navigation |
| `z-40` | 40 | Modals backdrop |
| `z-50` | 50 | Modals content |
| `z-60` | 60 | Toast notifications |

---

## Component Library

### Atomic Components

#### Button

**Variants:**

| Variant | Background | Text | Border | Usage |
|---------|------------|------|--------|-------|
| `default` | primary | primary-foreground | none | Primary actions |
| `secondary` | secondary | secondary-foreground | none | Secondary actions |
| `outline` | transparent | foreground | border | Tertiary actions |
| `ghost` | transparent | foreground | none | Subtle actions |
| `destructive` | destructive | white | none | Delete, cancel subscription |
| `link` | transparent | primary | none | Inline links |

**Sizes:**

| Size | Padding | Height | Font Size |
|------|---------|--------|-----------|
| `sm` | px-3 | h-8 | text-xs |
| `default` | px-4 | h-10 | text-sm |
| `lg` | px-6 | h-12 | text-base |
| `icon` | p-2 | h-10 w-10 | - |

**States:**
- `default` — Normal appearance
- `hover` — Slight brightness increase, cursor pointer
- `active/pressed` — Scale down to 0.98
- `focus` — Ring-2 ring-offset-2 ring-ring
- `disabled` — Opacity 50%, cursor not-allowed
- `loading` — Spinner icon, disabled interaction

**Example Structure:**
```
┌─────────────────────────────┐
│  [Icon]  Button Label  [→]  │
└─────────────────────────────┘
     ↑           ↑         ↑
  Optional    Required  Optional
  Leading               Trailing
```

---

#### Input

**Variants:**

| Variant | Description |
|---------|-------------|
| `default` | Standard text input |
| `textarea` | Multi-line input (auto-resize) |
| `search` | With search icon prefix |
| `password` | With visibility toggle |

**States:**
- `default` — Border-input, background transparent
- `hover` — Border darkens slightly
- `focus` — Ring-2 ring-ring, border-ring
- `error` — Border-destructive, ring-destructive
- `disabled` — Opacity 50%, bg-muted

**Anatomy:**
```
┌─────────────────────────────────────────┐
│ Label *                                 │
├─────────────────────────────────────────┤
│ ┌─────────────────────────────────────┐ │
│ │ [🔍] Placeholder text...        [×] │ │
│ └─────────────────────────────────────┘ │
│ Helper text or error message            │
└─────────────────────────────────────────┘
```

**Sizes:**

| Size | Height | Padding | Font Size |
|------|--------|---------|-----------|
| `sm` | h-8 | px-3 | text-xs |
| `default` | h-10 | px-4 | text-sm |
| `lg` | h-12 | px-4 | text-base |

---

#### Card

**Anatomy:**
```
┌─────────────────────────────────────────┐
│ Card Header                             │
│ ├─ Title                                │
│ └─ Description (optional)               │
├─────────────────────────────────────────┤
│ Card Content                            │
│                                         │
│   [Main content area]                   │
│                                         │
├─────────────────────────────────────────┤
│ Card Footer (optional)                  │
│   [Actions]                             │
└─────────────────────────────────────────┘
```

**Variants:**

| Variant | Background | Border | Shadow |
|---------|------------|--------|--------|
| `default` | card | border | shadow |
| `elevated` | card | none | shadow-md |
| `outline` | transparent | border | none |
| `interactive` | card | border | shadow → shadow-md on hover |

---

#### Badge

**Variants:**

| Variant | Background | Text |
|---------|------------|------|
| `default` | primary | primary-foreground |
| `secondary` | secondary | secondary-foreground |
| `outline` | transparent | foreground + border |
| `success` | success/10 | success |
| `warning` | warning/10 | warning |
| `destructive` | destructive/10 | destructive |

**Sizes:**

| Size | Padding | Font |
|------|---------|------|
| `sm` | px-2 py-0.5 | text-xs |
| `default` | px-2.5 py-0.5 | text-xs |
| `lg` | px-3 py-1 | text-sm |

---

#### Avatar

**Sizes:**

| Size | Dimensions | Font Size |
|------|------------|-----------|
| `xs` | 24×24 | text-xs |
| `sm` | 32×32 | text-sm |
| `default` | 40×40 | text-base |
| `lg` | 48×48 | text-lg |
| `xl` | 64×64 | text-xl |

**Fallback:** Initials from user name, gradient background based on user ID hash

---

#### Progress Bar

**Anatomy:**
```
┌─────────────────────────────────────────┐
│ Progress Label                  45%     │
│ ┌─────────────────────────────────────┐ │
│ │████████████████░░░░░░░░░░░░░░░░░░░░░│ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

**Variants:**
- `default` — Primary color fill
- `success` — Green fill for completed
- `warning` — Yellow fill for attention
- `indeterminate` — Animated shimmer for unknown duration

---

#### Toast / Notification

**Variants:**

| Variant | Icon | Border Color |
|---------|------|--------------|
| `default` | Info | muted |
| `success` | CheckCircle | success |
| `warning` | AlertTriangle | warning |
| `error` | XCircle | destructive |

**Anatomy:**
```
┌────────────────────────────────────────────┐
│ [✓] Task completed successfully       [×]  │
│     Your research results are ready        │
└────────────────────────────────────────────┘
```

**Behavior:**
- Position: Bottom-right, stacked
- Duration: 5 seconds (default), persistent for errors
- Animation: Slide in from right, fade out

---

### Composite Components

#### Task Input Card

**Purpose:** Primary component for task delegation

**Anatomy:**
```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                                                        │ │
│  │  Describe your task in natural language...            │ │
│  │                                                        │ │
│  │  Example: "Research top 10 CRM tools for small        │ │
│  │  businesses and create a comparison table"            │ │
│  │                                                        │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌──────────────┐  📎 Attach KB  │  0/2000        [Submit →]│
│  │ Use Template │                                            │
│  └──────────────┘                                            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**States:**
- `empty` — Placeholder text visible, example prompts
- `typing` — Character counter active
- `valid` — Submit button enabled
- `submitting` — Loading spinner, input disabled

---

#### Task Progress Card

**Purpose:** Real-time task execution feedback

**Anatomy:**
```
┌─────────────────────────────────────────────────────────────┐
│  ┌──────┐                                                   │
│  │ ⚙️   │  CRM Tools Research                    ⏱ 2:34    │
│  └──────┘  Executing...                                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ████████████████████░░░░░░░░░░░░░  45%                     │
│                                                              │
│  ✓ Identify CRM categories                                  │
│  ✓ Research market leaders                                  │
│  → Compare pricing models                     ← Current     │
│  ○ Compile recommendations                                  │
│  ○ Generate comparison table                                │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│  [Pause]                                          [Cancel]  │
└─────────────────────────────────────────────────────────────┘
```

**Subtask States:**
- `✓` Completed — Green checkmark, text-muted
- `→` In Progress — Primary color, pulsing indicator
- `○` Pending — Muted circle

---

#### Template Card

**Purpose:** Display template in grid/list view

**Anatomy:**
```
┌─────────────────────────────────────┐
│  [📊]                     [★ 4.8]  │
│                                     │
│  Market Research                    │
│  Comprehensive market analysis      │
│  for any industry or topic         │
│                                     │
│  Research · 3-5 min                 │
│                                     │
│  [Use Template]                     │
└─────────────────────────────────────┘
```

**Interaction:**
- Hover: Elevation increase, slight scale (1.02)
- Click: Navigate to template usage screen

---

#### Knowledge Base Item

**Anatomy:**
```
┌─────────────────────────────────────────────────────────────┐
│  [📄]  brand-guidelines.pdf                    [⋮]         │
│        PDF · 245 KB · Uploaded Feb 20                       │
│        ████████████████████████████████ Processing...       │
└─────────────────────────────────────────────────────────────┘
```

**Status Indicators:**
- `processing` — Animated progress bar
- `ready` — Green checkmark badge
- `error` — Red warning with retry option

---

#### Pricing Card

**Anatomy:**
```
┌─────────────────────────────────────┐
│  PRO                    POPULAR    │
│                                     │
│  $29                                │
│  /month                             │
│                                     │
│  ✓ 50 tasks/month                  │
│  ✓ All templates                   │
│  ✓ 1GB knowledge base              │
│  ✓ PDF export                      │
│  ✓ Priority support                │
│                                     │
│  [Get Started]                      │
└─────────────────────────────────────┘
```

**Variants:**
- `default` — Standard appearance
- `featured` — Border-primary, "POPULAR" badge
- `current` — Muted with "Current Plan" label

---

## Screen Specifications

### 1. Landing Page

**URL:** `taskpilot.com`

**Layout:**
```
┌─────────────────────────────────────────────────────────────────────┐
│  HEADER                                                              │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │ [Logo]         Features  Pricing  Templates    [Login] [Sign Up]││
│  └─────────────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────────────┤
│  HERO SECTION                                                        │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │                                                                  ││
│  │     Your AI Business Assistant                                   ││
│  │     Delegate tasks. Get results. Save hours.                     ││
│  │                                                                  ││
│  │     [Try Free — No Credit Card] [Watch Demo]                     ││
│  │                                                                  ││
│  │     ┌─────────────────────────────────────────────────────────┐ ││
│  │     │ Research my competitors in the fitness app market...   │ ││
│  │     └─────────────────────────────────────────────────────────┘ ││
│  │                                                                  ││
│  └─────────────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────────────┤
│  SOCIAL PROOF                                                        │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │  "Saved me 10+ hours/week"   [Avatar] Sarah, Freelancer         ││
│  │  ★★★★★  Trusted by 1,000+ professionals                         ││
│  └─────────────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────────────┤
│  HOW IT WORKS                                                        │
│  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐    │
│  │ 1. Describe      │ │ 2. Watch         │ │ 3. Get Results   │    │
│  │ Tell AI what     │ │ AI breaks down   │ │ Export ready-    │    │
│  │ you need         │ │ and executes     │ │ to-use outputs   │    │
│  └──────────────────┘ └──────────────────┘ └──────────────────┘    │
├─────────────────────────────────────────────────────────────────────┤
│  USE CASES TABS                                                      │
│  [Research] [Content] [Outreach] [Analysis]                          │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │ Example task and animated result preview                        ││
│  └─────────────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────────────┤
│  PRICING SECTION                                                     │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐                 │
│  │ FREE         │ │ PRO          │ │ BUSINESS     │                 │
│  │ $0/mo        │ │ $29/mo       │ │ $99/mo       │                 │
│  │ 5 tasks      │ │ 50 tasks     │ │ Unlimited    │                 │
│  │ [Start Free] │ │ [Get Pro]    │ │ [Contact]    │                 │
│  └──────────────┘ └──────────────┘ └──────────────┘                 │
├─────────────────────────────────────────────────────────────────────┤
│  TESTIMONIALS                                                        │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │ Carousel of 3 testimonial cards                                 ││
│  └─────────────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────────────┤
│  FAQ ACCORDION                                                       │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │ + What types of tasks can I delegate?                           ││
│  │ + How long does a task take?                                    ││
│  │ + Is my data secure?                                            ││
│  │ + Can I cancel anytime?                                         ││
│  └─────────────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────────────┤
│  CTA BANNER                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │     Ready to save 10+ hours every week?                         ││
│  │     [Start Free Trial]                                          ││
│  └─────────────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────────────┤
│  FOOTER                                                              │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │ [Logo]  Product | Company | Legal | Social Links               ││
│  │ © 2026 TaskPilot. All rights reserved.                          ││
│  └─────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────┘
```

---

### 2. Authentication Screens

#### 2.1 Login

**URL:** `app.taskpilot.com/login`

**Layout:**
```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                      │
│  ┌─────────────────────────────┐ ┌─────────────────────────────────┐│
│  │                             │ │                                 ││
│  │     [Brand Illustration]    │ │    [Logo]                       ││
│  │                             │ │                                 ││
│  │     "Your AI assistant      │ │    Welcome back                 ││
│  │      for business tasks"    │ │    Log in to your account       ││
│  │                             │ │                                 ││
│  │                             │ │    ┌─────────────────────────┐  ││
│  │                             │ │    │ Email                   │  ││
│  │                             │ │    └─────────────────────────┘  ││
│  │                             │ │    ┌─────────────────────────┐  ││
│  │                             │ │    │ Password            👁  │  ││
│  │                             │ │    └─────────────────────────┘  ││
│  │                             │ │                                 ││
│  │                             │ │    ☐ Remember me   Forgot pass? ││
│  │                             │ │                                 ││
│  │                             │ │    [Log In]                     ││
│  │                             │ │                                 ││
│  │                             │ │    ─────── or continue with ─── ││
│  │                             │ │                                 ││
│  │                             │ │    [G Google]  [GitHub]         ││
│  │                             │ │                                 ││
│  │                             │ │    Don't have an account?       ││
│  │                             │ │    Sign up                      ││
│  │                             │ │                                 ││
│  └─────────────────────────────┘ └─────────────────────────────────┘│
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

**Mobile:** Single column, illustration hidden

**Validation:**
- Email: Format validation, real-time feedback
- Password: Min 8 characters
- Error: Red border, message below field
- Rate limit: Show retry timer after 5 failed attempts

---

#### 2.2 Register

**URL:** `app.taskpilot.com/register`

**Layout:** Similar to login with additional fields:
- Full Name input
- Password confirmation
- Terms of Service checkbox
- Marketing consent checkbox (optional)

**Password Requirements Display:**
```
┌─────────────────────────────────────┐
│ Password strength: [████░░░░░░] Weak│
│                                     │
│ ✓ At least 8 characters            │
│ ✓ One uppercase letter             │
│ ○ One number                       │
│ ○ One special character            │
└─────────────────────────────────────┘
```

---

#### 2.3 Password Reset

**URL:** `app.taskpilot.com/forgot-password`

**Flow:**
1. Enter email → Send reset link
2. Check email message screen
3. Reset password form (new + confirm)
4. Success → Redirect to login

---

### 3. Dashboard

**URL:** `app.taskpilot.com/dashboard`

**Layout:**
```
┌─────────────────────────────────────────────────────────────────────┐
│  SIDEBAR (240px)            │  MAIN CONTENT                         │
│  ┌─────────────────────────┐│ ┌───────────────────────────────────┐ │
│  │ [Logo]                  ││ │ Good morning, Sarah 👋             │ │
│  │                         ││ │                                    │ │
│  │ ─────────────────────── ││ │ TASK INPUT CARD                    │ │
│  │ [+] New Task            ││ │ ┌──────────────────────────────────┐│ │
│  │                         ││ │ │ What would you like to delegate? ││ │
│  │ 📊 Dashboard            ││ │ │                                  ││ │
│  │ 📝 Templates            ││ │ └──────────────────────────────────┘│ │
│  │ 📚 Knowledge Base       ││ │                                    │ │
│  │ 📜 History              ││ │ QUICK STATS                        │ │
│  │                         ││ │ ┌────────┐ ┌────────┐ ┌────────┐   │ │
│  │ ─────────────────────── ││ │ │Tasks   │ │ Time   │ │Usage   │   │ │
│  │ ⚙️ Settings             ││ │ │23/50   │ │ 4.2hrs │ │46%     │   │ │
│  │                         ││ │ │this mo │ │ saved  │ │quota   │   │ │
│  │ ─────────────────────── ││ │ └────────┘ └────────┘ └────────┘   │ │
│  │                         ││ │                                    │ │
│  │ Plan: Pro               ││ │ ACTIVE TASKS                       │ │
│  │ 23/50 tasks             ││ │ ┌──────────────────────────────────┐│ │
│  │ [████████░░] 46%        ││ │ │ CRM Research        [45%] ▶     ││ │
│  │                         ││ │ └──────────────────────────────────┘│ │
│  │ [Upgrade]               ││ │                                    │ │
│  │                         ││ │ RECENT COMPLETED                   │ │
│  │ ─────────────────────── ││ │ ┌──────────────────────────────────┐│ │
│  │                         ││ │ │ ✓ Email Sequence     Feb 24     ││ │
│  │ [?] Help                ││ │ │ ✓ Market Analysis    Feb 23     ││ │
│  │ [User Avatar ▼]         ││ │ │ ✓ Blog Draft         Feb 22     ││ │
│  │                         ││ │ └──────────────────────────────────┘│ │
│  └─────────────────────────┘│ │                                    │ │
│                             │ │ POPULAR TEMPLATES                  │ │
│                             │ │ ┌────────┐ ┌────────┐ ┌────────┐   │ │
│                             │ │ │Research│ │Email   │ │Content │   │ │
│                             │ │ │        │ │Outreach│ │Brief   │   │ │
│                             │ │ └────────┘ └────────┘ └────────┘   │ │
│                             │ └───────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

**Sidebar Behavior:**
- Desktop: Fixed 240px
- Tablet: Collapsed to icons (64px), expand on hover
- Mobile: Hidden, accessible via hamburger menu

---

### 4. New Task Screen

**URL:** `app.taskpilot.com/tasks/new`

**State 1: Input**
```
┌─────────────────────────────────────────────────────────────────────┐
│  ← Back to Dashboard                                                │
│                                                                      │
│  Create New Task                                                    │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │                                                                  ││
│  │  Describe your task in detail...                                 ││
│  │                                                                  ││
│  │                                                                  ││
│  │                                                                  ││
│  └─────────────────────────────────────────────────────────────────┘│
│  0/2000                                                              │
│                                                                      │
│  OPTIONS                                                             │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │ ☑ Use Knowledge Base                                            ││
│  │   Selected: brand-guidelines.pdf, products.md                   ││
│  │   [Manage Documents]                                            ││
│  └─────────────────────────────────────────────────────────────────┘│
│                                                                      │
│  TRY A TEMPLATE                                                     │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐                       │
│  │Research│ │Content │ │Email   │ │Analysis│                       │
│  └────────┘ └────────┘ └────────┘ └────────┘                       │
│                                                                      │
│  [Cancel]                                        [Start Task →]     │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

**State 2: Decomposition (Loading)**
```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │                                                                  ││
│  │         [AI Animation/Spinner]                                   ││
│  │                                                                  ││
│  │         Analyzing your task...                                   ││
│  │         Breaking down into steps                                 ││
│  │                                                                  ││
│  └─────────────────────────────────────────────────────────────────┘│
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

**State 3: Review Breakdown**
```
┌─────────────────────────────────────────────────────────────────────┐
│  Review Task Breakdown                                              │
│                                                                      │
│  CRM Tools Research                            Est. time: ~3 min    │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │ 1. ○ Identify CRM categories and market segments      ~30s      ││
│  │ 2. ○ Research top 10 CRM tools for small business     ~60s      ││
│  │ 3. ○ Compare pricing and key features                 ~45s      ││
│  │ 4. ○ Analyze user reviews and ratings                 ~30s      ││
│  │ 5. ○ Compile recommendations                          ~35s      ││
│  └─────────────────────────────────────────────────────────────────┘│
│                                                                      │
│  [🔄 Regenerate]  [✏️ Edit Steps]             [Execute Task →]     │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

### 5. Task Detail Screen

**URL:** `app.taskpilot.com/tasks/{taskId}`

**State: Executing**
```
┌─────────────────────────────────────────────────────────────────────┐
│  ← Back                                                    [⋮]      │
│                                                                      │
│  CRM Tools Research                                                 │
│  Started 2 minutes ago                                              │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │ Progress                                                         ││
│  │ ████████████████████░░░░░░░░░░░░░░░░░░░░  45%     ⏱ 1:23        ││
│  └─────────────────────────────────────────────────────────────────┘│
│                                                                      │
│  STEPS                                                               │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │ ✓ Identify CRM categories and market segments                   ││
│  │   Found 5 main categories: Sales, Marketing, Service...         ││
│  ├─────────────────────────────────────────────────────────────────┤│
│  │ ✓ Research top 10 CRM tools                                     ││
│  │   Compiled list: HubSpot, Salesforce, Pipedrive...              ││
│  ├─────────────────────────────────────────────────────────────────┤│
│  │ → Compare pricing and key features                [In Progress] ││
│  │   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ ││
│  ├─────────────────────────────────────────────────────────────────┤│
│  │ ○ Analyze user reviews and ratings                              ││
│  ├─────────────────────────────────────────────────────────────────┤│
│  │ ○ Compile recommendations                                       ││
│  └─────────────────────────────────────────────────────────────────┘│
│                                                                      │
│  [⏸ Pause]                                              [✕ Cancel] │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

**State: Completed**
```
┌─────────────────────────────────────────────────────────────────────┐
│  ← Back                                                    [⋮]      │
│                                                                      │
│  ✓ CRM Tools Research                                    Completed  │
│  Completed in 2m 34s • Feb 24, 2026                                 │
│                                                                      │
│  RESULT                                                              │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │ # Top 10 CRM Tools for Small Business                           ││
│  │                                                                  ││
│  │ ## Executive Summary                                             ││
│  │ After analyzing the market, here are the top 10...              ││
│  │                                                                  ││
│  │ ## 1. HubSpot CRM                                               ││
│  │ **Best for:** Startups and small teams                          ││
│  │ **Pricing:** Free - $50/user/mo                                 ││
│  │ **Key Features:**                                               ││
│  │ - Contact management                                            ││
│  │ - Email tracking                                                ││
│  │ ...                                                             ││
│  │                                                                  ││
│  │ [Show More]                                                      ││
│  └─────────────────────────────────────────────────────────────────┘│
│                                                                      │
│  ACTIONS                                                             │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐                 │
│  │ 📋 Copy      │ │ 📄 Markdown  │ │ 📑 PDF       │                 │
│  └──────────────┘ └──────────────┘ └──────────────┘                 │
│                                                                      │
│  FEEDBACK                                                            │
│  Was this helpful?  [👍]  [👎]                                      │
│                                                                      │
│  [🔄 Re-run Task]                                                   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

### 6. Templates Screen

**URL:** `app.taskpilot.com/templates`

**Layout:**
```
┌─────────────────────────────────────────────────────────────────────┐
│  Templates                                                          │
│  Choose from our library of pre-built task templates                │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │ 🔍 Search templates...                                          ││
│  └─────────────────────────────────────────────────────────────────┘│
│                                                                      │
│  CATEGORIES                                                          │
│  [All] [Research] [Content] [Email Outreach] [Data Analysis]        │
│                                                                      │
│  TEMPLATES (24)                                                      │
│  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐    │
│  │ 📊               │ │ 📝               │ │ 📧               │    │
│  │ Market Research  │ │ Blog Post Draft  │ │ Cold Email       │    │
│  │                  │ │                  │ │ Sequence         │    │
│  │ Research · 3-5m  │ │ Content · 2-3m   │ │ Outreach · 2m    │    │
│  │ ★ 4.8 (234)      │ │ ★ 4.7 (189)      │ │ ★ 4.9 (312)      │    │
│  │ [Use →]          │ │ [Use →]          │ │ [Use →]          │    │
│  └──────────────────┘ └──────────────────┘ └──────────────────┘    │
│  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐    │
│  │ 📈               │ │ ✉️               │ │ 📋               │    │
│  │ Competitor       │ │ Follow-up        │ │ Survey           │    │
│  │ Analysis         │ │ Emails           │ │ Analysis         │    │
│  │ Research · 4-6m  │ │ Outreach · 1-2m  │ │ Analysis · 3-4m  │    │
│  │ ★ 4.6 (156)      │ │ ★ 4.5 (98)       │ │ ★ 4.8 (87)       │    │
│  │ [Use →]          │ │ [Use →]          │ │ [Use →]          │    │
│  └──────────────────┘ └──────────────────┘ └──────────────────┘    │
│                                                                      │
│  [Load More]                                                        │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

**Template Detail Modal:**
```
┌─────────────────────────────────────────────────────────────────────┐
│  Market Research                                              [×]   │
│  ★ 4.8 (234 uses) • Research • ~3-5 minutes                        │
│                                                                      │
│  Comprehensive market analysis including size, trends,              │
│  competitors, and opportunities.                                    │
│                                                                      │
│  PARAMETERS                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │ Topic or Industry *                                             ││
│  │ ┌───────────────────────────────────────────────────────────┐  ││
│  │ │ e.g., "AI productivity tools for small businesses"       │  ││
│  │ └───────────────────────────────────────────────────────────┘  ││
│  └─────────────────────────────────────────────────────────────────┘│
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │ Research Depth                                                  ││
│  │ ○ Shallow (quick overview)                                      ││
│  │ ● Medium (balanced)                                             ││
│  │ ○ Deep (comprehensive)                                          ││
│  └─────────────────────────────────────────────────────────────────┘│
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │ Geographic Focus (optional)                                     ││
│  │ ┌───────────────────────────────────────────────────────────┐  ││
│  │ │ e.g., "North America"                                     │  ││
│  │ └───────────────────────────────────────────────────────────┘  ││
│  └─────────────────────────────────────────────────────────────────┘│
│                                                                      │
│  EXPECTED OUTPUT                                                     │
│  • Executive Summary                                                │
│  • Market Size & Growth                                             │
│  • Key Players                                                      │
│  • Trends & Opportunities                                           │
│  • Recommendations                                                  │
│                                                                      │
│  [Cancel]                                          [Use Template →] │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

### 7. Knowledge Base Screen

**URL:** `app.taskpilot.com/knowledge`

**Layout:**
```
┌─────────────────────────────────────────────────────────────────────┐
│  Knowledge Base                                         [+ Upload]  │
│  Add context for more personalized results                          │
│                                                                      │
│  STORAGE                                                             │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │ ████████████████████████████░░░░░░░░░░ 245 MB / 1 GB used       ││
│  └─────────────────────────────────────────────────────────────────┘│
│                                                                      │
│  FOLDERS                                                             │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐       │
│  │ 📁 All     │ │ 📁 Company │ │ 📁 Products│ │ 📁 Clients │       │
│  │ 12 files   │ │ 5 files    │ │ 4 files    │ │ 3 files    │       │
│  └────────────┘ └────────────┘ └────────────┘ └────────────┘       │
│                                                                      │
│  DOCUMENTS                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │ ☐ │ 📄 brand-guidelines.pdf   │ Company │ 245 KB │ Ready  │ [⋮]││
│  │ ☐ │ 📄 product-catalog.pdf    │ Products│ 1.2 MB │ Ready  │ [⋮]││
│  │ ☐ │ 📄 company-overview.md    │ Company │ 12 KB  │ Ready  │ [⋮]││
│  │ ☐ │ 📄 pricing-2026.docx      │ Products│ 45 KB  │ Process│ [⋮]││
│  └─────────────────────────────────────────────────────────────────┘│
│                                                                      │
│  Selected: 0                                          [Delete]      │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

**Upload Modal:**
```
┌─────────────────────────────────────────────────────────────────────┐
│  Upload Documents                                            [×]    │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │                                                                  ││
│  │             ┌─────────────────────────────────┐                 ││
│  │             │         📁                       │                 ││
│  │             │                                  │                 ││
│  │             │   Drag & drop files here        │                 ││
│  │             │   or click to browse            │                 ││
│  │             │                                  │                 ││
│  │             │   TXT, MD, PDF, DOCX (max 10MB) │                 ││
│  │             └─────────────────────────────────┘                 ││
│  │                                                                  ││
│  └─────────────────────────────────────────────────────────────────┘│
│                                                                      │
│  UPLOADING                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │ 📄 new-document.pdf           ████████░░░░░░░░ 67%              ││
│  └─────────────────────────────────────────────────────────────────┘│
│                                                                      │
│  Folder: [Company ▼]                                               │
│                                                                      │
│  [Cancel]                                              [Done]       │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

### 8. Settings Screen

**URL:** `app.taskpilot.com/settings`

**Layout:**
```
┌─────────────────────────────────────────────────────────────────────┐
│  Settings                                                           │
│                                                                      │
│  ┌──────────────────────┐ ┌────────────────────────────────────────┐│
│  │ NAVIGATION           │ │ PROFILE                                ││
│  │                      │ │                                        ││
│  │ 👤 Profile           │ │ ┌────────┐                             ││
│  │ 🔔 Notifications     │ │ │ Avatar │  [Change Photo]            ││
│  │ 💳 Billing           │ │ └────────┘                             ││
│  │ 🔑 API Keys          │ │                                        ││
│  │ 🔒 Security          │ │ Full Name                              ││
│  │ 🎨 Appearance        │ │ ┌──────────────────────────────────┐  ││
│  │                      │ │ │ Sarah Johnson                    │  ││
│  │                      │ │ └──────────────────────────────────┘  ││
│  │                      │ │                                        ││
│  │                      │ │ Email                                  ││
│  │                      │ │ ┌──────────────────────────────────┐  ││
│  │                      │ │ │ sarah@example.com               │  ││
│  │                      │ │ └──────────────────────────────────┘  ││
│  │                      │ │                                        ││
│  │                      │ │ Role (optional)                        ││
│  │                      │ │ ┌──────────────────────────────────┐  ││
│  │                      │ │ │ Marketing Consultant             │  ││
│  │                      │ │ └──────────────────────────────────┘  ││
│  │                      │ │                                        ││
│  │                      │ │ [Save Changes]                        ││
│  │                      │ │                                        ││
│  │                      │ │ ───────────────────────────────────── ││
│  │                      │ │                                        ││
│  │                      │ │ DANGER ZONE                            ││
│  │                      │ │ [Delete Account]                       ││
│  │                      │ │                                        ││
│  └──────────────────────┘ └────────────────────────────────────────┘│
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

**Appearance Tab:**
```
┌────────────────────────────────────────────────────────────────────┐
│ APPEARANCE                                                          │
│                                                                      │
│ Theme                                                                │
│ ┌────────────┐ ┌────────────┐ ┌────────────┐                       │
│ │ ☀️ Light   │ │ 🌙 Dark    │ │ 💻 System  │                       │
│ │   [✓]      │ │            │ │            │                       │
│ └────────────┘ └────────────┘ └────────────┘                       │
│                                                                      │
│ Language                                                             │
│ ┌──────────────────────────────────────────┐                       │
│ │ English (US)                          ▼  │                       │
│ └──────────────────────────────────────────┘                       │
│                                                                      │
└────────────────────────────────────────────────────────────────────┘
```

---

### 9. Billing Screen

**URL:** `app.taskpilot.com/settings/billing`

**Layout:**
```
┌─────────────────────────────────────────────────────────────────────┐
│  Billing & Subscription                                             │
│                                                                      │
│  CURRENT PLAN                                                        │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │ PRO PLAN                                              $29/month ││
│  │                                                                  ││
│  │ ✓ 50 tasks per month                        Used: 23/50        ││
│  │ ████████████████████████░░░░░░░░░░░░░░░░░░░ 46%                 ││
│  │                                                                  ││
│  │ Renews on March 24, 2026                                        ││
│  │                                                                  ││
│  │ [Change Plan]                              [Cancel Subscription]││
│  └─────────────────────────────────────────────────────────────────┘│
│                                                                      │
│  PAYMENT METHOD                                                      │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │ 💳 Visa ending in 4242                     Expires 12/27       ││
│  │                                                         [Edit] ││
│  └─────────────────────────────────────────────────────────────────┘│
│                                                                      │
│  BILLING HISTORY                                                     │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │ Feb 24, 2026 │ Pro Plan      │ $29.00  │ Paid    │ [Receipt]   ││
│  │ Jan 24, 2026 │ Pro Plan      │ $29.00  │ Paid    │ [Receipt]   ││
│  │ Dec 24, 2025 │ Pro Plan      │ $29.00  │ Paid    │ [Receipt]   ││
│  └─────────────────────────────────────────────────────────────────┘│
│                                                                      │
│  CHANGE PLAN                                                         │
│  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐    │
│  │ FREE             │ │ PRO    ← Current │ │ BUSINESS         │    │
│  │ $0/month         │ │ $29/month        │ │ $99/month        │    │
│  │ 5 tasks          │ │ 50 tasks         │ │ Unlimited        │    │
│  │ [Downgrade]      │ │ ───              │ │ [Upgrade]        │    │
│  └──────────────────┘ └──────────────────┘ └──────────────────┘    │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## User Flows

### Flow 1: First Task Delegation (Activation)

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Landing   │────▶│   Register  │────▶│  Welcome    │
│    Page     │     │   (OAuth/   │     │  Onboarding │
│             │     │   Email)    │     │  (3 steps)  │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                               │
                                               ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Success   │◀────│   Task      │◀────│  Dashboard  │
│   Result    │     │  Execution  │     │  + Task     │
│   Export    │     │  Progress   │     │   Input     │
└─────────────┘     └─────────────┘     └─────────────┘

Time to First Value Target: <10 minutes
```

**Welcome Onboarding Steps:**
1. "Tell us about yourself" — Role selection (Freelancer, Entrepreneur, etc.)
2. "How will you use TaskPilot?" — Primary use case
3. "Try your first task" — Pre-filled example prompt

---

### Flow 2: Template Usage

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Dashboard  │────▶│  Templates  │────▶│  Template   │
│             │     │   Browse    │     │   Detail    │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                               │
                         Fill Parameters       │
                                               ▼
                    ┌─────────────┐     ┌─────────────┐
                    │   Result    │◀────│   Task      │
                    │             │     │  Execution  │
                    └─────────────┘     └─────────────┘
```

---

### Flow 3: Subscription Upgrade

```
┌─────────────┐         ┌─────────────┐
│  Task Limit │────────▶│   Upgrade   │
│   Warning   │         │    Modal    │
│  (80% used) │         │             │
└─────────────┘         └──────┬──────┘
                               │
       ┌───────────────────────┼───────────────────────┐
       │                       │                       │
       ▼                       ▼                       ▼
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Dismiss   │         │  Compare    │         │   Direct    │
│   (Later)   │         │   Plans     │         │  Checkout   │
└─────────────┘         └──────┬──────┘         └──────┬──────┘
                               │                       │
                               └───────────┬───────────┘
                                           │
                                           ▼
                               ┌─────────────────────┐
                               │   Stripe Checkout   │
                               │   (External Page)   │
                               └──────────┬──────────┘
                                          │
                          ┌───────────────┴───────────────┐
                          │                               │
                          ▼                               ▼
                   ┌─────────────┐                 ┌─────────────┐
                   │   Success   │                 │   Cancel    │
                   │  Confetti!  │                 │  Return to  │
                   │  New Limits │                 │   App       │
                   └─────────────┘                 └─────────────┘
```

**Upgrade Modal Anatomy:**
```
┌─────────────────────────────────────────────────────────────────────┐
│  🚀 Upgrade to Pro                                           [×]    │
│                                                                      │
│  You've used 5/5 tasks this month                                   │
│                                                                      │
│  ┌──────────────────────────────┐ ┌──────────────────────────────┐  │
│  │        PRO                   │ │      BUSINESS                │  │
│  │        $29/mo                │ │      $99/mo                  │  │
│  │                              │ │                              │  │
│  │  ✓ 50 tasks/month           │ │  ✓ Unlimited tasks          │  │
│  │  ✓ All templates            │ │  ✓ Everything in Pro        │  │
│  │  ✓ 1GB knowledge base       │ │  ✓ 10GB knowledge base      │  │
│  │  ✓ PDF export               │ │  ✓ Team sharing             │  │
│  │  ✓ Priority support         │ │  ✓ API access               │  │
│  │                              │ │  ✓ Custom branding          │  │
│  │  [Get Pro]                  │ │  [Get Business]              │  │
│  └──────────────────────────────┘ └──────────────────────────────┘  │
│                                                                      │
│  💡 Pro users complete 3x more tasks and save 12 hours/week        │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

### Flow 4: Knowledge Base Integration

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Knowledge  │────▶│   Upload    │────▶│  Processing │
│    Base     │     │   Modal     │     │   Status    │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                               │
                    Embedding Complete         │
                                               ▼
┌─────────────┐                         ┌─────────────┐
│  Create     │◀────────────────────────│   Ready     │
│  Task with  │    "Use in tasks"       │   ✓         │
│  KB Context │                         └─────────────┘
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────────────────────┐
│  Task result shows: "Sources: brand-guidelines.pdf" │
└─────────────────────────────────────────────────────┘
```

---

### Flow 5: Error Recovery

```
┌─────────────┐     ┌─────────────┐
│   Task      │────▶│   Error     │
│  Executing  │     │   State     │
└─────────────┘     └──────┬──────┘
                           │
       ┌───────────────────┼───────────────────┐
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Retry     │     │   Edit &    │     │   Cancel    │
│   Task      │     │   Retry     │     │   + Report  │
└─────────────┘     └─────────────┘     └─────────────┘
```

**Error Screen:**
```
┌─────────────────────────────────────────────────────────────────────┐
│  ⚠️ Task couldn't be completed                                      │
│                                                                      │
│  We encountered an issue while processing your task.                │
│  Error: AI rate limit exceeded                                      │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │ PARTIAL RESULTS                                                 ││
│  │                                                                 ││
│  │ ## CRM Categories Identified                                    ││
│  │ - Sales CRM                                                     ││
│  │ - Marketing CRM                                                 ││
│  │ ...                                                             ││
│  └─────────────────────────────────────────────────────────────────┘│
│                                                                      │
│  [🔄 Retry Task]  [✏️ Edit & Retry]  [✕ Cancel]                     │
│                                                                      │
│  [Report Issue]                                                     │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Responsive Design

### Breakpoints

| Breakpoint | Width | Layout Changes |
|------------|-------|----------------|
| `xs` | <375px | Single column, reduced padding |
| `sm` | 375-639px | Mobile layout, stacked elements |
| `md` | 640-767px | Tablet portrait, 2-column where appropriate |
| `lg` | 768-1023px | Tablet landscape, sidebar visible |
| `xl` | 1024-1279px | Desktop, full layout |
| `2xl` | ≥1280px | Large desktop, max-width container |

### Layout Adaptations

#### Navigation

| Breakpoint | Behavior |
|------------|----------|
| `xs-md` | Bottom tab bar + hamburger for more |
| `lg+` | Fixed left sidebar |

**Mobile Bottom Nav:**
```
┌─────────────────────────────────────────────────────────────────────┐
│                        MAIN CONTENT                                  │
│                                                                      │
│                                                                      │
├─────────────────────────────────────────────────────────────────────┤
│  [🏠]      [📊]      [➕]      [📝]      [⚙️]                        │
│  Home    Templates   New     History  Settings                      │
└─────────────────────────────────────────────────────────────────────┘
```

#### Cards & Grids

| Breakpoint | Grid Columns |
|------------|--------------|
| `xs-sm` | 1 |
| `md` | 2 |
| `lg` | 3 |
| `xl+` | 4 |

#### Typography Scaling

| Element | Mobile | Desktop |
|---------|--------|---------|
| H1 (Hero) | text-3xl | text-5xl |
| H2 (Section) | text-2xl | text-3xl |
| Body | text-sm | text-base |
| Small | text-xs | text-sm |

#### Touch Targets

- Minimum touch target: 44×44px
- Button padding increased on mobile: py-3 px-4
- Interactive spacing: min 8px between targets

---

## Accessibility

### WCAG 2.1 AA Compliance

#### Color Contrast

| Element | Minimum Ratio |
|---------|---------------|
| Normal text | 4.5:1 |
| Large text (≥18px bold, ≥24px regular) | 3:1 |
| UI components & graphics | 3:1 |
| Focus indicators | 3:1 |

#### Color Independence

- Never convey information by color alone
- Use icons + labels for status indicators
- Error states: Red color + icon + text message
- Success: Green + checkmark + text

#### Keyboard Navigation

| Key | Action |
|-----|--------|
| `Tab` | Navigate forward through focusable elements |
| `Shift+Tab` | Navigate backward |
| `Enter/Space` | Activate buttons, links, checkboxes |
| `Escape` | Close modals, dropdowns |
| `Arrow keys` | Navigate within menus, radio groups |

**Focus Order:**
1. Skip to main content link (hidden until focused)
2. Header navigation
3. Main content area (left to right, top to bottom)
4. Sidebar (if present)
5. Footer

#### Focus Indicators

```css
/* Default focus ring */
:focus-visible {
  outline: 2px solid hsl(var(--ring));
  outline-offset: 2px;
}

/* Remove default outline, use custom ring */
:focus:not(:focus-visible) {
  outline: none;
}
```

#### Screen Reader Support

| Element | ARIA Attributes |
|---------|-----------------|
| Buttons | `aria-label` for icon-only |
| Progress | `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax` |
| Modals | `role="dialog"`, `aria-labelledby`, `aria-describedby` |
| Alerts | `role="alert"`, `aria-live="polite"` |
| Navigation | `aria-current="page"` for active |
| Forms | `aria-required`, `aria-invalid`, `aria-describedby` |

#### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Form Accessibility

| Requirement | Implementation |
|-------------|----------------|
| Labels | Every input has visible label or aria-label |
| Error messages | Linked via aria-describedby |
| Required fields | Marked with asterisk + aria-required |
| Autocomplete | `autocomplete` attribute for common fields |
| Error focus | Focus moves to first error on submit |

---

## Motion & Animation

### Animation Principles

1. **Purpose** — Animations guide attention and provide feedback
2. **Speed** — Fast enough to feel responsive (150-300ms)
3. **Easing** — Natural motion with ease-out for entries, ease-in for exits
4. **Restraint** — No decorative animations that distract

### Timing Scale

| Token | Duration | Usage |
|-------|----------|-------|
| `duration-75` | 75ms | Color changes, micro-interactions |
| `duration-150` | 150ms | Small UI changes, hover states |
| `duration-200` | 200ms | Standard transitions |
| `duration-300` | 300ms | Panel slides, modals |
| `duration-500` | 500ms | Page transitions |

### Easing Functions

| Token | Value | Usage |
|-------|-------|-------|
| `ease-out` | cubic-bezier(0, 0, 0.2, 1) | Elements entering |
| `ease-in` | cubic-bezier(0.4, 0, 1, 1) | Elements leaving |
| `ease-in-out` | cubic-bezier(0.4, 0, 0.2, 1) | Moving elements |

### Component Animations

#### Button Hover/Active
```css
.button {
  transition: transform 150ms ease-out, 
              background-color 150ms ease-out;
}
.button:hover {
  transform: translateY(-1px);
}
.button:active {
  transform: scale(0.98);
}
```

#### Modal Entrance
```css
.modal-backdrop {
  animation: fadeIn 200ms ease-out;
}
.modal-content {
  animation: slideUp 300ms ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(10px) scale(0.98);
  }
  to { 
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
```

#### Progress Bar
```css
.progress-fill {
  transition: width 300ms ease-out;
}

/* Indeterminate state */
.progress-indeterminate {
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
```

#### Task Step Completion
```css
.step-completed {
  animation: check 300ms ease-out;
}

@keyframes check {
  0% { transform: scale(0); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}
```

#### Toast Notification
```css
.toast-enter {
  animation: slideInRight 300ms ease-out;
}
.toast-exit {
  animation: fadeOutRight 200ms ease-in;
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
```

### Loading States

#### Skeleton Loading
```
┌─────────────────────────────────────────────────────────────────────┐
│ ████████████████████░░░░░░░░░░░░░░░░░░░░ (shimmer animation)       │
│ ████████████████░░░░░░░░░░░░░░░░░░░░░░░░                           │
│ ██████████████████████████░░░░░░░░░░░░░░                           │
└─────────────────────────────────────────────────────────────────────┘
```

#### AI Processing Animation
- Pulsing dots or wave animation
- "Analyzing..." → "Breaking down..." → "Preparing..." text cycle
- Subtle rotation of AI icon

---

## Reconciliation Notes

### PRD Alignment Verification

| PRD Requirement | UI/UX Coverage |
|-----------------|----------------|
| FR-1.1 User Registration | ✓ Auth screens defined |
| FR-1.2 User Login | ✓ Login flow with OAuth |
| FR-1.3 Onboarding Flow | ✓ 3-step welcome flow |
| FR-2.1 Natural Language Input | ✓ Task Input Card component |
| FR-2.2 Task Decomposition | ✓ Review Breakdown screen |
| FR-2.3 Task Execution | ✓ Progress tracking UI |
| FR-2.4 Result Delivery | ✓ Task Detail completed state |
| FR-3.1 Template Browsing | ✓ Templates screen |
| FR-3.2 Template Usage | ✓ Template Detail modal |
| FR-4.1 Knowledge Upload | ✓ Knowledge Base upload modal |
| FR-5.1 Progress Display | ✓ Real-time progress component |
| FR-5.2 Task History | ✓ History in sidebar + dashboard |
| FR-6.1-6.3 Export | ✓ Export actions on result |
| FR-7.1-7.3 Billing | ✓ Billing screen with history |

### Tech Stack Compatibility

| TechStack Element | UI/UX Alignment |
|-------------------|-----------------|
| Tailwind CSS | ✓ All tokens in Tailwind format |
| shadcn/ui | ✓ Components follow shadcn patterns |
| Dark/Light Mode | ✓ Color system supports both |
| Next.js | ✓ URL structure follows pages/app router |

### Data Entity Mapping

| Entity | UI Display |
|--------|------------|
| User | Profile settings, avatar |
| Task | Task cards, detail screen |
| Subtask | Progress steps list |
| TaskResult | Result display with markdown |
| Template | Template cards, detail modal |
| KnowledgeDocument | Knowledge base file list |
| Subscription | Billing section, usage indicator |

### Open Questions

1. **Task Scheduling (Phase 1)** — UI for scheduled tasks TBD
2. **Team Sharing (Phase 1)** — Collaboration UI to be designed
3. **Marketplace (Phase 2)** — Template marketplace UI TBD
4. **Multi-language (Phase 2)** — RTL support consideration needed

---

## Appendix: Icon Reference

### Navigation Icons (Lucide)

| Icon | Name | Usage |
|------|------|-------|
| 🏠 | `home` | Dashboard |
| ➕ | `plus` | New task |
| 📊 | `layout-grid` | Templates |
| 📚 | `book-open` | Knowledge base |
| 📜 | `history` | Task history |
| ⚙️ | `settings` | Settings |
| 👤 | `user` | Profile |
| 💳 | `credit-card` | Billing |

### Status Icons

| Icon | Name | Usage |
|------|------|-------|
| ✓ | `check` | Completed |
| ○ | `circle` | Pending |
| → | `arrow-right` | In progress |
| ⚠️ | `alert-triangle` | Warning |
| ✕ | `x` | Error/Close |
| ℹ️ | `info` | Information |

### Action Icons

| Icon | Name | Usage |
|------|------|-------|
| 📋 | `clipboard` | Copy |
| 📄 | `file-text` | Markdown |
| 📑 | `file` | PDF |
| 🔄 | `refresh-cw` | Retry/Refresh |
| ⏸ | `pause` | Pause |
| ▶ | `play` | Resume |
| ✏️ | `edit` | Edit |
| 🗑 | `trash` | Delete |

---

*Document generated for TaskPilot UI/UX specification. For implementation details, refer to component library documentation.*
