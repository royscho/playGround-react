# Media Elements Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `/media-elements` page with four sections (Images, Video, Audio, SVG) demonstrating HTML5 media element attributes and SVG shapes.

**Architecture:** New `media-elements` feature following the `css-examples` pattern — four standalone section components composed by `MediaElementsPage`. Sample media files in `/public/media/`. New route and sidebar nav item added to existing infrastructure files.

**Tech Stack:** React, Tailwind 4, `import.meta.env.BASE_URL` for asset paths, Vitest + Testing Library, Storybook (`@storybook/react-vite`).

---

## File Map

| File | Action |
|------|--------|
| `public/media/sample.mp4` | Add — sample video file |
| `public/media/sample.mp3` | Add — sample audio file |
| `src/features/media-elements/components/ImageSection.tsx` | Create |
| `src/features/media-elements/components/VideoSection.tsx` | Create |
| `src/features/media-elements/components/AudioSection.tsx` | Create |
| `src/features/media-elements/components/SVGSection.tsx` | Create |
| `src/features/media-elements/components/MediaElementsPage.tsx` | Create |
| `src/features/media-elements/components/__tests__/ImageSection.test.tsx` | Create |
| `src/features/media-elements/components/__tests__/VideoSection.test.tsx` | Create |
| `src/features/media-elements/components/__tests__/AudioSection.test.tsx` | Create |
| `src/features/media-elements/components/__tests__/SVGSection.test.tsx` | Create |
| `src/features/media-elements/components/__tests__/MediaElementsPage.test.tsx` | Create |
| `src/features/media-elements/components/__stories__/ImageSection.stories.tsx` | Create |
| `src/features/media-elements/components/__stories__/VideoSection.stories.tsx` | Create |
| `src/features/media-elements/components/__stories__/AudioSection.stories.tsx` | Create |
| `src/features/media-elements/components/__stories__/SVGSection.stories.tsx` | Create |
| `src/app/router.tsx` | Modify — add lazy import + route |
| `src/app/layout/navItems.ts` | Modify — add nav item + MORE_ROUTES entry |

---

### Task 1: Add sample media files

**Files:**
- Create: `public/media/sample.mp4`
- Create: `public/media/sample.mp3`

- [ ] **Step 1: Download sample files**

```bash
mkdir -p public/media
curl -L "https://www.w3schools.com/html/mov_bbb.mp4" -o public/media/sample.mp4
curl -L "https://www.w3schools.com/html/horse.mp3" -o public/media/sample.mp3
```

- [ ] **Step 2: Verify files exist**

```bash
ls -lh public/media/
```

Expected: both files present, non-zero size.

- [ ] **Step 3: Commit**

```bash
git add public/media/sample.mp4 public/media/sample.mp3
git commit -m "feat(media-elements): add sample video and audio files"
```

---

### Task 2: ImageSection (TDD)

**Files:**
- Create: `src/features/media-elements/components/__tests__/ImageSection.test.tsx`
- Create: `src/features/media-elements/components/ImageSection.tsx`

- [ ] **Step 1: Write the failing tests**

