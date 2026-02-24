# Implementation Plan: TaskPilot

**Version:** 1.0  
**Date:** February 24, 2026  
**Status:** Approved  
**Sources:** PRD.md, TechStack.md, DBSchema.md, UI_UX.md, ProjectStructure.md

---

## Executive Summary

Данный план описывает пошаговую реализацию MVP TaskPilot — AI SaaS-платформы для делегирования бизнес-задач. План разбит на **12 волн (waves)** для оптимизации параллельного выполнения задач командой из 2-3 разработчиков.

**Общая оценка времени:** 10-12 недель  
**Команда:** 2 Frontend, 1 Full-stack  

---

## Feature Analysis

### Priority Breakdown (from PRD)

| Priority | Count | Description |
|----------|-------|-------------|
| **P0 (Must Have)** | 15 | Критически важные для MVP |
| **P1 (Should Have)** | 10 | Важные, но можно отложить |
| **P2 (Nice to Have)** | 5 | Дополнительные улучшения |

### P0 Features (MVP Critical)
- FR-1.1 User Registration
- FR-1.2 User Login
- FR-2.1 Natural Language Task Input
- FR-2.2 AI Task Decomposition
- FR-2.3 Task Execution Engine
- FR-2.4 Task Result Delivery
- FR-3.1 Template Browsing
- FR-3.2 Template Usage
- FR-5.1 Real-time Progress Display
- FR-5.2 Task History
- FR-6.1 Markdown Export
- FR-6.3 Clipboard Copy
- FR-7.1 Plan Display
- FR-7.2 Subscription Management

### P1 Features (Post-MVP Ready)
- FR-1.3 Onboarding Flow
- FR-3.3 Template Categories
- FR-4.1 Knowledge Upload
- FR-4.2 Knowledge Management
- FR-4.3 Knowledge Integration
- FR-6.2 PDF Export
- FR-7.3 Invoice & Receipt

### P2 Features (Future)
- FR-5.3 Task Re-run
- Custom templates
- Team features

---

## Implementation Stages

### Stage 1 — Foundation & System Setup

**Duration:** 1.5-2 weeks  
**Goal:** Рабочее окружение разработки, CI/CD, базовая инфраструктура

---

#### Wave 1.1: Project Initialization
**Duration:** 2-3 days  
**Parallel Execution:** Все задачи независимы

##### Task 1.1.1: Initialize Next.js Project
**Module:** Root  
**Dependencies:** None  
**Estimated Time:** 4 hours

**Description:**  
Создание проекта Next.js 14 с App Router, TypeScript, базовая конфигурация.

**Acceptance Criteria:**
- [ ] `pnpm create next-app@latest taskpilot` с App Router
- [ ] TypeScript 5.4+ настроен, strict mode
- [ ] Структура папок соответствует ProjectStructure.md
- [ ] `pnpm dev` запускается без ошибок
- [ ] README.md с инструкциями по запуску

**Files to Create:**
- `next.config.mjs`
- `tsconfig.json`
- `.env.example`
- `README.md`

---

##### Task 1.1.2: Configure Tailwind CSS & shadcn/ui
**Module:** `src/styles/`, `src/components/ui/`  
**Dependencies:** Task 1.1.1  
**Estimated Time:** 3 hours

**Description:**  
Настройка Tailwind CSS, установка shadcn/ui, базовые UI компоненты.

**Acceptance Criteria:**
- [ ] Tailwind CSS 3.4+ с JIT mode
- [ ] `tailwind.config.ts` с design tokens из UI_UX.md
- [ ] shadcn/ui инициализирован (`components.json`)
- [ ] Добавлены компоненты: button, card, input, dialog, toast
- [ ] Тёмная/светлая тема настроена через CSS variables
- [ ] `globals.css` содержит все design tokens

**Files to Create:**
- `tailwind.config.ts`
- `postcss.config.mjs`
- `src/app/globals.css`
- `components.json`
- `src/components/ui/*.tsx` (базовые)

---

##### Task 1.1.3: Configure ESLint, Prettier & Git Hooks  
**Module:** Root  
**Dependencies:** Task 1.1.1  
**Estimated Time:** 2 hours

**Description:**  
Настройка линтинга, форматирования и Git hooks для качества кода.

**Acceptance Criteria:**
- [ ] ESLint с next/core-web-vitals
- [ ] Prettier с plugin-tailwindcss
- [ ] Husky pre-commit hook: lint-staged
- [ ] Commitlint для conventional commits
- [ ] VS Code settings в `.vscode/`

**Files to Create:**
- `.eslintrc.cjs`
- `.prettierrc`
- `commitlint.config.js`
- `.husky/pre-commit`
- `.husky/commit-msg`
- `.vscode/settings.json`
- `.vscode/extensions.json`

---

##### Task 1.1.4: Configure GitHub Actions CI
**Module:** `.github/workflows/`  
**Dependencies:** Task 1.1.3  
**Estimated Time:** 2 hours

**Description:**  
Настройка CI pipeline для автоматической проверки PR.

**Acceptance Criteria:**
- [ ] Workflow на push и PR
- [ ] Jobs: install → lint → typecheck → test (parallel)
- [ ] Кэширование pnpm store
- [ ] Security audit job
- [ ] PR template создан

**Files to Create:**
- `.github/workflows/ci.yml`
- `.github/PULL_REQUEST_TEMPLATE.md`

---

#### Wave 1.2: Supabase Setup
**Duration:** 2-3 days  
**Parallel Execution:** Task 1.2.1 последовательно, остальные параллельно после

##### Task 1.2.1: Initialize Supabase Project & Local Dev
**Module:** `supabase/`  
**Dependencies:** Task 1.1.1  
**Estimated Time:** 3 hours

**Description:**  
Создание Supabase проекта, настройка локальной разработки.

**Acceptance Criteria:**
- [ ] Supabase project создан в dashboard
- [ ] `supabase init` в проекте
- [ ] `supabase start` работает локально
- [ ] Environment variables в `.env.local`
- [ ] Supabase CLI добавлен в devDependencies

**Files to Create:**
- `supabase/config.toml`
- `.env.local` (из template)

---

##### Task 1.2.2: Create Database Schema Migration
**Module:** `supabase/migrations/`  
**Dependencies:** Task 1.2.1  
**Estimated Time:** 6 hours

**Description:**  
Миграция создающая все таблицы согласно DBSchema.md.

**Acceptance Criteria:**
- [ ] Миграция `00001_init_schema.sql` создаёт все 9 таблиц
- [ ] Все constraints и indexes из DBSchema.md
- [ ] `set_updated_at()` trigger function
- [ ] `supabase db push` успешен
- [ ] Локальная БД содержит все таблицы

**Files to Create:**
- `supabase/migrations/00001_init_schema.sql`

---

##### Task 1.2.3: Configure Row-Level Security (RLS)
**Module:** `supabase/migrations/`  
**Dependencies:** Task 1.2.2  
**Estimated Time:** 4 hours

**Description:**  
Настройка RLS политик для безопасного доступа к данным.

