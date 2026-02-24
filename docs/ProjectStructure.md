# Project Structure: TaskPilot

**Version:** 1.0  
**Date:** February 24, 2026  
**Status:** Final  
**Framework:** Next.js 14 (App Router)

---

## Architecture Overview

TaskPilot использует **модульную архитектуру** на базе Next.js 14 App Router с чётким разделением ответственности:

```
taskpilot/
├── src/                    # Исходный код приложения
│   ├── app/               # Next.js App Router (страницы, layouts, API)
│   ├── components/        # React компоненты
│   ├── lib/               # Утилиты, клиенты, хелперы
│   ├── hooks/             # Кастомные React хуки
│   ├── stores/            # Zustand stores (клиентское состояние)
│   ├── services/          # Бизнес-логика и API клиенты
│   ├── types/             # TypeScript типы и интерфейсы
│   └── styles/            # Глобальные стили
├── public/                # Статические файлы
├── tests/                 # Тесты (unit, integration, e2e)
├── supabase/             # Supabase миграции и конфигурация
├── docs/                  # Документация проекта
└── [config files]        # Конфигурационные файлы
```

---

## Root Directory

```
taskpilot/
├── .github/                    # GitHub Actions и конфигурация
│   ├── workflows/
│   │   ├── ci.yml             # CI pipeline (lint, test, build)
│   │   └── deploy-preview.yml # Preview deployments
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── ISSUE_TEMPLATE/
│       ├── bug_report.md
│       └── feature_request.md
│
├── .husky/                     # Git hooks
│   ├── pre-commit             # Запуск lint-staged
│   └── commit-msg             # Проверка формата коммитов
│
├── .vscode/                    # VS Code настройки
│   ├── settings.json          # Настройки редактора
│   ├── extensions.json        # Рекомендуемые расширения
│   └── launch.json            # Конфигурация отладки
│
├── docs/                       # Документация
│   ├── PRD.md                 # Product Requirements Document
│   ├── TechStack.md           # Технический стек
│   ├── DBSchema.md            # Схема базы данных
│   ├── UI_UX.md               # UI/UX спецификация
│   └── ProjectStructure.md    # Структура проекта (этот файл)
│
├── public/                     # Статические ресурсы
│   ├── favicon.ico
│   ├── logo.svg
│   ├── og-image.png           # Open Graph изображение
│   ├── robots.txt
│   └── sitemap.xml
│
├── supabase/                   # Supabase конфигурация
│   ├── migrations/            # SQL миграции
│   │   ├── 00001_init_schema.sql
│   │   ├── 00002_rls_policies.sql
│   │   ├── 00003_functions.sql
│   │   └── 00004_triggers.sql
│   ├── seed.sql               # Начальные данные
│   └── config.toml            # Локальная конфигурация
│
├── tests/                      # Тесты
│   ├── unit/                  # Unit тесты (Vitest)
│   ├── integration/           # Интеграционные тесты
│   ├── e2e/                   # E2E тесты (Playwright)
│   ├── fixtures/              # Тестовые данные и моки
│   └── setup.ts               # Глобальная настройка тестов
│
├── src/                        # Исходный код
│   └── [см. детальную структуру ниже]
│
├── .env.example               # Шаблон переменных окружения
├── .env.local                 # Локальные переменные (не в git)
├── .eslintrc.cjs              # ESLint конфигурация
├── .gitignore                 # Git игнорируемые файлы
├── .prettierrc                # Prettier конфигурация
├── commitlint.config.js       # Commitlint правила
├── components.json            # shadcn/ui конфигурация
├── next.config.mjs            # Next.js конфигурация
├── package.json               # Зависимости проекта
├── pnpm-lock.yaml             # Lockfile (pnpm)
├── postcss.config.mjs         # PostCSS конфигурация
├── tailwind.config.ts         # Tailwind CSS конфигурация
├── tsconfig.json              # TypeScript конфигурация
├── vitest.config.ts           # Vitest конфигурация
└── playwright.config.ts       # Playwright конфигурация
```