Create `src/features/media-elements/components/__tests__/ImageSection.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ImageSection } from '../ImageSection'

describe('ImageSection', () => {
  it('renders section heading', () => {
    render(<ImageSection />)
    expect(screen.getByRole('heading', { name: /^images$/i })).toBeInTheDocument()
  })

  it('renders all 5 object-fit labels', () => {
    render(<ImageSection />)
    expect(screen.getByText('Cover')).toBeInTheDocument()
    expect(screen.getByText('Contain')).toBeInTheDocument()
    expect(screen.getByText('Fill')).toBeInTheDocument()
    expect(screen.getByText('None')).toBeInTheDocument()
    expect(screen.getByText('Scale Down')).toBeInTheDocument()
  })

  it('renders object-fit code labels', () => {
    render(<ImageSection />)
    expect(screen.getByText('object-cover')).toBeInTheDocument()
    expect(screen.getByText('object-contain')).toBeInTheDocument()
    expect(screen.getByText('object-fill')).toBeInTheDocument()
    expect(screen.getByText('object-none')).toBeInTheDocument()
    expect(screen.getByText('object-scale-down')).toBeInTheDocument()
  })

  it('renders loading attribute cards', () => {
    render(<ImageSection />)
    expect(screen.getByText('Lazy')).toBeInTheDocument()
    expect(screen.getByText('Eager')).toBeInTheDocument()
  })

  it('renders loading attribute code labels', () => {
    render(<ImageSection />)
    expect(screen.getByText('loading="lazy"')).toBeInTheDocument()
    expect(screen.getByText('loading="eager"')).toBeInTheDocument()
  })

  it('renders aspect-ratio demo', () => {
    render(<ImageSection />)
    expect(screen.getByText(/aspect-\[16\/9\]/)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx vitest run src/features/media-elements/components/__tests__/ImageSection.test.tsx
```

Expected: FAIL — `Cannot find module '../ImageSection'`

- [ ] **Step 3: Implement ImageSection.tsx**

Create `src/features/media-elements/components/ImageSection.tsx`:

```tsx
const OBJECT_FIT_CARDS = [
  { label: 'Cover', cls: 'object-cover' },
  { label: 'Contain', cls: 'object-contain' },
  { label: 'Fill', cls: 'object-fill' },
  { label: 'None', cls: 'object-none' },
  { label: 'Scale Down', cls: 'object-scale-down' },
]

const IMG1 = 'https://picsum.photos/seed/media1/400/300'
const IMG2 = 'https://picsum.photos/seed/media2/400/300'
const IMG3 = 'https://picsum.photos/seed/media3/800/450'

export function ImageSection() {
  return (
    <section>
      <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Images</h2>
      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
        HTML <code>&lt;img&gt;</code> attributes for loading strategy and visual fit.
      </p>

      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
        object-fit
      </h3>
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-5">
        {OBJECT_FIT_CARDS.map(({ label, cls }) => (
          <div key={cls} className="flex flex-col items-center gap-2">
            <div className="h-[120px] w-full overflow-hidden rounded border border-gray-200 dark:border-gray-700">
              <img src={IMG1} alt={`${label} demo`} className={`h-full w-full ${cls}`} />
            </div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</p>
            <code className="text-xs text-indigo-600 dark:text-indigo-400">{cls}</code>
          </div>
        ))}
      </div>

      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
        loading attribute
      </h3>
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
          <img src={IMG1} alt="lazy loading demo" loading="lazy" className="mb-3 h-32 w-full rounded object-cover" />
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Lazy</p>
          <code className="text-xs text-indigo-600 dark:text-indigo-400">loading="lazy"</code>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Browser defers load until near viewport</p>
        </div>
        <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
          <img src={IMG2} alt="eager loading demo" loading="eager" className="mb-3 h-32 w-full rounded object-cover" />
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Eager</p>
          <code className="text-xs text-indigo-600 dark:text-indigo-400">loading="eager"</code>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Browser loads immediately (default)</p>
        </div>
      </div>

      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
        aspect-ratio
      </h3>
      <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
        <div className="aspect-[16/9] w-full overflow-hidden rounded">
          <img src={IMG3} alt="aspect-ratio demo" className="h-full w-full object-cover" />
        </div>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Container uses{' '}
          <code className="text-indigo-600 dark:text-indigo-400">aspect-[16/9]</code> with{' '}
          <code className="text-indigo-600 dark:text-indigo-400">object-cover</code> on the image.
        </p>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run src/features/media-elements/components/__tests__/ImageSection.test.tsx
```

Expected: All 6 tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/features/media-elements/components/ImageSection.tsx \
        src/features/media-elements/components/__tests__/ImageSection.test.tsx
