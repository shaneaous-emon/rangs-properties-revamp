"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { CtaButton } from "../ui/Buttons";
import s from "./Hero.module.css";

/**
 * Hero — "Architecture Beyond Expectations" + "Explore Possibilities".
 * Motion reference (Figma annotation): obsidianassembly.com — slow, weighty
 * parallax on the obsidian rock and the floating project cards.
 */
export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);

      // ---- intro
      const intro = gsap.timeline({ defaults: { ease: "expo.out" } });
      intro
        .from(q("[data-word] > span"), { yPercent: 110, duration: 1.6, stagger: 0.12 }, 0.1)
        .from(q("[data-rock]"), { scale: 0.82, autoAlpha: 0, rotate: -8, duration: 2.2 }, 0.2)
        .from(q("[data-card='l']"), { xPercent: -80, rotate: -35, autoAlpha: 0, duration: 1.8 }, 0.5)
        .from(q("[data-card='r']"), { xPercent: 80, rotate: 35, autoAlpha: 0, duration: 1.8 }, 0.5)
        .from(q("[data-fadeup]"), { y: 30, autoAlpha: 0, duration: 1.2, stagger: 0.1 }, 0.9)
        .from(q("[data-curve]"), { autoAlpha: 0, duration: 2 }, 0.6);

      // ---- scroll parallax
      const st = { trigger: root.current, start: "top top", end: "bottom top", scrub: 1.2 };
      gsap.to(q("[data-rock]"), { yPercent: 38, rotate: 14, scale: 1.08, ease: "none", scrollTrigger: st });
      gsap.to(q(".".concat(s.wArchitecture)), { xPercent: -18, ease: "none", scrollTrigger: st });
      gsap.to(q(".".concat(s.wBeyond)), { xPercent: 22, ease: "none", scrollTrigger: st });
      gsap.to(q(".".concat(s.wExpectations)), { xPercent: -10, ease: "none", scrollTrigger: st });
      gsap.to(q("[data-card='l']"), { yPercent: -45, rotate: -24, ease: "none", scrollTrigger: st });
      gsap.to(q("[data-card='r']"), { yPercent: -60, rotate: 26, ease: "none", scrollTrigger: st });

      // ---- explore title: words slide in from opposite sides
      const ex = {
        trigger: q(".".concat(s.wExplore))[0],
        start: "top 95%",
        end: "top 35%",
        scrub: 1,
      };
      gsap.fromTo(q(".".concat(s.wExplore)), { xPercent: -25 }, { xPercent: 0, ease: "none", scrollTrigger: ex });
      gsap.fromTo(q(".".concat(s.wPossibilities)), { xPercent: 25 }, { xPercent: 0, ease: "none", scrollTrigger: ex });
      gsap.fromTo(
        q("[data-explore-curve]"),
        { yPercent: 12, autoAlpha: 0.2 },
        { yPercent: -8, autoAlpha: 1, ease: "none", scrollTrigger: { ...ex, end: "bottom top" } },
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className={s.hero} id="top" aria-label="Introduction">
      <div className={s.stage}>
        <Image className={s.texture} src="/img/hero/bg-texture.webp" alt="" width={1816} height={866} preload />
        <div className={s.screen} aria-hidden />
        <div className={`${s.abs} ${s.dome}`} aria-hidden />

        <h1 className="sr-only">Architecture Beyond Expectations</h1>
        <p className={`${s.word} ${s.wArchitecture} line-mask`} data-word aria-hidden>
          <span className="inline-block">Architecture</span>
        </p>
        <p className={`${s.word} ${s.wBeyond} line-mask`} data-word aria-hidden>
          <span className="inline-block">Beyond</span>
        </p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={`${s.abs} ${s.swash}`} src="/img/hero/beyond-swash.svg" alt="" width={517} height={198} />

        <div className={`${s.abs} ${s.rock}`} data-rock>
          <Image src="/img/hero/rock.webp" alt="" fill sizes="(max-width: 1023px) 120vw, 55vw" preload />
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={`${s.abs} ${s.curve}`} src="/img/hero/curve.svg" alt="" data-curve width={886} height={1081} />

        <p className={`${s.word} ${s.wExpectations} line-mask`} data-word aria-hidden>
          <span className="inline-block">Expectations</span>
        </p>
        <p className={`${s.abs} ${s.tagline}`} data-fadeup>
          Thoughtful spaces
          <br /> for a modern Dhaka
        </p>

        <div className={`${s.abs} ${s.fade}`} aria-hidden />

        <div className={`${s.abs} ${s.cta}`} data-fadeup>
          <p>Every meaningful space begins with a conversation</p>
          <CtaButton href="#contact">GET IN TOUCH</CtaButton>
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={`${s.abs} ${s.exploreCurve}`}
          src="/img/hero/explore-curve.svg"
          alt=""
          data-explore-curve
          width={1420}
          height={1080}
        />
        <h2 className="sr-only">Explore Possibilities</h2>
        <p className={`${s.word} ${s.wExplore}`} aria-hidden>
          Explore
        </p>
        <p className={`${s.word} ${s.wPossibilities}`} aria-hidden>
          Possibilities
        </p>
        <div className={`${s.abs} ${s.exploreFade}`} aria-hidden />
        <p className={`${s.abs} ${s.exploreSub}`}>Spaces beyond the ordinary</p>

        <div className={`${s.abs} ${s.card} ${s.cardLeft}`} data-card="l">
          <Image
            className={s.cardImgLeft}
            src="/img/hero/card-left.webp"
            alt="RANGS residential tower at dusk"
            width={1448}
            height={1086}
            sizes="40vw"
          />
        </div>
        <div className={`${s.abs} ${s.card} ${s.cardRight}`} data-card="r">
          <Image
            className={s.cardImgRight}
            src="/img/hero/card-right.webp"
            alt="RANGS building facade with rooftop garden"
            width={1086}
            height={1448}
            sizes="22vw"
          />
        </div>
      </div>
    </section>
  );
}