---

## src/ Directory

### Общая структура

```
src/
├── app/                   # Next.js App Router
├── components/            # React компоненты
├── lib/                   # Утилиты и клиенты
├── hooks/                 # Кастомные хуки
├── stores/                # Zustand state management
├── services/              # Бизнес-логика
├── types/                 # TypeScript типы
└── styles/                # Глобальные стили
```

---

## src/app/ — Next.js App Router

**Назначение:** Страницы, layouts, API routes, Server Actions

```
src/app/
├── (marketing)/                    # Группа: маркетинговые страницы
│   ├── layout.tsx                 # Layout без sidebar
│   ├── page.tsx                   # Landing page (/)
│   ├── pricing/
│   │   └── page.tsx               # Страница цен
│   ├── templates/
│   │   └── page.tsx               # Публичный каталог шаблонов
│   └── features/
│       └── page.tsx               # Страница возможностей
│
├── (auth)/                         # Группа: аутентификация
│   ├── layout.tsx                 # Auth layout (split-screen)
│   ├── login/
│   │   └── page.tsx               # Страница входа
│   ├── register/
│   │   └── page.tsx               # Страница регистрации
│   ├── forgot-password/
│   │   └── page.tsx               # Восстановление пароля
│   ├── reset-password/
│   │   └── page.tsx               # Сброс пароля
│   └── verify-email/
│       └── page.tsx               # Подтверждение email
│
├── (dashboard)/                    # Группа: приложение (требует auth)
│   ├── layout.tsx                 # Dashboard layout с sidebar
│   ├── dashboard/
│   │   └── page.tsx               # Главный дашборд
│   ├── tasks/
│   │   ├── page.tsx               # Список задач / история
│   │   ├── new/
│   │   │   └── page.tsx           # Создание задачи
│   │   └── [taskId]/
│   │       └── page.tsx           # Детали задачи
│   ├── templates/
│   │   ├── page.tsx               # Библиотека шаблонов
│   │   └── [templateId]/
│   │       └── page.tsx           # Использование шаблона
│   ├── knowledge/
│   │   ├── page.tsx               # База знаний
│   │   └── [folderId]/
│   │       └── page.tsx           # Папка в базе знаний
│   ├── settings/
│   │   ├── page.tsx               # Перенаправление на profile
│   │   ├── layout.tsx             # Settings layout с табами
│   │   ├── profile/
│   │   │   └── page.tsx           # Профиль пользователя
│   │   ├── subscription/
│   │   │   └── page.tsx           # Управление подпиской
│   │   └── preferences/
│   │       └── page.tsx           # Настройки приложения
│   └── billing/
│       ├── page.tsx               # Страница биллинга
│       └── success/
│           └── page.tsx           # Успешная оплата
│
├── api/                            # API Routes
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts           # OAuth callback
│   ├── tasks/
│   │   ├── route.ts               # POST /api/tasks (создание)
│   │   ├── [taskId]/
│   │   │   ├── route.ts           # GET, DELETE /api/tasks/:id
│   │   │   └── execute/
│   │   │       └── route.ts       # POST (запуск выполнения)
│   │   └── decompose/
│   │       └── route.ts           # POST (AI декомпозиция)
│   ├── templates/
│   │   └── route.ts               # GET /api/templates
│   ├── knowledge/
│   │   ├── route.ts               # GET, POST documents
│   │   ├── upload/
│   │   │   └── route.ts           # POST file upload
│   │   └── search/
│   │       └── route.ts           # POST semantic search
│   ├── stripe/
│   │   ├── checkout/
│   │   │   └── route.ts           # POST create checkout session
│   │   ├── portal/
│   │   │   └── route.ts           # POST customer portal
│   │   └── webhook/
│   │       └── route.ts           # POST Stripe webhooks
│   └── ai/
│       └── stream/
│           └── route.ts           # POST AI streaming response
│
├── actions/                        # Server Actions
│   ├── auth.ts                    # login, logout, register
│   ├── tasks.ts                   # createTask, updateTask, deleteTask
│   ├── templates.ts               # useTemplate
│   ├── knowledge.ts               # uploadDocument, deleteDocument
│   ├── subscription.ts            # updateSubscription
│   └── user.ts                    # updateProfile, updatePreferences
│
├── error.tsx                       # Global error boundary
├── loading.tsx                     # Global loading UI
├── not-found.tsx                   # 404 страница
├── layout.tsx                      # Root layout
├── globals.css                     # Глобальные стили
├── providers.tsx                   # Client providers (QueryClient, etc.)
└── manifest.ts                     # PWA manifest
```

