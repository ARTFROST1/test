# Product Requirements Document: TaskPilot

**Version:** 1.0  
**Date:** February 24, 2026  
**Status:** Draft  
**Owner:** Product Team

---

## Executive Summary

### Problem Statement
Фрилансеры, предприниматели и маркетологи тратят 40-60% рабочего времени на рутинные бизнес-задачи (исследования, создание контента, email outreach, анализ данных). Найм виртуального ассистента обходится в $15-50/час, что недоступно для большинства небольших бизнесов и индивидуальных специалистов. Существующие AI-инструменты требуют значительного ручного управления и не обеспечивают end-to-end автоматизацию задач.

### Proposed Solution
**TaskPilot** — SaaS-платформа, где пользователи делегируют повседневные бизнес-задачи AI-агентам через естественный язык. Агенты автоматически декомпозируют задачи, выполняют их пошагово и предоставляют готовые результаты. Платформа работает как виртуальный ассистент 24/7 по доступной подписке.

### Success Metrics (KPIs)

| Метрика | MVP Target (3 мес) | Post-MVP (6 мес) |
|---------|-------------------|------------------|
| MAU (Monthly Active Users) | 1,000 | 10,000 |
| Task Completion Rate | ≥85% | ≥90% |
| User Retention (Day 30) | ≥25% | ≥40% |
| NPS Score | ≥30 | ≥50 |
| Free → Paid Conversion | ≥3% | ≥7% |
| MRR | $5,000 | $50,000 |
| Avg. Task Completion Time | <5 min | <3 min |

### Timeline Overview

| Phase | Период | Deliverables |
|-------|--------|--------------|
| Phase 0: MVP | Mar-May 2026 | Core delegation, templates, export |
| Phase 1: Growth | Jun-Aug 2026 | Integrations, advanced AI, team features |
| Phase 2: Scale | Sep-Nov 2026 | API, enterprise, marketplace |

---

## Context & Inputs

### Stakeholders

| Role | Responsibilities |
|------|------------------|
| Product Owner | Vision, prioritization, roadmap |
| Engineering Lead | Technical architecture, delivery |
| Design Lead | UX/UI, user research |
| Marketing | GTM strategy, positioning |
| Customer Success | Onboarding, feedback collection |

### Related Documents & Data Sources
- Market research: AI assistant market analysis Q1 2026
- Competitor analysis: Zapier, Notion AI, Copy.ai, Jasper
- User interviews: 50+ interviews with target audience (summary below)

### Market & Competitive Summary

**Market Size:**
- TAM (Total Addressable Market): $15B (AI productivity tools)
- SAM (Serviceable Available Market): $3B (AI task automation)
- SOM (Serviceable Obtainable Market): $30M (SMB/freelancer segment)

**Competitive Landscape:**

| Competitor | Strength | Weakness | TaskPilot Differentiator |
|------------|----------|----------|--------------------------|
| Zapier | Automation workflows | Requires technical setup | Natural language input |
| Notion AI | Integrated workspace | Limited to content tasks | End-to-end task execution |
| Copy.ai | Content generation | Single-purpose | Multi-domain task support |
| ChatGPT | Conversational AI | No task tracking/persistence | Structured task management |
| Virtual Assistants | Human quality | $15-50/hour cost | 10x cheaper, 24/7 availability |

**Key Differentiators:**
1. Natural language task delegation (zero learning curve)
2. Intelligent task decomposition with progress tracking
3. Personal knowledge base for contextual execution
4. Template library for common business tasks
5. 10x cheaper than human VAs

---

## Target Audience & Personas

### Persona 1: Sarah — Freelance Consultant

**Demographics:**
- Age: 32
- Role: Marketing Consultant
- Company Size: Solo
- Tech Savviness: Medium
- Budget: $50-100/mo on tools

**Goals:**
- Spend more time on client work, less on admin
- Scale business without hiring
- Maintain quality and consistency

**Pain Points:**
- 15+ hours/week on research and email follow-ups
- Cannot afford full-time VA
- Existing tools require too much setup

**TaskPilot Use Cases:**
- Market research for client proposals
- Email outreach sequences
- Content briefs and drafts

---

### Persona 2: Alex — Solo Entrepreneur

**Demographics:**
- Age: 38
- Role: E-commerce store owner
- Company Size: 1-3 employees
- Tech Savviness: Low-Medium
- Budget: $100-300/mo on tools

**Goals:**
- Automate repetitive operational tasks
- Focus on strategic growth
- Reduce dependency on contractors

**Pain Points:**
- Overwhelmed by daily operations
- Inconsistent quality from freelancers
- No time for market analysis

**TaskPilot Use Cases:**
- Product description generation
- Competitor price monitoring
- Customer email responses

---

### Persona 3: Maya — Startup Founder

**Demographics:**
- Age: 29
- Role: CEO/Founder
- Company Size: 5-10 employees
- Tech Savviness: High
- Budget: $200-500/mo on tools

**Goals:**
- Move fast with limited resources
- Maintain quality across multiple projects
- Free up team for high-value work

**Pain Points:**
- Team bottleneck on content and research
- Too many tools, fragmented workflows
- Need consistency across outputs

**TaskPilot Use Cases:**
- Investor research and outreach
- Blog content production
- Competitive intelligence

---

### Persona 4: Jordan — Content Creator

**Demographics:**
- Age: 26
- Role: YouTuber / Blogger
- Company Size: Solo
- Tech Savviness: Medium
- Budget: $30-100/mo on tools

**Goals:**
- Increase content output
- Repurpose content across platforms
- Grow audience without burnout

**Pain Points:**
- Research takes longer than creation
- Inconsistent posting schedule
- Manual transcription and repurposing

**TaskPilot Use Cases:**
- Topic research and outlines
- Script drafts
- Social media adaptation

---

## User Journeys & Critical Paths

### Journey 1: First Task Delegation (Activation)

**Trigger:** New user signs up via landing page

