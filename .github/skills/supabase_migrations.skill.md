---
name: supabase-migrations
description: Manages Supabase database migrations via MCP tools. Use when user mentions migrations, database schema changes, creating tables, RLS policies, or generating TypeScript types from Supabase.
---

# Supabase Migrations Skill

## When to use this skill
- User asks to create a new database table or modify schema
- User wants to apply or check migration status
- User needs TypeScript types generated from database
- User mentions RLS policies or database security
- User asks about migration history

## MCP Tools Reference

| Tool | Purpose |
|------|---------|
| `mcp_supabase_list_migrations` | Check current migration status |
| `mcp_supabase_list_tables` | View existing tables and schema |
| `mcp_supabase_apply_migration` | Apply a new migration |
| `mcp_supabase_execute_sql` | Run arbitrary SQL queries |
| `mcp_supabase_generate_typescript_types` | Generate TS types from schema |

## Workflow

### Creating a New Migration

- [ ] Check existing tables with `mcp_supabase_list_tables`
- [ ] Check migration history with `mcp_supabase_list_migrations`
- [ ] Generate migration filename: `YYYYMMDDHHMMSS_description.sql`
- [ ] Write migration SQL following the pattern below
- [ ] Apply migration with `mcp_supabase_apply_migration`
- [ ] Verify with `mcp_supabase_list_tables`
- [ ] Generate TypeScript types with `mcp_supabase_generate_typescript_types`

### Migration File Pattern

**Location:** `supabase/migrations/YYYYMMDDHHMMSS_migration_name.sql`

```sql
-- supabase/migrations/YYYYMMDDHHMMSS_migration_name.sql

-- ============================================
-- 1. CREATE TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.table_name (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ============================================
-- 2. INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_table_name_user_id 
  ON public.table_name(user_id);

-- ============================================
-- 3. ROW LEVEL SECURITY
-- ============================================
ALTER TABLE public.table_name ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 4. RLS POLICIES
-- ============================================
-- SELECT: Users can view own data
CREATE POLICY "Users can view own data" 
  ON public.table_name FOR SELECT 
  USING (auth.uid() = user_id);

-- INSERT: Users can insert own data
CREATE POLICY "Users can insert own data" 
  ON public.table_name FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: Users can update own data
CREATE POLICY "Users can update own data" 
  ON public.table_name FOR UPDATE 
  USING (auth.uid() = user_id);

-- DELETE: Users can delete own data
CREATE POLICY "Users can delete own data" 
  ON public.table_name FOR DELETE 
  USING (auth.uid() = user_id);

-- ============================================
-- 5. TRIGGERS (updated_at)
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.table_name
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

## Instructions

### Naming Conventions
- Migration files: `YYYYMMDDHHMMSS_snake_case_description.sql`
- Tables: `snake_case`, plural (e.g., `tasks`, `projects`)
- Columns: `snake_case`
- Indexes: `idx_table_column`
- Policies: Descriptive English in quotes

### Common Migration Types

**Add column:**
```sql
ALTER TABLE public.table_name 
ADD COLUMN column_name TYPE DEFAULT value;
```

**Add foreign key:**
```sql
ALTER TABLE public.child_table
ADD COLUMN parent_id UUID REFERENCES public.parent_table(id) ON DELETE CASCADE;
```

**Create junction table (many-to-many):**
```sql
CREATE TABLE public.table1_table2 (
  table1_id UUID REFERENCES public.table1(id) ON DELETE CASCADE,
  table2_id UUID REFERENCES public.table2(id) ON DELETE CASCADE,
  PRIMARY KEY (table1_id, table2_id)
);
```

### TypeScript Types Generation

After applying migrations, always regenerate types:
1. Call `mcp_supabase_generate_typescript_types`
2. Types are saved to `src/types/database.types.ts`
3. Import in code: `import { Database } from '@/types/database.types'`

### Validation Checklist

Before applying migration:
- [ ] Table names don't conflict with existing
- [ ] Foreign keys reference existing tables
- [ ] RLS is enabled for all new tables
- [ ] Policies cover SELECT, INSERT, UPDATE, DELETE as needed
- [ ] Indexes added for frequently queried columns

### Error Recovery

If migration fails:
1. Check error message from `mcp_supabase_apply_migration`
2. Use `mcp_supabase_execute_sql` to inspect state
3. Create a rollback migration if needed:
```sql
-- Rollback example
DROP TABLE IF EXISTS public.table_name CASCADE;
DROP POLICY IF EXISTS "Policy name" ON public.table_name;
```