**Acceptance Criteria:**
- [ ] RLS включён на всех таблицах с user data
- [ ] Политики: users могут CRUD только свои данные
- [ ] templates: public read, admin write
- [ ] Service role bypass для server-side операций
- [ ] Тест политик через Supabase Studio

**Files to Create:**
- `supabase/migrations/00002_rls_policies.sql`

---

##### Task 1.2.4: Create Database Functions & Triggers
**Module:** `supabase/migrations/`  
**Dependencies:** Task 1.2.2  
**Estimated Time:** 4 hours

**Description:**  
Database functions для бизнес-логики.

**Acceptance Criteria:**
- [ ] `increment_template_usage()` function
- [ ] `reset_monthly_tasks()` function
- [ ] `update_task_progress()` function
- [ ] Trigger для автоматического создания subscription при user signup
- [ ] Тесты functions в Supabase Studio

**Files to Create:**
- `supabase/migrations/00003_functions.sql`
- `supabase/migrations/00004_triggers.sql`

---

##### Task 1.2.5: Seed Initial Data
**Module:** `supabase/`  
**Dependencies:** Task 1.2.2  
**Estimated Time:** 3 hours

**Description:**  
Начальные данные: категории шаблонов, 20 шаблонов для MVP.

**Acceptance Criteria:**
- [ ] 4 категории шаблонов (Research, Content, Email, Data Analysis)
- [ ] 20 шаблонов с parameters JSONB
- [ ] `supabase db seed` успешен
- [ ] Шаблоны видны в Supabase Studio

**Files to Create:**
- `supabase/seed.sql`

---

##### Task 1.2.6: Setup Supabase Client Libraries
**Module:** `src/lib/supabase/`  
**Dependencies:** Task 1.2.1  
**Estimated Time:** 3 hours

**Description:**  
Клиенты Supabase для браузера и сервера.

**Acceptance Criteria:**
- [ ] Browser client с `@supabase/supabase-js`
- [ ] Server client с `@supabase/ssr` (cookies)
- [ ] Middleware helper для auth
- [ ] Admin client с service role key
- [ ] TypeScript types generated from schema

**Files to Create:**
- `src/lib/supabase/client.ts`
- `src/lib/supabase/server.ts`
- `src/lib/supabase/middleware.ts`
- `src/lib/supabase/admin.ts`
- `src/types/database.ts`

---

### Stage 2 — Authentication & Core UI

**Duration:** 1.5-2 weeks  
**Goal:** Полностью работающая аутентификация, базовый UI каркас

---

#### Wave 2.1: Authentication Backend
**Duration:** 2-3 days  
**Parallel Execution:** Task 2.1.1 и 2.1.2 последовательно, 2.1.3 параллельно

##### Task 2.1.1: Setup Supabase Auth
**Module:** `src/app/api/auth/`, `src/lib/supabase/`  
**Dependencies:** Wave 1.2  
**Estimated Time:** 4 hours

**Description:**  
Настройка Supabase Auth с email и OAuth providers.

**Acceptance Criteria:**
- [ ] Email/password auth настроен
- [ ] Google OAuth provider настроен
- [ ] GitHub OAuth provider настроен
- [ ] Email templates настроены (confirm, reset)
- [ ] Redirect URLs корректны для development

---

##### Task 2.1.2: Implement Auth Server Actions
**Module:** `src/app/actions/auth.ts`  
**Dependencies:** Task 2.1.1  
**Estimated Time:** 6 hours

**Description:**  
Server Actions для authentication flows.

**Acceptance Criteria:**
- [ ] `signUp()` - регистрация с email verification
- [ ] `signIn()` - вход с credentials
- [ ] `signInWithOAuth()` - OAuth login
- [ ] `signOut()` - выход с очисткой сессии
- [ ] `resetPassword()` - запрос сброса пароля
- [ ] `updatePassword()` - обновление пароля
- [ ] Zod validation для всех inputs
- [ ] Error handling с user-friendly messages

**Files to Create:**
- `src/app/actions/auth.ts`
- `src/lib/validations/auth.ts`

---

##### Task 2.1.3: Setup Auth Middleware
**Module:** `src/middleware.ts`  
**Dependencies:** Task 2.1.1  
**Estimated Time:** 3 hours

**Description:**  
Middleware для защиты routes и обновления сессий.

**Acceptance Criteria:**
- [ ] Защита dashboard routes (`/dashboard/*`)
- [ ] Редирект неавторизованных на `/login`
- [ ] Редирект авторизованных с auth pages на dashboard
- [ ] Обновление session token
- [ ] Public routes не требуют auth

**Files to Create:**
- `src/middleware.ts`

---

#### Wave 2.2: Authentication UI
**Duration:** 2-3 days  
**Parallel Execution:** Все страницы могут разрабатываться параллельно

##### Task 2.2.1: Create Auth Layout
**Module:** `src/app/(auth)/`  
**Dependencies:** Task 1.1.2  
**Estimated Time:** 3 hours

**Description:**  
Split-screen layout для auth страниц.

**Acceptance Criteria:**
- [ ] Split-screen: левая часть - форма, правая - брендинг
- [ ] Responsive: на мобильных только форма
- [ ] Logo и навигация на главную
- [ ] Анимации при переходах

**Files to Create:**
- `src/app/(auth)/layout.tsx`

---

##### Task 2.2.2: Implement Login Page
**Module:** `src/app/(auth)/login/`, `src/components/auth/`  
**Dependencies:** Task 2.1.2, Task 2.2.1  
**Estimated Time:** 4 hours

**Description:**  
Страница входа с формой и OAuth кнопками.

**Acceptance Criteria:**
- [ ] Email/password форма с validation
- [ ] Google OAuth button
- [ ] GitHub OAuth button
- [ ] "Remember me" checkbox
- [ ] "Forgot password" link
- [ ] "Register" link
- [ ] Loading states
- [ ] Error handling с toast notifications

**Files to Create:**
- `src/app/(auth)/login/page.tsx`
- `src/components/auth/login-form.tsx`
- `src/components/auth/oauth-buttons.tsx`

---

##### Task 2.2.3: Implement Registration Page
**Module:** `src/app/(auth)/register/`, `src/components/auth/`  
**Dependencies:** Task 2.1.2, Task 2.2.1  
**Estimated Time:** 4 hours

**Description:**  
Страница регистрации с формой и OAuth.

**Acceptance Criteria:**
- [ ] Email, password, name inputs
- [ ] Password strength indicator
- [ ] Password requirements tooltip
- [ ] Terms of Service checkbox
- [ ] OAuth buttons
- [ ] Success message о verification email
- [ ] Redirect на confirmation page

**Files to Create:**
- `src/app/(auth)/register/page.tsx`
- `src/components/auth/register-form.tsx`
- `src/components/auth/password-strength.tsx`

---

##### Task 2.2.4: Implement Password Reset Flow
**Module:** `src/app/(auth)/forgot-password/`, `src/app/(auth)/reset-password/`  
**Dependencies:** Task 2.1.2, Task 2.2.1  
**Estimated Time:** 3 hours

**Description:**  
Страницы восстановления пароля.

