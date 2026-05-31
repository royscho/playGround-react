# Animation Playground — Design

## Goal

Add an `AnimationPlaygroundSection` to the CSS Examples page — an interactive playground that teaches how to customize Tailwind built-in animations via inline styles. User picks an animation, adjusts duration/delay/iteration-count with controls, and sees the live result alongside a generated code snippet.

## Approach

New self-contained `AnimationPlaygroundSection` component added to `CssExamplesPage` after `AnimationsSection`. Follows the established section pattern. All state is local `useState`. No external dependencies.

## Tech Stack

- React `useState` for all control state
- Inline `style` prop to apply animation overrides (teaches the correct pattern)
- Tailwind 4 utility classes for built-in animations
- Vitest + Testing Library for tests
- Storybook (`@storybook/react-vite`) for story

## File Structure

```
src/features/css-examples/components/
  AnimationPlaygroundSection.tsx          ← new
  __tests__/
    AnimationPlaygroundSection.test.tsx   ← new
  __stories__/
    AnimationPlaygroundSection.stories.tsx ← new
```

**Modified:**
- `src/features/css-examples/components/CssExamplesPage.tsx` — add `<AnimationPlaygroundSection />`
- `src/features/css-examples/components/__tests__/CssExamplesPage.test.tsx` — update "five" → "six" section headings test

## Component Design

### State

```ts
type AnimationName = 'spin' | 'bounce' | 'pulse' | 'ping'

const [selectedAnimation, setSelectedAnimation] = useState<AnimationName>('bounce')
const [duration, setDuration] = useState(1)        // seconds, 0.1–5
const [delay, setDelay] = useState(0)              // seconds, 0–2
const [iterationCount, setIterationCount] = useState<number | 'infinite'>('infinite')
const [replayKey, setReplayKey] = useState(0)
```

### Layout

Two-column on desktop (`grid grid-cols-1 lg:grid-cols-2`), stacked on mobile.

- **Left column:** controls panel (animation picker + sliders + iteration select + Restart button)
- **Right column:** preview area + generated code snippet below it

### Controls

| Control | Type | Range / Options | Default |
|---------|------|-----------------|---------|
| Animation | `<select>` | Spin, Bounce, Pulse, Ping | Bounce |
| Duration | `<input type="range">` | 0.1s – 5s, step 0.1 | 1s |
| Delay | `<input type="range">` | 0s – 2s, step 0.1 | 0s |
| Iteration Count | `<select>` | 1, 2, 3, 5, infinite | infinite |
| Restart | `<button>` | increments `replayKey` | — |

Each slider shows its current value next to the label (e.g. "Duration: 1.0s").

### Preview

Demo elements match `AnimationsSection` cards:
- Spin: `<div className="animate-spin text-3xl text-indigo-500">⟳</div>`
- Bounce: `<div className="h-6 w-6 rounded-full bg-pink-500" />`
- Pulse: `<div className="h-5 w-20 rounded bg-gray-300 dark:bg-gray-600" />`
- Ping: small circle with ping ring (relative wrapper)

The animated element receives `key={replayKey}` (forces remount on Restart) and inline style:

```tsx
style={{
  animationDuration: `${duration}s`,
  animationDelay: `${delay}s`,
  animationIterationCount: iterationCount,
}}
```

The Tailwind animation class (`animate-spin` etc.) is applied alongside the inline style. Inline style wins over Tailwind's default animation values because CSS inline styles have higher specificity.

### Generated Code Snippet

Below the preview, a `<pre><code>` block shows the exact JSX for the current settings:

```
<div
  className="animate-bounce"
  style={{
    animationDuration: '1.0s',
    animationDelay: '0.0s',
    animationIterationCount: 'infinite',
  }}
/>
```

Updates live as controls change. Uses `data-testid="code-snippet"` for testing.

## UI Layout

```
[Animation Playground]
Learn how to customize Tailwind animations with inline styles.

┌─────────────────────┬──────────────────────────┐
│ Animation  [Bounce▼]│                          │
│                     │      [ • ] (preview)     │
│ Duration   1.0s     │                          │
│ [────●────────]     │  <div                    │
│                     │    className="animate-   │
│ Delay      0.0s     │      bounce"             │
│ [●──────────]       │    style={{              │
│                     │      animationDuration:  │
│ Iterations [inf▼]   │        '1.0s',           │
│                     │      ...                 │
│ [Restart]           │    }}                    │
│                     │  />                      │
└─────────────────────┴──────────────────────────┘
```

## Testing

File: `src/features/css-examples/components/__tests__/AnimationPlaygroundSection.test.tsx`

Tests:
- Renders section heading "Animation Playground"
- Renders animation select with all 4 options (Spin, Bounce, Pulse, Ping)
- Renders duration slider
- Renders delay slider
- Renders iteration count select
- Renders Restart button
- Code snippet updates when duration slider changes
- Code snippet updates when animation selection changes
- Restart button increments replayKey (demo element data-key changes)

## Storybook

Single `Default` story, no args. Import from `@storybook/react-vite`.

## Out of Scope

- `animation-timing-function` control (adds complexity, lower learning value)
- `animation-direction` control
- `animation-fill-mode` control
- Saving/sharing configurations
- Multiple simultaneous animations
