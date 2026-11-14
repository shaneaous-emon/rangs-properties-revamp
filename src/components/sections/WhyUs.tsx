"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { Eyebrow } from "../ui/Buttons";
import s from "./WhyUs.module.css";

const STEPS = [
  {
    title: ["Architecture", "with Intention"],
    body: "We believe meaningful architecture goes beyond visual appeal. Every space is approached with thoughtful planning, purposeful design and an understanding of how people experience their surroundings.",
    img: "/img/why/building-1.webp",
    w: 1177,
    h: 1336,
  },
  {
    title: ["Quality in", "Every Detail"],
    body: "From material choices to the finer elements of execution, quality is reflected in every decision. We strive to create developments where craftsmanship, functionality and enduring appeal come together.",
    img: "/img/why/building-2.webp",
    w: 1024,
    h: 641,
  },
  {
    title: ["A Vision", "Beyond Today"],
    body: "We look beyond immediate expectations to create developments with lasting relevance. Our focus is on spaces that retain their value, purpose and appeal as lifestyles and cities continue to evolve.",
    img: "/img/why/building-3.webp",
    w: 1177,
    h: 1336,
  },
];

export default function WhyUs() {
  const root = useRef<HTMLElement>(null);
  const [step, setStep] = useState(0);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);
      const n = STEPS.length - 1;
      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut", duration: 1 },
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: () => `+=${window.innerHeight * 2.2}`,
          pin: q("[data-pin]")[0],
          scrub: 1,
          snap: { snapTo: 1 / n, duration: { min: 0.3, max: 0.8 }, ease: "power2.inOut", delay: 0.05 },
          onUpdate: (self) => setStep(Math.round(self.progress * n)),
        },
      });
      for (let i = 1; i <= n; i++) {
        const at = i - 1;
        tl.to(q("[data-titles]"), { yPercent: (-100 / STEPS.length) * i }, at)
          .to(q("[data-paras]"), { yPercent: (-100 / STEPS.length) * i }, at)
          .to(q("[data-media]"), { yPercent: -100 * i }, at)
          .fromTo(q("[data-shot] img")[i], { scale: 1.25, yPercent: 8 }, { scale: 1, yPercent: 0 }, at)
          .to(
            q("[data-rail]"),
            {
              y: () =>
                ((q("[data-railbox]")[0]?.clientHeight ?? 0) - (q("[data-rail]")[0]?.clientHeight ?? 0)) * (i / n),
            },
            at,
          )
          .to(q("[data-rock]"), { rotate: 25 * i, x: -30 * i, y: -20 * i }, at);
      }
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className={s.why} id="why-us" aria-labelledby="why-title">
      <div className={s.pin} data-pin>
        <div className={s.stage}>
          <div className={s.screen} aria-hidden />
          <div className={s.eyebrow}>
            <Eyebrow>Why us</Eyebrow>
          </div>

          <h2 id="why-title" className="sr-only">
            Why RANGS: {STEPS.map((st) => st.title.join(" ")).join(", ")}
          </h2>
          <div className={`${s.clip} ${s.titles}`} aria-hidden>
            <div className={s.track} data-titles>
              {STEPS.map((st) => (
                <p key={st.title.join()}>
                  {st.title[0]}
                  <br />
                  {st.title[1]}
                </p>
              ))}
            </div>
          </div>
          <div className={`${s.clip} ${s.paras}`}>
            <div className={s.track} data-paras>
              {STEPS.map((st, i) => (
                <p key={i} aria-hidden={i !== step}>
                  {st.body}
                </p>
              ))}
            </div>
          </div>

          <div className={s.rail} data-railbox aria-hidden>
            <span className={s.railFill} data-rail />
          </div>
          <ol className={s.steps} aria-hidden>
            {STEPS.map((_, i) => (
              <li key={i} data-on={i === step}>
                {String(i + 1).padStart(2, "0")}
              </li>
            ))}
          </ol>

          <div className={s.media}>
            <div className={s.mediaTrack} data-media>
              {STEPS.map((st, i) => (
                <div key={st.img} className={s.shot} style={{ top: `${i * 100}%` }} data-shot>
                  <Image src={st.img} alt={st.title.join(" ")} fill sizes="(max-width: 767px) 100vw, 50vw" />
                </div>
              ))}
            </div>
          </div>

          <div className={s.rock} data-rock aria-hidden>
            <Image src="/img/why/rock.webp" alt="" fill sizes="18vw" />
          </div>
        </div>
      </div>
    </section>
  );
}
