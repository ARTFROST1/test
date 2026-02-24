# Database Schema for RecastAI

> **Version:** 1.0
> **Date:** 2026-02-24
> **Status:** Draft
> **Depends on:** PRD.md (v1.0), TechStack.md (v1.0)

---

## Table of Contents

1. [Scope and Purpose](#1-scope-and-purpose)
2. [Chosen Database Engine](#2-chosen-database-engine)
3. [Conceptual Model](#3-conceptual-model)
4. [Enum Types](#4-enum-types)
5. [Logical Model — Tables](#5-logical-model--tables)
6. [Relationships](#6-relationships)
7. [Indexing Strategy](#7-indexing-strategy)
8. [Row Level Security (RLS) Policies](#8-row-level-security-rls-policies)
9. [Triggers & Functions](#9-triggers--functions)
10. [Views](#10-views)
11. [Storage Buckets](#11-storage-buckets)
12. [Migration Notes](#12-migration-notes)
13. [Supabase-Specific Notes](#13-supabase-specific-notes)
14. [Reconciliation Notes](#14-reconciliation-notes)
15. [Versioning](#15-versioning)

---

## 1. Scope and Purpose

This document defines the complete PostgreSQL database schema for **RecastAI**, an AI-powered content repurposing platform. The schema supports:

- User authentication and profile management (via Supabase Auth)
- Long-form content ingestion (text paste and URL extraction)
- AI-generated platform-specific social media posts
- Content library with full-text search, filtering, and soft-delete
- Usage tracking and credit enforcement (free tier: 5 repurposes/month)
- Subscription tier management (Free / Pro / Team) integrated with Stripe
- Team workspaces with shared content libraries and brand voice profiles
- Row Level Security (RLS) for complete data isolation between users/teams

**Expected data volume (from PRD NFR-4.2):**
- Up to 100,000 source content records
- Up to 1,000,000 generated posts
- 10,000+ MAU target at 6 months

---

## 2. Chosen Database Engine

**Supabase (PostgreSQL 15+)** — Managed PostgreSQL instance via Supabase Pro plan ($25/mo).

**Justification (from TechStack.md):**
- Built-in Auth, RLS, Storage, and Realtime in one platform
- Row-Level Security enforces data isolation at the DB level (NFR-3.2)
- Full-text search via `tsvector` / GIN indexes (FR-6.2) without external search service
- JSONB support for flexible platform-specific metadata
- Array column support for multi-value fields (platforms, tone_keywords)
- PgBouncer connection pooling in transaction mode for serverless (Vercel) compatibility
- Point-in-time recovery on Pro plan (NFR-2.3)

**ORM/Driver:** `@supabase/supabase-js` v2.45+ (PostgREST client); `@supabase/ssr` v0.5+ for server-side auth.

---

## 3. Conceptual Model

### Entity Relationship Diagram

```
auth.users (Supabase Auth)
    │
    │ 1:1
    ▼
profiles ──────────────────────┐
    │                          │
    │ 1:N                      │ N:1 (optional)
    ▼                          ▼
source_contents             teams
    │                       │   │
    │ 1:N                   │   │ 1:N
    ▼                       │   ▼
generated_posts             │  brand_voice_profiles
                            │
    ▲                       │ 1:N
    │                       ▼
profiles ──── 1:N ──── usage_records
    │
    │ 1:1
    ▼
user_preferences

teams ──── 1:N ──── team_invitations
```

### Domains

| Domain | Entities | Purpose |
|---|---|---|
| **User Management** | `profiles`, `user_preferences` | User identity, settings, subscription tier |
| **Content** | `source_contents`, `generated_posts` | Core repurposing data pipeline |
| **Usage & Billing** | `usage_records`, `profiles.tier`, `profiles.stripe_*` | Credit tracking, tier enforcement, Stripe integration |
| **Teams** | `teams`, `team_invitations`, `brand_voice_profiles` | Shared workspaces, invitations, brand voices |
| **Auth** | `auth.users` (Supabase-managed) | Authentication, JWT sessions, OAuth |

---

## 4. Enum Types

```sql
-- ============================================================
-- ENUM TYPES
-- ============================================================

-- Supported social media platforms
-- Referenced by: generated_posts.platform, user_preferences.default_platforms
CREATE TYPE platform_type AS ENUM (
  'twitter',
  'linkedin',
  'instagram',
  'tiktok',
  'bluesky',
  'email'
);

-- Subscription tiers aligned with Stripe products
-- Referenced by: profiles.tier
CREATE TYPE subscription_tier AS ENUM (
  'free',
  'pro',
  'team'
);

-- How the source content was provided
-- Referenced by: source_contents.input_method
CREATE TYPE input_method_type AS ENUM (
  'text',
  'url'
);

-- Usage action types for tracking credits
-- Referenced by: usage_records.action
CREATE TYPE usage_action_type AS ENUM (
  'repurpose',
  'regenerate'
);

-- Team invitation statuses
-- Referenced by: team_invitations.status
CREATE TYPE invitation_status AS ENUM (
  'pending',
  'accepted',
  'declined',
  'expired'
);

-- Theme preference
-- Referenced by: user_preferences.theme
CREATE TYPE theme_type AS ENUM (
  'light',
  'dark',
  'system'
);

-- Preset voice tones (Pro feature)
-- Referenced by: profiles.voice_preset
CREATE TYPE voice_preset_type AS ENUM (
  'default',
  'professional',
  'casual',
  'witty',
  'inspirational',
  'educational'
);
```

---

## 5. Logical Model — Tables

### 5.1 Table: `profiles`

**Purpose:** Extends Supabase `auth.users` with application-specific profile data, subscription info, and team membership. The `id` mirrors `auth.users.id` (1:1).

```sql
CREATE TABLE profiles (
  -- Identity
  id                      UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name            TEXT,
  avatar_url              TEXT,

  -- Subscription (Stripe-linked)
  tier                    subscription_tier NOT NULL DEFAULT 'free',
  stripe_customer_id      TEXT UNIQUE,
  stripe_subscription_id  TEXT UNIQUE,

  -- Voice settings (Pro feature, US-3.3)
  voice_preset            voice_preset_type NOT NULL DEFAULT 'default',
  voice_custom            TEXT,  -- custom voice description, max 500 chars

  -- Team membership (nullable = no team)
  team_id                 UUID REFERENCES teams(id) ON DELETE SET NULL,

  -- Timestamps
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Constraints
  CONSTRAINT chk_voice_custom_length CHECK (char_length(voice_custom) <= 500)
);

COMMENT ON TABLE profiles IS 'User profiles extending Supabase auth.users with app-specific data';
COMMENT ON COLUMN profiles.tier IS 'Subscription tier: free (5 repurposes/mo), pro ($12/mo unlimited), team ($29/mo)';
COMMENT ON COLUMN profiles.voice_custom IS 'Free-text voice description for Pro users, max 500 characters';
```

---

### 5.2 Table: `teams`

**Purpose:** Team workspace for Team-tier subscribers. Enables shared content libraries and brand voice profiles (FR-9.1–9.4).

```sql
CREATE TABLE teams (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  owner_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  max_members     INTEGER NOT NULL DEFAULT 3,

  -- Timestamps
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Constraints
  CONSTRAINT chk_max_members_positive CHECK (max_members > 0 AND max_members <= 10),
  CONSTRAINT chk_team_name_length CHECK (char_length(name) >= 1 AND char_length(name) <= 100)
);

COMMENT ON TABLE teams IS 'Team workspaces for Team-tier subscribers (up to 4 members: 1 admin + 3 invited)';
```

---

### 5.3 Table: `team_invitations`

**Purpose:** Tracks email-based invitations to join a team. Invitations expire after 7 days (US-8.1).

```sql
CREATE TABLE team_invitations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id         UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  email           TEXT NOT NULL,
  invited_by      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status          invitation_status NOT NULL DEFAULT 'pending',

  -- Expiry
  expires_at      TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '7 days'),

  -- Timestamps
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Prevent duplicate pending invitations to same email for same team
  CONSTRAINT uq_team_invitation_pending UNIQUE (team_id, email, status)
);

COMMENT ON TABLE team_invitations IS 'Email-based team invitations with 7-day expiry';
```

---

### 5.4 Table: `brand_voice_profiles`

**Purpose:** Team-level brand voice definitions that override individual voice settings during generation. Up to 5 per team (FR-9.3, US-8.2).

```sql
CREATE TABLE brand_voice_profiles (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id         UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  description     TEXT,
  tone_keywords   TEXT[] DEFAULT '{}',      -- e.g., ARRAY['bold', 'empathetic', 'data-driven']
  example_content TEXT,                     -- sample content demonstrating the voice

  -- Timestamps
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Constraints
  CONSTRAINT chk_brand_voice_name_length CHECK (char_length(name) >= 1 AND char_length(name) <= 100)
);

COMMENT ON TABLE brand_voice_profiles IS 'Team brand voice definitions (up to 5 per team) for consistent AI generation';
```

---

### 5.5 Table: `source_contents`

**Purpose:** Stores the original long-form content submitted by users for repurposing. Supports text paste and URL extraction input methods (FR-2.1–2.6). Implements soft-delete with 30-day recovery (FR-6.4).

```sql
CREATE TABLE source_contents (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  team_id         UUID REFERENCES teams(id) ON DELETE SET NULL,

  -- Content
  title           TEXT,                     -- extracted from URL or user-provided
  body            TEXT NOT NULL,            -- full source text (100–50,000 chars)
  source_url      TEXT,                     -- original URL if input_method = 'url'
  input_method    input_method_type NOT NULL,
  char_count      INTEGER NOT NULL,

  -- Generation context
  platforms       platform_type[] NOT NULL, -- selected platforms for this repurpose

  -- Soft delete (FR-6.4: 30-day recovery)
  is_deleted      BOOLEAN NOT NULL DEFAULT false,
  deleted_at      TIMESTAMPTZ,

  -- Full-text search vector (auto-populated by trigger)
  search_vector   TSVECTOR,

  -- Timestamps
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Constraints
  CONSTRAINT chk_char_count_range CHECK (char_count >= 100 AND char_count <= 50000),
  CONSTRAINT chk_body_not_empty CHECK (char_length(body) >= 100),
  CONSTRAINT chk_platforms_not_empty CHECK (array_length(platforms, 1) >= 1),
  CONSTRAINT chk_url_when_url_method CHECK (
    (input_method = 'url' AND source_url IS NOT NULL) OR
    (input_method = 'text')
  ),
  CONSTRAINT chk_deleted_at_consistency CHECK (
    (is_deleted = true AND deleted_at IS NOT NULL) OR
    (is_deleted = false AND deleted_at IS NULL)
  )
);

COMMENT ON TABLE source_contents IS 'Original long-form content submitted for AI repurposing';
COMMENT ON COLUMN source_contents.platforms IS 'Array of platform_type enums selected for this repurpose session';
COMMENT ON COLUMN source_contents.search_vector IS 'Auto-populated tsvector for full-text search (GIN-indexed)';
```

---

### 5.6 Table: `generated_posts`

**Purpose:** Stores AI-generated platform-specific posts linked to source content. Supports inline editing with original content preservation for revert (FR-3.1–3.5, FR-5.1–5.5).

```sql
CREATE TABLE generated_posts (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id         UUID NOT NULL REFERENCES source_contents(id) ON DELETE CASCADE,
  user_id           UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Post content
  platform          platform_type NOT NULL,
  post_number       INTEGER NOT NULL,       -- ordering within platform (1–7)
  content           TEXT NOT NULL,           -- current content (edited or original)
  original_content  TEXT NOT NULL,           -- AI-generated content (preserved for revert)
  is_edited         BOOLEAN NOT NULL DEFAULT false,
  char_count        INTEGER NOT NULL,

  -- Platform-specific data (thread structure, hashtags, subject line, etc.)
  metadata          JSONB NOT NULL DEFAULT '{}',

  -- Full-text search vector (auto-populated by trigger)
  search_vector     TSVECTOR,

  -- Timestamps
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Constraints
  CONSTRAINT chk_post_number_range CHECK (post_number >= 1 AND post_number <= 10),
  CONSTRAINT chk_char_count_positive CHECK (char_count > 0),
  CONSTRAINT uq_source_platform_post UNIQUE (source_id, platform, post_number)
);

COMMENT ON TABLE generated_posts IS 'AI-generated platform-specific posts (5–7 per platform per repurpose)';
COMMENT ON COLUMN generated_posts.metadata IS 'JSONB for platform-specific data: thread structure, hashtags, subject lines, visual cues';
COMMENT ON COLUMN generated_posts.original_content IS 'Preserved original AI output for "Revert to original" functionality';
```

---

### 5.7 Table: `usage_records`

**Purpose:** Tracks every repurpose and regenerate action for credit enforcement and dashboard analytics (FR-8.1–8.4). Free tier limited to 5 repurposes/month.

```sql
CREATE TABLE usage_records (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Action details
  action            usage_action_type NOT NULL,
  source_id         UUID REFERENCES source_contents(id) ON DELETE SET NULL,
  platforms_count   INTEGER NOT NULL,
  posts_generated   INTEGER NOT NULL,

  -- Timestamps
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Constraints
  CONSTRAINT chk_platforms_count_positive CHECK (platforms_count >= 1),
  CONSTRAINT chk_posts_generated_positive CHECK (posts_generated >= 1)
);

COMMENT ON TABLE usage_records IS 'Per-action usage log for credit enforcement and analytics dashboards';
COMMENT ON COLUMN usage_records.action IS 'repurpose = full generation (counts toward monthly limit); regenerate = single post regen';
```

---

### 5.8 Table: `user_preferences`

**Purpose:** Persists per-user UI preferences including default platform selection, theme, and notification settings (FR-4.3).

```sql
CREATE TABLE user_preferences (
  user_id             UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Defaults
  default_platforms   platform_type[] DEFAULT '{}',
  theme               theme_type NOT NULL DEFAULT 'system',
  email_notifications BOOLEAN NOT NULL DEFAULT true,

  -- Timestamps
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE user_preferences IS 'Per-user UI and notification preferences';
COMMENT ON COLUMN user_preferences.default_platforms IS 'Persisted platform selection restored on next visit (FR-4.3)';
```

---

## 6. Relationships

### Relationship Summary

| Relationship | Type | FK Column | References | On Delete | Business Rule |
|---|---|---|---|---|---|
| `profiles` → `auth.users` | 1:1 | `profiles.id` | `auth.users.id` | CASCADE | Profile deleted when auth user deleted |
| `profiles` → `teams` | N:1 | `profiles.team_id` | `teams.id` | SET NULL | User removed from team but profile preserved |
| `teams` → `auth.users` | N:1 | `teams.owner_id` | `auth.users.id` | CASCADE | Team deleted when owner account deleted |
| `team_invitations` → `teams` | N:1 | `team_invitations.team_id` | `teams.id` | CASCADE | Invitations deleted with team |
| `team_invitations` → `auth.users` | N:1 | `team_invitations.invited_by` | `auth.users.id` | CASCADE | Invitation removed when inviter deleted |
| `brand_voice_profiles` → `teams` | N:1 | `brand_voice_profiles.team_id` | `teams.id` | CASCADE | Voice profiles deleted with team |
| `source_contents` → `auth.users` | N:1 | `source_contents.user_id` | `auth.users.id` | CASCADE | All source content deleted with user |
| `source_contents` → `teams` | N:1 | `source_contents.team_id` | `teams.id` | SET NULL | Content preserved if team dissolved |
| `generated_posts` → `source_contents` | N:1 | `generated_posts.source_id` | `source_contents.id` | CASCADE | Posts deleted when source content deleted |
| `generated_posts` → `auth.users` | N:1 | `generated_posts.user_id` | `auth.users.id` | CASCADE | Posts deleted with user |
| `usage_records` → `auth.users` | N:1 | `usage_records.user_id` | `auth.users.id` | CASCADE | Usage history deleted with user |
| `usage_records` → `source_contents` | N:1 | `usage_records.source_id` | `source_contents.id` | SET NULL | Usage record preserved for analytics even if source deleted |
| `user_preferences` → `auth.users` | 1:1 | `user_preferences.user_id` | `auth.users.id` | CASCADE | Preferences deleted with user |

### Cardinality Details

- **One user** has **one profile**, **one user_preferences** row, **many source_contents**, **many generated_posts**, and **many usage_records**.
- **One source_content** has **many generated_posts** (5–7 per selected platform, so 5–42 posts per source).
- **One team** has **many profiles** (up to 4 members), **many brand_voice_profiles** (up to 5), and **many team_invitations**.
- A **generated_post** is uniquely identified within a source by `(source_id, platform, post_number)`.

---

## 7. Indexing Strategy

### Primary Key Indexes (automatic)

All tables use UUID primary keys with `gen_random_uuid()` defaults. PostgreSQL automatically creates unique B-tree indexes on all PKs.

### Foreign Key Indexes

```sql
-- ============================================================
-- FOREIGN KEY & LOOKUP INDEXES
-- ============================================================

-- profiles
CREATE INDEX idx_profiles_team_id ON profiles(team_id) WHERE team_id IS NOT NULL;
CREATE INDEX idx_profiles_stripe_customer_id ON profiles(stripe_customer_id) WHERE stripe_customer_id IS NOT NULL;

-- teams
CREATE INDEX idx_teams_owner_id ON teams(owner_id);

-- team_invitations
CREATE INDEX idx_team_invitations_team_id ON team_invitations(team_id);
CREATE INDEX idx_team_invitations_email ON team_invitations(email);
CREATE INDEX idx_team_invitations_status ON team_invitations(status) WHERE status = 'pending';

-- brand_voice_profiles
CREATE INDEX idx_brand_voice_team_id ON brand_voice_profiles(team_id);

-- source_contents
CREATE INDEX idx_source_contents_user_id ON source_contents(user_id);
CREATE INDEX idx_source_contents_team_id ON source_contents(team_id) WHERE team_id IS NOT NULL;
CREATE INDEX idx_source_contents_created_at ON source_contents(created_at DESC);
CREATE INDEX idx_source_contents_not_deleted ON source_contents(user_id, created_at DESC)
  WHERE is_deleted = false;

-- generated_posts
CREATE INDEX idx_generated_posts_source_id ON generated_posts(source_id);
CREATE INDEX idx_generated_posts_user_id ON generated_posts(user_id);
CREATE INDEX idx_generated_posts_platform ON generated_posts(platform);
CREATE INDEX idx_generated_posts_source_platform ON generated_posts(source_id, platform, post_number);

-- usage_records
CREATE INDEX idx_usage_records_user_month ON usage_records(user_id, created_at DESC);
CREATE INDEX idx_usage_records_user_action_month ON usage_records(user_id, action, created_at)
  WHERE action = 'repurpose';
```

### Full-Text Search Indexes (GIN)

```sql
-- ============================================================
-- FULL-TEXT SEARCH INDEXES (FR-6.2: search within 2 seconds)
-- ============================================================

-- Source content full-text search (title + body)
CREATE INDEX idx_source_contents_fts ON source_contents
  USING GIN (search_vector)
  WHERE is_deleted = false;

-- Generated posts full-text search (content)
CREATE INDEX idx_generated_posts_fts ON generated_posts
  USING GIN (search_vector);
```

### Index Rationale Summary

| Index | Reason |
|---|---|
| `idx_profiles_team_id` | Team member lookups; RLS policy evaluation |
| `idx_profiles_stripe_customer_id` | Stripe webhook handler matching customer to profile |
| `idx_teams_owner_id` | Owner permission checks |
| `idx_team_invitations_email` | Invitation lookup when user accepts via email link |
| `idx_team_invitations_status` | Partial index for pending invitations (most queried status) |
| `idx_source_contents_user_id` | Content library listing filtered by user |
| `idx_source_contents_created_at` | Default sort (newest first) in content library (FR-6.1) |
| `idx_source_contents_not_deleted` | Partial index for non-deleted content (most common query path) |
| `idx_generated_posts_source_id` | Fetching all posts for a source content item |
| `idx_generated_posts_source_platform` | Composite for ordered platform-grouped post retrieval |
| `idx_usage_records_user_action_month` | Partial index for monthly repurpose count (credit enforcement) |
| `idx_source_contents_fts` | GIN index for full-text search across source library (NFR-1.6: < 2s) |
| `idx_generated_posts_fts` | GIN index for full-text search across generated posts |

---

## 8. Row Level Security (RLS) Policies

All tables have RLS enabled. Policies use `auth.uid()` (Supabase's built-in function returning the authenticated user's UUID from the JWT).

### 8.1 `profiles` RLS

```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "profiles_select_own"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can read profiles of their team members (for team features)
CREATE POLICY "profiles_select_team"
  ON profiles FOR SELECT
  USING (
    team_id IS NOT NULL
    AND team_id = (SELECT team_id FROM profiles WHERE id = auth.uid())
  );

-- Users can insert their own profile (triggered on signup)
CREATE POLICY "profiles_insert_own"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
```

### 8.2 `teams` RLS

```sql
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

-- Team members can read their team
CREATE POLICY "teams_select_member"
  ON teams FOR SELECT
  USING (
    id IN (SELECT team_id FROM profiles WHERE id = auth.uid() AND team_id IS NOT NULL)
  );

-- Only authenticated users can create a team (tier checked at app level)
CREATE POLICY "teams_insert_owner"
  ON teams FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

-- Only team owner can update
CREATE POLICY "teams_update_owner"
  ON teams FOR UPDATE
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- Only team owner can delete
CREATE POLICY "teams_delete_owner"
  ON teams FOR DELETE
  USING (auth.uid() = owner_id);
```

### 8.3 `team_invitations` RLS

```sql
ALTER TABLE team_invitations ENABLE ROW LEVEL SECURITY;

-- Team owner/members can view invitations for their team
CREATE POLICY "team_invitations_select_team"
  ON team_invitations FOR SELECT
  USING (
    team_id IN (SELECT team_id FROM profiles WHERE id = auth.uid() AND team_id IS NOT NULL)
  );

-- Invitees can view their own invitations by email
-- (handled at API level since email matching requires service role)

-- Team owner can create invitations
CREATE POLICY "team_invitations_insert_owner"
  ON team_invitations FOR INSERT
  WITH CHECK (
    invited_by = auth.uid()
    AND team_id IN (SELECT id FROM teams WHERE owner_id = auth.uid())
  );

-- Team owner can update invitation status
CREATE POLICY "team_invitations_update_owner"
  ON team_invitations FOR UPDATE
  USING (
    team_id IN (SELECT id FROM teams WHERE owner_id = auth.uid())
  );
```

### 8.4 `brand_voice_profiles` RLS

```sql
ALTER TABLE brand_voice_profiles ENABLE ROW LEVEL SECURITY;

-- Team members can read their team's voice profiles
CREATE POLICY "brand_voice_select_team"
  ON brand_voice_profiles FOR SELECT
  USING (
    team_id IN (SELECT team_id FROM profiles WHERE id = auth.uid() AND team_id IS NOT NULL)
  );

-- Only team owner can create voice profiles
CREATE POLICY "brand_voice_insert_owner"
  ON brand_voice_profiles FOR INSERT
  WITH CHECK (
    team_id IN (SELECT id FROM teams WHERE owner_id = auth.uid())
  );

-- Only team owner can update voice profiles
CREATE POLICY "brand_voice_update_owner"
  ON brand_voice_profiles FOR UPDATE
  USING (
    team_id IN (SELECT id FROM teams WHERE owner_id = auth.uid())
  );

-- Only team owner can delete voice profiles
CREATE POLICY "brand_voice_delete_owner"
  ON brand_voice_profiles FOR DELETE
  USING (
    team_id IN (SELECT id FROM teams WHERE owner_id = auth.uid())
  );
```

### 8.5 `source_contents` RLS

```sql
ALTER TABLE source_contents ENABLE ROW LEVEL SECURITY;

-- Users can view own content + team content (FR-9.2)
CREATE POLICY "source_contents_select_own_or_team"
  ON source_contents FOR SELECT
  USING (
    user_id = auth.uid()
    OR (
      team_id IS NOT NULL
      AND team_id = (SELECT team_id FROM profiles WHERE id = auth.uid())
    )
  );

-- Users can insert their own content
CREATE POLICY "source_contents_insert_own"
  ON source_contents FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Users can update their own content (soft-delete, etc.)
CREATE POLICY "source_contents_update_own"
  ON source_contents FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Users can delete their own content
CREATE POLICY "source_contents_delete_own"
  ON source_contents FOR DELETE
  USING (user_id = auth.uid());
```

### 8.6 `generated_posts` RLS

```sql
ALTER TABLE generated_posts ENABLE ROW LEVEL SECURITY;

-- Users can view own posts + posts from team source content
CREATE POLICY "generated_posts_select_own_or_team"
  ON generated_posts FOR SELECT
  USING (
    user_id = auth.uid()
    OR source_id IN (
      SELECT id FROM source_contents
      WHERE team_id IS NOT NULL
        AND team_id = (SELECT team_id FROM profiles WHERE id = auth.uid())
    )
  );

-- Users can insert their own posts
CREATE POLICY "generated_posts_insert_own"
  ON generated_posts FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Users can update their own posts (inline editing)
CREATE POLICY "generated_posts_update_own"
  ON generated_posts FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Users can delete their own posts
CREATE POLICY "generated_posts_delete_own"
  ON generated_posts FOR DELETE
  USING (user_id = auth.uid());
```

### 8.7 `usage_records` RLS

```sql
ALTER TABLE usage_records ENABLE ROW LEVEL SECURITY;

-- Users can view their own usage
CREATE POLICY "usage_records_select_own"
  ON usage_records FOR SELECT
  USING (user_id = auth.uid());

-- Users can insert their own usage records
CREATE POLICY "usage_records_insert_own"
  ON usage_records FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- No update or delete allowed from client (immutable audit log)
-- Usage records are INSERT-only for data integrity
```

### 8.8 `user_preferences` RLS

```sql
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Users can view their own preferences
CREATE POLICY "user_preferences_select_own"
  ON user_preferences FOR SELECT
  USING (user_id = auth.uid());

-- Users can insert their own preferences
CREATE POLICY "user_preferences_insert_own"
  ON user_preferences FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Users can update their own preferences
CREATE POLICY "user_preferences_update_own"
  ON user_preferences FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
```

---

## 9. Triggers & Functions

### 9.1 Auto-Update `updated_at` Timestamp

A reusable trigger function applied to all tables with an `updated_at` column.

```sql
-- ============================================================
-- TRIGGER FUNCTION: auto-update updated_at on row change
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_teams_updated_at
  BEFORE UPDATE ON teams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_brand_voice_profiles_updated_at
  BEFORE UPDATE ON brand_voice_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_source_contents_updated_at
  BEFORE UPDATE ON source_contents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_generated_posts_updated_at
  BEFORE UPDATE ON generated_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

### 9.2 Auto-Populate Full-Text Search Vectors

```sql
-- ============================================================
-- TRIGGER FUNCTION: populate source_contents.search_vector
-- ============================================================

CREATE OR REPLACE FUNCTION update_source_content_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', coalesce(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', NEW.body), 'B');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_source_contents_search_vector
  BEFORE INSERT OR UPDATE OF title, body ON source_contents
  FOR EACH ROW EXECUTE FUNCTION update_source_content_search_vector();

-- ============================================================
-- TRIGGER FUNCTION: populate generated_posts.search_vector
-- ============================================================

CREATE OR REPLACE FUNCTION update_generated_post_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := to_tsvector('english', NEW.content);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_generated_posts_search_vector
  BEFORE INSERT OR UPDATE OF content ON generated_posts
  FOR EACH ROW EXECUTE FUNCTION update_generated_post_search_vector();
```

### 9.3 Auto-Create Profile and Preferences on Signup

```sql
-- ============================================================
-- TRIGGER FUNCTION: create profile + preferences on auth.users insert
-- ============================================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create profile
  INSERT INTO profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );

  -- Create default preferences
  INSERT INTO user_preferences (user_id)
  VALUES (NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach to Supabase auth.users table
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

### 9.4 Enforce Brand Voice Profile Limit (max 5 per team)

```sql
-- ============================================================
-- TRIGGER FUNCTION: enforce max 5 brand voice profiles per team
-- ============================================================

CREATE OR REPLACE FUNCTION enforce_brand_voice_limit()
RETURNS TRIGGER AS $$
DECLARE
  voice_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO voice_count
  FROM brand_voice_profiles
  WHERE team_id = NEW.team_id;

  IF voice_count >= 5 THEN
    RAISE EXCEPTION 'Maximum of 5 brand voice profiles per team reached';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_brand_voice_limit
  BEFORE INSERT ON brand_voice_profiles
  FOR EACH ROW EXECUTE FUNCTION enforce_brand_voice_limit();
```

### 9.5 Enforce Team Member Limit

```sql
-- ============================================================
-- TRIGGER FUNCTION: enforce max team members
-- ============================================================

CREATE OR REPLACE FUNCTION enforce_team_member_limit()
RETURNS TRIGGER AS $$
DECLARE
  member_count INTEGER;
  max_allowed INTEGER;
BEGIN
  -- Only check when team_id is being set (joining a team)
  IF NEW.team_id IS NULL THEN
    RETURN NEW;
  END IF;

  SELECT max_members INTO max_allowed FROM teams WHERE id = NEW.team_id;
  SELECT COUNT(*) INTO member_count FROM profiles WHERE team_id = NEW.team_id;

  -- +1 for the owner who is also in the team
  IF member_count >= (max_allowed + 1) THEN
    RAISE EXCEPTION 'Team has reached its maximum member limit';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_team_member_limit
  BEFORE UPDATE OF team_id ON profiles
  FOR EACH ROW EXECUTE FUNCTION enforce_team_member_limit();
```

---

## 10. Views

### 10.1 Monthly Usage Statistics

```sql
-- ============================================================
-- VIEW: Current month usage per user (for dashboard FR-8.1)
-- ============================================================

CREATE OR REPLACE VIEW v_user_monthly_usage AS
SELECT
  p.id AS user_id,
  p.tier,
  COUNT(ur.id) FILTER (WHERE ur.action = 'repurpose') AS repurposes_this_month,
  COUNT(ur.id) FILTER (WHERE ur.action = 'regenerate') AS regenerations_this_month,
  COALESCE(SUM(ur.posts_generated), 0) AS posts_generated_this_month,
  CASE
    WHEN p.tier = 'free' THEN 5
    ELSE NULL  -- unlimited
  END AS monthly_repurpose_limit,
  CASE
    WHEN p.tier = 'free' THEN GREATEST(0, 5 - COUNT(ur.id) FILTER (WHERE ur.action = 'repurpose'))
    ELSE NULL  -- unlimited
  END AS repurposes_remaining
FROM profiles p
LEFT JOIN usage_records ur
  ON ur.user_id = p.id
  AND ur.created_at >= date_trunc('month', now())
  AND ur.created_at < date_trunc('month', now()) + INTERVAL '1 month'
GROUP BY p.id, p.tier;

COMMENT ON VIEW v_user_monthly_usage IS 'Per-user monthly usage stats for dashboard and limit enforcement';
```

### 10.2 Content with Post Counts

```sql
-- ============================================================
-- VIEW: Source content with aggregated post stats (for library FR-6.1)
-- ============================================================

CREATE OR REPLACE VIEW v_content_library AS
SELECT
  sc.id,
  sc.user_id,
  sc.team_id,
  sc.title,
  LEFT(sc.body, 150) AS excerpt,
  sc.source_url,
  sc.input_method,
  sc.platforms,
  sc.created_at,
  sc.updated_at,
  COUNT(gp.id) AS post_count,
  COUNT(DISTINCT gp.platform) AS platform_count,
  COUNT(gp.id) FILTER (WHERE gp.is_edited) AS edited_post_count
FROM source_contents sc
LEFT JOIN generated_posts gp ON gp.source_id = sc.id
WHERE sc.is_deleted = false
GROUP BY sc.id;

COMMENT ON VIEW v_content_library IS 'Content library view with post counts, used by /api/library endpoint';
```

### 10.3 All-Time User Statistics

```sql
-- ============================================================
-- VIEW: All-time user stats (for dashboard FR-8.3)
-- ============================================================

CREATE OR REPLACE VIEW v_user_all_time_stats AS
SELECT
  p.id AS user_id,
  p.tier,
  p.created_at AS member_since,
  COUNT(DISTINCT sc.id) FILTER (WHERE sc.is_deleted = false) AS total_source_contents,
  COUNT(DISTINCT ur.id) FILTER (WHERE ur.action = 'repurpose') AS total_repurposes,
  COALESCE(SUM(ur.posts_generated), 0) AS total_posts_generated
FROM profiles p
LEFT JOIN source_contents sc ON sc.user_id = p.id
LEFT JOIN usage_records ur ON ur.user_id = p.id
GROUP BY p.id, p.tier, p.created_at;

COMMENT ON VIEW v_user_all_time_stats IS 'All-time user statistics for dashboard and analytics';
```

### 10.4 Weekly Usage History (Last 13 Weeks)

```sql
-- ============================================================
-- VIEW: Weekly usage breakdown for chart (FR-8.2: last ~3 months)
-- ============================================================

CREATE OR REPLACE VIEW v_weekly_usage_history AS
SELECT
  ur.user_id,
  date_trunc('week', ur.created_at)::DATE AS week_start,
  COUNT(*) FILTER (WHERE ur.action = 'repurpose') AS repurposes,
  COALESCE(SUM(ur.posts_generated), 0) AS posts_generated
FROM usage_records ur
WHERE ur.created_at >= now() - INTERVAL '13 weeks'
GROUP BY ur.user_id, date_trunc('week', ur.created_at)
ORDER BY week_start DESC;

COMMENT ON VIEW v_weekly_usage_history IS 'Weekly usage chart data for the last ~3 months (FR-8.2)';
```

---

## 11. Storage Buckets

Supabase Storage buckets for file/blob assets. Configured via Supabase Dashboard or migration SQL.

```sql
-- ============================================================
-- STORAGE BUCKET: User avatars
-- ============================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,                                          -- publicly readable (avatar URLs)
  2097152,                                       -- 2 MB max file size
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- RLS policies for avatars bucket
CREATE POLICY "avatars_select_public"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "avatars_insert_own"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars'
    AND auth.uid()::TEXT = (storage.foldername(name))[1]
  );

CREATE POLICY "avatars_update_own"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars'
    AND auth.uid()::TEXT = (storage.foldername(name))[1]
  );

CREATE POLICY "avatars_delete_own"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars'
    AND auth.uid()::TEXT = (storage.foldername(name))[1]
  );
```

**Storage naming convention:** Avatars stored as `avatars/{user_id}/{filename}` to align RLS with folder-based ownership.

---

## 12. Migration Notes

### Migration Order (respects foreign key dependencies)

1. **Create enum types** — all `CREATE TYPE` statements
2. **Create `teams` table** — no FK dependencies on other app tables
3. **Create `profiles` table** — references `auth.users` and `teams`
4. **Create `team_invitations` table** — references `teams` and `auth.users`
5. **Create `brand_voice_profiles` table** — references `teams`
6. **Create `source_contents` table** — references `auth.users` and `teams`
7. **Create `generated_posts` table** — references `source_contents` and `auth.users`
8. **Create `usage_records` table** — references `auth.users` and `source_contents`
9. **Create `user_preferences` table** — references `auth.users`
10. **Create indexes** — all `CREATE INDEX` statements
11. **Enable RLS + create policies** — all `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` and `CREATE POLICY` statements
12. **Create trigger functions** — all `CREATE FUNCTION` statements
13. **Create triggers** — all `CREATE TRIGGER` statements
14. **Create views** — all `CREATE VIEW` statements
15. **Create storage buckets** — storage bucket configuration

### Tooling

- **Supabase CLI** (`supabase migration new`, `supabase db push`) for local development
- Migrations stored in `supabase/migrations/` as timestamped `.sql` files
- `supabase db reset` to rebuild from scratch in local dev
- Production migrations applied via `supabase db push` or Supabase Dashboard

### Seed Data

Development seed data should include:
- 2–3 test users (free, pro, team tiers)
- 1 team with owner + 1 member
- 5–10 source content records per user
- 30–50 generated posts across platforms
- Usage records spanning 3 months
- 1–2 brand voice profiles

---

## 13. Supabase-Specific Notes

### UUID Generation
- All primary keys use `gen_random_uuid()` (PostgreSQL built-in, no extensions needed)
- `profiles.id` mirrors `auth.users.id` (not auto-generated)

### Timestamps
- All timestamps use `TIMESTAMPTZ` (timezone-aware) with `now()` defaults
- `updated_at` auto-maintained via `update_updated_at()` trigger

### Auth Integration
- `auth.uid()` is used in all RLS policies (returns JWT-authenticated user UUID)
- The `handle_new_user()` trigger runs as `SECURITY DEFINER` to bypass RLS when creating profile rows
- Foreign keys reference `auth.users(id)` directly (Supabase convention)

### Row-Level Security
- RLS is enabled on ALL application tables
- Client-side queries use the `anon` key and are subject to RLS
- Server-side operations use the `service_role` key to bypass RLS when needed (e.g., Stripe webhook handlers, usage reset)
- Team content access is granted through `profiles.team_id` matching in subqueries

### Connection Pooling
- Supabase uses PgBouncer in **transaction mode** by default
- Vercel serverless functions must use the **pooled connection string** (`db.*.supabase.co:6543`)
- Named prepared statements should be avoided in transaction pooling mode

### Enum Usage
- PostgreSQL native `ENUM` types used for fixed-set values (platforms, tiers, statuses)
- Enum values can be extended with `ALTER TYPE ... ADD VALUE` (non-destructive migration)
- Application code (Zod schemas) should mirror enum values for type safety

### Soft Delete Pattern
- `source_contents` uses `is_deleted` + `deleted_at` columns
- Soft-deleted records excluded from views and library queries via `WHERE is_deleted = false`
- 30-day cleanup handled by a scheduled Supabase Edge Function that permanently deletes records where `deleted_at < now() - INTERVAL '30 days'`

### Full-Text Search
- Weighted `tsvector` columns: title gets weight 'A', body gets weight 'B' (title matches rank higher)
- `search_vector` columns populated by triggers on INSERT/UPDATE
- Queries use `plainto_tsquery('english', ?)` or `websearch_to_tsquery('english', ?)` for user input
- GIN indexes ensure sub-second search at projected scale (< 100K records)

---

## 14. Reconciliation Notes

### Alignment with PRD.md (v1.0)

| PRD Reference | Schema Coverage | Notes |
|---|---|---|
| Section 10 — Data Model entities | All tables implemented | Schema matches PRD entity definitions |
| FR-1.6 — RLS on all tables | RLS enabled + policies defined | Covers user isolation and team sharing |
| FR-2.1 — 50,000 char limit | `chk_char_count_range` constraint | Enforced at DB level |
| FR-3.2 — Platform constraints | `platform_type` enum | 6 platforms as specified |
| FR-3.4 — Persist generated posts | `generated_posts` table | Linked to source_contents via FK |
| FR-5.4 — Edit/revert posts | `content` + `original_content` columns | `is_edited` flag tracks edit state |
| FR-6.2 — Full-text search | `search_vector` + GIN indexes | tsvector with weighted fields |
| FR-6.4 — Soft delete (30 days) | `is_deleted` + `deleted_at` + constraint | Cleanup via Edge Function |
| FR-8.1–8.4 — Usage dashboard | `usage_records` + views | `v_user_monthly_usage`, `v_weekly_usage_history` |
| FR-9.1–9.4 — Team features | `teams`, `team_invitations`, `brand_voice_profiles` | Limits enforced via triggers |
| Section 13 — Tier definitions | `subscription_tier` enum | free/pro/team with Stripe fields |
| NFR-4.2 — 100K source, 1M posts | Indexing strategy supports this scale | GIN + B-tree indexes, partial indexes |

### Alignment with TechStack.md (v1.0)

| TechStack Reference | Schema Coverage | Notes |
|---|---|---|
| PostgreSQL 15+ (Supabase managed) | All SQL is PostgreSQL 15+ compatible | Uses `gen_random_uuid()`, `TIMESTAMPTZ`, native enums |
| `@supabase/supabase-js` v2.45+ | RLS policies use `auth.uid()` | Compatible with PostgREST client |
| Full-text search via tsvector | `search_vector` columns + GIN indexes | Matches TechStack FTS specification |
| JSONB columns | `generated_posts.metadata` | Platform-specific data |
| Array columns | `platforms`, `tone_keywords`, `default_platforms` | Multi-value fields |
| Soft delete pattern | `is_deleted` + `deleted_at` | 30-day recovery window |
| PgBouncer transaction mode | No named prepared statements used | Compatible with Vercel serverless |

### Known Considerations

1. **Circular reference avoidance:** `profiles.team_id → teams.id` and `teams.owner_id → auth.users.id` do not create a circular dependency (profiles references teams, teams references auth.users — no cycle).
2. **Team dissolution:** When a team is deleted (`CASCADE` on `teams`), `profiles.team_id` is set to `NULL` via `ON DELETE SET NULL`, preserving user accounts. Team invitations and brand voice profiles cascade-delete.
3. **Usage records immutability:** No UPDATE or DELETE RLS policies on `usage_records` — these are append-only for audit integrity. Only service-role operations can modify them if needed.
4. **Platform enum extensibility:** Adding a new platform (e.g., `threads`, `mastodon`) requires `ALTER TYPE platform_type ADD VALUE 'newplatform'` — a non-breaking migration.

---

## 15. Versioning

**Version:** 1.0
**Date:** 2026-02-24

### Change Log

| Version | Date | Changes |
|---|---|---|
| 1.0 | 2026-02-24 | Initial schema design — all core tables, RLS, indexes, triggers, views, storage |
