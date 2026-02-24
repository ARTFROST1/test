---
name: deploying-to-vercel
description: Deploys TaskPilot Next.js application to Vercel using MCP tools. Use when user mentions deploy, Vercel, production, staging, or publishing the app.
---

# Vercel Deployment Skill

## When to Use
- User asks to deploy the project
- User wants to check deployment status
- User needs deployment URL or logs
- User mentions "production", "staging", "deploy", "Vercel"

## Available MCP Tools

| Tool | Purpose |
|------|---------|
| `mcp_vercel_deploy_to_vercel` | Deploy the project |
| `mcp_vercel_list_projects` | List all Vercel projects |
| `mcp_vercel_get_project` | Get project info |
| `mcp_vercel_list_deployments` | List deployments |
| `mcp_vercel_get_deployment` | Get deployment status |
| `mcp_vercel_get_deployment_build_logs` | Get build logs |

## Environment Variables

TaskPilot requires these env vars configured in Vercel:

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY

# AI
OPENAI_API_KEY
ANTHROPIC_API_KEY

# Stripe
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
```

## Deployment Workflow

### Checklist
- [ ] Verify project exists in Vercel
- [ ] Deploy project
- [ ] Monitor deployment status
- [ ] Retrieve deployment URL
- [ ] Check build logs if failed

### Step 1: Check Project
```
mcp_vercel_list_projects → find "TaskPilot"
mcp_vercel_get_project(projectId) → verify config
```

### Step 2: Deploy
```
mcp_vercel_deploy_to_vercel(
  projectName: "taskpilot",
  target: "production" | "preview"
)
```

### Step 3: Monitor Status
```
mcp_vercel_list_deployments(projectId, limit: 1) → get latest deployment ID
mcp_vercel_get_deployment(deploymentId) → check status
```

**Status values:**
- `QUEUED` — waiting
- `BUILDING` — in progress
- `READY` — success
- `ERROR` — failed

### Step 4: Handle Errors
If status is `ERROR`:
```
mcp_vercel_get_deployment_build_logs(deploymentId) → analyze errors
```

Common issues:
- Missing env vars → check Vercel dashboard
- Build failure → check logs for specific error
- Type errors → run `npm run build` locally first

## Response Format

After successful deployment:
```
✅ Deployed to Vercel
URL: https://taskpilot-xxx.vercel.app
Status: READY
Environment: production
```

After failed deployment:
```
❌ Deployment failed
Status: ERROR
Logs: [summary of error]
Action: [suggested fix]
```