### Naming Conventions для app/

| Файл | Назначение |
|------|------------|
| `page.tsx` | Страница маршрута |
| `layout.tsx` | Layout для вложенных страниц |
| `loading.tsx` | Loading UI (Suspense fallback) |
| `error.tsx` | Error boundary |
| `not-found.tsx` | 404 страница |
| `route.ts` | API route handler |

---

## src/components/

**Назначение:** React компоненты, организованные по atomic design + feature-based

```
src/components/
├── ui/                             # Базовые UI компоненты (shadcn/ui)
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   ├── textarea.tsx
│   ├── select.tsx
│   ├── checkbox.tsx
│   ├── radio-group.tsx
│   ├── switch.tsx
│   ├── dialog.tsx
│   ├── dropdown-menu.tsx
│   ├── popover.tsx
│   ├── tooltip.tsx
│   ├── tabs.tsx
│   ├── accordion.tsx
│   ├── badge.tsx
│   ├── avatar.tsx
│   ├── progress.tsx
│   ├── skeleton.tsx
│   ├── toast.tsx
│   ├── toaster.tsx
│   ├── separator.tsx
│   ├── scroll-area.tsx
│   ├── form.tsx
│   ├── label.tsx
│   └── sonner.tsx                 # Toast notifications
│
├── common/                         # Переиспользуемые компоненты проекта
│   ├── logo.tsx                   # Логотип
│   ├── theme-toggle.tsx           # Переключатель темы
│   ├── user-avatar.tsx            # Аватар пользователя с меню
│   ├── loading-spinner.tsx        # Спиннер загрузки
│   ├── empty-state.tsx            # Пустое состояние
│   ├── error-message.tsx          # Сообщение об ошибке
│   ├── confirmation-dialog.tsx    # Диалог подтверждения
│   ├── file-upload.tsx            # Загрузка файлов
│   ├── markdown-renderer.tsx      # Рендер Markdown
│   ├── copy-button.tsx            # Кнопка копирования
│   └── page-header.tsx            # Заголовок страницы
│
├── layout/                         # Layout компоненты
│   ├── header/
│   │   ├── index.tsx              # Экспорт
│   │   ├── marketing-header.tsx   # Header для landing
│   │   └── app-header.tsx         # Header для app
│   ├── sidebar/
│   │   ├── index.tsx
│   │   ├── sidebar.tsx            # Основной sidebar
│   │   ├── sidebar-nav.tsx        # Навигация
│   │   ├── sidebar-user.tsx       # Блок пользователя
│   │   └── sidebar-usage.tsx      # Блок использования квоты
│   ├── footer/
│   │   └── index.tsx              # Footer для landing
│   └── mobile-nav.tsx             # Мобильная навигация
│
├── auth/                           # Компоненты аутентификации
│   ├── login-form.tsx
│   ├── register-form.tsx
│   ├── forgot-password-form.tsx
│   ├── reset-password-form.tsx
│   ├── oauth-buttons.tsx          # Google, GitHub кнопки
│   ├── password-strength.tsx      # Индикатор силы пароля
│   └── auth-guard.tsx             # Защита роутов
│
├── dashboard/                      # Компоненты дашборда
│   ├── welcome-banner.tsx         # Приветствие пользователя
│   ├── quick-stats.tsx            # Карточки статистики
│   ├── active-tasks.tsx           # Список активных задач
│   ├── recent-completed.tsx       # Недавно завершённые
│   └── popular-templates.tsx      # Популярные шаблоны
│
├── tasks/                          # Компоненты задач
│   ├── task-input/
│   │   ├── index.tsx              # Task Input Card
│   │   ├── task-input-form.tsx    # Форма ввода
│   │   └── example-prompts.tsx    # Примеры задач
│   ├── task-card.tsx              # Карточка задачи в списке
│   ├── task-list.tsx              # Список задач
│   ├── task-filters.tsx           # Фильтры задач
│   ├── task-breakdown/
│   │   ├── index.tsx              # Компонент декомпозиции
│   │   ├── step-list.tsx          # Список шагов
│   │   └── step-item.tsx          # Элемент шага
│   ├── task-progress/
│   │   ├── index.tsx              # Task Progress Card
│   │   ├── progress-bar.tsx       # Полоса прогресса
│   │   └── step-status.tsx        # Статус шага
│   ├── task-result/
│   │   ├── index.tsx              # Результат задачи
│   │   ├── result-content.tsx     # Контент результата
│   │   ├── result-actions.tsx     # Кнопки экспорта
│   │   └── feedback-buttons.tsx   # Кнопки обратной связи
│   └── task-actions.tsx           # Действия над задачей
│
├── templates/                      # Компоненты шаблонов
│   ├── template-card.tsx          # Карточка шаблона
│   ├── template-grid.tsx          # Сетка шаблонов
│   ├── template-filters.tsx       # Фильтры по категориям
│   ├── template-search.tsx        # Поиск шаблонов
│   ├── template-form.tsx          # Форма параметров шаблона
│   └── category-tabs.tsx          # Табы категорий
│
├── knowledge/                      # Компоненты базы знаний
│   ├── document-card.tsx          # Карточка документа
│   ├── document-list.tsx          # Список документов
│   ├── document-upload.tsx        # Загрузка документов
│   ├── folder-tree.tsx            # Дерево папок
│   ├── processing-status.tsx      # Статус обработки
│   └── storage-usage.tsx          # Использование хранилища
│
├── settings/                       # Компоненты настроек
│   ├── profile-form.tsx           # Форма профиля
│   ├── avatar-upload.tsx          # Загрузка аватара
│   ├── preferences-form.tsx       # Форма настроек
│   ├── danger-zone.tsx            # Удаление аккаунта
│   └── settings-nav.tsx           # Навигация настроек
│
├── billing/                        # Компоненты биллинга
│   ├── pricing-card.tsx           # Карточка плана
│   ├── pricing-grid.tsx           # Сетка планов
│   ├── current-plan.tsx           # Текущий план
│   ├── usage-chart.tsx            # График использования
│   ├── invoice-list.tsx           # Список счетов
│   └── upgrade-modal.tsx          # Модал апгрейда
│
└── landing/                        # Компоненты лендинга
    ├── hero-section.tsx           # Hero секция
    ├── demo-input.tsx             # Демо input на hero
    ├── features-section.tsx       # Секция возможностей
    ├── how-it-works.tsx           # Как это работает
    ├── use-cases-tabs.tsx         # Табы с use cases
    ├── testimonials.tsx           # Отзывы (карусель)
    ├── faq-accordion.tsx          # FAQ аккордеон
    ├── cta-banner.tsx             # CTA баннер
    └── social-proof.tsx           # Социальное доказательство
```