**Steps:**
1. User lands on TaskPilot → clicks "Get Started Free"
2. Sign up via email/Google OAuth
3. Welcome screen explains 3-step process
4. User enters first task in natural language (e.g., "Research top 10 CRM tools for small business")
5. AI agent shows task breakdown with estimated time
6. User confirms or adjusts scope
7. Agent executes task, showing real-time progress
8. User receives completed results with export options
9. Success modal prompts to save to history and try template

**Expected Outcomes:**
- Task completed within 5 minutes
- User understands value proposition
- User saves result or starts second task

**Success Metrics:**
- Activation rate (complete first task): ≥60%
- Time to first value: <10 minutes

---

### Journey 2: Template-Based Task (Retention)

**Trigger:** Returning user needs recurring task

**Steps:**
1. User opens TaskPilot dashboard
2. Navigates to Template Library
3. Selects "Email Outreach Sequence" template
4. Fills required inputs (target audience, product, tone)
5. AI generates personalized sequence
6. User reviews, edits if needed
7. Exports to preferred format (Markdown/PDF)
8. Saves to history for future reference

**Expected Outcomes:**
- Consistent, high-quality outputs
- Reduced task creation time
- Increased engagement with templates

**Success Metrics:**
- Template usage rate: ≥40% of tasks
- Repeat template usage: ≥30%

---

### Journey 3: Knowledge Base Utilization (Engagement)

**Trigger:** User wants personalized outputs

**Steps:**
1. User navigates to Personal Knowledge Base
2. Uploads company info (brand guidelines, product details, etc.)
3. Links external sources (website, docs)
4. Creates new task referencing knowledge base
5. AI pulls relevant context automatically
6. Output reflects user's specific context
7. User provides feedback to improve future outputs

**Expected Outcomes:**
- Highly personalized task results
- Reduced need for manual edits
- Increased user investment in platform

**Success Metrics:**
- Knowledge base adoption: ≥50% of paying users
- Output edit rate reduction: ≥30%

---

### Journey 4: Subscription Upgrade (Conversion)

**Trigger:** Free user hits 5-task limit

**Steps:**
1. User attempts 6th task in month
2. Upgrade modal appears with plan comparison
3. User reviews Pro ($29) vs Business ($99) features
4. Selects plan and enters payment info
5. Immediate access to increased limits
6. Confirmation email with receipt

**Expected Outcomes:**
- Smooth upgrade flow
- Clear value differentiation
- Successful payment processing

**Success Metrics:**
- Upgrade modal → checkout: ≥20%
- Checkout → success: ≥70%
- Overall conversion: ≥3%

---

## Functional Requirements

### FR-1.0 User Authentication & Onboarding

#### FR-1.1 User Registration (Priority: P0)
**Description:** Users SHALL be able to create an account using email/password or OAuth providers (Google, GitHub).

**Acceptance Criteria:**
- [ ] Email registration with verification link
- [ ] Google OAuth integration functional
- [ ] Password requirements: min 8 chars, 1 uppercase, 1 number
- [ ] Duplicate email prevention with clear error message
- [ ] Terms of Service acceptance checkbox required

**Dependencies:** Supabase Auth
**Traceability:** Business Objective BO-1 (User Acquisition)

---

#### FR-1.2 User Login (Priority: P0)
**Description:** Registered users SHALL be able to log in securely with persistent sessions.

**Acceptance Criteria:**
- [ ] Email/password login with error handling
- [ ] OAuth login for registered providers
- [ ] "Remember me" option for 30-day session
- [ ] Rate limiting: max 5 failed attempts per 15 min
- [ ] Password reset via email link

**Dependencies:** FR-1.1
**Traceability:** BO-1

---

#### FR-1.3 Onboarding Flow (Priority: P1)
**Description:** New users SHALL be guided through an onboarding sequence to maximize activation.

**Acceptance Criteria:**
- [ ] 3-step tutorial explaining core features
- [ ] Optional survey for personalization (role, use case)
- [ ] First task prompt with example suggestions
- [ ] Skip option available at each step
- [ ] Progress indicator visible

**Dependencies:** FR-1.1
**Traceability:** BO-2 (User Activation)

---

### FR-2.0 Task Delegation System

#### FR-2.1 Natural Language Task Input (Priority: P0)
**Description:** Users SHALL be able to describe tasks in natural language through a text input interface.

**Acceptance Criteria:**
- [ ] Text input field with min 10, max 2000 characters
- [ ] Real-time character count display
- [ ] Example prompts available on empty state
- [ ] Support for English language (MVP)
- [ ] Input sanitization for security

**Dependencies:** None
**Traceability:** BO-3 (Core Value Delivery)

---

#### FR-2.2 AI Task Decomposition (Priority: P0)
**Description:** The AI agent SHALL analyze task input and break it into executable subtasks with estimated completion time.

**Acceptance Criteria:**
- [ ] Task breakdown shown within 3 seconds of submission
- [ ] Each subtask has title, description, estimated time
- [ ] Total estimated time displayed
- [ ] User can approve, edit, or regenerate breakdown
- [ ] Breakdown persisted before execution starts

**Dependencies:** FR-2.1, OpenAI/Anthropic API
**Traceability:** BO-3

---

#### FR-2.3 Task Execution Engine (Priority: P0)
**Description:** The AI agent SHALL execute approved tasks sequentially, showing real-time progress.

**Acceptance Criteria:**
- [ ] Subtasks execute in logical order
- [ ] Progress indicator updates in real-time
- [ ] Current subtask highlighted during execution
- [ ] Execution can be paused/resumed by user
- [ ] Error handling with clear user feedback
- [ ] Timeout after 10 minutes with partial results returned

**Dependencies:** FR-2.2
**Traceability:** BO-3

---

#### FR-2.4 Task Result Delivery (Priority: P0)
**Description:** Completed tasks SHALL present results in a structured, readable format.

