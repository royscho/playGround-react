# Mobile-First Layout Design

## Goal

Make the dashboard responsive for mobile screens by replacing the left sidebar with a bottom tab bar on small screens. Desktop layout is unchanged.

## Breakpoint

`md` = 768px (Tailwind default). Below `md` = mobile. At or above `md` = desktop (current behavior).

## Current Layout

```
┌─────────────────────────────┐
│ Sidebar │ TopBar            │
│  w-56   ├───────────────────┤
│ or w-16 │ <page content>    │
│         │                   │
└─────────┴───────────────────┘
```

Sidebar collapses to icon-only (`w-16`) when `sidebarOpen = false`. No mobile behavior exists.

## Mobile Layout (below md)

```
┌─────────────────────────────┐
│ TopBar: title + 🌙 🔔 name  │
├─────────────────────────────┤
│                             │
│      <page content>         │
│                             │
├─────────────────────────────┤
│ 📊  📈  ⚛️  ⚙️  •••         │
└─────────────────────────────┘
```

- Sidebar: hidden
- TopBar: no hamburger ☰, shows current page title on left, keeps dark mode + notifications + username on right
- Bottom tab bar: fixed to bottom, 5 slots
- Main content: padding-bottom added to avoid overlap with bottom bar

## Desktop Layout (md and above)

Unchanged. Sidebar, TopBar hamburger toggle, all existing behavior identical.

## Bottom Tab Bar

**Primary tabs (always visible):**

| Slot | Icon | Label | Route |
|------|------|-------|-------|
| 1 | 📊 | Home | /dashboard |
| 2 | 📈 | Analytics | /analytics |
| 3 | ⚛️ | Demos | /react-demos |
| 4 | ⚙️ | Settings | /settings |
| 5 | ••• | More | opens bottom sheet |

Active tab: highlighted with `text-blue-600`, inactive: `text-gray-500`.

## "More" Bottom Sheet

Tapping "More" slides up a sheet from the bottom containing the remaining 5 nav items:

- 👥 Users → /users
- 🎨 CSS Examples → /css-examples
- 💬 Chat Demo → /chat
- ⚡ Performance → /performance
- ♿ Accessibility → /accessibility

Sheet overlays content. Tapping an item navigates and closes the sheet. Tapping the backdrop closes the sheet.

## TopBar — Mobile Changes

- Hide hamburger `☰` button (`hidden md:block`)
- Show current page title on the left (derived from current route's nav item label)
- Keep right side: dark mode toggle, notification badge, username

## New Components

### `BottomNav.tsx`
`src/app/layout/BottomNav.tsx`

- Fixed bottom bar, full width, `h-16`, `z-50`
- 5 tabs: 4 nav links + 1 "More" button
- Uses `NavLink` from react-router-dom for active state on first 4 tabs
- Passes `onMoreClick` prop to open bottom sheet
- Only rendered on mobile (parent conditionally renders, or uses `md:hidden`)

### `BottomSheet.tsx`
`src/app/layout/BottomSheet.tsx`

- Slide-up overlay, full width, positioned above bottom nav
- Props: `isOpen: boolean`, `onClose: () => void`
- Contains list of 5 remaining nav items as `NavLink`s
- Clicking any item: navigate + call `onClose()`
- Backdrop (semi-transparent overlay) on click calls `onClose()`
- Transition: `translate-y-full` → `translate-y-0` with CSS transition

## Modified Files

| File | Change |
|------|--------|
| `src/app/layout/AppLayout.tsx` | Add `<BottomNav>` + `<BottomSheet>`, add `pb-16 md:pb-0` to main |
| `src/app/layout/Sidebar.tsx` | Add `hidden md:flex` to `<aside>` |
| `src/app/layout/TopBar.tsx` | Hide `☰` on mobile, add page title on mobile |

## State

Bottom sheet open/closed state lives in `AppLayout` as local `useState` — not in `uiStore`. It's transient UI state with no persistence needed.

## Testing

- Existing unit tests must still pass (183 tests)
- Manual: resize browser below 768px → sidebar hides, bottom nav appears
- Manual: tap "More" → sheet slides up, tap item → navigates + sheet closes
- Manual: tap backdrop → sheet closes
- Manual: resize above 768px → bottom nav hides, sidebar reappears
- Manual: dark mode toggle works on mobile