### Component Structure Convention

Каждый компонент следует структуре:

```tsx
// components/tasks/task-card.tsx

import { cn } from "@/lib/utils"
import { Task } from "@/types/task"

interface TaskCardProps {
  task: Task
  className?: string
}

export function TaskCard({ task, className }: TaskCardProps) {
  // ...
}
```

---

## src/lib/

**Назначение:** Утилиты, клиенты внешних сервисов, хелперы

```
src/lib/
├── supabase/                       # Supabase клиенты
│   ├── client.ts                  # Browser client
│   ├── server.ts                  # Server client (cookies)
│   ├── middleware.ts              # Auth middleware helper
│   └── admin.ts                   # Service role client
│
├── stripe/                         # Stripe интеграция
│   ├── client.ts                  # Stripe JS client
│   ├── server.ts                  # Stripe server SDK
│   ├── config.ts                  # Stripe products/prices config
│   └── helpers.ts                 # Stripe utility functions
│
├── ai/                             # AI интеграция
│   ├── openai.ts                  # OpenAI client
│   ├── anthropic.ts               # Anthropic client
│   ├── prompts/                   # Системные промпты
│   │   ├── decomposition.ts       # Промпт декомпозиции
│   │   ├── execution.ts           # Промпт выполнения
│   │   └── templates/             # Промпты для шаблонов
│   │       ├── research.ts
│   │       ├── content.ts
│   │       └── outreach.ts
│   └── embeddings.ts              # Генерация эмбеддингов
│
├── validations/                    # Zod схемы валидации
│   ├── auth.ts                    # Схемы аутентификации
│   ├── task.ts                    # Схемы задач
│   ├── template.ts                # Схемы шаблонов
│   ├── knowledge.ts               # Схемы базы знаний
│   ├── user.ts                    # Схемы пользователя
│   └── billing.ts                 # Схемы биллинга
│
├── utils/                          # Утилитарные функции
│   ├── index.ts                   # Реэкспорт всех utils
│   ├── cn.ts                      # clsx + tailwind-merge
│   ├── format.ts                  # Форматирование дат, чисел
│   ├── file.ts                    # Работа с файлами
│   └── errors.ts                  # Обработка ошибок
│
├── constants/                      # Константы приложения
│   ├── index.ts
│   ├── plans.ts                   # Конфигурация планов
│   ├── limits.ts                  # Лимиты по планам
│   ├── routes.ts                  # Константы маршрутов
│   └── task-status.ts             # Статусы задач
│
├── config/                         # Конфигурация
│   ├── site.ts                    # Метаданные сайта
│   ├── nav.ts                     # Навигационные ссылки
│   └── seo.ts                     # SEO конфигурация
│
└── pdf/                            # PDF генерация
    ├── generator.ts               # jsPDF генератор
    └── templates.ts               # PDF шаблоны
```