**Acceptance Criteria:**
- [ ] Forgot password: email input → sends reset link
- [ ] Reset password: new password inputs
- [ ] Password validation
- [ ] Success confirmations
- [ ] Error handling

**Files to Create:**
- `src/app/(auth)/forgot-password/page.tsx`
- `src/app/(auth)/reset-password/page.tsx`
- `src/components/auth/forgot-password-form.tsx`
- `src/components/auth/reset-password-form.tsx`

---

##### Task 2.2.5: OAuth Callback Handler
**Module:** `src/app/api/auth/callback/`  
**Dependencies:** Task 2.1.1  
**Estimated Time:** 2 hours

**Description:**  
API route для обработки OAuth callback.

**Acceptance Criteria:**
- [ ] Обмен code на session
- [ ] Редирект на dashboard
- [ ] Error handling с редиректом на login
- [ ] Создание user profile при первом входе

**Files to Create:**
- `src/app/api/auth/callback/route.ts`

---

#### Wave 2.3: Core UI Components & Layout
**Duration:** 3-4 days  
**Parallel Execution:** Большинство компонентов независимы

##### Task 2.3.1: Create Dashboard Layout
**Module:** `src/app/(dashboard)/`, `src/components/layout/`  
**Dependencies:** Task 2.1.3  
**Estimated Time:** 6 hours

**Description:**  
Основной layout приложения с sidebar и header.

**Acceptance Criteria:**
- [ ] Sidebar с навигацией (Dashboard, Tasks, Templates, Knowledge, Settings)
- [ ] App Header с user dropdown
- [ ] Responsive: collapsible sidebar на десктопе
- [ ] Mobile: bottom navigation или hamburger menu
- [ ] Usage quota indicator в sidebar
- [ ] Theme toggle в header

**Files to Create:**
- `src/app/(dashboard)/layout.tsx`
- `src/components/layout/sidebar/index.tsx`
- `src/components/layout/sidebar/sidebar-nav.tsx`
- `src/components/layout/sidebar/sidebar-user.tsx`
- `src/components/layout/sidebar/sidebar-usage.tsx`
- `src/components/layout/header/app-header.tsx`
- `src/components/layout/mobile-nav.tsx`

---

##### Task 2.3.2: Implement Common Components
**Module:** `src/components/common/`  
**Dependencies:** Task 1.1.2  
**Estimated Time:** 4 hours

**Description:**  
Переиспользуемые компоненты приложения.

**Acceptance Criteria:**
- [ ] Logo component
- [ ] Theme toggle
- [ ] User avatar with dropdown
- [ ] Loading spinner
- [ ] Empty state
- [ ] Error message
- [ ] Page header
- [ ] Confirmation dialog

**Files to Create:**
- `src/components/common/logo.tsx`
- `src/components/common/theme-toggle.tsx`
- `src/components/common/user-avatar.tsx`
- `src/components/common/loading-spinner.tsx`
- `src/components/common/empty-state.tsx`
- `src/components/common/error-message.tsx`
- `src/components/common/page-header.tsx`
- `src/components/common/confirmation-dialog.tsx`

---

##### Task 2.3.3: Setup State Management
**Module:** `src/stores/`, `src/hooks/`  
**Dependencies:** Task 1.1.1  
**Estimated Time:** 4 hours

**Description:**  
Zustand stores и React Query setup.

**Acceptance Criteria:**
- [ ] UI store: sidebar state, modals
- [ ] User store: cached user data
- [ ] Preferences store: theme, persisted settings
- [ ] QueryClient provider
- [ ] useAuth hook
- [ ] useUser hook
- [ ] useSubscription hook

**Files to Create:**
- `src/stores/ui-store.ts`
- `src/stores/user-store.ts`
- `src/stores/preferences-store.ts`
- `src/app/providers.tsx`
- `src/hooks/use-auth.ts`
- `src/hooks/use-user.ts`
- `src/hooks/use-subscription.ts`

---

##### Task 2.3.4: Create Types & Constants
**Module:** `src/types/`, `src/lib/constants/`  
**Dependencies:** Task 1.2.6  
**Estimated Time:** 3 hours

**Description:**  
TypeScript types и константы приложения.

**Acceptance Criteria:**
- [ ] User, Profile types
- [ ] Task, TaskStep, TaskResult types
- [ ] Template types
- [ ] Subscription, Plan types
- [ ] API response types
- [ ] Plans configuration
- [ ] Task status constants
- [ ] Route constants

**Files to Create:**
- `src/types/user.ts`
- `src/types/task.ts`
- `src/types/template.ts`
- `src/types/subscription.ts`
- `src/types/api.ts`
- `src/lib/constants/plans.ts`
- `src/lib/constants/task-status.ts`
- `src/lib/constants/routes.ts`

---

### Stage 3 — Core Features

**Duration:** 3-4 weeks  
**Goal:** Полностью работающая система задач, шаблоны, AI интеграция

---

#### Wave 3.1: Dashboard
**Duration:** 2-3 days  
**Parallel Execution:** Все компоненты после page.tsx

##### Task 3.1.1: Implement Dashboard Page
**Module:** `src/app/(dashboard)/dashboard/`, `src/components/dashboard/`  
**Dependencies:** Wave 2.3  
**Estimated Time:** 6 hours

**Description:**  
Главная страница dashboard с виджетами.

**Acceptance Criteria:**
- [ ] Welcome banner с именем пользователя
- [ ] Quick stats: tasks completed, usage quota
- [ ] Task input карточка (quick create)
- [ ] Active tasks виджет
- [ ] Recent completed tasks
- [ ] Popular templates preview
- [ ] Responsive grid layout

**Files to Create:**
- `src/app/(dashboard)/dashboard/page.tsx`
- `src/components/dashboard/welcome-banner.tsx`
- `src/components/dashboard/quick-stats.tsx`
- `src/components/dashboard/active-tasks.tsx`
- `src/components/dashboard/recent-completed.tsx`
- `src/components/dashboard/popular-templates.tsx`

---

#### Wave 3.2: Task System Backend
**Duration:** 3-4 days  
**Parallel Execution:** API routes параллельно после server actions

##### Task 3.2.1: Implement Task Server Actions
**Module:** `src/app/actions/tasks.ts`  
**Dependencies:** Wave 1.2, Wave 2.1  
**Estimated Time:** 6 hours

**Description:**  
Server Actions для CRUD операций с задачами.

**Acceptance Criteria:**
- [ ] `createTask()` - создание задачи
- [ ] `getTask()` - получение задачи с steps и result
- [ ] `getTasks()` - список задач пользователя с пагинацией
- [ ] `updateTask()` - обновление статуса/прогресса
- [ ] `deleteTask()` - soft delete задачи
- [ ] `pauseTask()` / `resumeTask()` - управление выполнением
- [ ] Zod validation
- [ ] Error handling
- [ ] Task limit check перед созданием

**Files to Create:**
- `src/app/actions/tasks.ts`
- `src/lib/validations/task.ts`

---

