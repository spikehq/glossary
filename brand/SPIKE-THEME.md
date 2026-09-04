# The Spike Theme

**One theme, everywhere.** This is the central design contract for anything that
carries the Spike name — the dashboard, the marketing site, docs, the terms
glossary, status pages, one-off landing pages. When someone lands on any of
these, it should read as **Spike first, page second**.

- **`spike-theme.css`** (next door) — the portable, framework-agnostic token
  file. `@import` it and consume the CSS variables. No Tailwind or shadcn
  required; the variable names mirror them 1:1 so a plain marketing page and the
  React dashboard stay in lockstep.
- **This file** — the human spec: what the tokens mean, when to use each, and the
  non-obvious rules (why the primary button isn't blue, how status colors work).

> **Source of truth:** the dashboard's `src/index.css`. If a value here and there
> ever disagree, the dashboard wins — then update both. The dashboard's deeper
> internal docs live in `docs/knowledge-base/design-system.md`.

---

## The one-paragraph version

Spike is **clean, modern, restrained**. Built on **shadcn/ui** (new-york style,
zinc base) + **Tailwind v4**. A page is a **warm off-white canvas** (`#fcfbf9`)
with **white cards floating on it** — never raw content on the canvas. Headings
are **Instrument Sans**, body is **Inter**, code is **Geist Mono**. The signature
color is **Spike Blue `#134ED9`**, reserved for real calls-to-action and the logo
— *not* sprayed across every button. Corners are generously **rounded** (cards at
14px). Motion is **subtle** (~120ms hovers, ~180ms reveals) and always respects
reduced-motion. Full dark mode via a `.dark` class.

---

## 1. The stack (what we build with)

| Concern | Choice |
|---|---|
| Component library / aesthetic reference | **shadcn/ui** — new-york style, zinc base |
| CSS framework | **Tailwind CSS v4** (utility-first; tokens exposed as CSS vars) |
| Icons | **Lucide** via `react-icons/lu` (e.g. `LuPlus`, `LuX`). Brand logos via `react-icons/si` (`SiSlack`) |
| Fonts | Self-hosted variable fonts via `@fontsource-variable/*` (Inter, Instrument Sans, Geist Mono) — no font CDN |
| Toasts | **Sonner** (bottom-right) |
| Data / calendar / date pickers | **shadcn** (Calendar + Popover) — never a third-party datepicker |
| Command palette | **cmdk** (via shadcn Command) |
| App framework (dashboard) | React 19 + Vite + React Router v7 + TanStack Query + Zustand |

**On a marketing site you don't need React or shadcn** — you need the *tokens* and
the *rules*. Use `spike-theme.css`, keep the fonts, keep the color discipline, and
it'll feel like Spike. If the marketing site *is* React, prefer shadcn components
so the two codebases share muscle memory.

---

## 2. Color

Colors are **oklch-based** with light + dark variants, exposed as CSS variables.
**Always consume the semantic token** (`--card`, `--muted-foreground`,
`--border`) — never hardcode a hex, with exactly two exceptions: the brand blue
and brand black.

### Brand colors — the only hex you type by hand

| Name | Value | Token | Use |
|---|---|---|---|
| **Spike Blue** | `#134ED9` | `--spike-blue` | Primary CTAs, the logo mark, brand accents |
| Spike Blue (hover) | `#1042B8` | `--spike-blue-hover` | Hover/active of a blue CTA (~12% darker) |
| **Spike Black** | `#161618` | `--spike-black` | Heading text (light mode), the dark-mode canvas, logo fill in dark mode |

### ⚠️ The most important color rule

**The primary button is NOT blue.** `--primary` is a neutral near-black. Spike
Blue is deliberately *not* wired to `--primary` so that ordinary buttons don't
repaint the whole app blue. **Blue is a scarce resource — spend it on the one
action you want clicked** (the hero CTA, "Get started", "Create incident"). This
restraint is a big part of why Spike looks considered rather than loud.

### Core semantic tokens

| Token | Light | Dark | What it's for |
|---|---|---|---|
| `--background` | `#fcfbf9` warm off-white | `#161618` spike black | The page canvas |
| `--foreground` | near-black | near-white | Body text |
| `--heading-foreground` | `#161618` | near-white | Headings (richer than body) |
| `--card` | white | lifted dark gray | The elevated surface |
| `--primary` | near-black | near-white | Default (non-brand) primary buttons |
| `--secondary` / `--muted` / `--accent` | light gray `oklch(0.97)` | dark gray `oklch(0.269)` | Fills, hover tints |
| `--muted-foreground` | mid gray | light gray | Descriptions, helper text, meta |
| `--destructive` | red | brighter red | Danger / delete |
| `--border` | light gray | white @ 10% | Hairlines, card edges |
| `--ring` | gray | gray | Keyboard focus ring |

> Every oklch value in `spike-theme.css` carries an `approx hex` comment for
> tooling that can't handle oklch (email, some CMSes).

### The card-on-canvas model (fundamental)

The whole visual language is **a tinted canvas with white cards floating on it**,
each card with its own border + soft shadow so the page reads as *layered, not
flat*. Never put raw content directly on the canvas — wrap it in a card.

- Card = `border + bg-card + rounded-xl (14px) + shadow-sm`, `24px` padding,
  `24px` internal gap. (`.spike-card` in the CSS gives you this.)
- Page container = centered, `max-width: 72rem` (1152px), `16px` padding on
  mobile → `24px` on `sm+`.

### Status, priority & severity — the shared state vocabulary

Anywhere you show incident state — dashboard, status page, a screenshot in
marketing, an example pill in the glossary — use **these exact tones**. Each is a
soft-tinted pill: `1px` border at 40% alpha, background at 10% alpha, colored
text (a darker shade in light mode, a lighter shade in dark mode).

| Meaning | Tone |
|---|---|
| **Triggered** (incident fired) | **red** |
| **Acknowledged** | **blue** |
| **Resolved** | **green** |
| Priority `P1` / `P2` / `P3` / `P4`–`P5` | red / orange / blue / zinc |
| Severity `SEV1` / `SEV2` / `SEV3` | red / orange / yellow |
| Notes / waiting / active timer | amber |
| Muted / neutral / system | zinc |

Exact hex per tone is in `spike-theme.css` (`--tone-*`). Pills are `inline-flex`,
`rounded-full`, `12px` / 500 weight, with an optional `6px` `currentColor` dot.

**Accessibility rule:** color is *never* the only signal. A pill always pairs its
color with text (and often an icon), so it's legible to colorblind users and
survives grayscale.

---

## 3. Typography

Three self-hosted variable fonts. **Headings get Instrument Sans automatically** —
you never add a font class to a heading; just use the right `<h1>`–`<h6>`.

| Role | Family | Token | Applied to |
|---|---|---|---|
| **Headings** | Instrument Sans | `--font-heading` | every `h1`–`h6`, card & dialog titles |
| **Body** | Inter | `--font-sans` | all running text, labels, inputs, `<kbd>` |
| **Mono** | Geist Mono | `--font-mono` | code, payloads, IDs, tabular timestamps |

### Type scale (app)

| Level | Size / weight | Use |
|---|---|---|
| Page title (`h1`) | **24px / 600** | the one top-of-page title per route |
| Section sub-heading (`h2`) | 20px / 500 | a heading *under* the page title (lighter on purpose) |
| Section heading (`h2`) | 18px / 600 | standalone section on a settings/detail page |
| Card / small heading (`h3`) | 16px / 600 | card titles, empty-state titles |
| Compact heading (`h3`) | 14px / 600 | dense cards, settings rows |
| Body | 14px (dense) / 16px (reading) / 400 | running copy |
| Secondary / muted | 14px, `--muted-foreground` | descriptions, helper text |
| Label | 14px / 500 | form labels |
| Timestamp / meta | 12px, `--muted-foreground` | |

**Marketing can go bigger** — `--text-3xl/4xl/5xl` (30/36/48px) exist for display
and hero copy, and `font-bold` (700) is fair game for a hero headline. Inside the
*app*, reserve 700 for rare display moments (404).

- **Weights:** headings live at **500** or **600**. Body **400**, emphasis/labels **500**.
- **Tracking:** no manual letter-spacing on standard headings. The one exception
  is small all-caps eyebrow labels: `12px`, 500, uppercase, `tracking-wide`, muted.
- **Leading:** headings `leading-none`; long body / marketing paragraphs `leading-relaxed`.

---

## 4. Radius

We like rounded corners — lean into them. Base `--radius: 10px`, with a scale:

| Token | Size | Used for |
|---|---|---|
| `--radius-sm` | 6px | small chips, `<kbd>` |
| `--radius-md` | 8px | inputs, buttons, dropdown items |
| `--radius-lg` | 10px | popovers, switchers (the base) |
| `--radius-xl` | 14px | **cards** |
| `--radius-full` | 9999px | avatars, pills, status dots, hover-pill links |

When in doubt, match the nearest shipped component.

---

## 5. Spacing

We use the **Tailwind default 4px scale** — no custom spacing system. The tokens
in `spike-theme.css` (`--space-1` … `--space-24`) map to it. The load-bearing
values in practice:

- **Card padding & internal gap:** `24px` (`--space-6`).
- **Page padding:** `16px` mobile → `24px` on `sm+`.
- **Page content cap:** `max-width: 72rem` (1152px), centered.
- **Marketing section rhythm:** `48px` (tight) to `96px` (generous) vertical.

---

## 6. Elevation & motion

- **Shadows:** `--shadow-xs` for buttons/small lifts, `--shadow-sm` for cards.
  Keep shadows soft; the border does most of the "edge" work.
- **Motion tokens:** hovers ~**120ms** `ease-out`; entrances/reveals
  ~**150–200ms** `ease-out` (e.g. a subtle ~0.3s staggered list reveal). Keep it
  subtle — motion should feel alive, not busy.
- **Always honor `prefers-reduced-motion`** — gate non-essential animation behind
  it. `spike-theme.css` ships a reduced-motion kill-switch you can keep or drop.

---

## 7. Components & affordances (the app conventions)

These are dashboard rules; a marketing site can borrow the spirit without every
detail.

- **Buttons:** reach for shadcn `<Button>` / `<ButtonGroup>` first — focus rings,
  disabled state, sizes, variants, press transition come free. Brand CTA = the
  `ctaBlue` helper (`bg-spike-blue text-white hover:bg-spike-blue-hover`), often
  with an arrow that slides right on hover.
- **Icons:** Lucide only (`react-icons/lu`). Delete/remove is **always** a cross
  (`LuX`). Brand logos from `react-icons/si` or the local `BrandIcons`.
- **Keyboard shortcuts are visible:** every shortcut shows its binding via `<Kbd>`
  next to the action (or inside its tooltip). No invisible shortcuts.
- **Tooltips generously:** explain icon actions and carry shortcuts. Default
  `side="bottom"`.
- **Links:** interactive rows/links get a **pill-shaped hover tint**
  (`rounded-full`/`rounded-md` + `hover:bg-accent`).
- **Loading = shadcn `Skeleton`** shaped like the content — not a centered spinner.
- **Empty / error states:** shared `EmptyState` (illustration → title →
  description → CTA) and `QueryErrorState` (message + Retry).
- **Toasts = Sonner**, bottom-right, neutral by default, **error tone for
  destructive/failed** actions.
- **Focus-visible ring on everything** — `2px` ring in `--ring` with a 2px
  offset. Never suppress it for mouse parity.

### The keyboard model (app is keyboard-first)

| Keys | Action |
|---|---|
| `↑` `↓` | Move the active row in any list |
| `Enter` | Open the active row |
| `X` | Select / deselect the active row |
| `⌘A` | Select all (multi-select) |
| `N` | New `<entity>` for the current page (button shows `N`) |
| `⌘⌫` | Delete/archive the active entity → confirm dialog |
| `Enter` / `⌘Enter` | In a confirm dialog: `Enter` archives, `⌘Enter` deletes |
| `⌘K` | Command palette — navigate anywhere + curated actions |
| `F` | Toggle filters |
| `[` | Collapse / expand the sidebar |
| `⌘Enter` | Submit a form (shown on the submit button) |

---

## 8. Dark mode

Add `class="dark"` high in the tree (`<html>` or `<body>`) and every token flips.
The dark canvas **is** the brand black `#161618`, with cards lifted above it in a
slightly lighter gray. Borders become white at 10% alpha. Test both — a Spike
surface should look intentional in either appearance.

---

## 9. Quick-start for a new (marketing) page

```html
<link rel="stylesheet" href="spike-theme.css" />
<!-- Load the three fonts (self-host via @fontsource-variable, or the CDN of
     your choice for a standalone page): Inter, Instrument Sans, Geist Mono -->

<body>
  <main style="max-width: var(--container-max); margin-inline: auto; padding: var(--space-6);">
    <h1>Glossary</h1>
    <p style="color: var(--muted-foreground);">Every term, defined.</p>

    <article class="spike-card">
      <h3>Acknowledgement</h3>
      <p>When a responder confirms they're handling an incident…</p>
      <span class="spike-pill" style="
        border-color: var(--tone-blue-border);
        background: var(--tone-blue-bg);
        color: var(--tone-blue-fg);">Acknowledged</span>
    </article>

    <a class="spike-cta spike-focusable" href="/signup">Get started →</a>
  </main>
</body>
```

That page will already read as Spike: warm canvas, white card, Instrument Sans
heading, Inter body, one blue CTA, a status pill in the shared vocabulary.

---

## 10. Do / Don't

**Do**
- Consume semantic tokens (`--card`, `--muted-foreground`) — not raw hex.
- Wrap content in cards on a tinted canvas.
- Spend Spike Blue on *the* action; leave the rest neutral.
- Round corners; keep motion subtle; support dark mode.
- Pair every status color with text (never color alone).

**Don't**
- Wire Spike Blue to `--primary` / make every button blue.
- Introduce a different icon set, datepicker, or font.
- Put raw content on the canvas with no card.
- Hardcode grays instead of the neutral tokens.
- Ship a color-only signal (fails accessibility).

---

_Keep this file and `spike-theme.css` in sync with the dashboard's
`src/index.css` whenever a token, color, or convention changes._
