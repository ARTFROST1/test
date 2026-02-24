# Product Requirements Document: RecastAI

> **Version:** 1.0  
> **Date:** 2026-02-24  
> **Status:** Draft  
> **Owner:** Product Team  

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Goals & Objectives](#3-goals--objectives)
4. [Context & Inputs](#4-context--inputs)
5. [Target Audience & Personas](#5-target-audience--personas)
6. [User Journeys & Critical Paths](#6-user-journeys--critical-paths)
7. [User Stories & Acceptance Criteria](#7-user-stories--acceptance-criteria)
8. [Functional Requirements](#8-functional-requirements)
9. [Non-Functional Requirements](#9-non-functional-requirements)
10. [Data Model](#10-data-model)
11. [API & Integration Specs](#11-api--integration-specs)
12. [Architecture Overview](#12-architecture-overview)
13. [Monetization & Billing](#13-monetization--billing)
14. [Implementation Plan & Milestones](#14-implementation-plan--milestones)
15. [Testing Strategy](#15-testing-strategy)
16. [Rollout & Monitoring](#16-rollout--monitoring)
17. [Success Metrics](#17-success-metrics)
18. [Risks & Mitigations](#18-risks--mitigations)
19. [Out of Scope](#19-out-of-scope)
20. [Glossary](#20-glossary)
21. [Traceability Matrix](#21-traceability-matrix)
22. [Change Log](#22-change-log)

---

## 1. Executive Summary

### Problem

Solo creators, solopreneurs, and small marketing teams invest significant effort producing long-form content — blog posts, newsletters, podcast transcripts, video scripts — but consistently fail to maximize its distribution. Manually adapting a single piece of content for X/Twitter, LinkedIn, Instagram, TikTok, Bluesky, and email is tedious, time-consuming, and error-prone. Most creators either skip platforms entirely or post poorly-adapted copies, resulting in lower engagement and wasted creative investment.

### Proposed Solution

**RecastAI** is an AI-powered content repurposing platform that transforms any long-form content into a week's worth of platform-perfect social media posts in seconds. Users paste text or a URL, select target platforms, and receive 5–7 optimized variations — each tailored to the platform's tone, format, character limits, and audience expectations. A built-in content library, inline editor, and usage dashboard give users full control over their output pipeline.

### Success Metrics (KPIs)

| Metric | Target (6 months post-launch) |
|---|---|
| Monthly Active Users (MAU) | 10,000 |
| Free → Pro Conversion Rate | 8–12% |
| Monthly Recurring Revenue (MRR) | $15,000 |
| Average Repurposes per User/Month | ≥ 6 |
| User Retention (30-day) | ≥ 45% |
| NPS | ≥ 40 |

### Timeline Overview

| Phase | Duration | Deliverable |
|---|---|---|
| Phase 0 — Foundation | Weeks 1–3 | Auth, database schema, project scaffolding |
| Phase 1 — Core MVP | Weeks 4–8 | AI engine, content input, platform selector, output display |
| Phase 2 — Library & Polish | Weeks 9–11 | Content library, inline editor, copy/export, usage dashboard |
| Phase 3 — Monetization | Weeks 12–13 | Stripe integration, tier enforcement, billing UI |
| Phase 4 — Beta & Launch | Weeks 14–16 | Closed beta, bug fixes, public launch |

---

## 2. Problem Statement

### Core Problem

Content creators spend **60–70% of their distribution time** manually reformatting long-form content for different social platforms. Each platform has unique constraints — character limits, formatting conventions, audience tone, algorithmic preferences — making the translation non-trivial. The result:

1. **Under-distribution:** Creators publish on 1–2 platforms and neglect others, leaving reach on the table.
2. **Quality degradation:** Rushed cross-posting produces generic content that underperforms platform-native posts.
3. **Inconsistent cadence:** Manual repurposing is unsustainable, leading to irregular posting schedules.
4. **Burnout:** The cognitive overhead of context-switching between platform formats drains creative energy.

### Business Impact

- Creators who distribute across 4+ platforms see **2.5× more audience growth** than single-platform creators (industry surveys).
- Consistent posting cadence correlates with **35–50% higher engagement** rates.
- The creator economy tools market is projected at **$32B by 2027**, with content repurposing as a high-growth segment.

### Why Now

- **LLM capabilities** (GPT-4o) have reached the quality threshold needed for platform-native content generation.
- **Creator economy growth** continues to accelerate, with more solo operators needing efficiency tools.
- **Existing tools** (Buffer, Hootsuite, Repurpose.io) focus on scheduling/distribution but lack intelligent content transformation.

---

## 3. Goals & Objectives

### Business Goals

| ID | Goal | Measurable Target |
|---|---|---|
| BG-1 | Establish product-market fit in the solo creator segment | 10,000 MAU within 6 months |
| BG-2 | Generate sustainable recurring revenue | $15,000 MRR within 6 months |
| BG-3 | Achieve strong free-to-paid conversion | 8–12% conversion rate |
| BG-4 | Build a defensible moat through voice learning | 60%+ of Pro users activate voice customization by month 3 |

### Product Goals

| ID | Goal | Success Indicator |
|---|---|---|
| PG-1 | Deliver instant, high-quality repurposed content | ≥ 80% of generated posts require ≤ 2 edits before publishing |
| PG-2 | Provide a frictionless input-to-output experience | Time from paste to generated output < 30 seconds |
| PG-3 | Support all major platforms with native formatting | 6 platforms supported at launch (X, LinkedIn, Instagram, TikTok, Bluesky, Email) |
| PG-4 | Enable content management and organization | Users can find any past content within 10 seconds via search/filter |

### User Goals

| ID | Goal |
|---|---|
| UG-1 | Reduce weekly content distribution time by ≥ 70% |
| UG-2 | Maintain consistent posting across 3+ platforms |
| UG-3 | Preserve authentic voice and tone in AI-generated content |
| UG-4 | Have full visibility into usage and remaining credits |

---

## 4. Context & Inputs

### Stakeholders

| Role | Responsibility |
|---|---|
| Product Owner | PRD ownership, prioritization, scope decisions |
| Engineering Lead | Technical architecture, implementation decisions |
| Design Lead | UX/UI design, interaction patterns |
| QA Lead | Test strategy, acceptance verification |
| Marketing | Go-to-market, positioning, early user acquisition |

### Related Documents & Data Sources

- Creator economy market reports (2025–2026)
- OpenAI API documentation (GPT-4o capabilities, pricing, rate limits)
- Supabase documentation (Auth, Postgres, Storage, Row-Level Security)
- Next.js 14+ App Router documentation
- Competitive analysis of Buffer, Hootsuite, Repurpose.io, Taplio, and Typefully

### Market & Competitive Summary

| Competitor | Strength | Weakness | RecastAI Differentiator |
|---|---|---|---|
| Buffer | Scheduling, analytics | No AI content transformation | AI-native repurposing from long-form |
| Hootsuite | Enterprise-grade, multi-platform | Complex, expensive, no AI generation | Simple, affordable, creator-focused |
| Repurpose.io | Video/audio repurposing | Limited to media formats, no text | Text-first with platform intelligence |
| Taplio | LinkedIn-specific AI | Single platform only | Multi-platform from single source |
| Typefully | Twitter/X thread writing | Single platform only | Multi-platform from single source |

**Key differentiator:** RecastAI is the only tool that takes a single long-form text input and produces platform-native content for 6+ platforms simultaneously, with adaptive voice learning.

---

## 5. Target Audience & Personas

### Persona A: "Alex the Solo Creator"

| Attribute | Detail |
|---|---|
| Role | Independent content creator / blogger |
| Age | 25–40 |
| Tech Savvy | Medium-high |
| Content Volume | 1–2 blog posts or newsletters per week |
| Platforms | X/Twitter, LinkedIn, Instagram, newsletter |
| Pain Points | Spends 3+ hours/week reformatting content; inconsistent posting; some platforms neglected entirely |
| Goals | Grow audience across platforms; spend more time creating, less time distributing |
| Willingness to Pay | $10–15/month for a tool that saves 3+ hours/week |

### Persona B: "Maya the Solopreneur"

| Attribute | Detail |
|---|---|
| Role | Coach / consultant running a personal brand |
| Age | 30–50 |
| Tech Savvy | Medium |
| Content Volume | 1 blog post or podcast episode per week |
| Platforms | LinkedIn, Instagram, TikTok, email |
| Pain Points | Not a "social media person" but knows visibility drives client acquisition; hires freelancers sporadically which is expensive |
| Goals | Maintain professional social presence with minimal effort; sound authentic, not "AI-generated" |
| Willingness to Pay | $12–30/month to replace freelancer costs |

### Persona C: "Jordan the Small Team Marketer"

| Attribute | Detail |
|---|---|
| Role | Marketing lead at a 5–20 person startup |
| Age | 28–45 |
| Tech Savvy | High |
| Content Volume | 2–3 long-form pieces per week across team |
| Platforms | All major platforms + email |
| Pain Points | Team lacks bandwidth for multi-platform distribution; no consistent brand voice across team members |
| Goals | Scale content output without hiring; enforce brand consistency; share library across team |
| Willingness to Pay | $29–50/month for team capabilities |

---

## 6. User Journeys & Critical Paths

### Journey 1: First-Time Repurpose (Critical — Activation)

```
Trigger: User lands on RecastAI from a blog post or Product Hunt.

1. User clicks "Get Started" → Signup page
2. Signs up via Google OAuth (or email/password)
3. Lands on empty dashboard with prominent "Create your first repurpose" CTA
4. Pastes blog post text (or URL) into input area
5. Selects target platforms: X/Twitter, LinkedIn, Instagram
6. Clicks "Generate"
7. Sees loading state with progress indicator (5–20 sec)
8. Views generated posts in a tabbed or card-based layout (one tab per platform)
9. Reads X thread → impressed by quality → clicks "Copy" → pastes into X
10. Returns to RecastAI to try another repurpose

Expected outcome: User completes first repurpose within 3 minutes of signup.
Success metric: ≥ 70% of new signups complete first repurpose within 24 hours.
```

### Journey 2: Refine & Export Workflow

```
Trigger: User generates content but wants to adjust tone on LinkedIn post.

1. User views generated LinkedIn post
2. Clicks "Edit" to open inline editor
3. Adjusts opening hook and CTA
4. Saves edited version
5. Clicks "Export All" → downloads Markdown/CSV bundle
6. Schedules posts using their preferred scheduler (Buffer, etc.)

Expected outcome: Edit-to-export in < 2 minutes.
```

### Journey 3: Content Library Retrieval

```
Trigger: User wants to find a repurpose from 2 weeks ago.

1. Opens Content Library from sidebar
2. Uses search bar to search by keyword from original content
3. Filters by platform (LinkedIn) and date range
4. Finds the post, clicks to view
5. Copies to clipboard

Expected outcome: Content found within 10 seconds.
```

### Journey 4: Upgrade to Pro

```
Trigger: Free user hits the 5 repurpose/month limit.

1. User attempts 6th repurpose
2. System shows upgrade prompt with clear comparison (Free vs Pro)
3. User clicks "Upgrade to Pro"
4. Redirected to Stripe Checkout
5. Completes payment
6. Redirected back to RecastAI with Pro badge and unlimited access
7. Resumes repurposing

Expected outcome: Frictionless upgrade in < 60 seconds.
```

### Journey 5: URL-Based Input

```
Trigger: User has a published blog post and wants to repurpose it.

1. User selects "Paste URL" input mode
2. Pastes blog post URL
3. System extracts article content (title, body, metadata)
4. User reviews extracted text in preview
5. User confirms or edits extracted text
6. Selects platforms and generates

Expected outcome: URL extraction succeeds for ≥ 90% of standard blog platforms.
Edge cases: Paywalled content, JavaScript-rendered pages, non-article pages.
Error behavior: System shows "Unable to extract content from this URL. Please paste the text directly." with fallback to text input.
```

---

## 7. User Stories & Acceptance Criteria

### Epic 1: Authentication

**US-1.1: Email/Password Signup**
> As a new user, I want to sign up with my email and password so that I can create an account.

| Acceptance Criteria |
|---|
| AC-1: User can enter email and password on the signup page |
| AC-2: Password SHALL meet minimum requirements: ≥ 8 characters, ≥ 1 uppercase, ≥ 1 number |
| AC-3: System SHALL send email verification link via Supabase Auth |
| AC-4: User SHALL NOT access the app until email is verified |
| AC-5: Duplicate email SHALL show "An account with this email already exists" error |
| AC-6: After verification, user is redirected to the dashboard |

**US-1.2: Google OAuth Signup/Login**
> As a new user, I want to sign up with Google so that I can get started faster.

| Acceptance Criteria |
|---|
| AC-1: "Continue with Google" button is visible on signup and login pages |
| AC-2: Clicking initiates Google OAuth flow via Supabase Auth |
| AC-3: On first Google sign-in, a new user record SHALL be created |
| AC-4: On subsequent Google sign-in, user SHALL be logged into existing account |
| AC-5: User SHALL be redirected to dashboard after successful auth |

**US-1.3: Login**
> As a returning user, I want to log in so that I can access my content.

| Acceptance Criteria |
|---|
| AC-1: User can log in with email/password or Google OAuth |
| AC-2: Invalid credentials SHALL show a generic "Invalid email or password" error (no enumeration) |
| AC-3: Session SHALL persist for 7 days (configurable) using Supabase session management |
| AC-4: User SHALL be redirected to dashboard after login |

**US-1.4: Password Reset**
> As a user who forgot my password, I want to reset it so I can regain access.

| Acceptance Criteria |
|---|
| AC-1: "Forgot password?" link on login page |
| AC-2: User enters email → system sends reset link (regardless of whether account exists — no enumeration) |
| AC-3: Reset link expires after 1 hour |
| AC-4: User sets new password meeting same requirements as signup |

**US-1.5: Logout**
> As a logged-in user, I want to log out so that my session is ended.

| Acceptance Criteria |
|---|
| AC-1: Logout option accessible from user menu |
| AC-2: Session SHALL be invalidated on Supabase |
| AC-3: User SHALL be redirected to login page |

---

### Epic 2: Content Input

**US-2.1: Paste Text Input**
> As a user, I want to paste my long-form content as text so that I can repurpose it.

| Acceptance Criteria |
|---|
| AC-1: Text input area accepts plain text up to 50,000 characters |
| AC-2: Character count SHALL be displayed in real-time |
| AC-3: Input below 100 characters SHALL show warning: "Content may be too short for quality repurposing" |
| AC-4: Input exceeding 50,000 characters SHALL be rejected with clear error message |
| AC-5: User can clear the input field with a single click |

**US-2.2: URL Input with Auto-Extraction**
> As a user, I want to paste a URL and have the article content automatically extracted.

| Acceptance Criteria |
|---|
| AC-1: URL input mode is selectable (tab or toggle) |
| AC-2: System SHALL validate URL format before attempting extraction |
| AC-3: System SHALL extract article title, body text, and (optionally) meta description |
| AC-4: Extracted content SHALL be displayed in a preview for user confirmation |
| AC-5: User SHALL be able to edit extracted content before proceeding |
| AC-6: Extraction SHALL complete within 10 seconds for standard web pages |
| AC-7: If extraction fails, system SHALL display fallback message and offer text paste option |
| AC-8: System SHALL handle common blog platforms: WordPress, Ghost, Substack, Medium, custom HTML |

---

### Epic 3: AI Repurposing Engine

**US-3.1: Generate Platform-Specific Posts**
> As a user, I want to generate social media posts optimized for my selected platforms from my source content.

| Acceptance Criteria |
|---|
| AC-1: System SHALL generate 5–7 distinct posts per selected platform |
| AC-2: X/Twitter output SHALL respect 280-character limit per tweet; threads SHALL have 3–7 tweets |
| AC-3: LinkedIn output SHALL use professional tone, ≤ 3,000 characters, with hook + value + CTA structure |
| AC-4: Instagram caption SHALL be ≤ 2,200 characters with hook-first format and relevant hashtag suggestions |
| AC-5: TikTok script SHALL follow hook-first pattern with ≤ 60-second spoken duration, include visual cues |
| AC-6: Bluesky output SHALL respect 300-character limit with conversational tone |
| AC-7: Email snippet SHALL include subject line, preview text, and body (≤ 500 words) |
| AC-8: Generation SHALL complete within 30 seconds for up to 4 platforms |
| AC-9: Each generated post SHALL be individually identifiable and editable |

**US-3.2: Platform Selector**
> As a user, I want to choose which platforms to generate content for.

| Acceptance Criteria |
|---|
| AC-1: Platform selector SHALL display all supported platforms with icons and names |
| AC-2: User SHALL be able to select/deselect individual platforms |
| AC-3: "Select All" and "Deselect All" options SHALL be available |
| AC-4: Free tier SHALL limit selection to 3 platforms per repurpose |
| AC-5: If free user selects > 3 platforms, system SHALL show upgrade prompt |
| AC-6: Platform selection SHALL persist as user preference across sessions |

**US-3.3: Voice/Tone Customization (Pro)**
> As a Pro user, I want the AI to match my personal voice and tone.

| Acceptance Criteria |
|---|
| AC-1: Pro users SHALL have access to a "Voice Settings" page |
| AC-2: User can select from preset tones: Professional, Casual, Witty, Inspirational, Educational |
| AC-3: User can provide a custom voice description (free text, ≤ 500 characters) |
| AC-4: System SHALL analyze user's past 10 repurposes to learn voice patterns (after ≥ 5 repurposes) |
| AC-5: Voice settings SHALL be applied to all subsequent generations |
| AC-6: User can toggle between "My Voice" and "Default" per generation |

---

### Epic 4: Content Editor

**US-4.1: Inline Post Editing**
> As a user, I want to edit any generated post before copying or exporting.

| Acceptance Criteria |
|---|
| AC-1: Each generated post SHALL have an "Edit" button |
| AC-2: Clicking "Edit" SHALL open an inline rich text editor |
| AC-3: Editor SHALL support: bold, italic, line breaks, bullet lists, links |
| AC-4: Editor SHALL show real-time character count and warn when exceeding platform limits |
| AC-5: User can save edits or discard changes |
| AC-6: Edited posts SHALL be visually marked as "Edited" |
| AC-7: Original generated version SHALL be recoverable via "Revert to original" action |

**US-4.2: Regenerate Individual Post**
> As a user, I want to regenerate a single post without regenerating everything.

| Acceptance Criteria |
|---|
| AC-1: Each post SHALL have a "Regenerate" button |
| AC-2: Regeneration SHALL produce a new variation for that specific platform/post |
| AC-3: Regeneration SHALL count against usage for free tier |
| AC-4: Previous version SHALL be replaced (but recoverable from content library history if stored) |

---

### Epic 5: Content Library

**US-5.1: Browse Past Content**
> As a user, I want to browse all my past repurposes and generated posts.

| Acceptance Criteria |
|---|
| AC-1: Content library SHALL display a list/grid of all past source content items |
| AC-2: Each item SHALL show: source title/excerpt, date created, platforms generated, post count |
| AC-3: Clicking an item SHALL expand to show all generated posts grouped by platform |
| AC-4: Library SHALL support pagination (20 items per page) or infinite scroll |
| AC-5: Default sort SHALL be newest first |

**US-5.2: Search & Filter**
> As a user, I want to search and filter my content library to find specific items.

| Acceptance Criteria |
|---|
| AC-1: Full-text search SHALL work across source content and generated post text |
| AC-2: Filter by platform SHALL be available (multi-select) |
| AC-3: Filter by date range SHALL be available |
| AC-4: Search results SHALL return within 2 seconds |
| AC-5: "No results" state SHALL be handled with helpful message |

**US-5.3: Delete Content**
> As a user, I want to delete source content and its generated posts.

| Acceptance Criteria |
|---|
| AC-1: Delete action SHALL require confirmation dialog |
| AC-2: Deleting source content SHALL cascade-delete all associated generated posts |
| AC-3: Deletion SHALL be soft-delete (retained 30 days) for accidental recovery |

---

### Epic 6: Export & Sharing

**US-6.1: One-Click Copy**
> As a user, I want to copy a generated post to my clipboard with one click.

| Acceptance Criteria |
|---|
| AC-1: Each generated post SHALL have a "Copy" button |
| AC-2: Clicking SHALL copy platform-formatted text to clipboard |
| AC-3: For X threads: copies full thread with tweet separators |
| AC-4: User SHALL see "Copied!" confirmation toast |
| AC-5: Copy SHALL work on all modern browsers (Chrome, Firefox, Safari, Edge) |

**US-6.2: Batch Export**
> As a user, I want to export all generated posts from a repurpose as a file.

| Acceptance Criteria |
|---|
| AC-1: "Export" button SHALL be available at the repurpose level |
| AC-2: Export formats: Markdown (.md) and CSV (.csv) |
| AC-3: Markdown export SHALL organize posts by platform with headers |
| AC-4: CSV export SHALL include columns: platform, post_number, content, character_count |
| AC-5: File SHALL download to user's device |

---

### Epic 7: Usage Dashboard

**US-7.1: View Usage Statistics**
> As a user, I want to see my usage stats so I know how much I've used and have remaining.

| Acceptance Criteria |
|---|
| AC-1: Dashboard SHALL display: total repurposes this month, credits remaining (free tier), total posts generated all-time |
| AC-2: Free tier SHALL show a progress bar: "3 of 5 repurposes used this month" |
| AC-3: Pro/Team tier SHALL show unlimited indicator with monthly volume stats |
| AC-4: Historical chart SHALL show repurposes per week over the last 3 months |
| AC-5: Dashboard SHALL update in real-time after each repurpose |

---

### Epic 8: Team Features

**US-8.1: Team Workspace (Team Tier)**
> As a team admin, I want to invite team members so we can share a content library.

| Acceptance Criteria |
|---|
| AC-1: Team admin can invite up to 3 members via email |
| AC-2: Invited user receives email with join link |
| AC-3: Team members share the same content library |
| AC-4: Each member's individual repurposes are visible to the team |
| AC-5: Admin can remove team members |

**US-8.2: Brand Voice Profiles (Team Tier)**
> As a team admin, I want to define brand voice profiles that all team members use.

| Acceptance Criteria |
|---|
| AC-1: Admin can create up to 5 brand voice profiles |
| AC-2: Each profile includes: name, description, tone keywords, example content |
| AC-3: Team members can select a brand voice profile when generating |
| AC-4: Brand voice SHALL override individual voice settings during generation |

---

## 8. Functional Requirements

### FR-1.0: User Authentication (Priority: P0)

| ID | Requirement | Acceptance | Trace |
|---|---|---|---|
| FR-1.1 | System SHALL support email/password registration with email verification via Supabase Auth | User receives verification email within 60 seconds; unverified users cannot access protected routes | BG-1 |
| FR-1.2 | System SHALL support Google OAuth signup/login via Supabase Auth | OAuth flow completes in a single redirect cycle; new user record auto-created on first login | BG-1 |
| FR-1.3 | System SHALL enforce password policy: ≥ 8 chars, ≥ 1 uppercase, ≥ 1 digit | Weak passwords rejected at client and server level | BG-1 |
| FR-1.4 | System SHALL provide password reset via email link (expires in 1 hour) | User can set new password via reset link | BG-1 |
| FR-1.5 | System SHALL manage sessions via Supabase JWT with 7-day expiry and auto-refresh | Session persists until explicit logout or 7-day timeout | BG-1 |
| FR-1.6 | System SHALL enforce Row-Level Security (RLS) on all Supabase tables so users can only access their own data | No cross-user data leakage under any query path | BG-1 |

### FR-2.0: Content Input (Priority: P0)

| ID | Requirement | Acceptance | Trace |
|---|---|---|---|
| FR-2.1 | System SHALL accept plain text input up to 50,000 characters | Input exceeding limit is rejected with error message | PG-2 |
| FR-2.2 | System SHALL display real-time character count during text input | Count updates on each keystroke | PG-2 |
| FR-2.3 | System SHALL accept a URL and extract article content (title, body) using server-side extraction | Extraction succeeds for ≥ 90% of standard blog platforms within 10 seconds | PG-2 |
| FR-2.4 | System SHALL display extracted content for user review and editing before generation | User sees extracted text and can modify it | PG-2 |
| FR-2.5 | System SHALL validate URL format before attempting extraction | Invalid URLs rejected immediately | PG-2 |
| FR-2.6 | System SHALL provide fallback to text paste when URL extraction fails | User sees clear error and can switch to text input without data loss | PG-2 |

### FR-3.0: AI Repurposing Engine (Priority: P0)

| ID | Requirement | Acceptance | Trace |
|---|---|---|---|
| FR-3.1 | System SHALL generate 5–7 platform-specific posts per selected platform using OpenAI GPT-4o API | Generated posts are syntactically valid and within platform constraints | PG-1, BG-1 |
| FR-3.2 | System SHALL apply platform-specific formatting rules: X (280 char/tweet, thread structure), LinkedIn (≤ 3,000 chars, professional tone), Instagram (≤ 2,200 chars, hook-first + hashtags), TikTok (≤ 60s script, visual cues), Bluesky (≤ 300 chars), Email (subject + preview + body ≤ 500 words) | Each output respects its platform's constraints | PG-3 |
| FR-3.3 | System SHALL stream generation results to client via server-sent events or chunked response | User sees incremental output; perceived wait time < 15 seconds for first post | PG-2 |
| FR-3.4 | System SHALL store all generated posts in Supabase linked to the source content | Posts persisted and retrievable after page reload | PG-4 |
| FR-3.5 | System SHALL support regeneration of individual posts without regenerating the full batch | Single post regenerated in < 10 seconds | PG-1 |
| FR-3.6 | System SHALL apply user's voice/tone settings (Pro) when generating content | Generated content reflects selected voice profile | PG-1, BG-4 |
| FR-3.7 | System SHALL include error handling for OpenAI API failures: retry with exponential backoff (max 3 retries), then show user-friendly error | User never sees raw API error; graceful degradation | PG-2 |

### FR-4.0: Platform Selector (Priority: P0)

| ID | Requirement | Acceptance | Trace |
|---|---|---|---|
| FR-4.1 | System SHALL display selectable platform options: X/Twitter, LinkedIn, Instagram, TikTok, Bluesky, Email | All 6 platforms available | PG-3 |
| FR-4.2 | System SHALL enforce free tier limit of 3 platforms per repurpose | Selecting > 3 triggers upgrade CTA | BG-2 |
| FR-4.3 | System SHALL persist platform selection as user preference | Last selection restored on next visit | PG-2 |

### FR-5.0: Inline Content Editor (Priority: P1)

| ID | Requirement | Acceptance | Trace |
|---|---|---|---|
| FR-5.1 | System SHALL provide inline rich text editing for each generated post | Edit mode opens without page navigation | PG-1 |
| FR-5.2 | Editor SHALL support bold, italic, line breaks, bullet lists, and links | Formatting applies correctly | PG-1 |
| FR-5.3 | Editor SHALL display real-time character count with platform limit warnings | Warning appears when within 10% of limit | PG-1 |
| FR-5.4 | System SHALL allow saving edits and reverting to original generated version | Both actions work correctly; original preserved | PG-1 |
| FR-5.5 | Edited posts SHALL be marked with "Edited" badge in the UI | Visual distinction between original and edited | PG-4 |

### FR-6.0: Content Library (Priority: P1)

| ID | Requirement | Acceptance | Trace |
|---|---|---|---|
| FR-6.1 | System SHALL display all user's source content items in a paginated list/grid | 20 items per page; sorted by newest first by default | PG-4 |
| FR-6.2 | System SHALL support full-text search across source content and generated posts | Search returns relevant results within 2 seconds | PG-4 |
| FR-6.3 | System SHALL support filtering by platform and date range | Filters apply correctly and combine with search | PG-4 |
| FR-6.4 | System SHALL support soft-delete with 30-day recovery window | Deleted items not visible in library; recoverable within 30 days | PG-4 |

### FR-7.0: Copy & Export (Priority: P1)

| ID | Requirement | Acceptance | Trace |
|---|---|---|---|
| FR-7.1 | System SHALL copy platform-formatted post text to clipboard on single click | Text appears in clipboard; toast confirmation shown | UG-1 |
| FR-7.2 | System SHALL export all posts from a repurpose as Markdown file | File downloads with posts organized by platform | UG-1 |
| FR-7.3 | System SHALL export all posts from a repurpose as CSV file | CSV contains columns: platform, post_number, content, character_count | UG-1 |

### FR-8.0: Usage Dashboard (Priority: P1)

| ID | Requirement | Acceptance | Trace |
|---|---|---|---|
| FR-8.1 | System SHALL display current month's repurpose count and remaining credits (free tier) | Accurate count after each repurpose | UG-4, BG-2 |
| FR-8.2 | System SHALL display historical repurpose volume chart (weekly, last 3 months) | Chart renders correctly with real data | UG-4 |
| FR-8.3 | System SHALL display total posts generated (all-time) | Counter increments after each generation | UG-4 |
| FR-8.4 | Free tier dashboard SHALL show upgrade CTA when usage > 60% of limit | CTA shown at 4/5 repurposes | BG-2 |

### FR-9.0: Team Features (Priority: P2)

| ID | Requirement | Acceptance | Trace |
|---|---|---|---|
| FR-9.1 | System SHALL allow team admin to invite up to 3 members via email | Invite sent; recipient can join team | BG-2 |
| FR-9.2 | System SHALL provide shared content library for team members | All team members see team content | BG-2 |
| FR-9.3 | System SHALL support up to 5 brand voice profiles per team | Profiles created, selected, applied during generation | BG-4 |
| FR-9.4 | System SHALL allow admin to remove team members | Removed member loses access to team library | BG-2 |

---

## 9. Non-Functional Requirements

### Performance

| ID | Requirement | Target | Measurement |
|---|---|---|---|
| NFR-1.1 | API route response time (non-AI) | SHALL be < 300 ms median, < 800 ms p95 | Server-side latency monitoring |
| NFR-1.2 | AI generation time (up to 4 platforms) | SHALL complete within 30 seconds end-to-end | Timer from request to last token |
| NFR-1.3 | First post visible to user (streamed) | SHALL appear within 8 seconds of generation start | Client-side timer |
| NFR-1.4 | Page load time (initial) | SHALL be < 2 seconds on 4G connection (LCP) | Lighthouse / Web Vitals |
| NFR-1.5 | URL content extraction | SHALL complete within 10 seconds | Server-side timer |
| NFR-1.6 | Content library search | SHALL return results within 2 seconds | Client-side timer |

### Availability & Reliability

| ID | Requirement | Target |
|---|---|---|
| NFR-2.1 | Service uptime | SHALL maintain ≥ 99.5% uptime (monthly) excluding scheduled maintenance |
| NFR-2.2 | AI API failure handling | SHALL retry with exponential backoff (3 attempts); degrade gracefully with user notification |
| NFR-2.3 | Data durability | SHALL NOT lose persisted content; Supabase point-in-time recovery enabled |
| NFR-2.4 | Session management | SHALL handle expired sessions gracefully with redirect to login |

### Security

| ID | Requirement | Target |
|---|---|---|
| NFR-3.1 | Authentication | SHALL use Supabase Auth with JWT; no custom auth implementation |
| NFR-3.2 | Authorization | SHALL enforce Supabase Row-Level Security on all tables; no cross-user data access |
| NFR-3.3 | Data in transit | SHALL use HTTPS (TLS 1.2+) for all communications |
| NFR-3.4 | API keys | SHALL store OpenAI API key, Supabase service key, and Stripe secret in environment variables; SHALL NOT expose to client |
| NFR-3.5 | Input sanitization | SHALL sanitize all user inputs to prevent XSS and SQL injection |
| NFR-3.6 | Rate limiting | SHALL enforce rate limits on API routes: 60 requests/minute per user for general routes; 10 requests/minute for AI generation |
| NFR-3.7 | OWASP Top 10 | SHALL not be vulnerable to OWASP Top 10 (2025) attack vectors |

### Scalability

| ID | Requirement | Target |
|---|---|---|
| NFR-4.1 | Concurrent users | SHALL support 1,000 concurrent users without degradation |
| NFR-4.2 | Database | SHALL support up to 100,000 source content records and 1M generated posts |
| NFR-4.3 | Serverless scaling | SHALL leverage Vercel's auto-scaling for API routes and SSR |
| NFR-4.4 | OpenAI rate limits | SHALL implement request queuing to stay within OpenAI API tier limits |

### Accessibility

| ID | Requirement | Target |
|---|---|---|
| NFR-5.1 | WCAG compliance | SHALL meet WCAG 2.1 Level AA |
| NFR-5.2 | Keyboard navigation | SHALL support full keyboard navigation for all interactive elements |
| NFR-5.3 | Screen reader | SHALL provide appropriate ARIA labels for all interactive components |

### Browser Support

| ID | Requirement | Target |
|---|---|---|
| NFR-6.1 | Desktop browsers | SHALL support Chrome, Firefox, Safari, Edge (latest 2 versions) |
| NFR-6.2 | Mobile responsiveness | SHALL provide a responsive layout usable on screens ≥ 375px width |

---

## 10. Data Model

### Entity Relationship Overview

```
users (1) ──── (N) source_contents (1) ──── (N) generated_posts
  │                                                     │
  │                                                     │
  ├──── (1) user_preferences                            │
  │                                                     │
  ├──── (N) usage_records                               │
  │                                                     │
  └──── (N) team_memberships ──── (N) teams ────────────┘
                                    │
                                    └──── (N) brand_voice_profiles
```

### Core Tables

#### `users`
Managed by Supabase Auth. Extended with a `profiles` table.

```sql
CREATE TABLE profiles (
  id             UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name   TEXT,
  avatar_url     TEXT,
  tier           TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'pro', 'team')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  voice_preset   TEXT DEFAULT 'default',
  voice_custom   TEXT,                     -- custom voice description (≤ 500 chars)
  team_id        UUID REFERENCES teams(id),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

#### `source_contents`

```sql
CREATE TABLE source_contents (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  team_id        UUID REFERENCES teams(id),
  title          TEXT,                     -- extracted or user-provided
  body           TEXT NOT NULL,            -- full source text
  source_url     TEXT,                     -- original URL if URL input
  input_method   TEXT NOT NULL CHECK (input_method IN ('text', 'url')),
  char_count     INTEGER NOT NULL,
  platforms      TEXT[] NOT NULL,          -- selected platforms for this repurpose
  is_deleted     BOOLEAN NOT NULL DEFAULT false,
  deleted_at     TIMESTAMPTZ,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_source_contents_user ON source_contents(user_id);
CREATE INDEX idx_source_contents_team ON source_contents(team_id);
CREATE INDEX idx_source_contents_created ON source_contents(created_at DESC);
CREATE INDEX idx_source_contents_search ON source_contents USING gin(to_tsvector('english', coalesce(title, '') || ' ' || body));
```

#### `generated_posts`

```sql
CREATE TABLE generated_posts (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id      UUID NOT NULL REFERENCES source_contents(id) ON DELETE CASCADE,
  user_id        UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  platform       TEXT NOT NULL CHECK (platform IN ('twitter', 'linkedin', 'instagram', 'tiktok', 'bluesky', 'email')),
  post_number    INTEGER NOT NULL,        -- ordering within platform (1-7)
  content        TEXT NOT NULL,            -- generated/edited content
  original_content TEXT NOT NULL,          -- original AI-generated content (for revert)
  is_edited      BOOLEAN NOT NULL DEFAULT false,
  char_count     INTEGER NOT NULL,
  metadata       JSONB DEFAULT '{}',      -- platform-specific metadata (e.g., thread structure, hashtags, subject line)
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_generated_posts_source ON generated_posts(source_id);
CREATE INDEX idx_generated_posts_user ON generated_posts(user_id);
CREATE INDEX idx_generated_posts_platform ON generated_posts(platform);
CREATE INDEX idx_generated_posts_search ON generated_posts USING gin(to_tsvector('english', content));
```

#### `usage_records`

```sql
CREATE TABLE usage_records (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  action         TEXT NOT NULL CHECK (action IN ('repurpose', 'regenerate')),
  source_id      UUID REFERENCES source_contents(id),
  platforms_count INTEGER NOT NULL,
  posts_generated INTEGER NOT NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_usage_records_user_month ON usage_records(user_id, created_at);
```

#### `teams`

```sql
CREATE TABLE teams (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name           TEXT NOT NULL,
  owner_id       UUID NOT NULL REFERENCES profiles(id),
  max_members    INTEGER NOT NULL DEFAULT 3,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

#### `team_invitations`

```sql
CREATE TABLE team_invitations (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id        UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  email          TEXT NOT NULL,
  invited_by     UUID NOT NULL REFERENCES profiles(id),
  status         TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'expired')),
  expires_at     TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '7 days'),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

#### `brand_voice_profiles`

```sql
CREATE TABLE brand_voice_profiles (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id        UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  name           TEXT NOT NULL,
  description    TEXT,
  tone_keywords  TEXT[],
  example_content TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

#### `user_preferences`

```sql
CREATE TABLE user_preferences (
  user_id            UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  default_platforms  TEXT[] DEFAULT '{}',
  theme              TEXT DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
  email_notifications BOOLEAN DEFAULT true,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### Row-Level Security Policies

All tables SHALL have RLS enabled. Key policies:

```sql
-- profiles: users can only read/update their own profile
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- source_contents: users see own content + team content
ALTER TABLE source_contents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own content" ON source_contents FOR SELECT
  USING (user_id = auth.uid() OR team_id IN (SELECT team_id FROM profiles WHERE id = auth.uid()));

-- generated_posts: same pattern as source_contents
ALTER TABLE generated_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own posts" ON generated_posts FOR SELECT
  USING (user_id = auth.uid() OR source_id IN (
    SELECT id FROM source_contents WHERE team_id IN (SELECT team_id FROM profiles WHERE id = auth.uid())
  ));
```

---

## 11. API & Integration Specs

### Internal API Routes (Next.js API Routes)

All routes are under `/api/` and require authentication via Supabase JWT (passed in `Authorization: Bearer <token>` header) unless noted.

---

#### POST `/api/auth/signup`
**Purpose:** Register a new user with email/password.

| Field | Type | Required | Notes |
|---|---|---|---|
| email | string | Yes | Valid email format |
| password | string | Yes | ≥ 8 chars, ≥ 1 uppercase, ≥ 1 digit |

**Response:** `201 Created`
```json
{
  "user": { "id": "uuid", "email": "user@example.com" },
  "message": "Verification email sent"
}
```

**Errors:** `400` (validation), `409` (email exists)

---

#### POST `/api/repurpose`
**Purpose:** Generate platform-specific posts from source content. This is the core endpoint.

**Auth:** Required. Checks tier limits.

| Field | Type | Required | Notes |
|---|---|---|---|
| content | string | Yes (if no `url`) | Source text (100–50,000 chars) |
| url | string | Yes (if no `content`) | URL to extract content from |
| platforms | string[] | Yes | 1–6 platform identifiers |
| voice_profile_id | string | No | Brand voice profile UUID (team tier) |

**Response:** `200 OK` (streamed via SSE)
```json
{
  "source_id": "uuid",
  "platforms": {
    "twitter": [
      { "id": "uuid", "post_number": 1, "content": "Thread 1/5: ...", "char_count": 267 },
      { "id": "uuid", "post_number": 2, "content": "2/5: ...", "char_count": 245 }
    ],
    "linkedin": [
      { "id": "uuid", "post_number": 1, "content": "Here's what I learned...", "char_count": 1843 }
    ]
  },
  "usage": { "repurposes_used": 3, "repurposes_remaining": 2 }
}
```

**Errors:** `400` (validation), `402` (limit reached), `429` (rate limit), `500` (AI failure after retries)

**Rate Limit:** 10 requests/minute per user.

---

#### POST `/api/repurpose/:sourceId/regenerate`
**Purpose:** Regenerate a single post.

| Field | Type | Required | Notes |
|---|---|---|---|
| post_id | string | Yes | UUID of the post to regenerate |

**Response:** `200 OK`
```json
{
  "post": { "id": "uuid", "post_number": 2, "content": "New variation...", "char_count": 251 }
}
```

---

#### PUT `/api/posts/:postId`
**Purpose:** Update a generated post (inline editing).

| Field | Type | Required | Notes |
|---|---|---|---|
| content | string | Yes | Updated post text |

**Response:** `200 OK`
```json
{
  "post": { "id": "uuid", "content": "...", "is_edited": true, "char_count": 230 }
}
```

---

#### GET `/api/library`
**Purpose:** Retrieve user's content library with search/filter.

| Param | Type | Required | Notes |
|---|---|---|---|
| q | string | No | Full-text search query |
| platform | string | No | Filter by platform |
| from | string | No | ISO date — start of range |
| to | string | No | ISO date — end of range |
| page | number | No | Default: 1 |
| limit | number | No | Default: 20, max: 50 |

**Response:** `200 OK`
```json
{
  "items": [
    {
      "id": "uuid",
      "title": "How to Build...",
      "excerpt": "First 150 chars...",
      "platforms": ["twitter", "linkedin"],
      "post_count": 12,
      "created_at": "2026-02-20T10:00:00Z"
    }
  ],
  "pagination": { "page": 1, "total_pages": 5, "total_items": 94 }
}
```

---

#### GET `/api/usage`
**Purpose:** Retrieve usage statistics.

**Response:** `200 OK`
```json
{
  "current_month": {
    "repurposes": 3,
    "limit": 5,
    "posts_generated": 36
  },
  "all_time": {
    "repurposes": 24,
    "posts_generated": 312
  },
  "weekly_history": [
    { "week": "2026-02-17", "repurposes": 2, "posts": 18 }
  ],
  "tier": "free"
}
```

---

#### POST `/api/extract-url`
**Purpose:** Extract article content from a URL.

| Field | Type | Required | Notes |
|---|---|---|---|
| url | string | Yes | Valid URL |

**Response:** `200 OK`
```json
{
  "title": "How to Build a SaaS in 2026",
  "content": "Full article text...",
  "char_count": 4523,
  "meta_description": "A guide to..."
}
```

**Errors:** `400` (invalid URL), `422` (extraction failed)

---

#### POST `/api/billing/create-checkout`
**Purpose:** Create Stripe Checkout session for upgrade.

| Field | Type | Required | Notes |
|---|---|---|---|
| plan | string | Yes | `pro` or `team` |

**Response:** `200 OK`
```json
{ "checkout_url": "https://checkout.stripe.com/..." }
```

---

#### POST `/api/billing/webhook`
**Purpose:** Handle Stripe webhook events.  
**Auth:** Stripe signature verification (no JWT).

**Handled events:** `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`

---

### External Integrations

| Integration | Purpose | Auth Method | Rate Limits |
|---|---|---|---|
| OpenAI API (GPT-4o) | Content generation | API key (server-side) | Per-tier (see OpenAI docs) |
| Supabase | Database, Auth, Storage | Service key (server-side), Anon key (client-side with RLS) | Generous for paid Supabase plan |
| Stripe | Payments & subscriptions | Secret key (server-side) | Standard Stripe limits |
| URL extraction (server-side) | Article content extraction | N/A (HTTP fetch + parsing) | Self-imposed: 10/min/user |

---

## 12. Architecture Overview

### Component Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                          VERCEL (Hosting)                           │
│                                                                     │
│  ┌──────────────────────────┐   ┌─────────────────────────────────┐ │
│  │   Next.js Frontend       │   │   Next.js API Routes            │ │
│  │   (App Router + RSC)     │   │   (Serverless Functions)        │ │
│  │                          │   │                                 │ │
│  │  - Auth Pages            │   │  /api/auth/*                    │ │
│  │  - Dashboard             │   │  /api/repurpose                 │ │
│  │  - Content Input         │   │  /api/posts/*                   │ │
│  │  - Output Display        │   │  /api/library                   │ │
│  │  - Content Library       │   │  /api/usage                     │ │
│  │  - Usage Dashboard       │   │  /api/extract-url               │ │
│  │  - Settings/Voice        │   │  /api/billing/*                 │ │
│  │  - Team Management       │   │                                 │ │
│  └──────────┬───────────────┘   └─────────┬───────────────────────┘ │
│             │                             │                         │
└─────────────┼─────────────────────────────┼─────────────────────────┘
              │                             │
              │  Supabase JS Client         │  Server-side calls
              │  (RLS-protected)            │
              ▼                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         SUPABASE                                    │
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────────────┐   │
│  │  Auth         │  │  PostgreSQL  │  │  Storage (avatars, etc) │   │
│  │  (JWT, OAuth) │  │  (+ RLS)     │  │                         │   │
│  └──────────────┘  └──────────────┘  └─────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
              │
              │  API Routes call externally
              ▼
┌────────────────────────┐    ┌─────────────────────┐
│    OpenAI API          │    │    Stripe API        │
│    (GPT-4o)            │    │    (Billing)         │
│    Content generation  │    │    Subscriptions     │
└────────────────────────┘    └─────────────────────┘
```

### Deployment Model

- **Frontend + API:** Deployed as a single Next.js application on **Vercel**.
- **Database & Auth:** Hosted on **Supabase** (managed PostgreSQL + Auth + Storage).
- **AI Processing:** Serverless API routes call **OpenAI API** directly; no persistent compute needed.
- **Payments:** **Stripe** handles all billing; webhook endpoint on Vercel processes events.
- **CDN & Edge:** Vercel Edge Network for static assets and ISR pages.

### Key Architectural Decisions

| Decision | Rationale |
|---|---|
| Next.js App Router with Server Components | Reduced client JS, faster page loads, native streaming support for AI output |
| Supabase over custom backend | Auth + DB + Storage + RLS in one service; rapid MVP development |
| Serverless API routes (Vercel) | Zero server management; auto-scales; cost-effective at low-to-mid traffic |
| OpenAI GPT-4o | Best quality/cost ratio for multi-format content generation; structured output support |
| Streaming SSE for AI output | Reduces perceived latency; user sees first post in < 8 seconds |
| Full-text search via PostgreSQL `tsvector` | Adequate for MVP scale; avoids external search service dependency |
| Stripe for billing | Industry standard; handles PCI compliance; supports subscriptions natively |

---

## 13. Monetization & Billing

### Tier Definitions

| Feature | Free | Pro ($12/mo) | Team ($29/mo) |
|---|---|---|---|
| Repurposes per month | 5 | Unlimited | Unlimited |
| Platforms per repurpose | 3 | All 6 | All 6 |
| Voice/tone customization | — | ✓ | ✓ |
| Priority generation | — | ✓ | ✓ |
| Team seats | 1 | 1 | Up to 4 (admin + 3) |
| Shared content library | — | — | ✓ |
| Brand voice profiles | — | — | Up to 5 |
| Content library | ✓ | ✓ | ✓ |
| Export (Markdown/CSV) | ✓ | ✓ | ✓ |

### Billing Implementation

- Stripe Checkout for upgrade flow (no custom payment form needed for MVP).
- Stripe Customer Portal for managing subscription (cancel, update payment method).
- Webhook-driven tier updates: on `checkout.session.completed`, update `profiles.tier`.
- On `customer.subscription.deleted`, downgrade to free tier.
- On `invoice.payment_failed`, send warning email; 3 failed attempts → downgrade to free.
- Credit reset: monthly repurpose count resets based on `usage_records.created_at` against subscription billing cycle.

### Limit Enforcement

- **Before generation:** API route checks `usage_records` for current billing period.
- **Platform count:** Validated in `/api/repurpose` before calling OpenAI.
- **Voice features:** Gated server-side; `profiles.tier` checked before applying voice settings.

---

## 14. Implementation Plan & Milestones

### Phase 0: Foundation (Weeks 1–3)

| Task | Owner | Duration | Dependencies |
|---|---|---|---|
| Project scaffolding: Next.js 14+, TypeScript, Tailwind CSS, ESLint | Engineering | 2 days | — |
| Supabase project setup: DB, Auth configuration, RLS policies | Engineering | 2 days | — |
| Database schema creation (all tables, indexes, RLS) | Engineering | 3 days | Supabase setup |
| Supabase Auth integration: email/password + Google OAuth | Engineering | 3 days | Schema |
| UI component library setup (design system, layout, nav) | Design + Eng | 4 days | Scaffolding |
| CI/CD pipeline: Vercel deployment, preview environments | Engineering | 1 day | Scaffolding |
| Environment variable management, secrets setup | Engineering | 0.5 days | — |

**Milestone:** User can sign up, log in, see an empty dashboard. Database schema deployed. CI/CD working.

### Phase 1: Core MVP (Weeks 4–8)

| Task | Owner | Duration | Dependencies |
|---|---|---|---|
| Content input UI: text paste + URL toggle | Engineering | 3 days | Phase 0 |
| URL extraction service (server-side) | Engineering | 3 days | Phase 0 |
| Platform selector component | Engineering | 2 days | Phase 0 |
| AI repurposing engine: OpenAI integration + prompt engineering | Engineering | 5 days | Phase 0 |
| Platform-specific prompt templates (X, LinkedIn, Instagram, TikTok, Bluesky, Email) | Eng + Product | 4 days | AI engine |
| SSE streaming for generation output | Engineering | 3 days | AI engine |
| Output display UI (tabbed/card layout, per-platform) | Engineering | 4 days | Streaming |
| Generated posts persistence (Supabase) | Engineering | 2 days | AI engine + Schema |
| Usage tracking (record each repurpose) | Engineering | 2 days | Schema |
| Free tier limit enforcement | Engineering | 1 day | Usage tracking |
| Error handling: retries, fallbacks, user-facing messages | Engineering | 2 days | AI engine |

**Milestone:** User can paste content or URL, select platforms, generate posts, see streaming output. Free tier limits enforced. Posts persisted.

### Phase 2: Library & Polish (Weeks 9–11)

| Task | Owner | Duration | Dependencies |
|---|---|---|---|
| Content library UI: list/grid view, pagination | Engineering | 3 days | Phase 1 |
| Full-text search implementation | Engineering | 2 days | Phase 1 |
| Filter by platform and date range | Engineering | 2 days | Library UI |
| Inline content editor (rich text) | Engineering | 4 days | Phase 1 |
| Edit/save/revert functionality | Engineering | 2 days | Editor |
| One-click copy to clipboard | Engineering | 1 day | Phase 1 |
| Batch export (Markdown + CSV) | Engineering | 2 days | Phase 1 |
| Usage dashboard UI (stats, charts) | Engineering | 3 days | Usage tracking |
| Soft-delete with recovery | Engineering | 1 day | Library |
| Responsive design pass | Design + Eng | 2 days | All UI |
| Accessibility audit and fixes | Design + Eng | 2 days | All UI |

**Milestone:** Full content library with search/filter. Inline editing working. Export functional. Usage dashboard live. Responsive and accessible.

### Phase 3: Monetization (Weeks 12–13)

| Task | Owner | Duration | Dependencies |
|---|---|---|---|
| Stripe integration: products, prices, checkout | Engineering | 3 days | Phase 2 |
| Stripe webhook handler | Engineering | 2 days | Stripe setup |
| Billing UI: pricing page, upgrade prompts, plan management | Engineering | 3 days | Stripe setup |
| Tier enforcement (server-side gating for Pro/Team features) | Engineering | 2 days | Stripe webhook |
| Voice/tone customization (Pro feature) | Engineering | 3 days | AI engine + Tier |
| Basic team features: invite, shared library, brand voices | Engineering | 4 days | Tier + Schema |

**Milestone:** Payment flow working end-to-end. Pro and Team tiers functional. Voice customization and team features operational.

### Phase 4: Beta & Launch (Weeks 14–16)

| Task | Owner | Duration | Dependencies |
|---|---|---|---|
| Closed beta: 50–100 users | Product + Eng | 5 days | Phase 3 |
| Bug fixes from beta feedback | Engineering | 5 days | Beta |
| Prompt quality tuning based on real usage | Eng + Product | 3 days | Beta |
| Landing page | Design + Eng | 3 days | — |
| Analytics integration (Vercel Analytics, PostHog) | Engineering | 1 day | — |
| Documentation: onboarding tooltips, FAQ | Product + Design | 2 days | — |
| Performance optimization pass | Engineering | 2 days | All phases |
| Security audit | Engineering | 2 days | All phases |
| Public launch 🚀 | All | 1 day | All above |

**Milestone:** Product publicly available. Landing page live. Analytics tracking. Known bugs fixed.

---

## 15. Testing Strategy

### Unit Tests

| Area | Framework | Coverage Target |
|---|---|---|
| Utility functions (format helpers, validators, char counters) | Vitest | ≥ 90% |
| API route handlers (input validation, error handling) | Vitest | ≥ 85% |
| Database queries (CRUD operations) | Vitest + Supabase local | ≥ 80% |
| React components (rendering, interaction) | Vitest + React Testing Library | ≥ 70% |

### Integration Tests

| Area | Approach |
|---|---|
| Auth flow (signup → verify → login → session) | Automated using Supabase local + test client |
| Repurpose flow (input → generate → persist → retrieve) | API-level test with mocked OpenAI responses |
| Billing flow (checkout → webhook → tier update) | Stripe test mode with webhook simulation |
| URL extraction | Test against known URLs + mock server for edge cases |
| RLS policies | Direct Supabase queries as different user roles to verify isolation |

### End-to-End Tests

| Flow | Tool |
|---|---|
| Signup → first repurpose → copy output | Playwright |
| Login → library search → edit post → export | Playwright |
| Free user → hit limit → upgrade → resume | Playwright (Stripe test mode) |
| URL input → extraction → preview → generate | Playwright |

### Load Tests

| Scenario | Tool | Target |
|---|---|---|
| 100 concurrent repurpose requests | k6 | All complete within 45 seconds |
| 1,000 concurrent library searches | k6 | p95 < 3 seconds |
| 500 concurrent page loads | k6 | LCP < 2.5 seconds |

### Acceptance Test Checklist (MVP)

- [ ] User can sign up with email/password and verify email
- [ ] User can sign up and log in with Google OAuth
- [ ] User can paste text and generate posts for 3 platforms
- [ ] User can paste a URL and extract article content
- [ ] Generated posts respect platform character limits and formatting
- [ ] AI generation completes within 30 seconds for 4 platforms
- [ ] First post visible via streaming within 8 seconds
- [ ] User can edit a generated post and save changes
- [ ] User can revert an edited post to original
- [ ] User can regenerate a single post
- [ ] User can copy a post to clipboard with one click
- [ ] User can export posts as Markdown and CSV
- [ ] Content library shows all past repurposes
- [ ] Content library search returns results within 2 seconds
- [ ] Content library filters by platform and date range
- [ ] Usage dashboard shows accurate counts
- [ ] Free tier enforces 5 repurposes/month and 3 platforms/repurpose
- [ ] Upgrade to Pro via Stripe Checkout works end-to-end
- [ ] Pro user has unlimited repurposes and voice customization
- [ ] Team admin can invite members and share content library
- [ ] RLS prevents cross-user data access
- [ ] All pages are responsive on mobile (≥ 375px)
- [ ] Keyboard navigation works for all interactive elements

---

## 16. Rollout & Monitoring

### Rollout Plan

| Stage | Audience | Duration | Gate to Next Stage |
|---|---|---|---|
| Internal alpha | Team only | 1 week | Core flows working without critical bugs |
| Closed beta | 50–100 invited users (creators, solopreneurs) | 2 weeks | NPS ≥ 30; no data loss bugs; generation quality rated ≥ 3.5/5 |
| Public beta | Open signups (soft launch) | 2 weeks | Conversion rate > 5%; no P0 bugs |
| General availability | Full launch with marketing push | Ongoing | — |

### Feature Flags

| Flag | Purpose |
|---|---|
| `ff_team_features` | Gate team tier functionality during beta |
| `ff_voice_customization` | Gate voice/tone features for staged rollout |
| `ff_bluesky_platform` | Gate Bluesky as a platform option (might lag) |
| `ff_url_extraction` | Gate URL input in case of extraction reliability issues |

### Monitoring & Alerting

| Metric | Tool | Alert Threshold |
|---|---|---|
| Error rate (API routes) | Vercel Analytics + Sentry | > 5% error rate over 5 minutes |
| AI generation latency | Custom logging + PostHog | p95 > 45 seconds |
| AI generation failure rate | Sentry | > 10% failure rate |
| Supabase DB connection pool | Supabase Dashboard | > 80% pool utilization |
| Stripe webhook failures | Stripe Dashboard | Any failed webhook (retry monitoring) |
| OpenAI API spend | OpenAI Dashboard | Daily spend > $50 (adjusted as usage grows) |
| Uptime | Vercel / UptimeRobot | Downtime > 5 minutes |
| Core Web Vitals (LCP, FID, CLS) | Vercel Analytics | LCP > 3s, CLS > 0.1 |

### Key Business Metrics to Track (PostHog / Custom)

| Metric | Description |
|---|---|
| Activation rate | % of signups completing first repurpose within 24 hours |
| Repurposes per user per week | Content velocity |
| Platform distribution | Which platforms are most selected |
| Edit rate | % of generated posts that are edited before copy/export |
| Export vs. copy ratio | How users prefer to extract their content |
| Free-to-Pro conversion rate | % of free users upgrading within 30 days |
| Churn rate | Monthly subscription cancellations |
| Feature adoption (voice, teams) | % of eligible users activating Pro/Team features |

---

## 17. Success Metrics

### North Star Metric

**Weekly Active Repurposes (WAR):** Number of repurpose operations completed per week across all users.

*Rationale:* This metric directly captures product value delivery — each repurpose represents a user getting value from the platform.

### KPI Dashboard (6-Month Targets)

| Category | Metric | Target | Measurement |
|---|---|---|---|
| Growth | MAU | 10,000 | Supabase Auth + PostHog |
| Growth | WAU / MAU ratio | ≥ 40% | PostHog |
| Growth | Signup → activation (first repurpose within 24h) | ≥ 70% | PostHog funnel |
| Revenue | MRR | $15,000 | Stripe |
| Revenue | Free → Pro conversion (30-day) | 8–12% | Stripe + PostHog |
| Revenue | Pro churn (monthly) | < 5% | Stripe |
| Engagement | Avg repurposes per active user/month | ≥ 6 | Usage records |
| Engagement | Avg platforms per repurpose | ≥ 3.5 | Usage records |
| Quality | % posts edited before copy/export | ≤ 40% (lower = better AI quality) | PostHog events |
| Quality | NPS | ≥ 40 | In-app survey (quarterly) |
| Retention | 30-day retention | ≥ 45% | PostHog cohorts |
| Retention | 90-day retention | ≥ 25% | PostHog cohorts |
| Performance | AI generation p95 latency | < 30 seconds | Custom logging |
| Performance | Uptime | ≥ 99.5% | UptimeRobot |

---

## 18. Risks & Mitigations

| ID | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| R-1 | **OpenAI API outage or degradation** — service disruption blocks core functionality | Medium | Critical | Implement retry with backoff; display cached/queued status to users; evaluate fallback model (Claude, Mistral) as backup; communicate transparently via status page |
| R-2 | **AI output quality inconsistency** — generated posts require too many edits, degrading value proposition | Medium | High | Invest in prompt engineering; A/B test prompt variations; collect thumbs up/down feedback per post; iterate continuously; set quality gate: ≥ 80% posts need ≤ 2 edits |
| R-3 | **OpenAI API cost exceeds projections** — high usage drives costs beyond revenue | Medium | High | Implement token budgets per generation; use `gpt-4o-mini` for simpler platforms; monitor daily spend with alerts; adjust pricing if needed |
| R-4 | **URL extraction unreliability** — many sites block or fail extraction | High | Medium | Support graceful fallback to text paste; test against top 20 blog platforms; implement user-agent rotation; use readability algorithms (Mozilla Readability); set extraction success rate target ≥ 90% |
| R-5 | **Low free-to-paid conversion** — free tier too generous or Pro value unclear | Medium | High | A/B test free tier limits (3 vs. 5 repurposes); add Pro upsell touchpoints; implement "Pro preview" showing voice customization difference; track conversion funnel closely |
| R-6 | **Platform format changes** — social platforms change character limits or formatting rules | Medium | Medium | Externalize platform rules as configuration; monitor platform changes quarterly; quick-deploy config updates without code changes |
| R-7 | **Security breach — data exposure** | Low | Critical | Enforce RLS rigorously; regular security audits; no sensitive data in client bundle; penetration testing before GA; implement Supabase audit logging |
| R-8 | **Vercel serverless cold starts** — AI generation timeout on cold function start | Medium | Medium | Use Vercel's function warm-up; set appropriate `maxDuration` (60s) for AI routes; implement client-side retry UX |
| R-9 | **Competitor launches similar feature** — Buffer/Hootsuite adds AI repurposing | Medium | Medium | Move fast to establish user base; differentiate on voice learning and multi-platform quality; build switching costs via content library |
| R-10 | **Supabase vendor lock-in** — migration becomes necessary | Low | Medium | Use standard PostgreSQL features; abstract Supabase client behind service layer; maintain schema as migration files |

---

## 19. Out of Scope

The following items are explicitly **out of scope** for the MVP and post-MVP phases described in this PRD:

| Item | Rationale | Potential Future Phase |
|---|---|---|
| **Direct social media publishing** (posting to platforms via API) | Requires OAuth with each platform; complex compliance requirements; users already have preferred schedulers | V2 — integrate with Buffer/Hootsuite APIs |
| **Social media scheduling** | Same complexity as publishing; low differentiation | V2 — after publishing |
| **Image/video generation** (AI-generated visuals for posts) | Separate AI domain; significantly increases cost and complexity | V3 |
| **Podcast/video file upload and transcription** | Requires audio/video processing pipeline; focus on text-first for MVP | V2 — use Whisper API |
| **Analytics on published posts** (engagement tracking from platforms) | Requires platform API integrations and data ingestion | V3 |
| **White-label or API access** | Enterprise feature; premature for MVP market | V3+ |
| **Mobile native apps** (iOS/Android) | Responsive web sufficient for MVP audience; mobile apps are high-cost | V2+ |
| **Multi-language support** | English-first; internationalization adds complexity to AI prompts and UI | V2 |
| **WordPress/CMS plugin integration** | Niche; URL extraction covers most use cases | V2 |
| **Collaborative real-time editing** | Complex engineering; Team tier's shared library is sufficient for MVP | V3 |
| **Custom AI model fine-tuning per user** | Cost-prohibitive at scale; voice prompting is MVP approach | V3+ |
| **Content calendar view** | Scheduling is out of scope; calendar adds limited value without it | V2 |
| **A/B testing of generated posts** | Valuable but non-essential; requires analytics integration | V2 |

---

## 20. Glossary

| Term | Definition |
|---|---|
| **Repurpose** | The act of converting one piece of source content into multiple platform-specific posts. One repurpose = one source input → N platform outputs. |
| **Source content** | The original long-form text (or extracted URL content) provided by the user as input. |
| **Generated post** | A single piece of platform-specific content produced by the AI engine from source content. |
| **Platform** | A social media service or distribution channel (X/Twitter, LinkedIn, Instagram, TikTok, Bluesky, Email). |
| **Voice profile** | A set of tone, style, and formatting preferences that guide AI generation. Can be a user's personal voice (Pro) or a team brand voice (Team). |
| **Credit** | One repurpose operation. Free tier has 5 credits/month. |
| **Thread** | An X/Twitter-specific format consisting of multiple connected tweets (3–7 per thread). |
| **Hook** | The opening line of a post, designed to capture attention. Especially important for TikTok and Instagram. |
| **RLS** | Row-Level Security — a PostgreSQL feature (used via Supabase) that restricts data access at the database row level based on user identity. |
| **SSE** | Server-Sent Events — a protocol for streaming data from server to client over HTTP. Used for real-time AI generation output. |
| **Tier** | A subscription level (Free, Pro, Team) that determines feature access and usage limits. |
| **MVP** | Minimum Viable Product — the first publicly usable version of RecastAI. |

---

## 21. Traceability Matrix

| Requirement ID | Business Goal | User Goal | Acceptance Test |
|---|---|---|---|
| FR-1.1, FR-1.2 | BG-1 (PMF) | — | User can sign up and log in |
| FR-2.1, FR-2.2 | BG-1 | UG-1 (save time) | User can input content |
| FR-2.3, FR-2.4 | BG-1 | UG-1 | URL extraction works for 90%+ sites |
| FR-3.1, FR-3.2 | BG-1, BG-2 | UG-1, UG-2 | Posts generated for all platforms with correct formatting |
| FR-3.3 | BG-1 | UG-1 | Streaming output visible in < 8s |
| FR-3.6 | BG-4 (moat) | UG-3 (voice) | Voice settings applied to output |
| FR-4.1, FR-4.2 | BG-2 | UG-2 (multi-platform) | Platform selection works; free tier limited |
| FR-5.1–5.5 | BG-1 | UG-1, UG-3 | Inline editing works with save/revert |
| FR-6.1–6.4 | BG-1 | UG-1 | Library browsable, searchable, filterable |
| FR-7.1–7.3 | BG-1 | UG-1 | Copy and export functional |
| FR-8.1–8.4 | BG-2 | UG-4 (visibility) | Usage stats accurate and visible |
| FR-9.1–9.4 | BG-2 | — | Team features functional |
| NFR-1.1–1.6 | BG-1 | UG-1 | Performance targets met |
| NFR-3.1–3.7 | BG-1 | — | Security audit passed |

---

## 22. Change Log

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0 | 2026-02-24 | Product Team | Initial PRD created |
