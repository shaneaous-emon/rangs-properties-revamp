"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Minimal horizontal slider: measures how many items fit in the viewport and
 * exposes index / prev / next plus a progress value for the orange bar.
 * Supports drag / swipe on the track.
 */
export function useSlider(count: number) {
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [maxIndex, setMaxIndex] = useState(count - 1);
  const [offset, setOffset] = useState(0);

  const measure = useCallback(() => {
    const vp = viewport.current;
    const tr = track.current;
    if (!vp || !tr || !tr.children.length) return;
    const items = Array.from(tr.children) as HTMLElement[];
    const maxScroll = Math.max(0, tr.scrollWidth - vp.clientWidth);
    // last index whose offset still fits
    let last = items.findIndex((el) => el.offsetLeft >= maxScroll - 1);
    if (last === -1) last = items.length - 1;
    setMaxIndex(Math.max(0, last));
    setIndex((i) => Math.min(i, Math.max(0, last)));
  }, []);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (viewport.current) ro.observe(viewport.current);
    return () => ro.disconnect();
  }, [measure]);

  useEffect(() => {
    const vp = viewport.current;
    const tr = track.current;
    if (!vp || !tr) return;
    const el = tr.children[index] as HTMLElement | undefined;
    const maxScroll = Math.max(0, tr.scrollWidth - vp.clientWidth);
    setOffset(Math.min(el?.offsetLeft ?? 0, maxScroll));
  }, [index, maxIndex]);

  // pointer drag / swipe
  useEffect(() => {
    const vp = viewport.current;
    if (!vp) return;
    let startX = 0;
    let dragging = false;
    const down = (e: PointerEvent) => {
      dragging = true;
      startX = e.clientX;
    };
    const up = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 50) setIndex((i) => Math.min(maxIndex, Math.max(0, i + (dx < 0 ? 1 : -1))));
    };
    vp.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    return () => {
      vp.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    };
  }, [maxIndex]);

  const prev = () => setIndex((i) => Math.max(0, i - 1));
  const next = () => setIndex((i) => Math.min(maxIndex, i + 1));
  const progress = maxIndex === 0 ? 1 : index / maxIndex;
  const visibleRatio = count ? Math.min(1, (count - maxIndex) / count) : 1;

  return { viewport, track, index, maxIndex, offset, prev, next, progress, visibleRatio };
}