**Acceptance Criteria:**
- [ ] Results displayed in formatted Markdown
- [ ] Section headers for organized content
- [ ] Code blocks rendered with syntax highlighting
- [ ] Links rendered as clickable hyperlinks
- [ ] Copy-to-clipboard functionality
- [ ] Results auto-saved to task history

**Dependencies:** FR-2.3
**Traceability:** BO-3

---

### FR-3.0 Template Library

#### FR-3.1 Template Browsing (Priority: P0)
**Description:** Users SHALL be able to browse and search pre-built task templates.

**Acceptance Criteria:**
- [ ] Template grid/list view with previews
- [ ] Category filters (Research, Content, Email, Data Analysis)
- [ ] Search by template name and description
- [ ] Popularity/rating indicators
- [ ] Template count: minimum 20 at launch

**Dependencies:** None
**Traceability:** BO-4 (User Efficiency)

---

#### FR-3.2 Template Usage (Priority: P0)
**Description:** Users SHALL be able to use templates by filling required parameters.

**Acceptance Criteria:**
- [ ] Clear input fields for each template parameter
- [ ] Required vs optional fields marked
- [ ] Input validation with helpful error messages
- [ ] Preview of expected output format
- [ ] "Use Template" button triggers task execution

**Dependencies:** FR-3.1, FR-2.0
**Traceability:** BO-4

---

#### FR-3.3 Template Categories (Priority: P1)

**MVP Template Categories:**

| Category | Templates |
|----------|-----------|
| Research | Market Research, Competitor Analysis, Industry Trends, Product Comparison |
| Content | Blog Post Draft, Social Media Posts, Email Newsletter, Product Description |
| Email Outreach | Cold Email Sequence, Follow-up Emails, Partnership Outreach, Customer Feedback Request |
| Data Analysis | Survey Analysis, Spreadsheet Summary, KPI Report, Customer Segmentation |

**Dependencies:** FR-3.1
**Traceability:** BO-4

---

### FR-4.0 Personal Knowledge Base

#### FR-4.1 Knowledge Upload (Priority: P1)
**Description:** Users SHALL be able to upload documents to their personal knowledge base.

**Acceptance Criteria:**
- [ ] Supported formats: TXT, MD, PDF, DOCX (max 10MB per file)
- [ ] Drag-and-drop upload interface
- [ ] Upload progress indicator
- [ ] File list with delete option
- [ ] Storage limit: 100MB (Free), 1GB (Pro), 10GB (Business)

**Dependencies:** Supabase Storage
**Traceability:** BO-5 (Personalization)

---

#### FR-4.2 Knowledge Management (Priority: P1)
**Description:** Users SHALL be able to organize and manage their uploaded knowledge.

**Acceptance Criteria:**
- [ ] Folder/tag organization system
- [ ] File rename and move capabilities
- [ ] Preview functionality for text files
- [ ] Bulk delete option
- [ ] Storage usage indicator

**Dependencies:** FR-4.1
**Traceability:** BO-5

---

#### FR-4.3 Knowledge Integration (Priority: P1)
**Description:** The AI agent SHALL automatically reference relevant knowledge base content during task execution.

**Acceptance Criteria:**
- [ ] AI retrieves relevant context using semantic search
- [ ] User can manually select specific documents for task
- [ ] Source attribution shown in results
- [ ] Toggle to enable/disable knowledge base for task

**Dependencies:** FR-4.1, FR-2.3
**Traceability:** BO-5

---

### FR-5.0 Progress Tracking

#### FR-5.1 Real-time Progress Display (Priority: P0)
**Description:** Users SHALL see real-time progress during task execution.

**Acceptance Criteria:**
- [ ] Overall progress percentage
- [ ] Current subtask indicator
- [ ] Elapsed time display
- [ ] Estimated remaining time
- [ ] Visual progress bar

**Dependencies:** FR-2.3, Supabase Realtime
**Traceability:** BO-6 (User Experience)

---

#### FR-5.2 Task History (Priority: P0)
**Description:** Users SHALL have access to a history of all completed tasks.

**Acceptance Criteria:**
- [ ] List view with task title, date, status
- [ ] Search and filter by date range
- [ ] Click to view full results
- [ ] Delete individual tasks
- [ ] Retention: 90 days (Free), unlimited (Pro/Business)

**Dependencies:** FR-2.4
**Traceability:** BO-6

---

#### FR-5.3 Task Re-run (Priority: P2)
**Description:** Users MAY re-run previous tasks with same or modified parameters.

**Acceptance Criteria:**
- [ ] "Re-run" button on history items
- [ ] Option to modify inputs before re-run
- [ ] New results saved as separate history entry

**Dependencies:** FR-5.2
**Traceability:** BO-6

---

### FR-6.0 Export System

#### FR-6.1 Markdown Export (Priority: P0)
**Description:** Users SHALL be able to export task results as Markdown files.

**Acceptance Criteria:**
- [ ] One-click download as .md file
- [ ] Properly formatted Markdown syntax
- [ ] Includes task metadata (title, date, parameters)
- [ ] Works on all modern browsers

**Dependencies:** FR-2.4
**Traceability:** BO-7 (Output Portability)

---

#### FR-6.2 PDF Export (Priority: P1)
**Description:** Users SHALL be able to export task results as PDF documents.

**Acceptance Criteria:**
- [ ] One-click download as .pdf file
- [ ] Professional formatting with headers/footers
- [ ] TaskPilot branding (removable on Business plan)
- [ ] Proper pagination for long results

**Dependencies:** FR-2.4
**Traceability:** BO-7

---

#### FR-6.3 Clipboard Copy (Priority: P0)
**Description:** Users SHALL be able to copy results to clipboard.

**Acceptance Criteria:**
- [ ] Copy button for full results
- [ ] Copy button for individual sections
- [ ] Visual confirmation of copy action
- [ ] Plain text and formatted options

**Dependencies:** FR-2.4
**Traceability:** BO-7

---

### FR-7.0 Subscription & Billing

#### FR-7.1 Plan Display (Priority: P0)
**Description:** Users SHALL see clear information about available plans and their current subscription.

