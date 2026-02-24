---
name: installing-shadcn-ui
description: Installs and configures shadcn/ui components in Next.js projects. Use when user mentions shadcn, UI components, button, card, dialog, input components, or needs to add pre-built React components with Tailwind CSS styling.
---

# shadcn/ui Component Management

## When to use this skill
- User wants to add shadcn/ui to a Next.js project
- User needs to install specific UI components (Button, Card, Input, Dialog, etc.)
- User wants to customize component themes or colors
- User mentions "shadcn", "radix ui", or component library setup

## Prerequisites
- Next.js project initialized
- Tailwind CSS configured
- TypeScript enabled (recommended)

## Workflow

### Initial Setup Checklist
```markdown
- [ ] Verify Next.js project exists
- [ ] Run shadcn/ui initialization
- [ ] Confirm components.json created
- [ ] Verify globals.css updated with CSS variables
- [ ] Test by adding first component
```

## Instructions

### 1. Initialize shadcn/ui

Run initialization with default configuration:

```bash
npx shadcn@latest init
```

For non-interactive setup with recommended defaults:

```bash
npx shadcn@latest init -d
```

Expected `components.json` after init:

```json
{
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

### 2. Install Components

Single component:
```bash
npx shadcn@latest add button
```

Multiple components at once:
```bash
npx shadcn@latest add button card input dialog
```

**Common components for TaskPilot:**
| Component | Command | Use Case |
|-----------|---------|----------|
| Button | `npx shadcn@latest add button` | Actions, form submit |
| Card | `npx shadcn@latest add card` | Task cards, content blocks |
| Input | `npx shadcn@latest add input` | Form fields |
| Dialog | `npx shadcn@latest add dialog` | Modals, confirmations |
| Select | `npx shadcn@latest add select` | Dropdowns |
| Checkbox | `npx shadcn@latest add checkbox` | Task completion |
| Badge | `npx shadcn@latest add badge` | Status labels |
| Avatar | `npx shadcn@latest add avatar` | User profiles |
| Dropdown Menu | `npx shadcn@latest add dropdown-menu` | Context menus |
| Toast | `npx shadcn@latest add toast` | Notifications |

List all available components:
```bash
npx shadcn@latest add --help
```

### 3. Component Usage

Components are installed to `src/components/ui/`. Import and use:

```tsx
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export function TaskCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Title</CardTitle>
      </CardHeader>
      <CardContent>
        <Button variant="default">Complete</Button>
        <Button variant="outline">Edit</Button>
        <Button variant="destructive">Delete</Button>
      </CardContent>
    </Card>
  )
}
```

### 4. Theming & Customization

#### Change Base Color
Edit `components.json` and re-init, or modify CSS variables directly in `src/app/globals.css`:

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    /* ... other variables */
  }
  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    /* ... dark mode variables */
  }
}
```

#### Create Custom Variants

Extend component variants in the component file:

```tsx
// src/components/ui/button.tsx
const buttonVariants = cva(
  "...", // base styles
  {
    variants: {
      variant: {
        default: "...",
        destructive: "...",
        outline: "...",
        secondary: "...",
        ghost: "...",
        link: "...",
        // Add custom variant:
        success: "bg-green-500 text-white hover:bg-green-600",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
  }
)
```

### 5. Troubleshooting

| Issue | Solution |
|-------|----------|
| Components not found | Verify `@/` alias in `tsconfig.json` paths |
| Styles not applying | Check Tailwind content paths include `./src/components/**/*.{ts,tsx}` |
| Dark mode not working | Add `darkMode: "class"` to `tailwind.config.ts` |

## Validation

After setup, verify installation:

```bash
# Check components.json exists
cat components.json

# Verify utils created
ls -la src/lib/utils.ts

# Check component files
ls -la src/components/ui/
```

## Resources

- [shadcn/ui Docs](https://ui.shadcn.com)
- [Component List](https://ui.shadcn.com/docs/components)
- [Theming Guide](https://ui.shadcn.com/docs/theming)
