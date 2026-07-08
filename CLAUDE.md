# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Landing site for Rockstar Studio, a nail art studio in Rio Verde - GO, Brazil. Portuguese-language marketing site: portfolio gallery, artist bio, client types, Instagram feed, location/contact. The public site is a Vite/React app. Portfolio photos can be managed by Sanity CMS, with hardcoded fallback content in `src/media.ts` so the site remains functional without CMS configuration.

## Commands

```bash
npm run dev      # start Vite dev server
npm run lint     # run Oxlint (rules: react, typescript, oxc - see .oxlintrc.json)
npm run build    # tsc -b (project references) + vite build, output to dist/
npm run preview  # preview the production build
```

There is no test suite configured in this repo. There is no `typecheck` script; `tsc -b` runs as part of `npm run build`.

## Architecture

**Routes.** `App.tsx` uses `react-router-dom` with `/` for the landing page and `/galeria` for the full portfolio gallery. `pages/Index.tsx` composes the home as a flat stack of sections (Hero, Works, ProcessCare, AboutArtist, ClientTypes, Explorations, InstagramFeed, Stats, ContactLocation, Footer). `pages/Gallery.tsx` has its own compact top bar because the main navbar anchors target home sections.

**CMS contract.** `src/lib/sanity.ts` is a minimal GROQ HTTP client against Sanity's CDN. It intentionally does not use the Sanity SDK in the public site. `src/lib/usePhotos.ts` returns:

- `undefined`: loading
- `null`: CMS unavailable or not configured, use local fallback
- `[]`: CMS configured but no photos published
- `GalleryPhoto[]`: photos from Sanity

`Works.tsx` uses photos marked `featured` for the home grid when available and falls back to `WORK_IMAGES`. `/galeria` shows all CMS photos with category pills and falls back to `WORK_IMAGES` if the CMS is unavailable.

**Sanity Studio.** `studio/` is a separate Sanity Studio project with two schemas: `photo` and `category`. It is outside the root TypeScript build. Configure `studio/env.ts`, install dependencies inside `studio/`, and deploy with `npm run deploy`. Setup steps live in `docs/CMS-SETUP.md`.

**Migration.** `scripts/migrate-to-sanity.mjs` uploads the current `public/images/works/` files to Sanity and creates category/photo documents. It requires `SANITY_PROJECT_ID`, optional `SANITY_DATASET`, and `SANITY_TOKEN` in the environment.

**Loading gate.** `Index.tsx` holds `isLoading` state; `LoadingScreen` renders until it calls `onComplete`, which flips `Hero`'s `active` prop. Scroll-triggered animations in `Hero` are gated on `active` so they do not run before the loading screen finishes.

**Two animation systems coexist, used for different jobs:**

- **Framer Motion** (`motion`, `whileInView`) - one-shot reveal-on-scroll for section content. Standard pattern: `initial={{opacity:0, y:30}}`, `whileInView={{opacity:1, y:0}}`, `viewport={{once:true, margin:'-100px'}}`.
- **GSAP + ScrollTrigger** - scrubbed, timeline-driven effects tied precisely to scroll position (pinning, staged reveals), used in `Hero.tsx` and `Explorations.tsx`. Wrap GSAP setup in `gsap.context(() => {...}, scopeRef)` inside `useEffect` and call `ctx.revert()` in cleanup.

Both `Hero.tsx` and `Explorations.tsx` implement scripted auto-scroll intro effects that drive `window.scrollTo` via GSAP and temporarily set `document.documentElement.style.scrollBehavior = 'auto'`. Preserve this behavior when editing those files.

**Video.** `HlsVideo.tsx` wraps hls.js. If `src` ends in `.m3u8` and `Hls.isSupported()`, it streams via hls.js; otherwise it sets `video.src` directly.

**Content.** Studio constants live in `src/constants.ts`. Fallback image manifests live in `src/media.ts`. Sanity-managed portfolio images should not replace the fallback; the fallback is part of the resilience design.

**Styling.** Tailwind with semantic color tokens (`bg`, `surface`, `text-primary`, `muted`, `stroke`) from HSL CSS variables in `src/index.css`, plus fixed brand colors (`purple`, `violet`, `blood`, `kawaii`). `blood` is reserved for booking CTAs. Fonts: `font-body` for body text and `font-display` for headline flourishes.

**Shared components.** Prefer `GlowButton` and `SectionHeader` for new UI. `GlowButton` renders `Link` for internal app routes like `/galeria`, and `<a>` for anchors/external URLs.
