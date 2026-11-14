"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { Map as MLMap, Marker } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { loadMapLibre } from "@/lib/maplibre";
import { buildMapStyle } from "@/lib/mapStyle";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import projects from "@/data/projects.json";
import s from "./ProjectMap.module.css";

type Project = (typeof projects)[number];

const STATUS: Record<string, string> = { ongoing: "Ongoing", upcoming: "Upcoming", completed: "Completed" };
const DEFAULT_ID = "noorani-heights";
const ZOOM = 14.1;

/** px value of N design units (same maths as the CSS --u token) */
const unit = (n: number) => {
  const w = window.innerWidth;
  const base = w < 1024 ? Math.min(w, 900) / 760 : Math.min(w, 1920) / 1920;
  return n * base;
};

/**
 * Project map. Left: project names (Voyage, 80px, copper → white when active).
 * Right: copper-road dark map with gold pins; the active project gets the
 * large white pin, a soft glow and the light detail card beside it.
 * Data: RANGS projects scraped for the interactive-map-module.
 */
export default function ProjectMap() {
  const root = useRef<HTMLElement>(null);
  const mapEl = useRef<HTMLDivElement>(null);
  const listEl = useRef<HTMLUListElement>(null);
  const cardEl = useRef<HTMLAnchorElement>(null);
  const mapRef = useRef<MLMap | null>(null);
  const markers = useRef<Map<string, { marker: Marker; el: HTMLButtonElement }>>(new Map());
  const [activeId, setActiveId] = useState(DEFAULT_ID);
  const [ready, setReady] = useState(false);
  const [near, setNear] = useState(false);
  const hoverTimer = useRef<number | null>(null);
  // where the last activation came from — the list only auto-scrolls when the map picked the project
  const fromList = useRef(false);
  const active = projects.find((p) => p.id === activeId) ?? projects[0];

  // lazy: only start MapLibre when the section approaches the viewport
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: "800px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // position the detail card next to the active pin
  const placeCard = useCallback(() => {
    const map = mapRef.current;
    const card = cardEl.current;
    const host = mapEl.current;
    if (!map || !card || !host) return;
    if (window.innerWidth < 1024) return; // CSS docks the card on mobile
    const p = projects.find((x) => x.id === card.dataset.id);
    if (!p) return;
    const pt = map.project([p.lng, p.lat]);
    const cw = card.offsetWidth;
    const ch = card.offsetHeight;
    let x = host.offsetLeft + pt.x + unit(84);
    if (x + cw > root.current!.clientWidth - unit(24)) x = host.offsetLeft + pt.x - unit(84) - cw;
    let y = pt.y - unit(227);
    y = Math.max(unit(24), Math.min(y, host.clientHeight - ch - unit(24)));
    card.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }, []);

  // create the map
  useEffect(() => {
    if (!near || !mapEl.current || mapRef.current) return;
    let cancelled = false;
    loadMapLibre().then((ml) => {
      if (cancelled || !mapEl.current) return;
      const start = projects.find((p) => p.id === DEFAULT_ID)!;
      const isTouch = window.matchMedia("(pointer: coarse)").matches;
      const map = new ml.Map({
        container: mapEl.current,
        style: buildMapStyle(),
        center: [start.lng, start.lat],
        zoom: ZOOM,
        pitch: 0,
        attributionControl: { compact: true },
        scrollZoom: false,
        cooperativeGestures: isTouch,
        dragRotate: false,
        pitchWithRotate: false,
        fadeDuration: 0,
      });
      mapRef.current = map;
      map.touchZoomRotate.disableRotation();

      projects.forEach((p) => {
        const el = document.createElement("button");
        el.type = "button";
        el.className = s.pin;
        el.setAttribute("aria-label", `${p.name}, ${p.location}`);
        el.innerHTML = `<img class="${s.glow}" src="/img/map/glow.svg" alt="" /><img class="${s.pinImg} ${s.pinIdle}" src="/img/map/pin.svg" alt="" /><img class="${s.pinImg} ${s.pinActiveImg}" src="/img/map/pin-active.svg" alt="" />`;
        el.addEventListener("click", (e) => {
          e.stopPropagation();
          fromList.current = false;
          setActiveId(p.id);
        });
        const marker = new ml.Marker({ element: el, anchor: "bottom" }).setLngLat([p.lng, p.lat]).addTo(map);
        markers.current.set(p.id, { marker, el });
      });

      map.on("move", placeCard);
      map.on("resize", placeCard);
      map.once("load", () => {
        setReady(true);
        placeCard();
      });
    });
    return () => {
      cancelled = true;
    };
  }, [near, placeCard]);

  useEffect(
    () => () => {
      mapRef.current?.remove();
      mapRef.current = null;
    },
    [],
  );

  // react to active project: fly, update pins, scroll list
  useEffect(() => {
    const map = mapRef.current;
    markers.current.forEach(({ el }, id) => {
      el.dataset.active = String(id === activeId);
      el.style.zIndex = id === activeId ? "3" : "1";
    });
    if (map) {
      const p = projects.find((x) => x.id === activeId)!;
      const mobile = window.innerWidth < 1024;
      map.flyTo({
        center: [p.lng, p.lat],
        zoom: Math.max(map.getZoom(), ZOOM - 0.4),
        offset: mobile ? [0, -40] : [unit(22), unit(32)],
        speed: 0.9,
        curve: 1.5,
        essential: true,
        duration: prefersReducedMotion() ? 0 : undefined,
      });
    }
    const list = listEl.current;
    const item = list?.querySelector<HTMLElement>(`[data-id="${activeId}"]`)?.parentElement;
    if (list && item && !fromList.current) {
      const target = item.offsetTop - list.clientHeight * 0.26;
      list.scrollTo({ top: target, behavior: prefersReducedMotion() ? "auto" : "smooth" });
    }
    requestAnimationFrame(placeCard);
  }, [activeId, ready, placeCard]);

  // entrance animation
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);
      gsap.from(q("[data-item]"), {
        x: -60,
        autoAlpha: 0,
        duration: 1.2,
        stagger: 0.05,
        ease: "expo.out",
        clearProps: "all",
        scrollTrigger: { trigger: root.current, start: "top 70%" },
      });
      gsap.from(q("[data-map]"), {
        scale: 1.08,
        autoAlpha: 0,
        duration: 2,
        ease: "expo.out",
        clearProps: "all",
        onComplete: () => mapRef.current?.resize(),
        scrollTrigger: { trigger: root.current, start: "top 70%" },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const hover = (id: string) => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => {
      fromList.current = true;
      setActiveId(id);
    }, 140);
  };

  return (
    <section ref={root} className={s.section} id="projects" aria-labelledby="map-title">
      <h2 id="map-title" className="sr-only">
        RANGS projects across Dhaka
      </h2>

      <div ref={mapEl} className={s.map} data-map aria-label="Map of RANGS projects" role="region">
        {!ready && <p className={s.loading}>LOADING MAP…</p>}
      </div>
      <div className={s.fadeLeft} aria-hidden />
      <div className={s.fadeRight} aria-hidden />

      <ul ref={listEl} className={s.list} onMouseLeave={() => hoverTimer.current && clearTimeout(hoverTimer.current)}>
        {projects.map((p) => (
          <li key={p.id}>
            <button
              type="button"
              className={s.item}
              data-item
              data-id={p.id}
              data-active={p.id === activeId}
              aria-pressed={p.id === activeId}
              onMouseEnter={() => hover(p.id)}
              onFocus={() => {
                fromList.current = true;
                setActiveId(p.id);
              }}
              onClick={() => {
                fromList.current = window.matchMedia("(pointer: coarse)").matches ? false : true;
                setActiveId(p.id);
              }}
            >
              <span data-long={p.name.length > 15 || undefined}>{p.name}</span>
            </button>
          </li>
        ))}
      </ul>

      <a
        ref={cardEl}
        key={active.id}
        data-id={active.id}
        data-hidden={!ready}
        className={`${s.card} ${s.cardAnim}`}
        href={active.url}
        target="_blank"
        rel="noreferrer"
      >
        <div className={s.cardImg}>
          {/* remote project photo from rangsproperties.com */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={active.image} alt={active.name} decoding="async" />
        </div>
        <div className={s.cardBody}>
          <p className={s.cardTitle}>{active.name}</p>
          <p className={s.cardMeta}>
            {STATUS[active.status] ?? active.status}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/ui/dot.svg" alt="" width={9} height={9} />
            {active.location}, Dhaka
          </p>
        </div>
      </a>
    </section>
  );
}

export type { Project };