**Acceptance Criteria:**
- [ ] Pricing page with plan comparison table
- [ ] Current plan highlighted in account settings
- [ ] Task usage counter visible in dashboard
- [ ] Warning at 80% and 100% of task limit

**Dependencies:** None
**Traceability:** BO-8 (Monetization)

---

#### FR-7.2 Subscription Management (Priority: P0)
**Description:** Users SHALL be able to subscribe, upgrade, downgrade, and cancel plans.

**Acceptance Criteria:**
- [ ] Stripe checkout integration
- [ ] Upgrade effective immediately
- [ ] Downgrade effective at billing cycle end
- [ ] Cancel with confirmation and feedback survey
- [ ] Prorated billing for mid-cycle upgrades

**Dependencies:** Stripe API
**Traceability:** BO-8

---

#### FR-7.3 Invoice & Receipt (Priority: P1)
**Description:** Users SHALL receive invoices and have access to billing history.

**Acceptance Criteria:**
- [ ] Email receipt after each payment
- [ ] Billing history in account settings
- [ ] Downloadable PDF invoices
- [ ] Tax-compliant invoice format

**Dependencies:** FR-7.2
**Traceability:** BO-8

---

## Non-Functional Requirements

### NFR-1.0 Performance

| Requirement | Metric | Target | Measurement |
|-------------|--------|--------|-------------|
| NFR-1.1 | Page Load Time | <2s @ 95th percentile | Lighthouse, RUM |
| NFR-1.2 | API Response Time (read) | <300ms @ 95th percentile | APM |
| NFR-1.3 | API Response Time (write) | <500ms @ 95th percentile | APM |
| NFR-1.4 | Task Decomposition Time | <3s @ 95th percentile | Custom metrics |
| NFR-1.5 | Time to First Byte (TTFB) | <200ms | CDN metrics |
| NFR-1.6 | Core Web Vitals - LCP | <2.5s | Lighthouse |
| NFR-1.7 | Core Web Vitals - FID | <100ms | Lighthouse |
| NFR-1.8 | Core Web Vitals - CLS | <0.1 | Lighthouse |

---

### NFR-2.0 Availability & Reliability

| Requirement | Metric | Target |
|-------------|--------|--------|
| NFR-2.1 | Service Uptime | ≥99.5% monthly |
| NFR-2.2 | Planned Maintenance Window | <4 hours/month |
| NFR-2.3 | Recovery Time Objective (RTO) | <1 hour |
| NFR-2.4 | Recovery Point Objective (RPO) | <15 minutes |
| NFR-2.5 | Error Rate (5xx) | <0.1% of requests |

---

### NFR-3.0 Scalability

| Requirement | Target |
|-------------|--------|
| NFR-3.1 | Concurrent Users | 1,000 (MVP), 10,000 (6 months) |
| NFR-3.2 | Tasks per Day | 5,000 (MVP), 50,000 (6 months) |
| NFR-3.3 | Database Size | 100GB initial capacity |
| NFR-3.4 | File Storage | 1TB initial capacity |
| NFR-3.5 | Horizontal Scaling | Auto-scale on Vercel |

---

### NFR-4.0 Security

| Requirement | Specification |
|-------------|---------------|
| NFR-4.1 | Data Encryption at Rest | AES-256 for all PII |
| NFR-4.2 | Data Encryption in Transit | TLS 1.3 minimum |
| NFR-4.3 | Authentication | JWT with secure httpOnly cookies |
| NFR-4.4 | Authorization | Row-level security (RLS) in Supabase |
| NFR-4.5 | API Security | Rate limiting, CORS, input validation |
| NFR-4.6 | Password Storage | Bcrypt with salt (cost factor 12) |
| NFR-4.7 | Session Management | Automatic expiry, secure token rotation |
| NFR-4.8 | Vulnerability Scanning | Weekly automated scans |

---

### NFR-5.0 Compliance

| Requirement | Specification |
|-------------|---------------|
| NFR-5.1 | GDPR Compliance | Data subject rights, privacy policy |
| NFR-5.2 | CCPA Compliance | California privacy requirements |
| NFR-5.3 | Cookie Consent | Compliant consent banner |
| NFR-5.4 | Data Retention | Configurable retention policies |
| NFR-5.5 | Audit Logging | All data access logged |

---

### NFR-6.0 Usability

| Requirement | Target |
|-------------|--------|
| NFR-6.1 | Mobile Responsiveness | Full functionality on 375px+ |
| NFR-6.2 | Accessibility | WCAG 2.1 AA compliance |
| NFR-6.3 | Browser Support | Chrome, Firefox, Safari, Edge (latest 2 versions) |
| NFR-6.4 | Onboarding Completion | ≥70% complete tutorial |
| NFR-6.5 | Task Completion Rate | ≥85% without support |

---

### NFR-7.0 Maintainability

| Requirement | Specification |
|-------------|---------------|
| NFR-7.1 | Code Coverage | ≥80% unit test coverage |
| NFR-7.2 | Documentation | JSDoc for all public functions |
| NFR-7.3 | Deployment Frequency | Daily deploys capability |
| NFR-7.4 | Rollback Time | <5 minutes |
| NFR-7.5 | Error Monitoring | Real-time alerting (Sentry) |

---

## Data Model

### Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│    User     │───1:N─│    Task     │───1:N─│   Subtask   │
└─────────────┘       └─────────────┘       └─────────────┘
       │                     │
       │                     │
       │1:1            1:N   │
       ▼                     ▼
┌─────────────┐       ┌─────────────┐
│Subscription │       │ TaskResult  │
└─────────────┘       └─────────────┘
       │
       │
┌─────────────┐       ┌─────────────┐
│  Knowledge  │───N:1─│    User     │
│    Base     │       └─────────────┘
└─────────────┘
       │
       │1:N
       ▼
┌─────────────┐
│  Document   │
└─────────────┘
```

### Core Entities

#### Users

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  full_name VARCHAR(100),
  avatar_url VARCHAR(500),
  auth_provider VARCHAR(20) DEFAULT 'email',
  email_verified BOOLEAN DEFAULT FALSE,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ
);
```

