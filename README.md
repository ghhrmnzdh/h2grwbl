# How to Get Rich (without getting lucky)

An interactive, **two-colour risograph** reading of Naval Ravikant's 38-part 2018
tweetstorm on building wealth. Cream stock, crimson spot ink, warm-black body —
set in big **Fraunces** with printer's crop marks, halftone, paper grain, and the
occasional overprint misregistration. It reads like a printed zine, not a landing page.

Built as a **static site** with no server — one build deploys to Vercel or GitHub Pages.

## The reading

A seven-act descent through the thread, each idea with its own printed spread and,
where a number *is* the argument, one meaningful interaction:

- **Hero** — the title overprinted in two colours, kinetic ink-stamp reveal.
- **I · Wealth vs Money vs Status** — three lanes; wealth keeps stamping coins while you stop, money drains, status is a zero-sum see-saw.
- **II · The Long Game** — a crimson compound-interest curve you scrub; the last decade dwarfs the first.
- **III · Specific Knowledge** — an editorial spread with a poster-size pull-quote.
- **IV · The Four Leverages** — a 2×2 that ignites; permissionless cells (code / media) fill crimson and replicate at zero marginal cost.
- **V–VI** — the foundational disciplines + an hourly-rate decision ledger.
- **The Wealth Equation** — `Knowledge × Accountability × Leverage`, with live sliders proving the factors **multiply** (any near-zero factor collapses the product).
- **VII · The Payoff** + the full 38-principle index and the four-kinds-of-luck appendix.

## Tech

- [Vite](https://vitejs.dev/) — vanilla JS, no framework
- [GSAP](https://gsap.com/) — ScrollTrigger + SplitText (free since 2025)
- [Lenis](https://lenis.darkroom.engineering/) — smooth scroll, one shared ticker
- Self-hosted fonts via `@fontsource` — **Fraunces**, **Space Grotesk**, **Space Mono** (no external requests)

Motion is deliberately sparse — ink-stamp reveals plus the four data visualizations,
which encode ideas rather than decorate. `prefers-reduced-motion` is a first-class
branch (skips smooth scroll, freezes canvases on labelled static frames, keeps sliders
usable); the leverage quadrant is keyboard-navigable; all narrative text is real DOM.

## Develop

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # → dist/
npm run preview    # serve the production build
```

## Deploy

`base: './'` (relative asset URLs) means the same `dist/` works from a domain root
or a project subpath — no per-target config.

- **Vercel** — import the repo; Vite is auto-detected (`vercel.json` included).
- **GitHub Pages** — push to `main`; `.github/workflows/deploy.yml` builds and publishes `dist/`. Enable **Settings → Pages → Source: GitHub Actions** once.

> Social preview uses a relative `og:image` (`./og.png`). On a custom domain, swap it
> for the absolute URL in `index.html` so scrapers that require absolute URLs resolve it.

## Structure

```
index.html                 # all narrative content (SEO / no-JS resilient)
src/
  main.js                  # bootstrap: Lenis, ink-stamp reveals, preloader, lazy viz init
  lib/motion.js            # GSAP registration, easings, reveal observer
  data/principles.js       # the verbatim 38 principles + acts + luck ladder
  sections/                # threeLane · compoundCurve · leverageQuadrant · wealthEquation
  styles/                  # tokens · base · sections
public/                    # favicon, og.png, apple-touch-icon, 404.html
```

## Credits

Words are **Naval Ravikant's** — the May 2018 thread, cross-checked against *The
Almanack of Naval Ravikant* (Eric Jorgenson, 2020) and [nav.al/rich](https://nav.al/rich).
An independent interpretation; not affiliated with or endorsed by Naval Ravikant.
