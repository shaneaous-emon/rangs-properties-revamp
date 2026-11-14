import { CircleArrow } from "./Buttons";
import s from "./slider.module.css";

type Props = {
  progress: number;
  visibleRatio: number;
  onPrev: () => void;
  onNext: () => void;
  atStart: boolean;
  atEnd: boolean;
  label: string;
};

/** Progress rail (grey 1549px line with orange thumb) + light circle arrows. */
export default function SliderControls({ progress, visibleRatio, onPrev, onNext, atStart, atEnd, label }: Props) {
  const thumb = Math.max(0.12, visibleRatio);
  return (
    <div className={s.controls}>
      <div className={s.rail} aria-hidden>
        <span
          className={s.thumb}
          style={{ width: `${thumb * 100}%`, transform: `translateX(${(progress * (1 - thumb) * 100) / thumb}%)` }}
        />
      </div>
      <div className={s.arrows}>
        <CircleArrow tone="light" dir="prev" onClick={onPrev} disabled={atStart} label={`Previous ${label}`} />
        <CircleArrow tone="light" dir="next" onClick={onNext} disabled={atEnd} label={`Next ${label}`} />
      </div>
    </div>
  );
}
