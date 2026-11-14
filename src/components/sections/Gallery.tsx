"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { Eyebrow } from "../ui/Buttons";
import s from "./Gallery.module.css";

const SLIDES = [
  { title: ["Lifestyle", "& Living"], img: "/img/gallery/g4.webp" },
  { title: ["Amenities", "& Leisure"], img: "/img/gallery/g5.webp" },
  { title: ["Spaces", "& Details"], img: "/img/gallery/g6.webp" },
];

export default function Gallery() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);
      const slides = q("[data-slide]");
      const n = SLIDES.length - 1;

      gsap.set(slides.slice(1), { clipPath: "inset(100% 0% 0% 0%)" });

      // entrance: lines draw out, title rises
      gsap.from(q("[data-line]"), {
        scaleX: 0,
        duration: 1.6,
        ease: "expo.out",
        scrollTrigger: { trigger: root.current, start: "top 60%" },
      });

      const tl = gsap.timeline({
        defaults: { ease: "power3.inOut", duration: 1 },
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: () => `+=${window.innerHeight * 2}`,
          pin: q("[data-pin]")[0],
          scrub: 1,
          snap: { snapTo: 1 / n, duration: { min: 0.3, max: 0.8 }, ease: "power2.inOut", delay: 0.05 },
          onUpdate: (self) => setActive(Math.round(self.progress * n)),
        },
      });
      for (let i = 1; i <= n; i++) {
        const at = i - 1;
        tl.to(slides[i], { clipPath: "inset(0% 0% 0% 0%)" }, at)
          .fromTo(slides[i].querySelector("img"), { scale: 1.3, yPercent: 10 }, { scale: 1, yPercent: 0 }, at)
          .to(slides[i - 1].querySelector("img"), { scale: 0.92, yPercent: -12 }, at)
          .to(q("[data-titles]"), { yPercent: (-100 / SLIDES.length) * i }, at);
      }
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className={s.gallery} id="gallery" aria-labelledby="gallery-title">
      <div className={s.pin} data-pin>
        {SLIDES.map((sl, i) => (
          <div key={sl.img} className={s.slide} data-slide style={{ zIndex: i + 1 }}>
            <Image src={sl.img} alt={sl.title.join(" ")} fill sizes="100vw" />
          </div>
        ))}

        <div className={s.ui}>
          <div className={s.eyebrow}>
            <Eyebrow>Gallery</Eyebrow>
          </div>
          <p className={s.dots} aria-hidden>
            {SLIDES.map((_, i) => (
              <span key={i} data-on={i === active}>
                {String(i + 1).padStart(2, "0")}
              </span>
            ))}
          </p>
          <span className={`${s.line} ${s.lineL}`} data-line />
          <span className={`${s.line} ${s.lineR}`} data-line />
          <h2 id="gallery-title" className="sr-only">
            {SLIDES[active].title.join(" ")}
          </h2>
          <div className={s.titleClip} aria-hidden>
            <div className={s.titleTrack} data-titles>
              {SLIDES.map((sl) => (
                <p key={sl.img}>
                  {sl.title[0]}
                  <br />
                  {sl.title[1]}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