##### Task 3.2.2: Implement Tasks API Routes
**Module:** `src/app/api/tasks/`  
**Dependencies:** Task 3.2.1  
**Estimated Time:** 4 hours

**Description:**  
REST API для задач (для realtime и streaming).

**Acceptance Criteria:**
- [ ] `POST /api/tasks` - создание
- [ ] `GET /api/tasks/:id` - детали
- [ ] `DELETE /api/tasks/:id` - удаление
- [ ] `POST /api/tasks/:id/execute` - запуск выполнения
- [ ] Auth middleware на всех routes
- [ ] Rate limiting

**Files to Create:**
- `src/app/api/tasks/route.ts`
- `src/app/api/tasks/[taskId]/route.ts`
- `src/app/api/tasks/[taskId]/execute/route.ts`

---

##### Task 3.2.3: Implement Task Hooks
**Module:** `src/hooks/`  
**Dependencies:** Task 3.2.1  
**Estimated Time:** 3 hours

**Description:**  
React Query hooks для работы с задачами.

**Acceptance Criteria:**
- [ ] `useTasks()` - список с фильтрами и пагинацией
- [ ] `useTask()` - данные одной задачи
- [ ] `useTaskMutation()` - create, update, delete
- [ ] `useTaskRealtime()` - подписка на обновления через Supabase Realtime
- [ ] Proper caching и invalidation

**Files to Create:**
- `src/hooks/use-tasks.ts`
- `src/hooks/use-task.ts`
- `src/hooks/use-task-mutation.ts`
- `src/hooks/use-task-realtime.ts`

---

#### Wave 3.3: Task System UI
**Duration:** 4-5 days  
**Parallel Execution:** Компоненты после task-input

##### Task 3.3.1: Implement Task Input Component
**Module:** `src/components/tasks/task-input/`  
**Dependencies:** Wave 3.2  
**Estimated Time:** 5 hours

**Description:**  
Основной компонент ввода задачи.

**Acceptance Criteria:**
- [ ] Textarea с character counter (10-2000)
- [ ] Example prompts на empty state
- [ ] Submit button с loading state
- [ ] Knowledge base toggle
- [ ] Template selector dropdown
- [ ] Keyboard shortcuts (Cmd+Enter to submit)
- [ ] Validation messages

**Files to Create:**
- `src/components/tasks/task-input/index.tsx`
- `src/components/tasks/task-input/task-input-form.tsx`
- `src/components/tasks/task-input/example-prompts.tsx`

---

##### Task 3.3.2: Implement Task Creation Page
**Module:** `src/app/(dashboard)/tasks/new/`  
**Dependencies:** Task 3.3.1  
**Estimated Time:** 4 hours

**Description:**  
Полная страница создания задачи.

**Acceptance Criteria:**
- [ ] Task input компонент
- [ ] Decomposition preview после submit
- [ ] Confirm/Edit/Regenerate buttons
- [ ] Start execution button
- [ ] Redirect на task detail при старте

**Files to Create:**
- `src/app/(dashboard)/tasks/new/page.tsx`

---

##### Task 3.3.3: Implement Task Detail Page
**Module:** `src/app/(dashboard)/tasks/[taskId]/`  
**Dependencies:** Wave 3.2  
**Estimated Time:** 6 hours

**Description:**  
Страница деталей задачи с прогрессом и результатом.

**Acceptance Criteria:**
- [ ] Task header: title, status, timestamps
- [ ] Progress section с step list (realtime updates)
- [ ] Current step highlight с animation
- [ ] Result section (when completed)
- [ ] Control buttons: pause/resume/cancel
- [ ] Export buttons: copy, markdown, PDF
- [ ] Error state handling
- [ ] Loading skeleton

**Files to Create:**
- `src/app/(dashboard)/tasks/[taskId]/page.tsx`
- `src/components/tasks/task-breakdown/index.tsx`
- `src/components/tasks/task-breakdown/step-list.tsx`
- `src/components/tasks/task-breakdown/step-item.tsx`
- `src/components/tasks/task-progress/index.tsx`
- `src/components/tasks/task-progress/progress-bar.tsx`
- `src/components/tasks/task-result/index.tsx`
- `src/components/tasks/task-result/result-content.tsx`
- `src/components/tasks/task-result/result-actions.tsx`

---

##### Task 3.3.4: Implement Task List/History Page
**Module:** `src/app/(dashboard)/tasks/`  
**Dependencies:** Wave 3.2  
**Estimated Time:** 5 hours

**Description:**  
Список задач с фильтрами и поиском.

**Acceptance Criteria:**
- [ ] Task cards list с статусом
- [ ] Filters: status, date range
- [ ] Search by title
- [ ] Sort: date, status
- [ ] Pagination или infinite scroll
- [ ] Empty state
- [ ] Bulk delete (optional)
- [ ] Click → navigate to detail

**Files to Create:**
- `src/app/(dashboard)/tasks/page.tsx`
- `src/components/tasks/task-card.tsx`
- `src/components/tasks/task-list.tsx`
- `src/components/tasks/task-filters.tsx`
- `src/components/tasks/task-actions.tsx`

---

#### Wave 3.4: AI Integration
**Duration:** 4-5 days  
**Parallel Execution:** 3.4.1 и 3.4.2 последовательно, 3.4.3 параллельно

##### Task 3.4.1: Setup AI Clients
**Module:** `src/lib/ai/`  
**Dependencies:** Wave 1.1  
**Estimated Time:** 3 hours

**Description:**  
Клиенты OpenAI и Anthropic с конфигурацией.

**Acceptance Criteria:**
- [ ] OpenAI client с API key
- [ ] Anthropic client с API key
- [ ] AI SDK (Vercel) setup
- [ ] Error handling и retries
- [ ] Logging token usage

**Files to Create:**
- `src/lib/ai/openai.ts`
- `src/lib/ai/anthropic.ts`
- `src/lib/ai/config.ts`

---

##### Task 3.4.2: Implement Task Decomposition
**Module:** `src/lib/ai/`, `src/app/api/tasks/decompose/`  
**Dependencies:** Task 3.4.1  
**Estimated Time:** 8 hours

**Description:**  
AI сервис для декомпозиции задач на подзадачи.

**Acceptance Criteria:**
- [ ] System prompt для decomposition
- [ ] Structured output: [{title, description, estimatedTime}]
- [ ] Streaming response для быстрого feedback
- [ ] Fallback на Claude при ошибках GPT-4
- [ ] Timeout 10 seconds
- [ ] Cost tracking (tokens)
- [ ] API route `POST /api/tasks/decompose`

**Files to Create:**
- `src/lib/ai/prompts/decomposition.ts`
- `src/services/tasks/decomposer.ts`
- `src/app/api/tasks/decompose/route.ts`

---

##### Task 3.4.3: Implement Task Execution Engine
**Module:** `src/services/tasks/`, `src/app/api/ai/stream/`  
**Dependencies:** Task 3.4.2  
**Estimated Time:** 10 hours

**Description:**  
Сервис последовательного выполнения подзадач с streaming.