git commit -m "feat(media-elements): add ImageSection with object-fit, loading, aspect-ratio demos"
```

---

### Task 3: VideoSection (TDD)

**Files:**
- Create: `src/features/media-elements/components/__tests__/VideoSection.test.tsx`
- Create: `src/features/media-elements/components/VideoSection.tsx`

- [ ] **Step 1: Write the failing tests**

Create `src/features/media-elements/components/__tests__/VideoSection.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { VideoSection } from '../VideoSection'

describe('VideoSection', () => {
  it('renders section heading', () => {
    render(<VideoSection />)
    expect(screen.getByRole('heading', { name: /^video$/i })).toBeInTheDocument()
  })

  it('renders Native Controls card label', () => {
    render(<VideoSection />)
    expect(screen.getByText('Native Controls')).toBeInTheDocument()
  })

  it('renders Autoplay + Muted card label', () => {
    render(<VideoSection />)
    expect(screen.getByText('Autoplay + Muted')).toBeInTheDocument()
  })

  it('renders Poster Image card label', () => {
    render(<VideoSection />)
    expect(screen.getByText('Poster Image')).toBeInTheDocument()
  })

  it('controls video has controls attribute', () => {
    render(<VideoSection />)
    expect(screen.getByTestId('video-controls')).toHaveAttribute('controls')
  })

  it('autoplay video has muted attribute', () => {
    render(<VideoSection />)
    expect(screen.getByTestId('video-autoplay')).toHaveAttribute('muted')
  })

  it('poster video has poster attribute', () => {
    render(<VideoSection />)
    expect(screen.getByTestId('video-poster')).toHaveAttribute('poster')
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx vitest run src/features/media-elements/components/__tests__/VideoSection.test.tsx
```

Expected: FAIL — `Cannot find module '../VideoSection'`

- [ ] **Step 3: Implement VideoSection.tsx**

Create `src/features/media-elements/components/VideoSection.tsx`:

```tsx
const VIDEO_SRC = `${import.meta.env.BASE_URL}media/sample.mp4`
const POSTER_SRC = 'https://picsum.photos/seed/vidposter/400/225'

export function VideoSection() {
  return (
    <section>
      <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Video</h2>
      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
        HTML <code>&lt;video&gt;</code> key attributes for controls, autoplay, and poster image.
      </p>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="flex flex-col gap-2 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Native Controls</p>
          <video data-testid="video-controls" controls src={VIDEO_SRC} className="w-full rounded" />
          <code className="text-xs text-indigo-600 dark:text-indigo-400">controls src</code>
        </div>

        <div className="flex flex-col gap-2 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Autoplay + Muted</p>
          <video
            data-testid="video-autoplay"
            autoPlay
            muted
            loop
            src={VIDEO_SRC}
            className="w-full rounded"
          />
          <code className="text-xs text-indigo-600 dark:text-indigo-400">autoPlay muted loop</code>
          <p className="text-xs text-gray-500 dark:text-gray-400">autoPlay requires muted</p>
        </div>

        <div className="flex flex-col gap-2 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Poster Image</p>
          <video
            data-testid="video-poster"
            controls
            src={VIDEO_SRC}
            poster={POSTER_SRC}
            className="w-full rounded"
          />
          <code className="text-xs text-indigo-600 dark:text-indigo-400">poster</code>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run src/features/media-elements/components/__tests__/VideoSection.test.tsx
```

Expected: All 7 tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/features/media-elements/components/VideoSection.tsx \
        src/features/media-elements/components/__tests__/VideoSection.test.tsx
git commit -m "feat(media-elements): add VideoSection with controls, autoplay, poster demos"
```

---

### Task 4: AudioSection (TDD)

**Files:**
- Create: `src/features/media-elements/components/__tests__/AudioSection.test.tsx`
- Create: `src/features/media-elements/components/AudioSection.tsx`

- [ ] **Step 1: Write the failing tests**

Create `src/features/media-elements/components/__tests__/AudioSection.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AudioSection } from '../AudioSection'

describe('AudioSection', () => {
  it('renders section heading', () => {
    render(<AudioSection />)
    expect(screen.getByRole('heading', { name: /^audio$/i })).toBeInTheDocument()
  })

  it('renders Native Controls card label', () => {
    render(<AudioSection />)
    expect(screen.getByText('Native Controls')).toBeInTheDocument()
  })

  it('renders Loop card label', () => {
    render(<AudioSection />)
    expect(screen.getByText('Loop')).toBeInTheDocument()
  })

  it('renders preload options', () => {
    render(<AudioSection />)
    expect(screen.getByText('preload="none"')).toBeInTheDocument()
    expect(screen.getByText('preload="metadata"')).toBeInTheDocument()
    expect(screen.getByText('preload="auto"')).toBeInTheDocument()
  })

  it('controls audio has controls attribute', () => {
    render(<AudioSection />)
    expect(screen.getByTestId('audio-controls')).toHaveAttribute('controls')
  })

  it('loop audio has loop attribute', () => {
    render(<AudioSection />)
    expect(screen.getByTestId('audio-loop')).toHaveAttribute('loop')
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx vitest run src/features/media-elements/components/__tests__/AudioSection.test.tsx
```

Expected: FAIL — `Cannot find module '../AudioSection'`

- [ ] **Step 3: Implement AudioSection.tsx**

Create `src/features/media-elements/components/AudioSection.tsx`:

```tsx
const AUDIO_SRC = `${import.meta.env.BASE_URL}media/sample.mp3`

const PRELOAD_OPTIONS: { value: 'none' | 'metadata' | 'auto'; description: string }[] = [
  { value: 'none', description: 'No preload — waits for user interaction' },
  { value: 'metadata', description: 'Loads only duration and metadata' },
  { value: 'auto', description: 'Browser decides how much to buffer' },
]

export function AudioSection() {
  return (
    <section>
      <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Audio</h2>
      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
        HTML <code>&lt;audio&gt;</code> key attributes for controls, looping, and preload strategy.
      </p>

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Native Controls</p>
          <audio data-testid="audio-controls" controls src={AUDIO_SRC} className="w-full" />
          <code className="text-xs text-indigo-600 dark:text-indigo-400">controls src</code>
        </div>

        <div className="flex flex-col gap-2 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Loop</p>
          <audio data-testid="audio-loop" controls loop src={AUDIO_SRC} className="w-full" />
          <code className="text-xs text-indigo-600 dark:text-indigo-400">loop</code>
          <p className="text-xs text-gray-500 dark:text-gray-400">Restarts when it ends</p>
        </div>
      </div>

      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
        preload options
      </h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {PRELOAD_OPTIONS.map(({ value, description }) => (
          <div key={value} className="flex flex-col gap-2 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">preload="{value}"</p>
            <audio controls preload={value} src={AUDIO_SRC} className="w-full" />
            <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run src/features/media-elements/components/__tests__/AudioSection.test.tsx
```

Expected: All 6 tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/features/media-elements/components/AudioSection.tsx \
        src/features/media-elements/components/__tests__/AudioSection.test.tsx
git commit -m "feat(media-elements): add AudioSection with controls, loop, preload demos"
```

---

### Task 5: SVGSection (TDD)

**Files:**
- Create: `src/features/media-elements/components/__tests__/SVGSection.test.tsx`
- Create: `src/features/media-elements/components/SVGSection.tsx`

- [ ] **Step 1: Write the failing tests**

Create `src/features/media-elements/components/__tests__/SVGSection.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SVGSection } from '../SVGSection'

describe('SVGSection', () => {
  it('renders section heading', () => {
    render(<SVGSection />)
    expect(screen.getByRole('heading', { name: /^svg$/i })).toBeInTheDocument()
  })

  it('renders all 6 shape labels', () => {
    render(<SVGSection />)
    expect(screen.getByText('Rectangle')).toBeInTheDocument()
    expect(screen.getByText('Circle')).toBeInTheDocument()
    expect(screen.getByText('Ellipse')).toBeInTheDocument()
    expect(screen.getByText('Line')).toBeInTheDocument()
    expect(screen.getByText('Polygon')).toBeInTheDocument()
    expect(screen.getByText('Path')).toBeInTheDocument()
  })

  it('renders SVG elements in the DOM', () => {
    const { container } = render(<SVGSection />)
    expect(container.querySelectorAll('svg').length).toBeGreaterThan(0)
  })

  it('renders fill and stroke sub-section labels', () => {
    render(<SVGSection />)
    expect(screen.getByText('fill only')).toBeInTheDocument()
    expect(screen.getByText('stroke only')).toBeInTheDocument()
    expect(screen.getByText('fill + stroke')).toBeInTheDocument()
  })

  it('renders inline SVG sub-section', () => {
    render(<SVGSection />)
    expect(screen.getByText('Inline SVG')).toBeInTheDocument()
  })

  it('renders SVG as img sub-section', () => {
    render(<SVGSection />)
    expect(screen.getByAltText('svg as img')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx vitest run src/features/media-elements/components/__tests__/SVGSection.test.tsx
```

Expected: FAIL — `Cannot find module '../SVGSection'`

- [ ] **Step 3: Implement SVGSection.tsx**

Create `src/features/media-elements/components/SVGSection.tsx`:

```tsx
export function SVGSection() {
  return (
    <section>
      <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">SVG</h2>
      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
        Inline SVG shapes, fill/stroke attributes, and inline SVG vs <code>&lt;img&gt;</code>.
      </p>

      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
        Basic Shapes
      </h3>
      <div className="mb-8 grid grid-cols-3 gap-4 lg:grid-cols-6">
        <div className="flex flex-col items-center gap-2">
          <svg viewBox="0 0 80 80" className="h-16 w-16">
            <rect x="10" y="10" width="60" height="60" rx="4" fill="#6366f1" />
          </svg>
          <p className="text-sm text-gray-700 dark:text-gray-300">Rectangle</p>
          <code className="text-xs text-indigo-600 dark:text-indigo-400">&lt;rect&gt;</code>
        </div>

        <div className="flex flex-col items-center gap-2">
          <svg viewBox="0 0 80 80" className="h-16 w-16">
            <circle cx="40" cy="40" r="30" fill="#ec4899" />
          </svg>
          <p className="text-sm text-gray-700 dark:text-gray-300">Circle</p>
          <code className="text-xs text-indigo-600 dark:text-indigo-400">&lt;circle&gt;</code>
        </div>

        <div className="flex flex-col items-center gap-2">
          <svg viewBox="0 0 80 80" className="h-16 w-16">
            <ellipse cx="40" cy="40" rx="35" ry="20" fill="#f59e0b" />
          </svg>
          <p className="text-sm text-gray-700 dark:text-gray-300">Ellipse</p>
          <code className="text-xs text-indigo-600 dark:text-indigo-400">&lt;ellipse&gt;</code>
        </div>

        <div className="flex flex-col items-center gap-2">
          <svg viewBox="0 0 80 80" className="h-16 w-16">
            <line x1="10" y1="40" x2="70" y2="40" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />
          </svg>
          <p className="text-sm text-gray-700 dark:text-gray-300">Line</p>
          <code className="text-xs text-indigo-600 dark:text-indigo-400">&lt;line&gt;</code>
        </div>

        <div className="flex flex-col items-center gap-2">
          <svg viewBox="0 0 80 80" className="h-16 w-16">
            <polygon points="40,5 50,30 75,30 55,48 62,75 40,58 18,75 25,48 5,30 30,30" fill="#f97316" />
          </svg>
          <p className="text-sm text-gray-700 dark:text-gray-300">Polygon</p>
          <code className="text-xs text-indigo-600 dark:text-indigo-400">&lt;polygon&gt;</code>
        </div>

        <div className="flex flex-col items-center gap-2">
          <svg viewBox="0 0 80 80" className="h-16 w-16">
            <path d="M 10 40 Q 40 10 70 40 Q 40 70 10 40 Z" fill="#8b5cf6" />
          </svg>
          <p className="text-sm text-gray-700 dark:text-gray-300">Path</p>
          <code className="text-xs text-indigo-600 dark:text-indigo-400">&lt;path&gt;</code>
        </div>
      </div>

      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
        fill + stroke
      </h3>
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex flex-col items-center gap-2 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
          <svg viewBox="0 0 80 80" className="h-16 w-16">
            <circle cx="40" cy="40" r="30" fill="#6366f1" />
          </svg>
          <p className="text-sm text-gray-700 dark:text-gray-300">fill only</p>
          <code className="text-xs text-indigo-600 dark:text-indigo-400">fill="#6366f1"</code>
        </div>

        <div className="flex flex-col items-center gap-2 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
          <svg viewBox="0 0 80 80" className="h-16 w-16">
            <circle cx="40" cy="40" r="28" fill="none" stroke="#6366f1" strokeWidth="4" />
          </svg>
          <p className="text-sm text-gray-700 dark:text-gray-300">stroke only</p>
          <code className="text-xs text-indigo-600 dark:text-indigo-400">fill="none" stroke="…"</code>
        </div>

        <div className="flex flex-col items-center gap-2 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
          <svg viewBox="0 0 80 80" className="h-16 w-16">
            <circle cx="40" cy="40" r="28" fill="#c7d2fe" stroke="#6366f1" strokeWidth="4" />
          </svg>
          <p className="text-sm text-gray-700 dark:text-gray-300">fill + stroke</p>
          <code className="text-xs text-indigo-600 dark:text-indigo-400">fill + stroke + strokeWidth</code>
        </div>
      </div>

      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
        Inline SVG vs &lt;img&gt;
      </h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
          <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Inline SVG</p>
          <svg viewBox="0 0 80 80" className="h-16 w-16 fill-indigo-500">
            <circle cx="40" cy="40" r="30" />
          </svg>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Styled with Tailwind <code className="text-indigo-600 dark:text-indigo-400">fill-indigo-500</code>.
            Accessible to CSS and JS.
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
          <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            SVG as &lt;img&gt;
          </p>
          <img
            src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'%3E%3Ccircle cx='40' cy='40' r='30' fill='%236366f1'/%3E%3C/svg%3E"
            alt="svg as img"
            className="h-16 w-16"
          />
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Treated as image. CSS cannot change <code className="text-indigo-600 dark:text-indigo-400">fill</code>.
          </p>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run src/features/media-elements/components/__tests__/SVGSection.test.tsx
```

Expected: All 6 tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/features/media-elements/components/SVGSection.tsx \
        src/features/media-elements/components/__tests__/SVGSection.test.tsx
git commit -m "feat(media-elements): add SVGSection with shapes, fill/stroke, inline vs img demos"
```

---

### Task 6: MediaElementsPage + wire route + nav

**Files:**
- Create: `src/features/media-elements/components/MediaElementsPage.tsx`
- Create: `src/features/media-elements/components/__tests__/MediaElementsPage.test.tsx`
- Modify: `src/app/router.tsx`
- Modify: `src/app/layout/navItems.ts`

- [ ] **Step 1: Write the failing page test**

Create `src/features/media-elements/components/__tests__/MediaElementsPage.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import MediaElementsPage from '../MediaElementsPage'

describe('MediaElementsPage', () => {
  it('renders page heading', () => {
    render(<MediaElementsPage />)
    expect(screen.getByRole('heading', { name: /media elements/i })).toBeInTheDocument()
  })

  it('renders all four section headings', () => {
    render(<MediaElementsPage />)
    expect(screen.getByRole('heading', { name: /^images$/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /^video$/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /^audio$/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /^svg$/i })).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/features/media-elements/components/__tests__/MediaElementsPage.test.tsx
```

Expected: FAIL — `Cannot find module '../MediaElementsPage'`

- [ ] **Step 3: Create MediaElementsPage.tsx**

Create `src/features/media-elements/components/MediaElementsPage.tsx`:

```tsx
import { ImageSection } from './ImageSection'
import { VideoSection } from './VideoSection'
import { AudioSection } from './AudioSection'
import { SVGSection } from './SVGSection'

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

- [ ] **Step 4: Run page test to verify it passes**

```bash
npx vitest run src/features/media-elements/components/__tests__/MediaElementsPage.test.tsx
```

Expected: All 2 tests PASS

- [ ] **Step 5: Add route to router.tsx**

In `src/app/router.tsx`, add after the AccessibilityPage lazy import line:

```tsx
const MediaElementsPage = lazy(() => import('../features/media-elements/components/MediaElementsPage'))
```

Then add this route after the `/accessibility` route (inside the `<Route element={<AppLayout />}>` block):

```tsx
<Route
  path="/media-elements"
  element={
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <MediaElementsPage />
      </Suspense>
    </ErrorBoundary>
  }
/>
```

- [ ] **Step 6: Add nav item to navItems.ts**

In `src/app/layout/navItems.ts`:

Add to the `navItems` array (after the accessibility entry):
```ts
{ to: '/media-elements', label: 'Media Elements', icon: '🎬' },
```

Add `'/media-elements'` to `MORE_ROUTES`:
```ts
const MORE_ROUTES = ['/users', '/css-examples', '/chat', '/performance', '/accessibility', '/media-elements']
```

- [ ] **Step 7: Run full test suite**

```bash
npm run test -- --run 2>&1 | tail -5
```

Expected: all tests pass

- [ ] **Step 8: Commit**

```bash
git add src/features/media-elements/components/MediaElementsPage.tsx \
        src/features/media-elements/components/__tests__/MediaElementsPage.test.tsx \
        src/app/router.tsx \
        src/app/layout/navItems.ts
git commit -m "feat(media-elements): add MediaElementsPage, route, and nav item"
```

---

### Task 7: Storybook stories

**Files:**
- Create: `src/features/media-elements/components/__stories__/ImageSection.stories.tsx`
- Create: `src/features/media-elements/components/__stories__/VideoSection.stories.tsx`
- Create: `src/features/media-elements/components/__stories__/AudioSection.stories.tsx`
- Create: `src/features/media-elements/components/__stories__/SVGSection.stories.tsx`

**IMPORTANT:** Always import from `@storybook/react-vite`, never `@storybook/react`.

- [ ] **Step 1: Create all 4 story files**

Create `src/features/media-elements/components/__stories__/ImageSection.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ImageSection } from '../ImageSection'

const meta: Meta<typeof ImageSection> = {
  component: ImageSection,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof ImageSection>

export const Default: Story = {}
```

Create `src/features/media-elements/components/__stories__/VideoSection.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite'
import { VideoSection } from '../VideoSection'

const meta: Meta<typeof VideoSection> = {
  component: VideoSection,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof VideoSection>

export const Default: Story = {}
```

Create `src/features/media-elements/components/__stories__/AudioSection.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite'
import { AudioSection } from '../AudioSection'

const meta: Meta<typeof AudioSection> = {
  component: AudioSection,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof AudioSection>

export const Default: Story = {}
```

Create `src/features/media-elements/components/__stories__/SVGSection.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite'
import { SVGSection } from '../SVGSection'

const meta: Meta<typeof SVGSection> = {
  component: SVGSection,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof SVGSection>

export const Default: Story = {}
```

- [ ] **Step 2: Verify lint passes**

```bash
npm run lint
```

Expected: 0 errors

- [ ] **Step 3: Commit**

```bash
git add src/features/media-elements/components/__stories__/
git commit -m "feat(media-elements): add Storybook stories for all four sections"
```
