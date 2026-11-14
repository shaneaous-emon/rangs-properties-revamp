import type { ReactNode } from "react";
import s from "./ui.module.css";

/**
 * Label whose letters ride up in a "V" shaped wave on hover, matching the
 * Figma hover variants (letters offset 21 → 56px, centre letters arrive first).
 */
export function WaveLabel({ text }: { text: string }) {
  const chars = Array.from(text);
  const c = (chars.length - 1) / 2 || 1;
  return (
    <span className={s.label} aria-label={text}>
      <span className={s.labelBase} aria-hidden>
        {text}
      </span>
      <span className={s.labelWave} aria-hidden>
        {chars.map((ch, i) => {
          const dist = Math.abs(i - c) / c; // 0 centre → 1 edges
          return (
            <span key={i} style={{ ["--o" as string]: `${100 + dist * 170}%`, ["--i" as string]: i }}>
              {ch}
            </span>
          );
        })}
      </span>
    </span>
  );
}

type CtaProps = { href?: string; children: string; className?: string };

/** 279×85 light card button with the bottom-right sparkle (GET IN TOUCH / LEARN MORE). */
export function CtaButton({ href = "#", children, className }: CtaProps) {
  return (
    <a href={href} className={`${s.cta} ${s.hoverable} ${className ?? ""}`}>
      <span className={s.fill} aria-hidden />
      <WaveLabel text={children} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={s.ctaIcon} src="/img/ui/btn-arrow.svg" alt="" width={14} height={14} />
    </a>
  );
}

/** 280×37 translucent pill (RESIDENTIAL / COMMERCIAL). */
export function PillButton({ href = "#", children }: { href?: string; children: string }) {
  return (
    <a href={href} className={`${s.pill} ${s.hoverable}`}>
      <span className={s.fill} aria-hidden />
      <WaveLabel text={children} />
    </a>
  );
}

export function MenuButton({ open, onClick }: { open: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      className={`${s.menu} ${s.hoverable}`}
      data-active={open}
      aria-expanded={open}
      aria-controls="site-menu"
      onClick={onClick}
    >
      <span className={s.fill} aria-hidden />
      <span className={s.menuLines} aria-hidden>
        <i />
        <i />
        <i />
      </span>
      <WaveLabel text={open ? "CLOSE" : "MENU"} />
    </button>
  );
}

type CircleProps = {
  dir: "prev" | "next";
  onClick?: () => void;
  disabled?: boolean;
  tone?: "dark" | "light";
  label?: string;
};

/** 88px round arrow button. Dark = #0f0b07 → white fill; light = cream → orange fill. */
export function CircleArrow({ dir, onClick, disabled, tone = "dark", label }: CircleProps) {
  const light = tone === "light";
  const idle = light ? "/img/ui/arrow-up-dark.svg" : "/img/ui/arrow-up.svg";
  const hover = light ? "/img/ui/arrow-up.svg" : "/img/ui/arrow-down.svg";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label ?? (dir === "prev" ? "Previous" : "Next")}
      className={`${s.circle} ${light ? s.circleLight : ""} ${dir === "prev" ? s.circlePrev : ""}`}
    >
      <span className={s.circleFill} aria-hidden />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={s.circleArrow} src={idle} alt="" width={26} height={18} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={s.circleArrowIn} src={hover} alt="" width={26} height={18} />
    </button>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="eyebrow">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/img/ui/sparkle.svg" alt="" width={13} height={13} />
      <span>{children}</span>
    </p>
  );
}