---

## src/hooks/

**Назначение:** Кастомные React хуки

```
src/hooks/
├── use-auth.ts                    # Хук аутентификации
├── use-user.ts                    # Данные текущего пользователя
├── use-subscription.ts            # Данные подписки
│
├── use-task.ts                    # Данные задачи (TanStack Query)
├── use-tasks.ts                   # Список задач
├── use-task-mutation.ts           # Мутации задач
├── use-task-realtime.ts           # Realtime обновления задачи
│
├── use-templates.ts               # Список шаблонов
├── use-template.ts                # Данные шаблона
│
├── use-documents.ts               # Список документов KB
├── use-document-upload.ts         # Загрузка документов
│
├── use-debounce.ts                # Debounce значения
├── use-local-storage.ts           # LocalStorage state
├── use-media-query.ts             # Media query hooks
├── use-copy-to-clipboard.ts       # Копирование в буфер
├── use-toast.ts                   # Toast notifications
└── use-mounted.ts                 # Отслеживание mounted state
```

---

## src/stores/

**Назначение:** Zustand stores для клиентского состояния

```
src/stores/
├── index.ts                       # Реэкспорт stores
├── user-store.ts                  # Данные пользователя (кэш)
├── ui-store.ts                    # UI состояние (sidebar, modals)
├── task-editor-store.ts           # Состояние редактора задач
└── preferences-store.ts           # Пользовательские настройки (theme)
```

