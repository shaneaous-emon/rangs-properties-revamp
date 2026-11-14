"use client";

import Image from "next/image";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { CircleArrow } from "../ui/Buttons";
import s from "./Projects.module.css";

const PROJECTS = [
  {
    name: "The Majestic",
    area: "7.36",
    desc: "The Majestic is envisioned as an urban sanctuary.",
    img: "/img/hero/slide-majestic.webp",
    shade: 0.4,
    learn: { x: 660, y: 151 },
  },
  {
    name: "Cloud & Creek",
    area: "23.74",
    desc: "Cloud & Creek is a lakeside haven where architecture meets serenity.",
    img: "/img/hero/slide-cloud.webp",
    shade: 0.2,
    learn: { x: 1150, y: 190 },
  },
  {
    name: "Terminal S",
    area: "17.15",
    desc: "Terminal S is designed as a connected commercial destination defined by accessibility, movement, and urban flow.",
    img: "/img/hero/slide-terminal.webp",
    shade: 0.2,
    learn: { x: 1170, y: 330 },
  },
];

const TILES = [
  { cls: s.t1, src: "/img/hero/g-pool.webp", alt: "Courtyard pool", w: 1448, h: 1086, dx: -1, dy: -0.4 },
  { cls: s.t2, src: "/img/hero/g-living-2.webp", alt: "Living room with city view", w: 885, h: 434, dx: -1, dy: 0.5 },
  { cls: s.t3, src: "/img/hero/g-lounge.webp", alt: "Double-height lounge", w: 1914, h: 822, dx: -0.3, dy: 1 },
  { cls: s.t5, src: "/img/hero/g-bedroom.webp", alt: "Master bedroom", w: 1914, h: 822, dx: 0.3, dy: -1 },
  { cls: s.t6, src: "/img/hero/g-atrium.webp", alt: "Retail atrium", w: 1402, h: 1122, dx: 1, dy: 0.5 },
  { cls: s.t7, src: "/img/hero/g-pool-2.webp", alt: "Rooftop infinity pool", w: 806, h: 432, dx: 1, dy: -0.5 },
];

/**
 * Mosaic gallery that opens into a full-bleed project slider.
 * Prototype: Commercial → Variant2…5. Reference: pyzhevsky.estate/spaces.
 */
