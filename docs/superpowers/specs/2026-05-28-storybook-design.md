# Storybook Design

## Goal

Add Storybook 8 to the project for learning and interview prep. Visual catalogue of shared and feature components with variants and states.

## Approach

CLI auto-install (`npx storybook@latest init`) with `@storybook/react-vite` builder. Stories co-located with components in `__stories__/` folders, matching the existing `__tests__/` pattern.

## Setup

1. Merge `feat/mobile-first` → `main`
2. Create branch `feat/storybook`
3. Run `npx storybook@latest init` (auto-detects Vite + React + TypeScript)
4. Import `src/index.css` in `.storybook/preview.ts` so Tailwind 4 styles apply
5. Delete generated boilerplate example stories

## File Structure

```
.storybook/
  main.ts          # builder + addons config
  preview.ts       # global decorators, CSS import

src/
  shared/components/__stories__/
    Button.stories.tsx
    Input.stories.tsx
    Badge.stories.tsx
    Modal.stories.tsx
    Table.stories.tsx
    Skeleton.stories.tsx
  features/analytics/components/__stories__/
    KpiCard.stories.tsx
  app/layout/__stories__/
    BottomNav.stories.tsx
  features/notifications/components/__stories__/
    NotificationBadge.stories.tsx
```

## Stories

### Button
- `Primary` — variant="primary", default size
- `Secondary` — variant="secondary"
- `Ghost` — variant="ghost"
- `Small` — size="sm"
- `Large` — size="lg"
- `Loading` — isLoading=true
- `Disabled` — disabled=true

### Input
- `Default` — empty, no label
- `WithValue` — pre-filled value
- `Error` — error prop set
- `Disabled` — disabled=true

### Badge
- One story per color variant available in the component

### Modal
- `Open` — isOpen=true with sample title + body
- `Closed` — isOpen=false

### Table
- `WithData` — sample rows
- `Empty` — no rows

### Skeleton
- `Text` — inline text skeleton
- `Card` — card-shaped skeleton
- `List` — stacked list of skeletons

### KpiCard
- `Revenue` — `{ label: 'Total Revenue', value: 284500, change: 12.5, unit: '$' }`
- `Users` — `{ label: 'Active Users', value: 12340, change: -3.2, unit: '' }`
- `Conversion` — `{ label: 'Conversion Rate', value: 3.8, change: 0.6, unit: '%' }`
- `Session` — `{ label: 'Avg Session', value: 4.2, change: 8.1, unit: 'min' }`

### BottomNav
- Requires `MemoryRouter` decorator (uses NavLink)
- `Default` — onMoreClick no-op
- `MoreClicked` — shows onMoreClick interaction

### NotificationBadge
- `NoCount` — count=0
- `WithCount` — count=6

## Storybook Config

`.storybook/main.ts`:
```ts
import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../src/**/__stories__/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-essentials'],
  framework: { name: '@storybook/react-vite', options: {} },
}

export default config
```

`.storybook/preview.ts`:
```ts
import type { Preview } from '@storybook/react'
import '../src/index.css'

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#f3f4f6' },
        { name: 'dark', value: '#0f172a' },
      ],
    },
  },
}

export default preview
```

## Router Decorator

`BottomNav` uses `NavLink` which requires a Router context. Add a `MemoryRouter` decorator to its story file only (not globally).

## npm Scripts

Add to `package.json`:
```json
"storybook": "storybook dev -p 6006",
"build-storybook": "storybook build"
```

## Out of Scope

- MDX documentation
- Chromatic visual regression
- Stories for all 48 components
- `ErrorBoundary` (not story-friendly)
- Accessibility addon (can add later)