### Store Structure Convention

```ts
// stores/ui-store.ts

import { create } from 'zustand'

interface UIState {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}))
```

---

## src/services/

**Назначение:** Сервисный слой — бизнес-логика, взаимодействие с API

```
src/services/
├── api/                            # API клиенты
│   ├── client.ts                  # Базовый HTTP клиент
│   ├── tasks.ts                   # CRUD задач
│   ├── templates.ts               # API шаблонов
│   ├── knowledge.ts               # API базы знаний
│   ├── users.ts                   # API пользователей
│   └── billing.ts                 # API биллинга
│
├── auth/                           # Сервис аутентификации
│   ├── index.ts
│   ├── session.ts                 # Управление сессиями
│   └── providers.ts               # OAuth providers
│
├── tasks/                          # Сервис задач
│   ├── index.ts
│   ├── decomposer.ts              # AI декомпозиция
│   ├── executor.ts                # Выполнение задач
│   └── exporter.ts                # Экспорт результатов
│
├── knowledge/                      # Сервис базы знаний
│   ├── index.ts
│   ├── parser.ts                  # Парсинг документов
│   ├── embedder.ts                # Генерация эмбеддингов
│   └── retriever.ts               # RAG retrieval
│
└── billing/                        # Сервис биллинга
    ├── index.ts
    ├── subscription.ts            # Управление подписками
    └── usage.ts                   # Учёт использования
```

---

## src/types/

**Назначение:** TypeScript типы и интерфейсы

```
src/types/
├── index.ts                       # Реэкспорт типов
├── database.ts                    # Supabase generated types
├── user.ts                        # User, Profile types
├── task.ts                        # Task, TaskStep, TaskResult
├── template.ts                    # Template, TemplateCategory
├── knowledge.ts                   # Document, Embedding
├── subscription.ts                # Subscription, Plan, Usage
├── api.ts                         # API request/response types
└── common.ts                      # Общие типы (Pagination, etc.)
```

### Type Generation

```bash
# Генерация типов из Supabase
pnpm supabase gen types typescript --local > src/types/database.ts
```

---

## src/styles/

**Назначение:** Глобальные стили и CSS переменные

```
src/styles/
├── globals.css                    # Главный CSS файл (Tailwind + CSS vars)
├── fonts.css                      # Подключение шрифтов
└── prose.css                      # Стили для Markdown контента
```

---

## tests/

**Назначение:** Тесты всех уровней

```
tests/
├── unit/                           # Unit тесты (Vitest)
│   ├── lib/
│   │   ├── utils.test.ts
│   │   └── validations.test.ts
│   ├── hooks/
│   │   ├── use-debounce.test.ts
│   │   └── use-auth.test.ts
│   └── services/
│       └── tasks.test.ts
│
├── integration/                    # Интеграционные тесты
│   ├── api/
│   │   ├── tasks.test.ts
│   │   └── templates.test.ts
│   └── components/
│       ├── task-input.test.tsx
│       └── login-form.test.tsx
│
├── e2e/                            # E2E тесты (Playwright)
│   ├── auth.spec.ts               # Тесты аутентификации
│   ├── task-creation.spec.ts      # Создание задачи
│   ├── templates.spec.ts          # Работа с шаблонами
│   └── billing.spec.ts            # Тесты биллинга
│
├── fixtures/                       # Тестовые данные
│   ├── users.ts
│   ├── tasks.ts
│   ├── templates.ts
│   └── mocks/
│       ├── supabase.ts
│       ├── stripe.ts
│       └── openai.ts
│
└── setup.ts                        # Глобальная настройка
```

---

## supabase/

**Назначение:** Конфигурация и миграции Supabase

