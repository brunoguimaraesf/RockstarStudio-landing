# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Landing site for Rockstar Studio, a nail art studio in Rio Verde - GO, Brazil. Portuguese-language marketing site: portfolio gallery, artist bio, client types, Instagram feed, location/contact. There is no backend and no CMS; content is maintained in code through `src/constants.ts` and `src/media.ts`.

## Commands

```bash
npm run dev      # start Vite dev server
npm run lint     # run Oxlint (rules: react, typescript, oxc - see .oxlintrc.json)
npm run build    # tsc -b (project references) + vite build, output to dist/
npm run preview  # preview the production build
```

There is no test suite configured in this repo. There is no `typecheck` script; `tsc -b` runs as part of `npm run build`.

## Architecture

**Routes.** `App.tsx` uses `react-router-dom` with `/` for the landing page and `/galeria` for the portfolio gallery. `pages/Index.tsx` composes the home as a flat stack of sections (Hero, Works, ProcessCare, AboutArtist, ClientTypes, Explorations, InstagramFeed, Stats, ContactLocation, Footer). `pages/Gallery.tsx` has its own compact top bar because the main navbar anchors target home sections.

**Gallery content.** The gallery and Works fallback grid are fed by `WORK_IMAGES` in `src/media.ts`. To add or remove portfolio photos, place the asset under `public/images/works/` and update `WORK_IMAGES`.

**Loading gate.** `Index.tsx` holds `isLoading` state; `LoadingScreen` renders until it calls `onComplete`, which flips `Hero`'s `active` prop. Scroll-triggered animations in `Hero` are gated on `active` so they do not run before the loading screen finishes.

**Two animation systems coexist, used for different jobs:**

- **Framer Motion** (`motion`, `whileInView`) - one-shot reveal-on-scroll for section content. Standard pattern: `initial={{opacity:0, y:30}}`, `whileInView={{opacity:1, y:0}}`, `viewport={{once:true, margin:'-100px'}}`.
- **GSAP + ScrollTrigger** - scrubbed, timeline-driven effects tied precisely to scroll position (pinning, staged reveals), used in `Hero.tsx` and `Explorations.tsx`. Wrap GSAP setup in `gsap.context(() => {...}, scopeRef)` inside `useEffect` and call `ctx.revert()` in cleanup.

Both `Hero.tsx` and `Explorations.tsx` implement scripted auto-scroll intro effects that drive `window.scrollTo` via GSAP and temporarily set `document.documentElement.style.scrollBehavior = 'auto'`. Preserve this behavior when editing those files.

**Video.** `HlsVideo.tsx` wraps hls.js. If `src` ends in `.m3u8` and `Hls.isSupported()`, it streams via hls.js; otherwise it sets `video.src` directly.

**Content.** Studio constants live in `src/constants.ts`. Image manifests live in `src/media.ts` and reference files under `public/images/`.

**Styling.** Tailwind with semantic color tokens (`bg`, `surface`, `text-primary`, `muted`, `stroke`) from HSL CSS variables in `src/index.css`, plus fixed brand colors (`purple`, `violet`, `blood`, `kawaii`). `blood` is reserved for booking CTAs. Fonts: `font-body` for body text and `font-display` for headline flourishes.

**Shared components.** Prefer `GlowButton` and `SectionHeader` for new UI. `GlowButton` renders `Link` for internal app routes like `/galeria`, and `<a>` for anchors/external URLs.