**Acceptance Criteria:**
- [ ] Sequential step execution
- [ ] Streaming output через AI SDK
- [ ] Progress updates в БД
- [ ] Realtime broadcasting через Supabase
- [ ] Step timeout (2 min per step)
- [ ] Total task timeout (10 min)
- [ ] Pause/Resume support
- [ ] Error handling per step
- [ ] Result aggregation
- [ ] Token usage tracking

**Files to Create:**
- `src/lib/ai/prompts/execution.ts`
- `src/services/tasks/executor.ts`
- `src/app/api/ai/stream/route.ts`

---

##### Task 3.4.4: Implement Export Service
**Module:** `src/services/tasks/`, `src/lib/pdf/`  
**Dependencies:** Task 3.3.3  
**Estimated Time:** 4 hours

**Description:**  
Экспорт результатов в различные форматы.

**Acceptance Criteria:**
- [ ] Copy to clipboard (plain text + markdown)
- [ ] Markdown file download
- [ ] PDF generation с jsPDF
- [ ] PDF template с TaskPilot branding
- [ ] Metadata в exported files

**Files to Create:**
- `src/services/tasks/exporter.ts`
- `src/lib/pdf/generator.ts`
- `src/lib/pdf/templates.ts`
- `src/hooks/use-copy-to-clipboard.ts`

---

#### Wave 3.5: Templates System
**Duration:** 3-4 days  
**Parallel Execution:** Backend и UI параллельно после базовых compонентов

##### Task 3.5.1: Implement Templates Backend
**Module:** `src/app/actions/templates.ts`, `src/app/api/templates/`  
**Dependencies:** Wave 1.2  
**Estimated Time:** 4 hours

**Description:**  
Backend для работы с шаблонами.

**Acceptance Criteria:**
- [ ] `getTemplates()` - список с filters
- [ ] `getTemplate()` - детали шаблона
- [ ] `useTemplate()` - создание задачи из шаблона
- [ ] Category filtering
- [ ] Search по name/description
- [ ] Usage count increment

**Files to Create:**
- `src/app/actions/templates.ts`
- `src/app/api/templates/route.ts`
- `src/lib/validations/template.ts`

---

##### Task 3.5.2: Implement Template Hooks
**Module:** `src/hooks/`  
**Dependencies:** Task 3.5.1  
**Estimated Time:** 2 hours

**Description:**  
React Query hooks для шаблонов.

**Acceptance Criteria:**
- [ ] `useTemplates()` - список с фильтрами
- [ ] `useTemplate()` - данные одного шаблона
- [ ] Proper caching

**Files to Create:**
- `src/hooks/use-templates.ts`
- `src/hooks/use-template.ts`

---

##### Task 3.5.3: Implement Templates Library Page
**Module:** `src/app/(dashboard)/templates/`, `src/components/templates/`  
**Dependencies:** Task 3.5.2  
**Estimated Time:** 6 hours

**Description:**  
Страница библиотеки шаблонов.

**Acceptance Criteria:**
- [ ] Category tabs (Research, Content, Email, Data Analysis)
- [ ] Template grid с карточками
- [ ] Search input
- [ ] Template card: name, description, usage count, category badge
- [ ] Click → template detail page
- [ ] Empty state per category

**Files to Create:**
- `src/app/(dashboard)/templates/page.tsx`
- `src/components/templates/template-card.tsx`
- `src/components/templates/template-grid.tsx`
- `src/components/templates/template-filters.tsx`
- `src/components/templates/template-search.tsx`
- `src/components/templates/category-tabs.tsx`

---

##### Task 3.5.4: Implement Template Usage Page
**Module:** `src/app/(dashboard)/templates/[templateId]/`  
**Dependencies:** Task 3.5.2, Wave 3.2  
**Estimated Time:** 5 hours

**Description:**  
Страница использования шаблона с формой параметров.

**Acceptance Criteria:**
- [ ] Template header: name, description
- [ ] Dynamic form из template.parameters
- [ ] Required/optional field markers
- [ ] Input validation
- [ ] Example output preview
- [ ] "Create Task" button
- [ ] Redirect на task creation/execution

**Files to Create:**
- `src/app/(dashboard)/templates/[templateId]/page.tsx`
- `src/components/templates/template-form.tsx`

---

### Stage 4 — Advanced Features

**Duration:** 2-3 weeks  
**Goal:** Knowledge Base, Settings, Billing, Landing

---

#### Wave 4.1: Knowledge Base
**Duration:** 4-5 days  
**Parallel Execution:** Backend сначала, затем UI

##### Task 4.1.1: Implement Knowledge Base Backend
**Module:** `src/app/actions/knowledge.ts`, `src/app/api/knowledge/`  
**Dependencies:** Wave 1.2  
**Estimated Time:** 6 hours

**Description:**  
Backend для управления документами knowledge base.

**Acceptance Criteria:**
- [ ] `uploadDocument()` - загрузка с Supabase Storage
- [ ] `getDocuments()` - список документов
- [ ] `deleteDocument()` - удаление
- [ ] File type validation (TXT, MD, PDF, DOCX)
- [ ] Size limit check (10MB per file)
- [ ] Storage quota check

**Files to Create:**
- `src/app/actions/knowledge.ts`
- `src/app/api/knowledge/route.ts`
- `src/app/api/knowledge/upload/route.ts`
- `src/lib/validations/knowledge.ts`

---

##### Task 4.1.2: Implement Document Processing Pipeline
**Module:** `src/services/knowledge/`  
**Dependencies:** Task 4.1.1, Task 3.4.1  
**Estimated Time:** 8 hours

**Description:**  
Pipeline для парсинга документов и создания embeddings.

**Acceptance Criteria:**
- [ ] Text extraction: TXT, MD (direct)
- [ ] PDF parsing с pdf-parse
- [ ] DOCX parsing с mammoth
- [ ] Text chunking (500 tokens per chunk)
- [ ] Embedding generation с OpenAI ada-002
- [ ] Storage в document_embeddings table
- [ ] Status updates (pending → processing → completed)
- [ ] Error handling с retry

**Files to Create:**
- `src/services/knowledge/parser.ts`
- `src/services/knowledge/embedder.ts`
- `src/services/knowledge/index.ts`

---

##### Task 4.1.3: Implement Semantic Search (RAG)
**Module:** `src/services/knowledge/`, `src/app/api/knowledge/search/`  
**Dependencies:** Task 4.1.2  
**Estimated Time:** 5 hours

**Description:**  
Semantic search для retrieval в RAG pipeline.

**Acceptance Criteria:**
- [ ] Query embedding generation
- [ ] pgvector similarity search
- [ ] Top-k retrieval (k=5)
- [ ] Score threshold filtering
- [ ] Context formatting для AI prompt
- [ ] API route `POST /api/knowledge/search`

**Files to Create:**
- `src/services/knowledge/retriever.ts`
- `src/app/api/knowledge/search/route.ts`

---

##### Task 4.1.4: Implement Knowledge Base UI
**Module:** `src/app/(dashboard)/knowledge/`, `src/components/knowledge/`  
**Dependencies:** Task 4.1.1  
**Estimated Time:** 6 hours

