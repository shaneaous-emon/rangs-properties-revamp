"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import SliderControls from "../ui/SliderControls";
import { useSlider } from "../ui/useSlider";
import ss from "../ui/slider.module.css";
import s from "./Stories.module.css";

const TESTIMONIALS = [
  {
    quote:
      "Choosing Rangs was one of the most rewarding decisions for our family. The attention to detail, thoughtful design, and commitment to quality made the entire experience truly exceptional.",
    name: "Nusrat Jahan",
    role: "Homeowner",
    project: "Rangs Residence",
    img: "/img/stories/p1.webp",
  },
  {
    quote:
      "Working with Rangs transformed our living space into a sanctuary. Their innovative solutions and personalized service exceeded all expectations, allowing us to create memories that will last a lifetime.",
    name: "Amit Singh",
    role: "Property Owner",
    project: "Rangs Properties",
    img: "/img/stories/p2.webp",
  },
  {
    quote:
      "Beyond the architecture, what gives us confidence is the reputation and vision behind the development. It feels like an investment built on lasting value, allowing us to create memories that will last a lifetime.",
    name: "Farhan Kabir",
    role: "Residential Client",
    project: "Rangs Properties",
    img: "/img/stories/p3.webp",
  },
  {
    quote:
      "Beyond the architecture, what gives us confidence is the reputation and vision behind the development. It feels like an investment built on lasting value, allowing us to create memories that will last a lifetime.",
    name: "Samira Chowdhury",
    role: "Property Investor",
    project: "Rangs Properties",
    img: "/img/stories/p4.webp",
  },
  {
    quote:
      "The attention Rangs pays to customer service is unparalleled. From the first consultation to finalizing the details, we felt supported every step of the way, making the process enjoyable.",
    name: "Mahmud Rahman",
    role: "First-Time Buyer",
    project: "Rangs Development",
    img: "/img/stories/p5.webp",
  },
  {
    quote:
      "Every room in our Rangs home tells a story of craftsmanship and care. It's more than just a place to live; it's a reflection of our values and aspirations.",
    name: "Tanvir Ahmed",
    role: "Homeowner",
    project: "Rangs Estates",
    img: "/img/stories/p6.webp",
  },
];

export default function Stories() {
  const root = useRef<HTMLElement>(null);
  const { viewport, track, index, maxIndex, offset, prev, next, progress, visibleRatio } = useSlider(
    TESTIMONIALS.length,
  );

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);
      gsap.from(q("[data-line]"), {
        yPercent: 100,
        autoAlpha: 0,
        duration: 1.6,
        stagger: 0.15,
        ease: "expo.out",
        scrollTrigger: { trigger: root.current, start: "top 75%" },
      });
      gsap.from(q("[data-card]"), {
        y: 60,
        autoAlpha: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: "expo.out",
        scrollTrigger: { trigger: q("[data-card]")[0], start: "top 90%" },
      });
      gsap.fromTo(
        q("[data-rock]"),
        { y: 120, rotate: -10 },
        {
          y: -80,
          rotate: 12,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 1 },
        },
      );
      gsap.fromTo(
        q("[data-curve]"),
        { rotate: -8 },
        {
          rotate: 6,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 1 },
        },
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className={s.stories} id="stories" aria-labelledby="stories-title">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={s.curve} src="/img/stories/curve.svg" alt="" data-curve width={1000} height={1000} />
      <div className={s.inner}>
        <div className={s.rock} data-rock aria-hidden>
          <Image src="/img/stories/rock.webp" alt="" fill sizes="38vw" />
        </div>
        <h2 id="stories-title" className={s.title}>
          <span className="line-mask">
            <span data-line className="inline-block">
              Stories of
            </span>
          </span>
          <span className="line-mask">
            <span data-line className="inline-block">
              Trust &amp; Belonging
            </span>
          </span>
        </h2>

        <div className={`${ss.viewport} ${s.viewport}`} ref={viewport}>
          <div className={ss.track} ref={track} style={{ transform: `translateX(${-offset}px)` }}>
            {TESTIMONIALS.map((t, i) => (
              <figure key={t.name} className={s.card} data-card aria-hidden={i < index}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className={s.quote} src="/img/stories/quote.svg" alt="" width={129} height={60} />
                <blockquote className={s.text}>{t.quote}</blockquote>
                <figcaption className={s.person}>
                  <span className={s.avatar}>
                    <Image src={t.img} alt={t.name} fill sizes="64px" />
                  </span>
                  <div>
                    <p className={s.name}>{t.name}</p>
                    <p className={s.meta}>
                      {t.role}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/img/ui/dot.svg" alt="" width={9} height={9} />
                      {t.project}
                    </p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        <div className={s.controls}>
          <SliderControls
            label="testimonial"
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
