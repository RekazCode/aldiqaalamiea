# Developer Notes — AL-DIQQA AL-LAMI'A Landing Page

## Semantic Structure

```
<header>        — Fixed sticky header (top-bar + nav)
<section#hero>  — Full-viewport hero with CTAs
<section#trust> — Trust bar / value propositions (4 items)
<section#collections> — Collection tiles grid (6 items)
<section#about> — About + certifications + stats
<section#services>    — B2B service cards (4 items)
<section#testimonials> — Testimonial carousel + client logos
<section#contact>     — Lead capture form + contact info
<footer>        — Anchor links + copyright
```

## RTL Implementation Notes

- `<html lang="ar" dir="rtl">` is set on the root element
- All CSS uses logical properties where possible
- Flexbox/Grid naturally handle RTL via `direction: rtl`
- Email and phone inputs use `dir="ltr"` for proper LTR input
- Carousel uses positive `translateX` for RTL sliding direction
- SVG arrow icons in carousel are NOT mirrored (chevrons point correctly for RTL prev/next)
- The modal close button is positioned `left` (which is top-start in RTL)

## Arabic Font Choices

| Token          | Font       | Usage                        |
|----------------|------------|------------------------------|
| `--font-display` | Amiri     | Headlines, section titles, quotes |
| `--font-body`    | Tajawal   | Body text, labels, buttons, UI    |

Both fonts are loaded from Google Fonts with `display=swap`.

**Type Scale (CSS custom properties):**
- `--fs-hero`: clamp(2rem, 5vw, 3.5rem)
- `--fs-h2`: clamp(1.5rem, 3.5vw, 2.25rem)
- `--fs-h3`: clamp(1.125rem, 2vw, 1.375rem)
- `--fs-body`: 1rem (16px base)
- `--fs-body-sm`: 0.875rem
- `--fs-caption`: 0.75rem

## Theme Variants

| Variant | Class on `<html>` | Description |
|---------|-------------------|-------------|
| A (default) | none | Dark luxury: charcoal/black backgrounds, gold accents |
| B | `theme-light` | Light elegant: cream/white backgrounds, gold accents |

Switch by adding/removing `class="theme-light"` on the `<html>` element.

## Dynamic Elements (connect to backend/CMS)

| Element | Selector | Notes |
|---------|----------|-------|
| Collection tiles | `.collection-tile` | Data from `data-modal` attribute; product data in `main.js` `productData` object |
| Testimonials | `.testimonial-card` | Content + carousel auto-adjusts to number of cards |
| Client logos | `.client-logos__item` | Replace placeholder text with `<img>` tags |
| Certificate PDF | `.about__cert-link` | Update `href` to actual PDF URL |
| Contact form | `#contactForm` | Connect `submit` handler to API endpoint |
| Quote form | `#quoteForm` | Connect `submit` handler to API endpoint |
| Logo | `.header__logo-img` | Replace `logo.png` src with actual logo file |

## Image Recommendations

| Image | Recommended Size | Format | Notes |
|-------|-----------------|--------|-------|
| Logo | 280×100px @2x | PNG/SVG | Transparent background |
| Hero background | 1920×1080 | WebP + JPEG fallback | Dark, macro jewelry photo |
| Collection tiles | 600×400 @2x | WebP | Currently CSS gradients as placeholders |
| About section photo | 800×600 @2x | WebP | Workshop or display photo |
| Client logos | 200×80 | SVG preferred | Monochrome versions |
| Testimonial avatars | 96×96 @2x | WebP | Replace letter avatars |

## Lazy Loading

- Add `data-src` attribute to images below the fold
- The `IntersectionObserver` in `main.js` handles swapping `data-src` → `src`
- `rootMargin: '200px'` triggers load 200px before viewport entry
- For hero images: load eagerly (no lazy-load)

## Performance Hints

- **Critical CSS**: Key header + hero styles are inlined in `<head>`
- **Font loading**: `display=swap` prevents FOIT
- **Animations**: Use `will-change` sparingly; CSS transitions use GPU-friendly `transform` + `opacity`
- **Scroll handler**: Uses `{ passive: true }` for scroll performance
- **Resize handler**: Debounced at 250ms
- **Target**: < 3s LCP on 3G, < 100ms CLS

## Interaction Specifications

### Sticky Header
- Scroll > 80px → top bar collapses (height: 0), nav bar shrinks (72px → 56px)
- Smooth transition (300ms ease-out)
- Active nav link highlighted based on visible section

### Modals
- **Quote Modal**: Triggered by "اطلب عرض سعر" button in hero
- **Product Quick-View**: Triggered by clicking any collection tile
- Both: backdrop blur, ESC to close, focus trap on first input
- Transition: fade in + translateY(20px → 0)

### Carousel
- Touch/swipe not implemented (add Hammer.js if needed)
- Dot navigation + prev/next buttons
- Slides per view: 1 (mobile), 2 (tablet), 3 (desktop)
- Auto-rebuild on resize

### FAB Phone Button
- Visible on mobile/tablet only (< 1024px)
- Fixed bottom-left (left in RTL = visual right)
- Pulse animation ring effect
- Links to `tel:0924767353`

## Accessibility Checklist
- [x] `lang="ar"` and `dir="rtl"` on root
- [x] WCAG contrast targets (gold on dark passes AA for large text)
- [x] `:focus-visible` outlines on all interactive elements
- [x] `aria-label` on icon-only buttons
- [x] `role="dialog"` + `aria-modal="true"` on modals
- [x] `aria-expanded` on hamburger toggle
- [x] Collection tiles have `tabindex="0"` and `role="button"`
- [x] Form labels linked to inputs via `for`/`id`
- [x] Keyboard: Enter/Space triggers tile click, ESC closes modals

## File Structure

```
aldeqa/
├── index.html          # Single-page landing (all sections)
├── css/
│   └── styles.css      # Full responsive stylesheet with tokens
├── js/
│   └── main.js         # Interactions, modals, carousel, forms
└── docs/
    ├── arabic-copy.txt # All Arabic text content
    └── dev-notes.md    # This file
```