**Description:**  
UI для управления knowledge base.

**Acceptance Criteria:**
- [ ] Document list с статусом обработки
- [ ] Upload zone (drag & drop)
- [ ] Upload progress indicator
- [ ] Folder organization (optional MVP)
- [ ] Storage usage indicator
- [ ] Delete confirmation
- [ ] Processing status badges

**Files to Create:**
- `src/app/(dashboard)/knowledge/page.tsx`
- `src/components/knowledge/document-card.tsx`
- `src/components/knowledge/document-list.tsx`
- `src/components/knowledge/document-upload.tsx`
- `src/components/knowledge/processing-status.tsx`
- `src/components/knowledge/storage-usage.tsx`
- `src/hooks/use-documents.ts`
- `src/hooks/use-document-upload.ts`

---

##### Task 4.1.5: Integrate Knowledge Base with Task Execution
**Module:** `src/services/tasks/`  
**Dependencies:** Task 4.1.3, Task 3.4.3  
**Estimated Time:** 4 hours

**Description:**  
Интеграция RAG в task execution pipeline.

**Acceptance Criteria:**
- [ ] Retrieve relevant context при execution
- [ ] Inject context в AI prompts
- [ ] Source attribution в результатах
- [ ] Toggle в task input UI
- [ ] Document selection в task creation

---

#### Wave 4.2: Settings & Profile
**Duration:** 2-3 days  
**Parallel Execution:** Все страницы параллельно

##### Task 4.2.1: Implement Settings Layout
**Module:** `src/app/(dashboard)/settings/`  
**Dependencies:** Wave 2.3  
**Estimated Time:** 2 hours

**Description:**  
Layout для settings с табами.

**Acceptance Criteria:**
- [ ] Tabbed navigation: Profile, Subscription, Preferences
- [ ] Active tab highlighting
- [ ] Mobile-friendly tabs

**Files to Create:**
- `src/app/(dashboard)/settings/layout.tsx`
- `src/app/(dashboard)/settings/page.tsx` (redirect)
- `src/components/settings/settings-nav.tsx`

---

##### Task 4.2.2: Implement Profile Settings
**Module:** `src/app/(dashboard)/settings/profile/`, `src/components/settings/`  
**Dependencies:** Task 4.2.1  
**Estimated Time:** 4 hours

**Description:**  
Страница настроек профиля.

**Acceptance Criteria:**
- [ ] Full name edit
- [ ] Avatar upload (Supabase Storage)
- [ ] Email display (readonly)
- [ ] Password change form
- [ ] Danger zone: delete account

**Files to Create:**
- `src/app/(dashboard)/settings/profile/page.tsx`
- `src/app/actions/user.ts`
- `src/components/settings/profile-form.tsx`
- `src/components/settings/avatar-upload.tsx`
- `src/components/settings/danger-zone.tsx`

---

##### Task 4.2.3: Implement Preferences Settings
**Module:** `src/app/(dashboard)/settings/preferences/`  
**Dependencies:** Task 4.2.1  
**Estimated Time:** 3 hours

**Description:**  
Страница пользовательских настроек.

**Acceptance Criteria:**
- [ ] Theme selector (light/dark/system)
- [ ] Default knowledge base toggle
- [ ] Email notifications toggles
- [ ] Language selector (future, stub for now)
- [ ] Save с toast confirmation

**Files to Create:**
- `src/app/(dashboard)/settings/preferences/page.tsx`
- `src/components/settings/preferences-form.tsx`

---

#### Wave 4.3: Billing & Subscription
**Duration:** 4-5 days  
**Parallel Execution:** Backend сначала, UI параллельно с webhooks

##### Task 4.3.1: Setup Stripe Integration
**Module:** `src/lib/stripe/`  
**Dependencies:** Wave 1.1  
**Estimated Time:** 4 hours

**Description:**  
Настройка Stripe SDK и конфигурации.

**Acceptance Criteria:**
- [ ] Stripe JS client setup
- [ ] Stripe server SDK setup
- [ ] Products/Prices созданы в Stripe dashboard
- [ ] Price IDs в config
- [ ] Plans config matching PRD

**Files to Create:**
- `src/lib/stripe/client.ts`
- `src/lib/stripe/server.ts`
- `src/lib/stripe/config.ts`

---

##### Task 4.3.2: Implement Checkout Flow
**Module:** `src/app/api/stripe/`, `src/app/actions/`  
**Dependencies:** Task 4.3.1  
**Estimated Time:** 5 hours

**Description:**  
Stripe Checkout для подписки.

**Acceptance Criteria:**
- [ ] `createCheckoutSession()` server action
- [ ] API route для checkout redirect
- [ ] Success page `/billing/success`
- [ ] Cancel redirect handling
- [ ] Customer creation в Stripe

**Files to Create:**
- `src/app/api/stripe/checkout/route.ts`
- `src/app/actions/subscription.ts`
- `src/app/(dashboard)/billing/success/page.tsx`

---

##### Task 4.3.3: Implement Stripe Webhooks
**Module:** `src/app/api/stripe/webhook/`  
**Dependencies:** Task 4.3.1  
**Estimated Time:** 6 hours

**Description:**  
Webhook handler для Stripe events.

**Acceptance Criteria:**
- [ ] Signature verification
- [ ] Handle: checkout.session.completed
- [ ] Handle: customer.subscription.updated
- [ ] Handle: customer.subscription.deleted
- [ ] Handle: invoice.paid
- [ ] Update subscription в БД
- [ ] Reset monthly task count on renewal

**Files to Create:**
- `src/app/api/stripe/webhook/route.ts`
- `src/services/billing/subscription.ts`

---

##### Task 4.3.4: Implement Customer Portal
**Module:** `src/app/api/stripe/portal/`  
**Dependencies:** Task 4.3.1  
**Estimated Time:** 2 hours

**Description:**  
Redirect на Stripe Customer Portal.

**Acceptance Criteria:**
- [ ] Create portal session
- [ ] Redirect к Stripe
- [ ] Return URL handling

**Files to Create:**
- `src/app/api/stripe/portal/route.ts`

---

##### Task 4.3.5: Implement Billing UI
**Module:** `src/app/(dashboard)/billing/`, `src/components/billing/`  
**Dependencies:** Task 4.3.2  
**Estimated Time:** 5 hours

**Description:**  
UI для биллинга и подписки.

**Acceptance Criteria:**
- [ ] Current plan card
- [ ] Usage stats (tasks used / limit)
- [ ] Upgrade/downgrade buttons
- [ ] Plan comparison grid
- [ ] Billing history link (Stripe portal)
- [ ] Cancel subscription button

**Files to Create:**
- `src/app/(dashboard)/billing/page.tsx`
- `src/app/(dashboard)/settings/subscription/page.tsx`
- `src/components/billing/current-plan.tsx`
- `src/components/billing/pricing-card.tsx`
- `src/components/billing/pricing-grid.tsx`
- `src/components/billing/usage-chart.tsx`
- `src/components/billing/upgrade-modal.tsx`

---

