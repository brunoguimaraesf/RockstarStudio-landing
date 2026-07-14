# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Landing site for Rockstar Studio, a nail art studio in Rio Verde - GO, Brazil. Portuguese-language marketing site: portfolio gallery, artist bio, client types, Instagram feed, location/contact. There is no backend of our own. Gallery photos can be served by Sanity (runtime fetch from its CDN, optional — see `docs/CMS-SETUP.md`); all other content, plus the gallery's permanent fallback, is maintained in code through `src/constants.ts` and `src/media.ts`.

## Commands

```bash
npm run dev      # start Vite dev server
npm run lint     # run Oxlint (rules: react, typescript, oxc - see .oxlintrc.json)
npm run build    # tsc -b (project references) + vite build, output to dist/
npm run preview  # preview the production build
```

There is no test suite configured in this repo. There is no `typecheck` script; `tsc -b` runs as part of `npm run build`.

Sanity Studio (separate npm project in `studio/`, requires its own `npm install`):

```bash
cd studio
npm run dev      # panel at http://localhost:3333 (needs real projectId in studio/env.ts)
npm run deploy   # publish panel to https://<hostname>.sanity.studio
```

One-shot photo migration (PowerShell, needs a write token — see docs/CMS-SETUP.md §6):

```powershell
$env:SANITY_PROJECT_ID="..."; $env:SANITY_TOKEN="..."; node scripts/migrate-to-sanity.mjs
```

**Encoding gotcha:** save files in this repo without a UTF-8 BOM. PowerShell 5.1's `Out-File`/`Set-Content` write a BOM by default, and the Sanity CLI crashes parsing a BOM'd `studio/package.json` (this happened once — fixed in `a740230`).

## Architecture

**Routes.** `App.tsx` uses `react-router-dom` with `/` for the landing page, `/galeria` for the portfolio gallery and `/loja` for the press-on shop (both lazy-loaded via `React.lazy`). `pages/Index.tsx` composes the home as a flat stack of sections (Hero, Works, ProcessCare, AboutArtist, ClientTypes, Explorations, InstagramFeed, Stats, ContactLocation, Footer). `pages/Gallery.tsx` and `pages/Shop.tsx` have their own compact top bars because the main navbar anchors target home sections.

**Gallery content.** `pages/Gallery.tsx` calls `usePhotos()` (`src/lib/usePhotos.ts`), which wraps the fetch-based Sanity GROQ client in `src/lib/sanity.ts`. Contract: `undefined` = loading (skeleton grid), `null` or empty = CMS unavailable/not configured (falls back to `WORK_IMAGES` from `src/media.ts`), non-empty array = CMS photos. Photos with `featured: true` form a synthetic "Destaques" category shown first. The CMS is enabled by `VITE_SANITY_PROJECT_ID` (build-time env var — production needs it set on the host plus a redeploy). The Sanity project id is also hardcoded in `vercel.json` (the `/foto/*` rewrite) and `studio/env.ts` — if the Sanity project ever changes, update all three places. The home's Works section is static (editorial cards linking to `/galeria?categoria=...`) and does not consume the CMS — to change the home's featured photos, edit the `FEATURED` array at the top of `src/components/Works.tsx` (each card: `title`, `image` under `public/images/works/`, handcrafted `gradient`, `tags`). The Sanity Studio lives in `studio/` (separate npm project, outside the site build); `scripts/migrate-to-sanity.mjs` is the one-shot upload of the original photos; setup steps are in `docs/CMS-SETUP.md` and the owner's manual in `docs/GUIA-DA-DONA.md`. To change the fallback photos, edit `WORK_IMAGES` and `public/images/works/`.

**Shop (press-on).** `pages/Shop.tsx` sells press-on nail kits with a WhatsApp checkout — no payment gateway, no backend. Products come exclusively from Sanity (`product` schema in `studio/schemaTypes/product.ts`) via `useProducts()` (`src/lib/useProducts.ts`), same contract as `usePhotos` but with no static fallback: `null`/empty renders a "catálogo indisponível" box pointing to WhatsApp. Cart state lives in `src/lib/cart.tsx` (`CartProvider` + `useCart`), provided inside the Shop page only; it is in-memory only — persistence was removed in `0255c4e`, and the provider clears the legacy `rockstar-cart` localStorage key on mount. Checkout builds the order message and opens `https://wa.me/${WHATSAPP_PHONE}?text=...`; while `WHATSAPP_PHONE` (`src/constants.ts`) is empty, it falls back to copying the message to the clipboard and opening `WHATSAPP_URL` (the business short-link, which cannot pre-fill text).

**Loading gate.** `Index.tsx` holds `isLoading` state; `LoadingScreen` renders until it calls `onComplete`, which flips `Hero`'s `active` prop. Scroll-triggered animations in `Hero` are gated on `active` so they do not run before the loading screen finishes.

**Two animation systems coexist, used for different jobs:**

- **Framer Motion** - one-shot reveal-on-scroll for section content. The app is wrapped in `<LazyMotion features={domAnimation} strict>` (App.tsx), so components must use the lightweight `m.*` instead of `motion.*` (strict mode throws otherwise). Standard pattern: `initial={{opacity:0, y:30}}`, `whileInView={{opacity:1, y:0}}`, `viewport={{once:true, margin:'-100px'}}`. `layout`/`drag` props would require upgrading features to `domMax`.
- **GSAP + ScrollTrigger** - scrubbed, timeline-driven effects tied precisely to scroll position (pinning, staged reveals), used in `Hero.tsx` and `Explorations.tsx`. Wrap GSAP setup in `gsap.context(() => {...}, scopeRef)` inside `useEffect` and call `ctx.revert()` in cleanup.

Both `Hero.tsx` and `Explorations.tsx` implement scripted auto-scroll intro effects that drive `window.scrollTo` via GSAP and temporarily set `document.documentElement.style.scrollBehavior = 'auto'`. Preserve this behavior when editing those files.

**Video.** `HlsVideo.tsx` wraps hls.js behind a dynamic `import()` — the hls.js chunk only loads when `src` ends in `.m3u8` (today the hero uses a plain `.mp4`, so it never loads). Keep the dynamic import when editing.

**Content.** Studio constants live in `src/constants.ts`. Image manifests live in `src/media.ts` and reference files under `public/images/`.

**Styling.** Tailwind with semantic color tokens (`bg`, `surface`, `text-primary`, `muted`, `stroke`) from HSL CSS variables in `src/index.css`, plus fixed brand colors (`purple`, `violet`, `blood`, `kawaii`). `blood` is reserved for booking CTAs. Fonts: `font-body` for body text and `font-display` for headline flourishes.

**Shared components.** Prefer `GlowButton` and `SectionHeader` for new UI. `GlowButton` renders `Link` for internal app routes like `/galeria`, and `<a>` for anchors/external URLs.
