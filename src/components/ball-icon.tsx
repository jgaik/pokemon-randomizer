import type { CSSProperties } from "react";
// A tiny pixel ball: two halves, a band and a round button in the middle.
// Every pixel is worked out from a circle, so the shape stays round at any
// size instead of being typed in by hand.
const SIZE = 15;
const PIXEL_SIZE_PX = 2;
const RADIUS = SIZE / 2;
const BUTTON_RADIUS = 1.5;
const BUTTON_RING_RADIUS = 2.5;

// "." outside, "#" outline. Lower case is the lit side of the top half "r" and
// the bottom half "w"; each comes as light (L), plain, dithered shade (s) and
// deep shade (d), lit from the top left like the sprites.
const getSymbol = (x: number, y: number) => {
  const offsetX = x + 0.5 - RADIUS;
  const offsetY = y + 0.5 - RADIUS;
  const distance = Math.hypot(offsetX, offsetY);

  if (distance > RADIUS) return ".";
  if (distance > RADIUS - 1) return "#";
  if (distance <= BUTTON_RADIUS) return "w";
  if (distance <= BUTTON_RING_RADIUS) return "#";
  if (Math.abs(offsetY) < 0.5) return "#";

  const half = offsetY < 0 ? "r" : "w";
  const light = (offsetX + offsetY) / RADIUS;
  const rim = RADIUS - distance;

  if (rim < 3 && light < -0.7) return `${half}L`;
  if (
    half === "r" &&
    offsetX < -1.5 &&
    offsetX > -3.5 &&
    offsetY < -3 &&
    offsetY > -4.5
  )
    return `${half}L`;
  if (rim < 3 && light > 0.75) return `${half}d`;
  if (rim < 3.6 && light > 0.35) return (x + y) % 2 === 0 ? `${half}s` : half;

  return half;
};

const ROWS = Array.from({ length: SIZE }, (_, y) =>
  Array.from({ length: SIZE }, (_, x) => getSymbol(x, y)),
);

function getPath(symbol: string) {
  return ROWS.flatMap((row, y) =>
    row.flatMap((cell, x) => (cell === symbol ? [`M${x} ${y}h1v1h-1z`] : [])),
  ).join("");
}

const mix = (color: string, target: number, amount: number) => {
  const channels = [1, 3, 5].map((index) =>
    Math.round(
      parseInt(color.slice(index, index + 2), 16) * (1 - amount) +
        target * amount,
    ),
  );

  return `#${channels.map((value) => value.toString(16).padStart(2, "0")).join("")}`;
};

const withShades = (base: string) => ({
  base,
  light: mix(base, 255, 0.4),
  shade: mix(base, 0, 0.16),
  deep: mix(base, 0, 0.3),
});

const TONES = {
  red: { top: "#e04848", bottom: "#f8f8f8", outline: "#2b2f3a" },
  gray: { top: "#a8b0c0", bottom: "#e4e8ee", outline: "#6b7280" },
  dark: { top: "#4b5263", bottom: "#242833", outline: "#0d0f14" },
};

const PATHS = {
  outline: getPath("#"),
  top: ["r", "rL", "rs", "rd"].map(getPath),
  bottom: ["w", "wL", "ws", "wd"].map(getPath),
};

type BallIconProps = {
  tone?: keyof typeof TONES;
  spinning?: boolean;
  size?: number;
  className?: string;
  style?: CSSProperties;
};

export const BallIcon = ({
  tone = "red",
  spinning = false,
  size = SIZE * PIXEL_SIZE_PX,
  className,
  style,
}: BallIconProps) => (
  <svg
    className={["ball-icon", spinning && "ball-icon--spinning", className]
      .filter(Boolean)
      .join(" ")}
    style={{ width: size, height: size, ...style }}
    viewBox={`0 0 ${SIZE} ${SIZE}`}
    shapeRendering="crispEdges"
    aria-hidden="true"
  >
    {(["top", "bottom"] as const).map((half) => {
      const shades = withShades(TONES[tone][half]);

      return [shades.base, shades.light, shades.shade, shades.deep].map(
        (fill, index) => (
          <path key={`${half}-${index}`} d={PATHS[half][index]} fill={fill} />
        ),
      );
    })}
    <path d={PATHS.outline} fill={TONES[tone].outline} />
  </svg>
);