#### Subscriptions

```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  plan VARCHAR(20) NOT NULL DEFAULT 'free', -- free, pro, business
  status VARCHAR(20) NOT NULL DEFAULT 'active', -- active, canceled, past_due
  stripe_customer_id VARCHAR(100),
  stripe_subscription_id VARCHAR(100),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  tasks_used_this_month INTEGER DEFAULT 0,
  task_limit INTEGER NOT NULL DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Tasks

```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  template_id UUID REFERENCES templates(id),
  status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending, decomposing, executing, completed, failed, canceled
  progress INTEGER DEFAULT 0, -- 0-100
  estimated_time_seconds INTEGER,
  actual_time_seconds INTEGER,
  use_knowledge_base BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);
```

#### Subtasks

```sql
CREATE TABLE subtasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending, in_progress, completed, failed
  estimated_time_seconds INTEGER,
  actual_time_seconds INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Task Results

```sql
CREATE TABLE task_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  content_format VARCHAR(20) DEFAULT 'markdown',
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Templates

```sql
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL,
  prompt_template TEXT NOT NULL,
  parameters JSONB NOT NULL, -- [{name, type, required, description}]
  usage_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Knowledge Base Documents

```sql
CREATE TABLE knowledge_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_type VARCHAR(20) NOT NULL,
  file_size INTEGER NOT NULL,
  folder VARCHAR(255),
  embedding_status VARCHAR(20) DEFAULT 'pending', -- pending, processing, completed, failed
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Document Embeddings

```sql
CREATE TABLE document_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES knowledge_documents(id) ON DELETE CASCADE,
  chunk_index INTEGER NOT NULL,
  content TEXT NOT NULL,
  embedding vector(1536), -- OpenAI ada-002 embedding size
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## API & Integration Specs

### Authentication API

#### POST /api/auth/register
**Description:** Register a new user

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "fullName": "John Doe"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Verification email sent",
  "userId": "uuid"
}
```

**Errors:**
- 400: Invalid input
- 409: Email already exists
- 429: Rate limit exceeded

---

#### POST /api/auth/login
**Description:** Authenticate user and create session

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "rememberMe": true
}
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "John Doe"
  },
  "accessToken": "jwt_token"
}
```

**Errors:**
- 401: Invalid credentials
- 403: Email not verified
- 429: Rate limit exceeded

---

### Tasks API

#### POST /api/tasks
**Description:** Create and initiate a new task

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Request:**
```json
{
  "description": "Research the top 10 CRM tools for small businesses",
  "templateId": "uuid (optional)",
  "templateParams": { "industry": "retail" },
  "useKnowledgeBase": true,
  "documentIds": ["uuid", "uuid"]
}
```

**Response (201):**
```json
{
  "success": true,
  "task": {
    "id": "uuid",
    "title": "CRM Tools Research",
    "status": "decomposing",
    "estimatedTimeSeconds": 180,
    "createdAt": "2026-02-24T10:00:00Z"
  }
}
```

**Errors:**
- 400: Invalid input
- 401: Unauthorized
- 402: Task limit reached
- 500: AI processing error

---

#### GET /api/tasks/{taskId}
**Description:** Get task details and status

**Response (200):**
```json
{
  "task": {
    "id": "uuid",
    "title": "CRM Tools Research",
    "description": "Research the top 10 CRM tools...",
    "status": "executing",
    "progress": 45,
    "subtasks": [
      {
        "id": "uuid",
        "title": "Identify CRM categories",
        "status": "completed",
        "orderIndex": 1
      },
      {
        "id": "uuid",
        "title": "Research top tools",
        "status": "in_progress",
        "orderIndex": 2
      }
    ],
    "estimatedTimeSeconds": 180,
    "createdAt": "2026-02-24T10:00:00Z"
  }
}
```

---

#### GET /api/tasks/{taskId}/result
**Description:** Get completed task result

**Response (200):**
```json
{
  "result": {
    "content": "# Top 10 CRM Tools for Small Business\n\n## 1. HubSpot CRM...",
    "format": "markdown",
    "metadata": {
      "sourcesUsed": 12,
      "knowledgeBaseReferenced": true
    },
    "createdAt": "2026-02-24T10:03:00Z"
  }
}
```

---

#### POST /api/tasks/{taskId}/actions
**Description:** Perform action on task (pause, resume, cancel)

**Request:**
```json
{
  "action": "pause" // pause, resume, cancel
}
```

**Response (200):**
```json
{
  "success": true,
  "task": {
    "id": "uuid",
    "status": "paused"
  }
}
```

---

### Templates API

#### GET /api/templates
**Description:** List available templates

**Query Parameters:**
- `category`: Filter by category
- `search`: Search term
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)

**Response (200):**
```json
{
  "templates": [
    {
      "id": "uuid",
      "name": "Market Research",
      "description": "Comprehensive market analysis...",
      "category": "research",
      "parameters": [
        {
          "name": "industry",
          "type": "string",
          "required": true,
          "description": "Target industry"
        }
      ],
      "usageCount": 1234
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 24
  }
}
```

---

### Knowledge Base API

#### POST /api/knowledge/documents
**Description:** Upload document to knowledge base

**Headers:**
```
Content-Type: multipart/form-data
```

**Request:**
- `file`: Document file (max 10MB)
- `folder`: Optional folder path

**Response (201):**
```json
{
  "success": true,
  "document": {
    "id": "uuid",
    "name": "brand-guidelines.pdf",
    "fileType": "pdf",
    "fileSize": 245000,
    "embeddingStatus": "processing"
  }
}
```

---

#### GET /api/knowledge/documents
**Description:** List user's knowledge base documents

