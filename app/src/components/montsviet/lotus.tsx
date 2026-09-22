import type { CSSProperties } from "react";

type Petal = { angle: number; scale: number; layer: "back" | "mid" | "front"; delay: number };

// Eight petals fanning out from the base of the flower. Order = paint order.
const PETALS: Petal[] = [
  { angle: -58, scale: 0.74, layer: "back", delay: 0 },
  { angle: 58, scale: 0.74, layer: "back", delay: 0 },
  { angle: 0, scale: 0.8, layer: "back", delay: 0.05 },
  { angle: -36, scale: 0.9, layer: "mid", delay: 0.18 },
  { angle: 36, scale: 0.9, layer: "mid", delay: 0.18 },
  { angle: -16, scale: 1, layer: "front", delay: 0.34 },
  { angle: 16, scale: 1, layer: "front", delay: 0.34 },
  { angle: 0, scale: 1.04, layer: "front", delay: 0.46 },
];

const PETAL_PATH = "M100 152 C 72 118, 74 60, 100 22 C 126 60, 128 118, 100 152 Z";

type LotusProps = {
  open: boolean;
  variant?: "fill" | "line";
  className?: string;
  title?: string;
};

/**
 * Animated lotus. Petals start folded around the centre and unfold when `open`
 * flips to true (CSS transitions, so it costs nothing on the main thread).
 */
export function Lotus({ open, variant = "fill", className, title }: LotusProps) {
  return (
    <svg
      viewBox="0 0 200 176"
      className={`lotus lotus-${variant} ${className ?? ""}`}
      data-open={open ? "true" : "false"}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <defs>
        <linearGradient id="lotus-front" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d1533f" />
          <stop offset="1" stopColor="#8e2b21" />
        </linearGradient>
        <linearGradient id="lotus-mid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#b4382c" />
          <stop offset="1" stopColor="#6f2018" />
        </linearGradient>
        <linearGradient id="lotus-back" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8e2b21" />
          <stop offset="1" stopColor="#4f150f" />
        </linearGradient>
      </defs>
      <g className="lotus-leaves">
        <ellipse cx="62" cy="156" rx="46" ry="9" />
        <ellipse cx="138" cy="156" rx="46" ry="9" />
      </g>
      {PETALS.map((p, i) => (
        <path
          key={i}
          d={PETAL_PATH}
          className={`lotus-petal lotus-petal-${p.layer}`}
          style={
            {
              "--a": `${p.angle}deg`,
              "--s": p.scale,
              "--d": `${p.delay}s`,
            } as CSSProperties
          }
        />
      ))}
    </svg>
  );
}
