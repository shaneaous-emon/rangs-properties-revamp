"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import s from "./Stats.module.css";

const STATS = [
  {
    value: 30,
    suffix: "+",
    label: "Years of experience",
    desc: "Building trust through decades of real estate development.",
  },
  {
    value: 125,
    suffix: "+",
    label: "Projects delivered",
    desc: "Creating thoughtfully designed spaces for modern living.",
  },
  { value: 5000, suffix: "+", label: "Families served", desc: "Helping families find a place to call home." },
  { value: 4.4, suffix: "M+", label: "Sq. ft. delivered", desc: "Shaping residential spaces across the city." },
  {
    value: 470,
    suffix: "+",
    label: "Landowners partnered",
    desc: "Turning land into lasting value through collaboration.",
  },
  {
    value: 320,
    suffix: "+",
    label: "Agricultural partners",
    desc: "Enhancing yield and sustainability with innovative practices.",
  },
  {
    value: 150,
    suffix: "+",
    label: "Community initiatives",
    desc: "Empowering local populations through educational programs.",
  },
];

const fmt = (v: number, target: number) => (target % 1 !== 0 ? v.toFixed(1) : Math.round(v).toLocaleString("en-US"));

export default function Stats() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const q = gsap.utils.selector(root);
    const track = q("[data-track]")[0] as HTMLElement;
    const reduce = prefersReducedMotion();

    const ctx = gsap.context(() => {
      // count-up
      q("[data-num]").forEach((el) => {
        const target = Number(el.dataset.num);
        const obj = { v: 0 };
        if (reduce) return;
        el.textContent = fmt(0, target);
        gsap.to(obj, {
          v: target,
          duration: 2.2,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 70%" },
          onUpdate: () => (el.textContent = fmt(obj.v, target)),
        });
      });
      if (reduce) return;

      // background drift
      gsap.fromTo(
        q("[data-bg] img"),
        { scale: 1.2, yPercent: -6 },
        {
          scale: 1.02,
          yPercent: 6,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 1 },
        },
      );

      // infinite marquee (cards are rendered twice), speeds up with scroll velocity
      const half = track.scrollWidth / 2;
      const loop = gsap.to(track, { x: -half, duration: 48, ease: "none", repeat: -1 });
      ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const v = Math.min(Math.abs(self.getVelocity()) / 400, 6);
          gsap.to(loop, { timeScale: 1 + v, duration: 0.3, overwrite: true });
          gsap.to(loop, { timeScale: 1, duration: 1.2, delay: 0.3 });
        },
      });
      const pause = () => gsap.to(loop, { timeScale: 0.15, duration: 0.6 });
      const play = () => gsap.to(loop, { timeScale: 1, duration: 0.6 });
      track.addEventListener("mouseenter", pause);
      track.addEventListener("mouseleave", play);
      return () => {
        track.removeEventListener("mouseenter", pause);
        track.removeEventListener("mouseleave", play);
      };
    }, root);
    return () => ctx.revert();
  }, []);

  const cards = [...STATS, ...STATS];

  return (
    <section ref={root} className={s.stats} aria-label="RANGS in numbers">
      <div className={s.bg} data-bg>
        <Image src="/img/stats/bg.webp" alt="" fill sizes="100vw" />
      </div>
      <div className={s.shade} aria-hidden />
      <div className={s.viewport}>
        <ul className={s.track} data-track>
          {cards.map((st, i) => (
            <li key={i} className={s.card} aria-hidden={i >= STATS.length}>
              <div>
                <p className={s.num}>
                  <span data-num={st.value}>{fmt(st.value, st.value)}</span>
                  {st.suffix}
                </p>
                <p className={s.label}>{st.label}</p>
              </div>
              <p className={s.desc}>{st.desc}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