#### Wave 4.4: Landing Page
**Duration:** 3-4 days  
**Parallel Execution:** Все секции параллельно после layout

##### Task 4.4.1: Create Marketing Layout
**Module:** `src/app/(marketing)/`  
**Dependencies:** Wave 2.3  
**Estimated Time:** 3 hours

**Description:**  
Layout для маркетинговых страниц.

**Acceptance Criteria:**
- [ ] Marketing header с navigation
- [ ] CTA buttons (Login, Get Started)
- [ ] Footer с links
- [ ] No sidebar
- [ ] SEO metadata

**Files to Create:**
- `src/app/(marketing)/layout.tsx`
- `src/components/layout/header/marketing-header.tsx`
- `src/components/layout/footer/index.tsx`

---

##### Task 4.4.2: Implement Landing Page
**Module:** `src/app/(marketing)/`, `src/components/landing/`  
**Dependencies:** Task 4.4.1  
**Estimated Time:** 8 hours

**Description:**  
Главная landing page.

**Acceptance Criteria:**
- [ ] Hero section с demo input
- [ ] Features section (4-6 features)
- [ ] How it works (3 steps)
- [ ] Use cases tabs
- [ ] Testimonials carousel (placeholder)
- [ ] Pricing preview
- [ ] FAQ accordion
- [ ] CTA banner
- [ ] Social proof badges

**Files to Create:**
- `src/app/(marketing)/page.tsx`
- `src/components/landing/hero-section.tsx`
- `src/components/landing/demo-input.tsx`
- `src/components/landing/features-section.tsx`
- `src/components/landing/how-it-works.tsx`
- `src/components/landing/use-cases-tabs.tsx`
- `src/components/landing/testimonials.tsx`
- `src/components/landing/faq-accordion.tsx`
- `src/components/landing/cta-banner.tsx`
- `src/components/landing/social-proof.tsx`

---

##### Task 4.4.3: Implement Pricing Page
**Module:** `src/app/(marketing)/pricing/`  
**Dependencies:** Task 4.4.1, Task 4.3.1  
**Estimated Time:** 4 hours

**Description:**  
Страница с ценами и планами.

**Acceptance Criteria:**
- [ ] Plan comparison table
- [ ] Feature matrix
- [ ] FAQ about billing
- [ ] CTA buttons to signup/upgrade
- [ ] Annual/Monthly toggle (future, stub)

**Files to Create:**
- `src/app/(marketing)/pricing/page.tsx`

---

##### Task 4.4.4: Implement Public Templates Page
**Module:** `src/app/(marketing)/templates/`  
**Dependencies:** Task 4.4.1, Task 3.5.1  
**Estimated Time:** 3 hours

**Description:**  
Публичная страница каталога шаблонов.

**Acceptance Criteria:**
- [ ] Template grid (preview only)
- [ ] Category filters
- [ ] CTA to signup to use

**Files to Create:**
- `src/app/(marketing)/templates/page.tsx`

---

### Stage 5 — Testing & Polish

**Duration:** 1.5-2 weeks  
**Goal:** Тесты, accessibility, performance, final polish

---

#### Wave 5.1: Testing Infrastructure
**Duration:** 2-3 days  
**Parallel Execution:** Unit и E2E setup параллельно

##### Task 5.1.1: Setup Unit Testing
**Module:** `tests/unit/`  
**Dependencies:** All previous waves  
**Estimated Time:** 4 hours

**Description:**  
Настройка Vitest для unit tests.

**Acceptance Criteria:**
- [ ] Vitest configuration
- [ ] Testing Library setup
- [ ] Mock setup для Supabase
- [ ] Mock setup для OpenAI
- [ ] Coverage reporting

**Files to Create:**
- `vitest.config.ts`
- `tests/setup.ts`
- `tests/fixtures/mocks/supabase.ts`
- `tests/fixtures/mocks/openai.ts`

---

##### Task 5.1.2: Write Unit Tests
**Module:** `tests/unit/`  
**Dependencies:** Task 5.1.1  
**Estimated Time:** 8 hours

**Description:**  
Unit tests для критических модулей.

**Acceptance Criteria:**
- [ ] Tests для utils functions
- [ ] Tests для validation schemas
- [ ] Tests для hooks (useAuth, useTasks)
- [ ] Tests для services (decomposer, executor)
- [ ] Coverage ≥80% для services

**Files to Create:**
- `tests/unit/lib/utils.test.ts`
- `tests/unit/lib/validations.test.ts`
- `tests/unit/hooks/use-auth.test.ts`
- `tests/unit/hooks/use-tasks.test.ts`
- `tests/unit/services/decomposer.test.ts`
- `tests/unit/services/executor.test.ts`

---

##### Task 5.1.3: Setup E2E Testing
**Module:** `tests/e2e/`  
**Dependencies:** Task 5.1.1  
**Estimated Time:** 4 hours

**Description:**  
Настройка Playwright для E2E tests.

**Acceptance Criteria:**
- [ ] Playwright configuration
- [ ] Test user в seed data
- [ ] Auth helper для login
- [ ] Screenshot on failure
- [ ] CI integration

**Files to Create:**
- `playwright.config.ts`
- `tests/e2e/utils/auth.ts`

---

##### Task 5.1.4: Write E2E Tests
**Module:** `tests/e2e/`  
**Dependencies:** Task 5.1.3  
**Estimated Time:** 8 hours

**Description:**  
E2E tests для critical paths.

**Acceptance Criteria:**
- [ ] Auth flow: register → verify → login
- [ ] Task creation flow
- [ ] Template usage flow
- [ ] Settings update flow
- [ ] Billing upgrade flow (mock Stripe)

**Files to Create:**
- `tests/e2e/auth.spec.ts`
- `tests/e2e/task-creation.spec.ts`
- `tests/e2e/templates.spec.ts`
- `tests/e2e/settings.spec.ts`
- `tests/e2e/billing.spec.ts`

---

#### Wave 5.2: Accessibility & Performance
**Duration:** 2-3 days  
**Parallel Execution:** A11y и Performance параллельно

##### Task 5.2.1: Accessibility Audit & Fixes
**Module:** All components  
**Dependencies:** All previous waves  
**Estimated Time:** 6 hours

**Description:**  
WCAG 2.1 AA compliance audit и исправления.

**Acceptance Criteria:**
- [ ] Lighthouse accessibility score ≥90
- [ ] Keyboard navigation works everywhere
- [ ] Screen reader support (ARIA labels)
- [ ] Color contrast compliance
- [ ] Focus indicators visible
- [ ] Skip links added

---

##### Task 5.2.2: Performance Optimization
**Module:** All pages  
**Dependencies:** All previous waves  
**Estimated Time:** 6 hours

**Description:**  
Performance audit и оптимизации.

**Acceptance Criteria:**
- [ ] Lighthouse performance score ≥90
- [ ] LCP <2.5s
- [ ] FID <100ms
- [ ] CLS <0.1
- [ ] Bundle analysis и tree shaking
- [ ] Image optimization
- [ ] Font loading optimization

---

