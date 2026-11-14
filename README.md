# RANGS Properties — Homepage revamp

Next.js 16 (App Router) + Tailwind CSS 4 + GSAP/ScrollTrigger + Lenis, built from the Figma file
"RANGS Properties Limited → Web UI v1.0 → Desktop".

```bash
npm install
npm run dev     # http://localhost:3000
npm run build && npm start
```

## Sections

| Section | Component | Figma node | Motion reference (Figma annotation) |
| --- | --- | --- | --- |
| Header + menu | `components/Header.tsx` | button variants `Btn`, `Frame 2`, `Residential`, `Commercial` | letter-wave hover |
| Hero + Explore Possibilities | `sections/Hero.tsx` | `21039:1404` | obsidianassembly.com |
| Mosaic → project slider | `sections/Projects.tsx` | `Commercial` variants 1–5 | pyzhevsky.estate/spaces |
| More Than Spaces | `sections/About.tsx` | `21115:719` | |
| Stats strip | `sections/Stats.tsx` | `slider auto` | air.pro |
| Why us | `sections/WhyUs.tsx` | `Why us` variants 1–3 | springs.estate/design |
| Project map | _not built yet_ | `21039:1580` | planned for a later phase |
| Gallery | `sections/Gallery.tsx` | `Gallery 4` variants 1–3 | pyzhevsky.estate/spaces |
| Testimonials | `sections/Stories.tsx` | `21088:3336` | |
| News | `sections/News.tsx` | `21088:3451` | |
| Footer | `components/Footer.tsx` | `21039:1700` | |

## Layout system

The design is drawn on a 1920px canvas. `--u` (in `globals.css`) equals one design pixel, so a value
like `calc(200 * var(--u))` scales the 1920 layout proportionally. Below 1024px and 768px `--u` is
re-based, and each section's CSS module has its own tablet/mobile rules.

## Fonts

- **Stack Sans Headline** loads from Google Fonts via `next/font`.
- **Voyage**, the display serif, is a commercial font and is **not included**. Put the licensed
  `Voyage-Regular.woff2` file in `public/fonts/` and it is picked up automatically. Until then,
  Playfair Display is used as the fallback.

## Assets

All images were exported from Figma into `public/img/<section>/` and converted to WebP.