```
supabase/
├── migrations/
│   ├── 00001_init_schema.sql      # Создание таблиц
│   ├── 00002_rls_policies.sql     # Row Level Security
│   ├── 00003_functions.sql        # Database functions
│   ├── 00004_triggers.sql         # Triggers (updated_at, etc.)
│   └── 00005_indexes.sql          # Дополнительные индексы
│
├── functions/                      # Edge Functions (если нужно)
│   └── process-document/
│       └── index.ts
│
├── seed.sql                        # Начальные данные (templates, categories)
└── config.toml                     # Локальная конфигурация Supabase
```

---

## Naming Conventions

### Файлы и папки

| Тип | Конвенция | Пример |
|-----|-----------|--------|
| Компоненты | kebab-case | `task-card.tsx` |
| Хуки | kebab-case с `use-` | `use-auth.ts` |
| Stores | kebab-case с `-store` | `ui-store.ts` |
| Типы | kebab-case | `task.ts` |
| Утилиты | kebab-case | `format.ts` |
| Страницы | kebab-case папки | `forgot-password/page.tsx` |
| API routes | kebab-case папки | `api/tasks/route.ts` |

### Экспорты

| Тип | Конвенция | Пример |
|-----|-----------|--------|
| Компоненты | PascalCase named export | `export function TaskCard()` |
| Хуки | camelCase named export | `export function useAuth()` |
| Stores | camelCase named export | `export const useUIStore` |
| Типы | PascalCase | `export interface Task` |
| Утилиты | camelCase | `export function formatDate()` |

---

## Feature-to-Module Mapping

| Feature (PRD) | App Route | Components | Services |
|---------------|-----------|------------|----------|
| Authentication | `(auth)/*` | `auth/*` | `auth/*` |
| Dashboard | `(dashboard)/dashboard` | `dashboard/*` | — |
| Task Delegation | `(dashboard)/tasks/*` | `tasks/*` | `tasks/*` |
| Templates | `(dashboard)/templates/*` | `templates/*` | `api/templates.ts` |
| Knowledge Base | `(dashboard)/knowledge/*` | `knowledge/*` | `knowledge/*` |
| Settings | `(dashboard)/settings/*` | `settings/*` | `api/users.ts` |
| Billing | `(dashboard)/billing/*` | `billing/*` | `billing/*` |
| Landing | `(marketing)/*` | `landing/*` | — |

---

## Environment Variables

```bash
# .env.example

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=TaskPilot

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# AI
OPENAI_API_KEY=
ANTHROPIC_API_KEY=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Sentry (production)
SENTRY_DSN=
SENTRY_AUTH_TOKEN=
```

---

## Scripts (package.json)

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "typecheck": "tsc --noEmit",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "test": "vitest",
    "test:unit": "vitest run",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "db:generate": "supabase gen types typescript --local > src/types/database.ts",
    "db:migrate": "supabase db push",
    "db:reset": "supabase db reset",
    "prepare": "husky"
  }
}
```

---

## Reconciliation Notes

| Source Document | Requirement | Structure Decision |
|-----------------|-------------|-------------------|
| TechStack.md | Next.js 14 App Router | Route groups: `(marketing)`, `(auth)`, `(dashboard)` |
| TechStack.md | shadcn/ui | Components в `src/components/ui/` |
| DBSchema.md | 10 сущностей | Types в `src/types/` соответствуют таблицам |
| UI_UX.md | 20+ экранов | Каждый экран имеет соответствующий route |
| PRD.md | 8 модулей | Компоненты сгруппированы по модулям |
| TechStack.md | Vitest + Playwright | Отдельные папки в `tests/` |
| TechStack.md | pnpm | `pnpm-lock.yaml` в корне |

---

## Summary

Структура проекта TaskPilot оптимизирована для:

1. **Масштабируемости** — модульная организация позволяет легко добавлять фичи
2. **Поддержки** — чёткое разделение ответственности упрощает навигацию
3. **Тестирования** — изолированные модули легко тестируются
4. **Командной работы** — стандартные конвенции минимизируют конфликты
5. **Производительности** — Next.js App Router обеспечивает оптимальную загрузку
