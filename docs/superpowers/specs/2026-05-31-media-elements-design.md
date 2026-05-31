# Media Elements Page — Design

## Goal

Add a `/media-elements` page showcasing HTML5 `<img>`, `<video>`, and `<audio>` elements with their key attributes. Teaches the browser-native API for each media type — useful for interviews and practical web development.

## Approach

New `media-elements` feature following the established pattern of `css-examples` and `react-demos`. Three section components (`ImageSection`, `VideoSection`, `AudioSection`) composed by `MediaElementsPage`. All content is static demos — no React state needed. New route `/media-elements` + sidebar nav item added to `moreNavItems`.

## Tech Stack

- Plain HTML5 media elements (`<img>`, `<video>`, `<audio>`) with Tailwind 4 styling
- Placeholder images from `picsum.photos` (stable, no API key)
- Sample media files in `/public/media/` for video and audio
- Vitest + Testing Library for tests
- Storybook (`@storybook/react-vite`) for stories

## File Structure

```
src/features/media-elements/
  components/
    MediaElementsPage.tsx               ← new
    ImageSection.tsx                    ← new
    VideoSection.tsx                    ← new
    AudioSection.tsx                    ← new
    SVGSection.tsx                      ← new
    __tests__/
      MediaElementsPage.test.tsx        ← new
      ImageSection.test.tsx             ← new
      VideoSection.test.tsx             ← new
      AudioSection.test.tsx             ← new
      SVGSection.test.tsx               ← new
    __stories__/
      ImageSection.stories.tsx          ← new
      VideoSection.stories.tsx          ← new
      AudioSection.stories.tsx          ← new
      SVGSection.stories.tsx            ← new

public/
  media/
    sample.mp4                          ← add (free sample video)
    sample.mp3                          ← add (free sample audio)
```

**Modified:**
- `src/app/router.tsx` — lazy import + route for `MediaElementsPage`
- `src/app/layout/navItems.ts` — add `/media-elements` to `navItems` array and `MORE_ROUTES`

## ImageSection

**Heading:** "Images"

**Sub-section 1: object-fit**
5 demo cards in a responsive grid (`grid-cols-2 lg:grid-cols-5`). Each card: fixed 150×120px container with same image (`https://picsum.photos/seed/media1/400/300`), different `object-fit` value, label + `<code>` tag below.

| Card | Class |
|------|-------|
| Cover | `object-cover` |
| Contain | `object-contain` |
| Fill | `object-fill` |
| None | `object-none` |
| Scale Down | `object-scale-down` |

**Sub-section 2: loading attribute**
2 cards side-by-side. Each shows an `<img>` with the attribute in a `<code>` tag and a one-line description.

| Card | Attribute | Description |
|------|-----------|-------------|
| Lazy | `loading="lazy"` | Browser defers load until near viewport |
| Eager | `loading="eager"` | Browser loads immediately (default) |

**Sub-section 3: aspect-ratio**
Single demo: 100% wide container with `aspect-ratio: 16/9`, image fills it with `object-fit: cover`. Shows `aspect-[16/9] object-cover` Tailwind classes.

## VideoSection

**Heading:** "Video"

**Sub-section: Key Attributes**
3 demo cards in `grid-cols-1 md:grid-cols-3`:

| Card | Element | Key attributes shown |
|------|---------|----------------------|
| Native Controls | `<video>` | `controls`, `src`, `poster` |
| Autoplay + Muted | `<video>` | `autoPlay`, `muted`, `loop` |
| Poster Image | `<video>` | `poster` (image shown before play) |

Each card: video element, label, `<code>` tag showing the key attributes used.

`src="/playGround-react/media/sample.mp4"` (Vite base path prefix for GitHub Pages).
`poster="https://picsum.photos/seed/vidposter/400/225"`.

> Note on autoplay: browsers block autoplay with sound. `autoPlay` only works when `muted` is also set. This is shown explicitly in the Autoplay card.

## AudioSection

