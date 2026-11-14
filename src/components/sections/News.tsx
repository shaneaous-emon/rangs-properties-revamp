"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import SliderControls from "../ui/SliderControls";
import { useSlider } from "../ui/useSlider";
import ss from "../ui/slider.module.css";
import s from "./News.module.css";

const POSTS = [
  {
    title: "A New Chapter in Urban Living",
    body: "A vision of refined architecture takes shape, bringing thoughtful design and contemporary living together.",
    type: "Blog",
    date: "12 Nov, 2026",
    img: "/img/news/n1.webp",
  },
  {
    title: "Sustainable Solutions for Tomorrow",
    body: "Innovative technologies pave the way for eco-friendly living, merging sustainability with modern comforts.",
    type: "Article",
    date: "15 Nov, 2026",
    img: "/img/news/n2.webp",
  },
  {
    title: "Revitalizing Community Spaces",
    body: "Transforming neglected areas into vibrant hubs fosters community engagement and revitalizes neighborhoods.",
    type: "News",
    date: "18 Nov, 2026",
    img: "/img/news/n3.webp",
  },
  {
    title: "Smart Homes: The Future is Now",
    body: "Integrating smart technology into homes enhances convenience and efficiency, redefining everyday living.",
    type: "Feature",
    date: "22 Nov, 2026",
    img: "/img/news/n4.webp",
  },
  {
    title: "The Rise of Mixed-Use Developments",
    body: "Combining residential, commercial, and recreational spaces creates a dynamic urban experience for all.",
    type: "Insight",
    date: "25 Nov, 2026",
    img: "/img/news/n5.webp",
  },
  {
    title: "Urban Greenery: Integrating Nature Into City Life",
    body: "Incorporating parks and green spaces within urban environments enhances well-being and promotes biodiversity.",
    type: "Report",
    date: "30 Nov, 2026",
    img: "/img/news/n6.webp",
  },
  {
    title: "Affordable Housing Initiatives",
    body: "Exploring innovative approaches to affordable housing addresses the urban housing crisis and supports diverse communities.",
    type: "Update",
    date: "02 Dec, 2026",
    img: "/img/news/n7.webp",
  },
];

export default function News() {
  const root = useRef<HTMLElement>(null);
  const { viewport, track, index, maxIndex, offset, prev, next, progress, visibleRatio } = useSlider(POSTS.length);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);
      gsap.from(q("[data-title] > span"), {
        yPercent: 100,
        duration: 1.6,
        ease: "expo.out",
        scrollTrigger: { trigger: root.current, start: "top 75%" },
      });
      gsap.from(q("[data-item]"), {
        y: 60,
        autoAlpha: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: "expo.out",
        scrollTrigger: { trigger: q("[data-item]")[0], start: "top 90%" },
      });
      const scrub = { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 1 };
      gsap.fromTo(
        q("[data-rock]"),
        { y: 160, rotate: 10 },
        { y: -40, rotate: -18, ease: "none", scrollTrigger: scrub },
      );
      gsap.fromTo(q("[data-curve]"), { rotate: 4 }, { rotate: 16, ease: "none", scrollTrigger: scrub });
      gsap.fromTo(
        q("[data-bg] img"),
        { yPercent: -10, scale: 1.15 },
        { yPercent: 6, scale: 1, ease: "none", scrollTrigger: scrub },
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className={s.news} id="insights" aria-labelledby="news-title">
      <div className={s.bg} data-bg aria-hidden>
        <Image src="/img/news/bg.webp" alt="" fill sizes="100vw" />
      </div>
      <div className={s.bgFade} aria-hidden />
      <div className={s.inner}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={s.curve} src="/img/news/curve.svg" alt="" data-curve width={1194} height={896} />
        <div className={s.rock} data-rock aria-hidden>
          <Image src="/img/news/rock.webp" alt="" fill sizes="30vw" />
        </div>
        <h2 id="news-title" className={`${s.title} line-mask`} data-title>
          <span className="inline-block">A World in Motion</span>
        </h2>

        <div className={`${ss.viewport} ${s.viewport}`} ref={viewport}>
          <div className={ss.track} ref={track} style={{ transform: `translateX(${-offset}px)` }}>
            {POSTS.map((p) => (
              <article key={p.title} className={s.item} data-item>
                <a href="#" className={s.card} draggable={false}>
                  <div>
                    <div className={s.head}>
                      <h3>{p.title}</h3>
                      <p>{p.body}</p>
                    </div>
                    <p className={s.meta}>
                      {p.type}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/img/ui/dot.svg" alt="" width={9} height={9} />
                      <time>{p.date}</time>
                    </p>
                  </div>
                  <div className={s.thumb}>
                    <Image src={p.img} alt="" fill sizes="(max-width: 1023px) 78vw, 31vw" draggable={false} />
                  </div>
                </a>
              </article>
            ))}
          </div>
        </div>

        <div className={s.controls}>
          <SliderControls
            label="article"
            progress={progress}
            visibleRatio={visibleRatio}
            onPrev={prev}
            onNext={next}
            atStart={index === 0}
            atEnd={index >= maxIndex}
          />
        </div>
      </div>
    </section>
  );
}