export default function Projects() {
  const root = useRef<HTMLElement>(null);
  const stRef = useRef<ScrollTrigger | null>(null);
  const [index, setIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const prevIndex = useRef(0);

  useLayoutEffect(() => {
    const q = gsap.utils.selector(root);
    if (prefersReducedMotion()) {
      gsap.set(q("[data-full]"), { clipPath: "inset(0% 0% 0% 0% round 0px)" });
      gsap.set(q("[data-tile], [data-cover]"), { autoAlpha: 0 });
      gsap.set(q("[data-ui]"), { autoAlpha: 1 });
      gsap.delayedCall(0, () => setExpanded(true));
      return;
    }
    const ctx = gsap.context(() => {
      gsap.set(q("[data-ui]"), { autoAlpha: 0 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=110%",
          pin: true,
          scrub: 1,
          onUpdate: (self) => setExpanded(self.progress > 0.72),
        },
      });
      stRef.current = tl.scrollTrigger ?? null;

      tl.to(q("[data-full]"), { clipPath: "inset(0% 0% 0% 0% round 0px)", duration: 1, ease: "power2.inOut" }, 0)
        .fromTo(q("[data-slide] img"), { scale: 1.12 }, { scale: 1, duration: 1 }, 0)
        .to(q("[data-mosaic-arrows]"), { autoAlpha: 0, duration: 0.2 }, 0)
        .to(q("[data-cover]"), { autoAlpha: 0, scale: 1.25, duration: 0.45, ease: "power1.in" }, 0.05);

      q("[data-tile]").forEach((el) => {
        const dx = Number(el.dataset.dx);
        const dy = Number(el.dataset.dy);
        tl.to(
          el,
          { xPercent: dx * 70, yPercent: dy * 70, scale: 0.85, autoAlpha: 0, duration: 0.8, ease: "power2.in" },
          0,
        );
      });
      tl.to(q("[data-ui]"), { autoAlpha: 1, duration: 0.25 }, 0.8).fromTo(
        q("[data-line]"),
        { scaleX: 0 },
        { scaleX: 1, duration: 0.25 },
        0.8,
      );
    }, root);
    return () => ctx.revert();
  }, []);

  // slide transitions (clip reveal like the prototype)
  useLayoutEffect(() => {
    const from = prevIndex.current;
    if (from === index) return;
    const q = gsap.utils.selector(root);
    const slides = q("[data-slide]");
    const dir = index > from ? 1 : -1;
    const incoming = slides[index];
    gsap.set(slides, { zIndex: 0 });
    gsap.set(slides[from], { zIndex: 1 });
    gsap.set(incoming, { zIndex: 2, autoAlpha: 1 });
    gsap.fromTo(
      incoming,
      { clipPath: dir > 0 ? "inset(100% 0% 0% 0%)" : "inset(0% 0% 100% 0%)" },
      { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "expo.inOut" },
    );
    gsap.fromTo(incoming.querySelector("img"), { scale: 1.2 }, { scale: 1, duration: 1.6, ease: "expo.out" });
    gsap.to(slides[from].querySelector("img"), {
      yPercent: -10 * dir,
      duration: 1.2,
      ease: "expo.inOut",
      onComplete: () => {
        gsap.set(slides[from].querySelector("img"), { yPercent: 0 });
      },
    });
    prevIndex.current = index;
  }, [index]);

  const expand = useCallback(() => {
    const st = stRef.current;
    if (st) window.scrollTo({ top: st.end - 2, behavior: "smooth" });
    else setExpanded(true);
  }, []);

  const go = (d: number) => setIndex((i) => (i + d + PROJECTS.length) % PROJECTS.length);
  const p = PROJECTS[index];

  return (
    <section ref={root} className={s.section} id="explore" aria-label="Featured projects">
      <div className={s.viewport}>
        <div className={s.stage}>
          {TILES.map((t) => (
            <div key={t.src} className={`${s.tile} ${t.cls}`} data-tile data-dx={t.dx} data-dy={t.dy}>
              <Image src={t.src} alt={t.alt} fill sizes="25vw" />
            </div>
          ))}

          <div className={s.full} data-full>
            {PROJECTS.map((pr, i) => (
              <div
                key={pr.name}
                className={s.slide}
                data-slide
                style={{
                  ["--shade" as string]: pr.shade,
                  zIndex: i === 0 ? 2 : 0,
                  visibility: i === 0 ? "visible" : "hidden",
                }}
              >
                <Image src={pr.img} alt={pr.name} fill sizes="100vw" preload={i === 0} />
              </div>
            ))}
            {/* the mosaic's centre tile — fades into the full-bleed slide as it expands */}
            <div className={s.cover} data-cover>
              <Image src="/img/hero/g-main.webp" alt="" fill sizes="50vw" />
            </div>
          </div>

          <div className={s.arrows + " " + s.arrowsMosaic} data-mosaic-arrows>
            <CircleArrow dir="prev" onClick={expand} label="Open projects" />
            <CircleArrow dir="next" onClick={expand} label="Open projects" />
          </div>

          <div className={s.content} data-ui aria-hidden={!expanded}>
            <div className={`${s.clip} ${s.titles}`}>
              <div className={s.track} style={{ transform: `translateY(${-index * (100 / PROJECTS.length)}%)` }}>
                {PROJECTS.map((pr) => (
                  <p key={pr.name}>{pr.name}</p>
                ))}
              </div>
            </div>
            <span className={`${s.clip} ${s.line}`} data-line aria-hidden />
            <div className={`${s.clip} ${s.areas}`}>
              <div className={s.track} style={{ transform: `translateY(${-index * (100 / PROJECTS.length)}%)` }}>
                {PROJECTS.map((pr) => (
                  <p key={pr.name}>
                    {pr.area}
                    <small>Katha</small>
                  </p>
                ))}
              </div>
            </div>
            <div className={`${s.clip} ${s.desc}`}>
              <div className={s.track} style={{ transform: `translateY(${-index * (100 / PROJECTS.length)}%)` }}>
                {PROJECTS.map((pr) => (
                  <p key={pr.name}>{pr.desc}</p>
                ))}
              </div>
            </div>
            <a
              href="#"
              className={s.learn}
              style={{ left: `calc(${p.learn.x} * var(--u))`, top: `calc(${p.learn.y} * var(--u))` }}
              tabIndex={expanded ? 0 : -1}
            >
              Learn
              <br />
              more
            </a>
            <div className={s.arrows}>
              <CircleArrow dir="prev" onClick={() => go(-1)} label="Previous project" />
              <CircleArrow dir="next" onClick={() => go(1)} label="Next project" />
            </div>
            <p className={s.counter} aria-live="polite">
              {String(index + 1).padStart(2, "0")} / {String(PROJECTS.length).padStart(2, "0")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
