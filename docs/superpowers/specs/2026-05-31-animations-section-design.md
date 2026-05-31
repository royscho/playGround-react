# Animations Section — Design

## Goal

Add an `AnimationsSection` to the CSS Examples page showcasing CSS animations — both Tailwind 4 built-ins and custom `@keyframes`. Teaches the two approaches side-by-side for interview prep.

## Approach

Single self-contained `AnimationsSection` component dropped into `CssExamplesPage`, matching the existing section pattern (`TransitionsSection`, `VisualEffectsSection`). Two sub-sections: Tailwind built-ins and custom `@keyframes`. Replay buttons re-trigger animations via key remounting. No external state or API.

## Tech Stack

- Tailwind 4 utility classes for built-in animations
- `<style>` tag with `@keyframes` + custom utility classes for custom animations (same pattern as `TransitionsSection`)
- React `useState` + `useCallback` for replay key trick
- No shared component dependencies beyond the section itself

## File Structure

```
src/features/css-examples/components/
  AnimationsSection.tsx                        ← new
  __tests__/
    AnimationsSection.test.tsx                 ← new
  __stories__/
    AnimationsSection.stories.tsx              ← new
```

**Modified:**
- `src/features/css-examples/components/CssExamplesPage.tsx` — add `<AnimationsSection />`

## Sub-Section 1: Tailwind Built-ins

4 cards in a responsive grid (`grid-cols-2 lg:grid-cols-4`):

| Card | Class | Demo element |
|------|-------|--------------|
| Spin | `animate-spin` | Circular arrow icon (⟳) 48px |
| Bounce | `animate-bounce` | Filled circle 24px |
| Pulse | `animate-pulse` | Rounded rectangle 80×24px (skeleton style) |
| Ping | `animate-ping` | Small circle with ping ring (notification dot) |

Each card: animation name as label, Tailwind class in `<code>` tag, demo element, Replay button.

## Sub-Section 2: Custom @keyframes

4 cards in same grid, custom animations defined in a `<style>` block at component top:

| Card | Class | Keyframe | Demo element |
|------|-------|----------|--------------|
| Fade In | `anim-fade-in` | `opacity: 0 → 1` | Text "Hello" |
| Slide Up | `anim-slide-up` | `translateY(20px) → 0, opacity 0 → 1` | Text "World" |
| Shake | `anim-shake` | `translateX(-8px → 8px → -4px → 4px → 0)` | Text "Error!" in red |
| Zoom In | `anim-zoom-in` | `scale(0.8) opacity(0) → scale(1) opacity(1)` | Emoji 🎉 |

Custom class definitions (in `<style>` tag):
```css
@keyframes anim-fade-in { from { opacity: 0; } to { opacity: 1; } }
@keyframes anim-slide-up { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
@keyframes anim-shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-8px); }
  40% { transform: translateX(8px); }
  60% { transform: translateX(-4px); }
  80% { transform: translateX(4px); }
}
@keyframes anim-zoom-in { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }

.anim-fade-in  { animation: anim-fade-in  0.6s ease forwards; }
.anim-slide-up { animation: anim-slide-up 0.6s ease forwards; }
.anim-shake    { animation: anim-shake    0.5s ease; }
.anim-zoom-in  { animation: anim-zoom-in  0.5s ease forwards; }
```

## Replay Mechanism

Each card has a `replayKey` integer in state. The animation element uses `key={replayKey}`. Clicking Replay increments the key, which unmounts+remounts the element — restarting the animation cleanly.

Each card is independent (its own `replayKey` state), implemented via a `AnimationCard` internal component:

```tsx
function AnimationCard({ label, className, codeLabel, children }) {
  const [key, setKey] = useState(0)
  return (
    <div className="...card styles...">
      <div key={key} className={className}>{children}</div>
      <p>{label}</p>
      <code>{codeLabel}</code>
      <button onClick={() => setKey(k => k + 1)}>Replay</button>
    </div>
  )
}
```

## UI Layout

```
[CSS Animations]
Description...

Tailwind Built-ins
[Spin] [Bounce] [Pulse] [Ping]
  ⟳      •     ████    ◉

Custom @keyframes
[Fade In] [Slide Up] [Shake] [Zoom In]
  Hello    World     Error!    🎉
```

## Testing

File: `src/features/css-examples/components/__tests__/AnimationsSection.test.tsx`

Tests:
- Renders section heading
- Renders all 4 Tailwind built-in animation labels (Spin, Bounce, Pulse, Ping)
- Renders all 4 custom animation labels (Fade In, Slide Up, Shake, Zoom In)
- Clicking Replay button remounts animation element (key changes — element re-renders)
- Each card shows its class name in a `<code>` element

## Storybook

Single `Default` story, no args.

## Out of Scope

- Animation controls (duration, delay sliders)
- Pausing/resuming animations
- Combined multi-step animations
- CSS animation events (`animationend` etc.)
