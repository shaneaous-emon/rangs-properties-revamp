"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { CtaButton } from "../ui/Buttons";
import s from "./About.module.css";

export default function About() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);
      const base = { trigger: root.current, start: "top 85%" };

      gsap.from(q("[data-t1]"), { xPercent: -12, autoAlpha: 0, duration: 1.8, ease: "expo.out", scrollTrigger: base });
      gsap.from(q("[data-t2]"), {
        xPercent: 12,
        autoAlpha: 0,
        duration: 1.8,
        delay: 0.15,
        ease: "expo.out",
        scrollTrigger: base,
      });
      gsap.from(q("[data-orb]"), { scale: 0.6, autoAlpha: 0, duration: 2, ease: "expo.out", scrollTrigger: base });

      // rocks rise up through the orb as you scroll
      gsap.fromTo(
        q("[data-rocks]"),
        { yPercent: 22 },
        {
          yPercent: -6,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 1 },
        },
      );
      gsap.fromTo(
        q("[data-curve]"),
        { rotate: -4 },
        {
          rotate: 3,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 1 },
        },
      );
      gsap.from(q("[data-reveal]"), {
        y: 40,
        autoAlpha: 0,
        duration: 1.2,
        stagger: 0.12,
        ease: "expo.out",
        scrollTrigger: { trigger: q("[data-reveal]")[0], start: "top 90%" },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className={s.about} id="about" aria-labelledby="about-title">
      <div className={s.stage}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={`${s.abs} ${s.orb}`} src="/img/about/ellipse17.svg" alt="" data-orb width={989} height={989} />
        <h2 id="about-title" className="sr-only">
          More Than Spaces. A Way of Living.
        </h2>
        <p className={s.title} data-t1 aria-hidden>
          More Than Spaces.
        </p>
        <p className={s.title2} data-t2 aria-hidden>
          A Way of Living.
        </p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={`${s.abs} ${s.halo}`} src="/img/about/ellipse4.svg" alt="" width={241} height={209} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={`${s.abs} ${s.halo2}`} src="/img/about/ellipse18.svg" alt="" width={219} height={186} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={`${s.abs} ${s.curve}`}
          src="/img/about/curve.svg"
          alt=""
          data-curve
          width={1654}
          height={1241}
        />
        <div className={`${s.abs} ${s.rocks}`} data-rocks>
          <Image src="/img/about/rocks.webp" alt="" fill sizes="(max-width: 767px) 140vw, 76vw" />
        </div>
        <div className={`${s.abs} ${s.fade}`} aria-hidden />
      </div>

      <div className={s.copyWrap}>
        <p className={`${s.copy} ${s.copyL}`} data-reveal>
          RANGS Properties brings together decades of experience, thoughtful architecture and a commitment to quality to
          create spaces that stand the test of time.
        </p>
        <p className={`${s.copy} ${s.copyR}`} data-reveal>
          From contemporary residences to dynamic commercial destinations, every development reflects a considered
          approach to design, functionality and the way people live, work and connect.
        </p>
        <div className={`${s.abs} ${s.btn}`} data-reveal>
          <CtaButton href="#why-us">LEARN MORE</CtaButton>
        </div>
      </div>
    </section>
  );
}
