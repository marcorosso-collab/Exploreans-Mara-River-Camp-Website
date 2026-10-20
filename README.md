# mara.exploreans.com

The website for **Exploreans Mara River Camp**, built to the **Exploreans Brand Bible v1.0 (October 2026)**.
Astro 7, React islands for a few interactive moments, Sveltia CMS, GitHub and Netlify. It shares its
design system with [exploreans.com](https://exploreans.com) (`marcorosso-collab/Exploreans-Brand-Site`).

## Pages

| Route | What it is |
|---|---|
| `/` | The place page, in the bible's order: hero film, what you will live, a day at the camp, the five families, the people, rooms and spaces, what to expect, the Passport, plan your journey |
| `/stay/` and `/stay/[slug]/` | River tents, bush tents and Simba's Den, with galleries and facts |
| `/experiences/` and `/experiences/[slug]/` | Every experience, filterable by family (`?family=taste`), each described the bible's way |
| `/passport/` | The Exploreans Passport as a book you can turn, the rewards and the Travel Journal |
| `/stories/` and `/stories/[slug]/` | Stories from the river (Markdown) |
| `/plan-your-stay/` | Direct booking, the enquiry form, getting there, the river month by month, what to expect, questions |

Old addresses (`/accommodation/*`, `/journal/*`, `/contact`, the old experience slugs) redirect in `netlify.toml`.

## Local development

```bash
npm install
npm run dev      # http://localhost:4321
npm run check    # type check
npm run build    # production build into dist/
```

Node 22.12 or later (set in `netlify.toml`).

## Brand system in code

- **Tokens** (`src/styles/tokens.css`): the core palette, functional tints, the five type colours, type scale, spacing and grid. `--place` is Safari Green for the whole site: it carries the place name, accents, the Passport and its stamps.
- **Type**: Georgia and Calibri, falling back to the metric-matched Gelasio and Carlito (self-hosted).
- **Wordmark and lockup** (`Wordmark.astro`, `Lockup.astro`): master artwork paths, never redrawn or animated. The lockup sets MARA RIVER CAMP in Calibri capitals under the wordmark.
- **The compact header** (`Nav.astro`): the lockup at the top of every page; past the first screen the header shortens and the hippo place mark crossfades in over 300 ms.
- **Stamps and the place mark** (`public/stamps/`, `Stamp.astro`): master artwork used as CSS masks. The place mark appears only in the compact header and Passport contexts. The twelve `mara-*.png` stamps are lifted from the draft Mara River Camp Passport (October 2026); swap the files when the final artwork is approved.
- **The Mara page reward**: one stamp in each of the five families completes the page.
- **Map line** (`src/lib/contours.ts`, served at `/map/a.svg`, `/b.svg`, `/c.svg`): contour lines generated at build time.

## Motion and React Bits Pro

Site-wide motion is GSAP, ScrollTrigger and Lenis (`src/scripts/motion.ts`): slow fades, ink-like reveals, parallax only on hero media, no bounce. Everything collapses to a still page under `prefers-reduced-motion`.

Five React Bits Pro components (`src/components/react-bits/`, installed with the shadcn CLI, `-css` variants) are used as islands, restyled to brand tokens and slowed to brand timings:

| Component | Where | Island |
|---|---|---|
| Hover Preview | Home, "What you will live": the photographed words | `islands/StoryHover.tsx` |
| Loupe Image | Home, "Look closer at the river" | `islands/LookCloser.tsx` |
| Page Flip | `/passport/`: the Passport book (edited to take HTML pages and controlled turns) | `islands/PassportBook.tsx` |
| Scroll Mask | `/stay/`: the iris opening onto the river | `islands/StayReveal.tsx` |
| Dappled Light | `/stay/`, "Between the drives": shade moving over Linen (larger screens only) | `islands/WithinShade.tsx` |

To add more: put `REACTBITS_LICENSE_KEY` in your environment (never commit it) and run
`npx shadcn@latest add @reactbits-starter/<slug>-css`. The registries are in `components.json`.

## Booking and enquiries

- **Direct booking**: `BookingForm.astro` sends arrival, departure, adults and children's ages straight to Simplebooking (`in`, `out`, `guests=A,A,8`). Every booking click fires `booking_click` (with `placement`) into the GTM `dataLayer`.
- **The Passport wishlist**: guests mark experiences they would like to collect (`src/scripts/passport.ts`, stored in the browser only). The picks travel with the enquiry in the `experiences` field.
- **Netlify Forms**: `contact` (the enquiry, same name and fields as before plus `room`, `guests` and `experiences`) and `newsletter` (footer). Both submit in place with JavaScript and fall back to `/thank-you/`.

## Content and the CMS

All copy lives in `src/content/` and is editable at `/admin` (Sveltia CMS, GitHub backend):

- `settings/site.json`: contacts, booking engine, navigation, newsletter
- `pages/*.json`: one file per page (home, stay, experiences, passport, stories, plan)
- `stay/*.md`: the rooms
- `experiences/*.md`: name, family, stamp, led by, when, where, what you will live, good to know, rates and fees paid on top. Tick **With every stay** for experiences included at no charge. Rates show with a note that they are in US dollars and subject to change
- `stories/*.md`: stories; set `canonical` for stories first published on exploreans.com

### Photography

Processed photography is in `public/images/places/mara-river-camp/`, named `place-family-subject-number`, as `name.webp` (1920 px) plus `name-960.webp`. `Img.astro` picks up the small variant and reads real dimensions to prevent layout shift. CMS uploads go to `public/images/uploads/` and are converted to WebP at 1920 px.

## Before publishing anything new

Run the brand checklist in chapter 08 of the bible: experience first, at least one pillar visible, a qualified person named, both directions of the brand idea, master artwork only, core palette plus Safari Green, Georgia and Calibri in sentence case, positive description, no star ratings or luxury vocabulary, British English, no dashes as punctuation.