##### Task 5.2.3: Error Handling & Monitoring
**Module:** `src/app/`, `src/lib/`  
**Dependencies:** All previous waves  
**Estimated Time:** 4 hours

**Description:**  
Global error handling и Sentry setup.

**Acceptance Criteria:**
- [ ] Sentry SDK installed
- [ ] Source maps uploaded
- [ ] Error boundary на root
- [ ] Custom error pages (404, 500)
- [ ] User feedback widget
- [ ] Performance monitoring

**Files to Create:**
- `src/app/error.tsx`
- `src/app/not-found.tsx`
- `sentry.client.config.ts`
- `sentry.server.config.ts`

---

#### Wave 5.3: Final Polish
**Duration:** 2-3 days  
**Parallel Execution:** Все задачи параллельно

##### Task 5.3.1: SEO Optimization
**Module:** `src/app/`  
**Dependencies:** All previous waves  
**Estimated Time:** 4 hours

**Description:**  
SEO настройка для всех страниц.

**Acceptance Criteria:**
- [ ] Metadata для всех pages
- [ ] Open Graph tags
- [ ] Twitter cards
- [ ] Structured data (JSON-LD)
- [ ] Sitemap generation
- [ ] Robots.txt

**Files to Create:**
- `src/lib/config/seo.ts`
- `src/app/sitemap.ts`
- `public/robots.txt`

---

##### Task 5.3.2: Loading States & Skeletons
**Module:** All pages  
**Dependencies:** All previous waves  
**Estimated Time:** 4 hours

**Description:**  
Добавление loading states для всех async операций.

**Acceptance Criteria:**
- [ ] Loading.tsx для каждой route group
- [ ] Skeleton components для cards
- [ ] Suspense boundaries
- [ ] Optimistic UI updates

**Files to Create:**
- `src/app/(dashboard)/loading.tsx`
- `src/app/(auth)/loading.tsx`
- `src/components/common/skeleton-*.tsx`

---

##### Task 5.3.3: Documentation & README
**Module:** Root, `docs/`  
**Dependencies:** All previous waves  
**Estimated Time:** 3 hours

**Description:**  
Финальная документация проекта.

**Acceptance Criteria:**
- [ ] README с setup instructions
- [ ] Environment variables documentation
- [ ] API documentation (basic)
- [ ] Contributing guidelines
- [ ] Deployment guide

**Files to Create/Update:**
- `README.md`
- `CONTRIBUTING.md`
- `docs/DEPLOYMENT.md`
- `docs/API.md`

---

## Dependencies Graph

```
Wave 1.1 (Project Init)
    │
    ├── Wave 1.2 (Supabase Setup)
    │       │
    │       └── Wave 2.1 (Auth Backend)
    │               │
    │               ├── Wave 2.2 (Auth UI)
    │               │
    │               └── Wave 2.3 (Core UI)
    │                       │
    │                       ├── Wave 3.1 (Dashboard)
    │                       │
    │                       ├── Wave 3.2 (Task Backend)
    │                       │       │
    │                       │       └── Wave 3.3 (Task UI)
    │                       │
    │                       ├── Wave 3.4 (AI Integration)
    │                       │       │
    │                       │       └── Wave 4.1 (Knowledge Base)
    │                       │
    │                       ├── Wave 3.5 (Templates)
    │                       │
    │                       ├── Wave 4.2 (Settings)
    │                       │
    │                       ├── Wave 4.3 (Billing)
    │                       │
    │                       └── Wave 4.4 (Landing)
    │                               │
    │                               └── Wave 5.1-5.3 (Testing & Polish)
```

---

## Resource Requirements

### Team Allocation

| Role | Wave 1 | Wave 2 | Wave 3 | Wave 4 | Wave 5 |
|------|--------|--------|--------|--------|--------|
| Frontend Dev 1 | Setup | Auth UI | Task UI | Landing | Testing |
| Frontend Dev 2 | - | Core UI | Templates | Billing UI | A11y |
| Full-stack Dev | Supabase | Auth Backend | AI Integration | Knowledge Base | Performance |

### External Services Setup

| Service | When Needed | Setup Time |
|---------|-------------|------------|
| Supabase | Wave 1.2 | 1 hour |
| Vercel | Wave 1.1 | 30 min |
| OpenAI API | Wave 3.4 | 30 min |
| Anthropic API | Wave 3.4 | 30 min |
| Stripe | Wave 4.3 | 2 hours |
| Sentry | Wave 5.2 | 1 hour |

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| AI API rate limits | Medium | High | Implement fallback, caching, retry logic |
| Stripe integration complexity | Low | Medium | Follow official docs, use test mode extensively |
| pgvector performance | Low | Medium | Index optimization, batch processing |
| Real-time scaling | Medium | Medium | Supabase handles, monitor usage |
| Auth edge cases | Medium | Medium | Comprehensive testing, follow Supabase guides |

---

## Timeline Summary

| Stage | Duration | Weeks |
|-------|----------|-------|
| Stage 1: Foundation | 1.5-2 weeks | 1-2 |
| Stage 2: Auth & Core UI | 1.5-2 weeks | 2-4 |
| Stage 3: Core Features | 3-4 weeks | 4-8 |
| Stage 4: Advanced Features | 2-3 weeks | 8-11 |
| Stage 5: Testing & Polish | 1.5-2 weeks | 11-12 |
| **Total** | **10-12 weeks** | - |

---

## Resource Links

### Documentation
- [Next.js 14 Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Vercel AI SDK](https://sdk.vercel.ai/docs)
- [OpenAI API](https://platform.openai.com/docs)
- [Stripe Docs](https://stripe.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Tools
- [Playwright](https://playwright.dev)
- [Vitest](https://vitest.dev)
- [Sentry](https://docs.sentry.io/platforms/javascript/guides/nextjs/)

---

## Reconciliation Notes

| PRD Requirement | Implementation Decision | Notes |
|-----------------|------------------------|-------|
| FR-1.1 User Registration | Wave 2.1-2.2 | Supabase Auth с email verification |
| FR-2.0 Task System | Wave 3.2-3.4 | Realtime via Supabase, streaming via AI SDK |
| FR-3.0 Templates | Wave 3.5 | 20 templates in seed data |
| FR-4.0 Knowledge Base | Wave 4.1 | pgvector for embeddings, RAG integration |
| FR-5.0 Progress Tracking | Wave 3.3 | Supabase Realtime subscriptions |
| FR-6.0 Export | Task 3.4.4 | jsPDF for PDF, native download for MD |
| FR-7.0 Billing | Wave 4.3 | Stripe Checkout + Customer Portal |
| P2 Features | Deferred | Task re-run, custom templates - post-MVP |

---

## Success Criteria

MVP считается завершённым когда:

1. [ ] Все P0 features реализованы и протестированы
2. [ ] Lighthouse scores ≥90 (Performance, Accessibility)
3. [ ] Test coverage ≥80% для services
4. [ ] E2E tests pass для всех critical paths
5. [ ] Production deployment на Vercel успешен
6. [ ] Stripe payments работают в production
7. [ ] Task completion rate ≥85% в тестировании
8. [ ] Документация полная
