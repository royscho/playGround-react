# HTML5 Interview Notes

## Semantic Elements

Use semantic tags — they tell the browser AND screen readers what content means.

```html
<header>   <!-- site/section header -->
<nav>      <!-- navigation links -->
<main>     <!-- primary content (one per page) -->
<article>  <!-- self-contained content (blog post, card) -->
<section>  <!-- thematic grouping with a heading -->
<aside>    <!-- sidebar, related content -->
<footer>   <!-- site/section footer -->
<figure>   <!-- image + caption -->
<figcaption>
<time datetime="2024-01-15">January 15</time>
<mark>     <!-- highlighted text -->
<details>  <!-- collapsible content -->
<summary>  <!-- label for <details> -->
```

**Q: `<div>` vs `<section>` vs `<article>`?**
- `<div>` = no meaning, pure layout
- `<section>` = themed grouping, needs a heading (`<h2>` etc.)
- `<article>` = independently distributable content (RSS feed, tweet)

---

## Forms

```html
<form action="/submit" method="POST" novalidate>
  <!-- novalidate = disable browser validation, handle in JS -->

  <label for="email">Email</label>
  <input
    id="email"
    type="email"
    name="email"
    required
    autocomplete="email"
    placeholder="you@example.com"
  />

  <input type="password" autocomplete="current-password" />
  <input type="search"   />
  <input type="tel"      />   <!-- mobile shows numeric keyboard -->
  <input type="number" min="0" max="100" step="1" />
  <input type="date"     />
  <input type="file" accept=".pdf,.png" multiple />
  <input type="checkbox" name="agree" value="yes" />
  <input type="radio"    name="color" value="red" />
  <input type="range" min="0" max="100" />
  <input type="hidden" name="csrf" value="token" />

  <textarea rows="4" cols="50"></textarea>

  <select name="role">
    <option value="">-- Select --</option>
    <optgroup label="Staff">
      <option value="admin">Admin</option>
      <option value="editor">Editor</option>
    </optgroup>
  </select>

  <button type="submit">Submit</button>
  <button type="reset">Reset</button>
  <button type="button">JS only</button>  <!-- doesn't submit -->
</form>
```

**Accessibility must-haves:**
- Every `<input>` needs a `<label>` with matching `for`/`id`
- Use `aria-describedby` to link error messages to inputs
- `required`, `aria-required="true"` for screen readers

---

## Accessibility (a11y)

**ARIA roles:**
```html
<div role="button" tabindex="0">clickable div</div>
<div role="alert">error message shown dynamically</div>
<div role="dialog" aria-modal="true" aria-labelledby="title">
```

**ARIA attributes:**
```html
aria-label="Close"           <!-- name when no visible text -->
aria-labelledby="heading-id" <!-- name from another element -->
aria-describedby="hint-id"   <!-- additional description -->
aria-hidden="true"           <!-- hide from screen readers -->
aria-expanded="false"        <!-- toggle state -->
aria-selected="true"         <!-- selected state (tabs, listbox) -->
aria-live="polite"           <!-- announce dynamic updates -->
aria-live="assertive"        <!-- announce immediately (errors) -->
aria-current="page"          <!-- current nav item -->
```

**Focus management:**
```html
<!-- tabbable by default: a[href], button, input, select, textarea -->
<div tabindex="0">  <!-- make focusable -->
<div tabindex="-1"> <!-- focusable via JS only, not tab key -->

<!-- trap focus in modal -->
<dialog>  <!-- native dialog handles focus trap automatically -->
```

**Skip link (keyboard navigation):**
```html
<a href="#main-content" class="sr-only focus:not-sr-only">
  Skip to main content
</a>
<main id="main-content">...</main>
```

---

## Meta Tags

```html
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <!-- ↑ required for responsive design on mobile -->

  <meta name="description" content="Page description for SEO" />
  <meta name="robots" content="index, follow" />

  <!-- Open Graph (Facebook, LinkedIn previews) -->
  <meta property="og:title" content="Page Title" />
  <meta property="og:description" content="Description" />
  <meta property="og:image" content="https://example.com/image.png" />
  <meta property="og:url" content="https://example.com/page" />

  <!-- Twitter card -->
  <meta name="twitter:card" content="summary_large_image" />

  <!-- Preload critical assets -->
  <link rel="preload" href="/fonts/inter.woff2" as="font" crossorigin />
  <link rel="preconnect" href="https://api.example.com" />

  <title>Page Title</title>
</head>
```

---

## Images