**Response (200):**
```json
{
  "documents": [
    {
      "id": "uuid",
      "name": "brand-guidelines.pdf",
      "folder": "Company",
      "fileType": "pdf",
      "fileSize": 245000,
      "embeddingStatus": "completed",
      "createdAt": "2026-02-20T08:00:00Z"
    }
  ],
  "storageUsed": 524288,
  "storageLimit": 1073741824
}
```

---

### Subscription API

#### GET /api/subscription
**Description:** Get current subscription details

**Response (200):**
```json
{
  "subscription": {
    "plan": "pro",
    "status": "active",
    "tasksUsed": 23,
    "taskLimit": 50,
    "currentPeriodEnd": "2026-03-24T00:00:00Z"
  }
}
```

---

#### POST /api/subscription/checkout
**Description:** Create Stripe checkout session for upgrade

**Request:**
```json
{
  "plan": "pro",
  "successUrl": "https://app.taskpilot.com/success",
  "cancelUrl": "https://app.taskpilot.com/pricing"
}
```

**Response (200):**
```json
{
  "checkoutUrl": "https://checkout.stripe.com/..."
}
```

---

### WebSocket Events (Realtime)

#### Task Progress Updates

**Channel:** `task:{taskId}`

**Event:** `progress`
```json
{
  "taskId": "uuid",
  "status": "executing",
  "progress": 67,
  "currentSubtask": {
    "id": "uuid",
    "title": "Compiling results"
  },
  "elapsedSeconds": 95,
  "estimatedRemainingSeconds": 45
}
```

**Event:** `completed`
```json
{
  "taskId": "uuid",
  "status": "completed",
  "resultId": "uuid"
}
```

**Event:** `error`
```json
{
  "taskId": "uuid",
  "status": "failed",
  "error": {
    "code": "AI_RATE_LIMIT",
    "message": "Please try again in a few moments"
  }
}
```

---

## Architecture Overview

### System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                           CLIENTS                                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │   Web App    │  │  Mobile Web  │  │   Future:    │              │
│  │   (Next.js)  │  │  (Responsive)│  │   Native App │              │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘              │
└─────────┼─────────────────┼─────────────────┼───────────────────────┘
          │                 │                 │
          └─────────────────┼─────────────────┘
                            │
                    ┌───────▼───────┐
                    │   Vercel CDN  │
                    │   (Edge/SSR)  │
                    └───────┬───────┘
                            │
┌───────────────────────────┼───────────────────────────────────────────┐
│                    VERCEL SERVERLESS                                   │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │                      Next.js Application                         │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │ │
│  │  │    Pages     │  │  API Routes  │  │  Middleware  │          │ │
│  │  │  (React/SSR) │  │  (Functions) │  │  (Auth/Rate) │          │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘          │ │
│  └─────────────────────────────────────────────────────────────────┘ │
└───────────────────────────┬───────────────────────────────────────────┘
                            │
          ┌─────────────────┼─────────────────┐
          │                 │                 │
          ▼                 ▼                 ▼
┌──────────────────┐ ┌──────────────┐ ┌──────────────────┐
│    Supabase      │ │   AI / LLM   │ │    External      │
│  ┌────────────┐  │ │              │ │    Services      │
│  │ PostgreSQL │  │ │  ┌────────┐  │ │  ┌────────────┐  │
│  │   (Data)   │  │ │  │ OpenAI │  │ │  │   Stripe   │  │
│  └────────────┘  │ │  │  API   │  │ │  │  (Billing) │  │
│  ┌────────────┐  │ │  └────────┘  │ │  └────────────┘  │
│  │    Auth    │  │ │  ┌────────┐  │ │  ┌────────────┐  │
│  │ (Sessions) │  │ │  │Anthropic│ │ │  │   Sentry   │  │
│  └────────────┘  │ │  │  API   │  │ │  │ (Errors)   │  │
│  ┌────────────┐  │ │  └────────┘  │ │  └────────────┘  │
│  │  Storage   │  │ │              │ │  ┌────────────┐  │
│  │  (Files)   │  │ │              │ │  │  Resend    │  │
│  └────────────┘  │ │              │ │  │  (Email)   │  │
│  ┌────────────┐  │ │              │ │  └────────────┘  │
│  │  Realtime  │  │ │              │ │                  │
│  │ (WebSocket)│  │ │              │ │                  │
│  └────────────┘  │ │              │ │                  │
└──────────────────┘ └──────────────┘ └──────────────────┘
```

### Deployment Model

**Environment Tiers:**

| Environment | Purpose | URL |
|-------------|---------|-----|
| Development | Local development | localhost:3000 |
| Preview | PR previews | pr-{number}.taskpilot.vercel.app |
| Staging | Pre-production testing | staging.taskpilot.com |
| Production | Live application | app.taskpilot.com |

**CI/CD Pipeline:**
1. Push to feature branch → Preview deployment
2. PR merged to main → Staging deployment
3. Manual promotion or tag → Production deployment
4. Automatic rollback on failure

---

## Implementation Plan

### Phase 0: MVP (March - May 2026)

**Goals:**
- Launch core task delegation functionality
- Validate product-market fit
- Acquire first 1,000 users

**Features:**

| Feature | Priority | Sprint |
|---------|----------|--------|
| User auth (email + Google) | P0 | 1 |
| Natural language task input | P0 | 1-2 |
| AI task decomposition | P0 | 2-3 |
| Task execution engine | P0 | 3-4 |
| Real-time progress tracking | P0 | 4-5 |
| Result display + Markdown export | P0 | 5 |
| Template library (10 templates) | P0 | 5-6 |
| Task history | P0 | 6 |
| Subscription + Stripe | P0 | 6-7 |
| PDF export | P1 | 7 |
| Basic knowledge base | P1 | 7-8 |

**Milestones:**

| Milestone | Date | Criteria |
|-----------|------|----------|
| M0.1: Auth + Basic UI | Mar 15, 2026 | Users can register/login |
| M0.2: Task Execution | Apr 1, 2026 | Complete task flow works |
| M0.3: Templates + History | Apr 15, 2026 | Templates usable, history saved |
| M0.4: Billing | May 1, 2026 | Stripe integration complete |
| M0.5: MVP Launch | May 15, 2026 | Public launch |

---

### Phase 1: Growth (June - August 2026)

**Goals:**
- Improve retention and engagement
- Expand use cases
- Reach 10,000 MAU

**Features:**

| Feature | Priority | Sprint |
|---------|----------|--------|
| Advanced knowledge base | P1 | 9-10 |
| Browser extension | P1 | 10-11 |
| Email notifications | P1 | 11 |
| Task scheduling | P2 | 12 |
| Additional templates (+20) | P1 | 12-13 |
| Improved AI model selection | P1 | 13-14 |
| Mobile optimization | P1 | 14 |
| Team sharing (Business) | P2 | 15-16 |

---

### Phase 2: Scale (September - November 2026)

**Goals:**
- Enterprise readiness
- API for integrations
- Marketplace launch

**Features:**

| Feature | Priority | Sprint |
|---------|----------|--------|
| Public API | P1 | 17-18 |
| Zapier/Make integration | P1 | 18-19 |
| Custom workflows | P2 | 19-20 |
| Template marketplace | P2 | 20-21 |
| SSO (Enterprise) | P2 | 21-22 |
| Advanced analytics | P2 | 22-23 |
| Multi-language support | P2 | 23-24 |

---

## Testing Strategy

### Testing Pyramid

```
                    ┌─────────┐
                    │   E2E   │  10%
                    │ (Cypress)│
                   ┌┴─────────┴┐
                   │Integration │  20%
                   │  (Vitest)  │
                  ┌┴───────────┴┐
                  │    Unit     │  70%
                  │  (Vitest)   │
                  └─────────────┘