**Heading:** "Audio"

**Sub-section: Key Attributes**
3 demo cards in `grid-cols-1 md:grid-cols-3`:

| Card | Element | Key attributes shown |
|------|---------|----------------------|
| Native Controls | `<audio>` | `controls`, `src` |
| Loop | `<audio>` | `controls`, `loop` |
| Preload Options | 3 mini cards | `preload="none"`, `"metadata"`, `"auto"` |

`src="/playGround-react/media/sample.mp3"`.

## SVGSection

**Heading:** "SVG"

**Sub-section 1: Basic Shapes**
6 inline SVGs in a `grid-cols-3 lg:grid-cols-6` grid. Each card: rendered SVG shape, label, `<code>` tag showing the element name.

| Shape | SVG element |
|-------|-------------|
| Rectangle | `<rect>` |
| Circle | `<circle>` |
| Ellipse | `<ellipse>` |
| Line | `<line>` |
| Polygon | `<polygon>` (star or arrow) |
| Path | `<path>` (simple arc or checkmark) |

Each SVG: 80×80px `viewBox="0 0 80 80"`, `fill` + `stroke` attributes shown.

**Sub-section 2: fill + stroke**
3 cards showing same circle with different styling:
- `fill` only (solid color)
- `stroke` only (outline, `fill="none"`)
- `fill` + `stroke` + `stroke-width`

**Sub-section 3: Inline vs `<img>`**
2 cards:
- Inline SVG: `<svg>` directly in JSX — can style with CSS, access with JS
- `<img src="data:image/svg+xml,..." />` — treated as image, no CSS access

Inline SVG shows a colored circle that changes fill via Tailwind `fill-indigo-500`. The img version shows the same circle as a data URI to illustrate the difference.

## MediaElementsPage

Composes the four sections:

```tsx
export default function MediaElementsPage() {
  return (
    <div className="space-y-10 p-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Media Elements</h1>
      <ImageSection />
      <VideoSection />
      <AudioSection />
      <SVGSection />
    </div>
  )
}
```

## Navigation

Add to `navItems.ts`:
```ts
{ to: '/media-elements', label: 'Media Elements', icon: '🎬' }
```

Add `/media-elements` to `MORE_ROUTES` (appears in sidebar + "More" bottom sheet, not primary nav).

## Testing

Each section has its own test file. Tests check rendered structure — not media playback (jsdom cannot play media).

**MediaElementsPage.test.tsx:** renders page heading + 4 section headings (Images, Video, Audio, SVG)

**ImageSection.test.tsx:**
- Renders section heading "Images"
- Renders all 5 object-fit labels (Cover, Contain, Fill, None, Scale Down)
- Renders object-fit code labels (`object-cover` etc.)
- Renders loading attribute cards (Lazy, Eager)
- Renders aspect-ratio demo

**VideoSection.test.tsx:**
- Renders section heading "Video"
- Renders `controls` card
- Renders `autoPlay` + `muted` card
- Renders `poster` card
- Video elements have correct attributes (`controls`, `muted`, `loop`)

**AudioSection.test.tsx:**
- Renders section heading "Audio"
- Renders `controls` card
- Renders `loop` card
- Renders preload options (none, metadata, auto)
- Audio elements have correct attributes

**SVGSection.test.tsx:**
- Renders section heading "SVG"
- Renders all 6 shape labels (Rectangle, Circle, Ellipse, Line, Polygon, Path)
- Renders fill/stroke sub-section
- Renders inline vs img sub-section
- SVG elements present in DOM

## Storybook

One `Default` story per section. Import from `@storybook/react-vite`.

## Out of Scope

- React event handlers (`onPlay`, `onPause`, `onEnded`)
- Custom video/audio controls
- Responsive images (`srcset`, `sizes`, `<picture>`)
- WebRTC / MediaStream API
- Canvas drawing from video
- SVG animations (SMIL)
- SVG filters and gradients
- SVG `<use>` symbol reuse