```html
<!-- basic -->
<img src="photo.jpg" alt="Description of image" width="800" height="600" />
<!-- always set width/height → prevents layout shift (CLS) -->
<!-- alt="" for decorative images (screen reader skips) -->

<!-- responsive images -->
<img
  src="small.jpg"
  srcset="small.jpg 480w, medium.jpg 800w, large.jpg 1200w"
  sizes="(max-width: 600px) 480px, (max-width: 1000px) 800px, 1200px"
  alt="Responsive image"
/>

<!-- art direction — different image per breakpoint -->
<picture>
  <source media="(max-width: 600px)" srcset="mobile.jpg" />
  <source media="(max-width: 1000px)" srcset="tablet.jpg" />
  <img src="desktop.jpg" alt="Description" />
</picture>

<!-- lazy load -->
<img src="photo.jpg" alt="..." loading="lazy" />

<!-- modern formats -->
<picture>
  <source srcset="photo.avif" type="image/avif" />
  <source srcset="photo.webp" type="image/webp" />
  <img src="photo.jpg" alt="..." />  <!-- fallback -->
</picture>
```

---

## Audio & Video

```html
<video controls width="640" height="360" poster="thumbnail.jpg">
  <source src="video.mp4" type="video/mp4" />
  <source src="video.webm" type="video/webm" />
  <track kind="subtitles" src="subs.vtt" srclang="en" label="English" />
  Your browser doesn't support video.
</video>

<audio controls>
  <source src="audio.mp3" type="audio/mpeg" />
</audio>

<!-- autoplay requires muted on most browsers -->
<video autoplay muted loop playsinline src="bg.mp4"></video>
```

---

## Data Attributes

Store custom data on elements, read in JS:

```html
<button data-user-id="42" data-action="delete">Delete</button>
```

```js
const btn = document.querySelector('button')
btn.dataset.userId  // "42"
btn.dataset.action  // "delete"
```

Useful for: event delegation, analytics tracking, feature flags.

---

## `<dialog>` (native modal)

```html
<dialog id="modal">
  <h2>Title</h2>
  <p>Content</p>
  <button autofocus onclick="modal.close()">Close</button>
</dialog>

<button onclick="modal.showModal()">Open</button>
```

```css
dialog::backdrop { background: rgba(0,0,0,0.5); }
```

Free: focus trap, ESC to close, backdrop, accessibility. Use over custom modals when possible.

---

## Script Loading

```html
<!-- blocks HTML parsing — BAD for performance -->
<script src="app.js"></script>

<!-- async: downloads in parallel, executes immediately when ready -->
<!-- order NOT guaranteed -->
<script async src="analytics.js"></script>

<!-- defer: downloads in parallel, executes after HTML parsed -->
<!-- order guaranteed — preferred for app scripts -->
<script defer src="app.js"></script>

<!-- module scripts are deferred by default -->
<script type="module" src="app.js"></script>
```

---

## Storage APIs

```js
// localStorage — persists across sessions
localStorage.setItem('key', JSON.stringify(value))
localStorage.getItem('key')   // always string, parse with JSON.parse
localStorage.removeItem('key')
localStorage.clear()

// sessionStorage — cleared when tab closes
sessionStorage.setItem('key', value)

// Cookies — sent with every HTTP request, expiry, domain control
document.cookie = 'name=value; path=/; max-age=3600; Secure; SameSite=Strict'

// IndexedDB — large structured data, async, works offline
// (use a library like idb or Dexie.js in practice)
```

---

## Common Interview Q&A

**Q: `<script>` in `<head>` vs end of `<body>`?**  
End of body (or `defer`) ensures DOM is ready. In `<head>` without `defer`/`async` blocks HTML parsing.

**Q: What is the DOM?**  
Document Object Model — tree of objects representing the HTML. JavaScript manipulates the DOM to update the UI. React abstracts this with the virtual DOM.

**Q: `id` vs `class`?**  
`id` = unique per page, used for `<label for>`, anchor links (`#section`), `document.getElementById`. `class` = reusable, used for styling multiple elements.

**Q: What is `<!DOCTYPE html>`?**  
Tells the browser to use standards mode (HTML5). Without it, browser falls back to quirks mode (legacy IE behavior).

**Q: Difference between `<b>` and `<strong>`?**  
`<b>` = visually bold, no semantic meaning. `<strong>` = important content, screen readers emphasize it.

**Q: What is CORS?**  
Cross-Origin Resource Sharing. Browser blocks requests to a different origin unless the server responds with `Access-Control-Allow-Origin` header. Relevant when your React app (localhost:5173) calls an API (localhost:3000).

**Q: What is `rel="noopener noreferrer"` on links?**  
`noopener` prevents the new tab from accessing `window.opener` (security). `noreferrer` hides the referrer header. Always add to `target="_blank"` links.
```html
<a href="https://external.com" target="_blank" rel="noopener noreferrer">
```