```

### Unit Tests

**Coverage Target:** ≥80%

**Focus Areas:**
- Utility functions
- API route handlers
- React component logic
- State management
- Validation logic

**Example:**
```typescript
describe('TaskDecomposition', () => {
  it('should break task into 3-7 subtasks', async () => {
    const task = 'Research top 10 CRM tools';
    const result = await decomposeTask(task);
    expect(result.subtasks.length).toBeGreaterThanOrEqual(3);
    expect(result.subtasks.length).toBeLessThanOrEqual(7);
  });
});
```

---

### Integration Tests

**Focus Areas:**
- API endpoint flows
- Database operations
- Authentication flows
- Stripe webhooks
- AI API integration

**Example:**
```typescript
describe('POST /api/tasks', () => {
  it('should create task and return decomposition', async () => {
    const response = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${testToken}`)
      .send({ description: 'Test task' });
    
    expect(response.status).toBe(201);
    expect(response.body.task.subtasks).toBeDefined();
  });
});
```

---

### E2E Tests

**Tool:** Cypress

**Critical Paths:**
1. Registration → Onboarding → First task
2. Login → Template selection → Task execution → Export
3. Login → Upgrade flow → Payment
4. Knowledge base upload → Task with context

**Example:**
```typescript
describe('Task Completion Flow', () => {
  it('should complete task and show results', () => {
    cy.login('test@example.com', 'password');
    cy.visit('/dashboard');
    cy.get('[data-testid="task-input"]').type('Research competitors');
    cy.get('[data-testid="submit-task"]').click();
    cy.get('[data-testid="progress-bar"]').should('be.visible');
    cy.get('[data-testid="task-result"]', { timeout: 120000 }).should('be.visible');
  });
});
```

---

### Load Testing

**Tool:** k6

**Scenarios:**

| Scenario | VUs | Duration | Target |
|----------|-----|----------|--------|
| Normal Load | 100 | 10 min | <500ms p95 |
| Peak Load | 500 | 5 min | <1s p95 |
| Stress Test | 1000 | 5 min | No failures |
| Soak Test | 200 | 1 hour | Stable memory |

---

### Acceptance Test Checklist (MVP)

| ID | Test Case | Priority |
|----|-----------|----------|
| AT-1 | User can register with email and verify | P0 |
| AT-2 | User can login with Google OAuth | P0 |
| AT-3 | User can create task via natural language | P0 |
| AT-4 | AI decomposes task into subtasks in <3s | P0 |
| AT-5 | User sees real-time progress during execution | P0 |
| AT-6 | Task completes and shows formatted results | P0 |
| AT-7 | User can export results as Markdown | P0 |
| AT-8 | User can browse and use templates | P0 |
| AT-9 | User can view task history | P0 |
| AT-10 | Free user is blocked after 5 tasks | P0 |
| AT-11 | User can upgrade to Pro via Stripe | P0 |
| AT-12 | User can export results as PDF | P1 |
| AT-13 | User can upload documents to knowledge base | P1 |
| AT-14 | AI uses knowledge base context in task | P1 |

---

## Rollout & Monitoring

### Rollout Plan

#### Pre-Launch (T-2 weeks)
- [ ] Security audit complete
- [ ] Load testing passed
- [ ] Staging environment stable
- [ ] Documentation complete
- [ ] Support team trained

#### Soft Launch (T-0)
- [ ] Invite-only beta (100 users)
- [ ] Monitor error rates and performance
- [ ] Collect feedback via in-app survey
- [ ] Fix critical issues

#### Public Launch (T+2 weeks)
- [ ] Remove invite requirement
- [ ] Enable feature flags for new features
- [ ] Monitor conversion funnel
- [ ] Scale infrastructure as needed

### Feature Flags

| Flag | Description | Default |
|------|-------------|---------|
| `knowledge_base_enabled` | Enable knowledge base feature | false (MVP) |
| `pdf_export_enabled` | Enable PDF export | true |
| `new_ai_model` | Use upgraded AI model | false |
| `team_features` | Enable team collaboration | false |

### Monitoring & Alerting

#### Metrics Dashboard

**Business Metrics:**
- Daily/Weekly/Monthly Active Users
- Task completion rate
- Template usage distribution
- Conversion funnel
- Revenue (MRR/ARR)
- Churn rate

**Technical Metrics:**
- Request rate (RPS)
- Error rate (4xx/5xx)
- Response times (p50/p95/p99)
- Database connections
- AI API latency
- WebSocket connections

#### Alert Thresholds

| Alert | Condition | Severity | Channel |
|-------|-----------|----------|---------|
| High Error Rate | 5xx > 1% for 5 min | Critical | PagerDuty |
| Slow Response | p95 > 2s for 10 min | Warning | Slack |
| Task Failures | Failure rate > 10% | Critical | PagerDuty |
| AI API Down | No response 30s | Critical | PagerDuty |
| High CPU | >80% for 15 min | Warning | Slack |
| Payment Failures | >5% checkout fail | Warning | Slack |

### Observability Stack

| Component | Tool |
|-----------|------|
| Error Tracking | Sentry |
| APM | Vercel Analytics |
| Logging | Vercel Logs + Axiom |
| Uptime Monitoring | Better Uptime |
| Real User Monitoring | Vercel Web Vitals |
| Business Analytics | PostHog |

---

## Risks & Mitigations

### Risk Matrix

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **R1: AI API Rate Limits** | High | High | Implement queuing, multiple provider fallback, caching |
| **R2: AI Cost Overruns** | Medium | High | Set per-user limits, optimize prompts, monitor costs daily |
| **R3: Poor Task Quality** | Medium | High | User feedback loop, prompt engineering, quality metrics |
| **R4: Low Conversion Rate** | Medium | Medium | A/B test pricing, improve onboarding, add social proof |
| **R5: Security Breach** | Low | Critical | Security audit, penetration testing, SOC2 roadmap |
| **R6: Scalability Issues** | Medium | Medium | Load testing, auto-scaling, database optimization |
| **R7: Competitor Launch** | Medium | Medium | Focus on UX differentiation, rapid iteration |
| **R8: User Churn** | High | Medium | Improve templates, add integrations, engagement emails |

### Detailed Mitigations

#### R1: AI API Rate Limits
- Implement request queuing with Redis
- Configure fallback to Anthropic if OpenAI rate limited
- Cache common decompositions
- Implement exponential backoff

#### R2: AI Cost Overruns
- Monitor daily API spend with alerts at 80% budget
- Optimize prompts to reduce token usage
- Implement tiered model selection (GPT-3.5 for simple, GPT-4 for complex)
- Set hard per-task token limits

#### R3: Poor Task Quality
- Implement thumbs up/down feedback on results
- Track quality score per template
- A/B test prompt variations
- Manual review of lowest-rated outputs

---

## Glossary

| Term | Definition |
|------|------------|
| **Task** | A user-delegated work item described in natural language |
| **Subtask** | An atomic step in the decomposed task plan |
| **Template** | Pre-built task structure with configurable parameters |
| **Knowledge Base** | User-uploaded documents for contextual AI execution |
| **Agent** | AI system that executes tasks on behalf of users |
| **Decomposition** | Process of breaking a task into executable subtasks |
| **MAU** | Monthly Active Users |
| **MRR** | Monthly Recurring Revenue |
| **NPS** | Net Promoter Score |
| **RLS** | Row-Level Security (Supabase/PostgreSQL feature) |

---

## Change Log

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-02-24 | Product Team | Initial PRD creation |

---

## Traceability Matrix

| Business Objective | Requirements | Acceptance Tests |
|--------------------|--------------|------------------|
| BO-1: User Acquisition | FR-1.1, FR-1.2 | AT-1, AT-2 |
| BO-2: User Activation | FR-1.3 | AT-3, AT-4 |
| BO-3: Core Value Delivery | FR-2.1, FR-2.2, FR-2.3, FR-2.4 | AT-3, AT-4, AT-5, AT-6 |
| BO-4: User Efficiency | FR-3.1, FR-3.2, FR-3.3 | AT-8 |
| BO-5: Personalization | FR-4.1, FR-4.2, FR-4.3 | AT-13, AT-14 |
| BO-6: User Experience | FR-5.1, FR-5.2, FR-5.3 | AT-5, AT-9 |
| BO-7: Output Portability | FR-6.1, FR-6.2, FR-6.3 | AT-7, AT-12 |
| BO-8: Monetization | FR-7.1, FR-7.2, FR-7.3 | AT-10, AT-11 |

---

## Appendix A: MVP Template Specifications

### Template: Market Research

**Category:** Research  
**Estimated Time:** 3-5 minutes

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| topic | string | Yes | Research topic or industry |
| depth | enum | No | shallow / medium / deep |
| region | string | No | Geographic focus |

**Output Structure:**
1. Executive Summary
2. Market Size & Growth
3. Key Players
4. Trends & Opportunities
5. Challenges & Risks
6. Recommendations

---

### Template: Email Outreach Sequence

**Category:** Email Outreach  
**Estimated Time:** 2-3 minutes

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| target_audience | string | Yes | Who you're reaching |
| product_service | string | Yes | What you're offering |
| tone | enum | No | professional / casual / friendly |
| sequence_length | number | No | Number of emails (1-5) |

**Output Structure:**
1. Subject Lines (A/B variants)
2. Email 1: Introduction
3. Email 2: Value Proposition
4. Email 3: Social Proof
5. Email 4: Final CTA

---

## Appendix B: API Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| AUTH_INVALID_CREDENTIALS | 401 | Email or password incorrect |
| AUTH_EMAIL_NOT_VERIFIED | 403 | Email verification required |
| AUTH_RATE_LIMITED | 429 | Too many login attempts |
| TASK_LIMIT_REACHED | 402 | Monthly task limit exceeded |
| TASK_NOT_FOUND | 404 | Task ID does not exist |
| TASK_EXECUTION_FAILED | 500 | AI failed to complete task |
| AI_RATE_LIMIT | 503 | AI provider rate limited |
| STORAGE_LIMIT_REACHED | 402 | Knowledge base storage full |
| INVALID_FILE_TYPE | 400 | Unsupported file format |
| FILE_TOO_LARGE | 400 | File exceeds size limit |
