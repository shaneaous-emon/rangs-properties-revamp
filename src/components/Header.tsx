"use client";

import { useEffect, useState } from "react";
import { MenuButton, PillButton } from "./ui/Buttons";
import s from "./Header.module.css";

export const NAV_LINKS = ["Home", "About", "Projects", "Landowner", "Career", "Insights", "Contact us"] as const;

export default function Header() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setSolid(y > 40);
      setHidden(y > 400 && y > last);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header className={s.header} data-hidden={hidden && !open} data-solid={solid && !open}>
        <div className={s.inner}>
          <a href="#top" className={s.brand} aria-label="RANGS Properties, a Rancon company">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={s.logo} src="/img/ui/logo-rangs-white.svg" alt="RANGS" width={176} height={40} />
            <span className={s.divider} aria-hidden />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={s.rancon} src="/img/ui/rancon.webp" alt="A Rancon company" width={193} height={19} />
          </a>

          <nav className={s.pills} aria-label="Project categories">
            <PillButton href="#explore">RESIDENTIAL</PillButton>
            <PillButton href="#explore">COMMERCIAL</PillButton>
          </nav>

          <MenuButton open={open} onClick={() => setOpen((o) => !o)} />
        </div>
      </header>

      <div id="site-menu" className={s.overlay} data-open={open} aria-hidden={!open}>
        <nav className={s.nav} aria-label="Main">
          {NAV_LINKS.map((l, i) => (
            <a key={l} href={i === 0 ? "#top" : "#"} tabIndex={open ? 0 : -1} onClick={() => setOpen(false)}>
              <span style={{ transitionDelay: open ? `${0.25 + i * 0.05}s` : "0s" }}>{l}</span>
            </a>
          ))}
        </nav>
        <div className={s.meta}>
          <h3>LOCATION</h3>
          <p>
            Rangs Babylonia, 246, Bir Uttam Mir Shawkat Road,
            <br />
            Tejgaon I/A, Dhaka-1208
          </p>
          <h3>CONTACT US</h3>
          <p>16677</p>
        </div>
      </div>
    </>
  );
}
