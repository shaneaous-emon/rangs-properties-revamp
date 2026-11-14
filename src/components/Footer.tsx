"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { NAV_LINKS } from "./Header";
import s from "./Footer.module.css";

const SOCIAL = [
  { name: "Facebook", icon: "/img/footer/facebook.svg", href: "https://www.facebook.com/" },
  { name: "LinkedIn", icon: "/img/footer/linkedin.svg", href: "https://www.linkedin.com/", boxed: true },
  { name: "X", icon: "/img/footer/x.svg", href: "https://x.com/" },
  { name: "YouTube", icon: "/img/footer/youtube.svg", href: "https://www.youtube.com/" },
];

export default function Footer() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);
      gsap.fromTo(
        q("[data-bg] img"),
        { yPercent: -12 },
        {
          yPercent: 0,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom bottom", scrub: 1 },
        },
      );
      const st = { trigger: q("[data-bottom]")[0], start: "top 95%" };
      gsap.from(q("[data-lines] i"), { scaleX: 0, duration: 1.6, ease: "expo.inOut", scrollTrigger: st });
      gsap.from(q("[data-logo]"), {
        yPercent: 60,
        autoAlpha: 0,
        duration: 1.4,
        delay: 0.3,
        ease: "expo.out",
        scrollTrigger: st,
      });
      gsap.from(q("[data-col] > *"), {
        y: 30,
        autoAlpha: 0,
        duration: 1,
        stagger: 0.05,
        ease: "expo.out",
        scrollTrigger: { trigger: root.current, start: "top 70%" },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <footer ref={root} className={s.footer} id="contact">
      <div className={s.bg} data-bg aria-hidden>
        <Image src="/img/footer/bg.webp" alt="" fill sizes="100vw" />
      </div>
      <div className={s.inner}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={s.curve} src="/img/footer/curve.svg" alt="" width={1361} height={713} />

        <div className={s.cols}>
          <ul className={s.nav} data-col>
            {NAV_LINKS.map((l, i) => (
              <li key={l}>
                <a href={i === 0 ? "#top" : "#"}>{l}</a>
              </li>
            ))}
          </ul>
          <div className={s.contact} data-col>
            <div>
              <h3>Location</h3>
              <p>
                Rangs Babylonia,
                <br />
                246, Bir Uttam Mir Shawkat Road,
                <br />
                Tejgaon I/A, Dhaka-1208
              </p>
            </div>
            <div>
              <h3>Contact us</h3>
              <a className={s.phone} href="tel:16677">
                16677
              </a>
            </div>
            <div className={s.social}>
              {SOCIAL.map((so) => (
                <a
                  key={so.name}
                  href={so.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={so.name}
                  className={so.boxed ? s.linkedin : undefined}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={so.icon} alt="" width={30} height={30} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className={s.bottom} data-bottom>
          <div className={s.lines} data-lines aria-hidden>
            <i />
            <i />
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={s.logo} src="/img/footer/logo-rangs.svg" alt="RANGS" data-logo width={305} height={70} />
          <div className={s.legal}>
            <p>
              © RANGS Properties Ltd.
              <br />
              2026 © All Rights Reserved.
            </p>
            <a className={s.by} href="https://dcastalia.com" target="_blank" rel="noreferrer">
              Site By Dcastalia
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/img/footer/dcastalia.webp" alt="" width={20} height={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
