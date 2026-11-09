import { GRASS_HEIGHT_DVH } from "./constants";

export const GRID_WIDTH = 30;
export const GROUND_HEIGHT = 2;

const BLADE_COUNT = 22;
const SHADE_COUNT = 4;
const LENGTH_MIN = 8;
const LENGTH_MAX = 26;
const ANGLE_MAX = 18;
const ARC_MAX = 40;
const DARKEST_SHADE = 0x2e7d32;
const LIGHTEST_SHADE = 0x6fcf5b;

// A new field on every load.
const SEED = Date.now();

const STEPS_PER_PIXEL = 4;
const TIP_START = 0.92;
const STEEP_LIMIT = 0.7;

// A blade can rise at most `LENGTH_MAX` rows, and a flat stretch is one row
// taller than that.
export const GRID_HEIGHT = LENGTH_MAX + 2;

// Splits a 0xRRGGBB number into its red, green and blue channels.
const toChannels = (color: number) => [
  (color >> 16) & 255,
  (color >> 8) & 255,
  color & 255,
];

export const SHADE_COLORS = Array.from({ length: SHADE_COUNT }, (_, shade) => {
  const mix = shade / Math.max(1, SHADE_COUNT - 1);
  const [red, green, blue] = toChannels(DARKEST_SHADE).map((dark, channel) =>
    Math.round(dark + (toChannels(LIGHTEST_SHADE)[channel] - dark) * mix),
  );

  return `rgb(${red} ${green} ${blue})`;
});

// A blade is one smooth curve made of two connected arcs: the heading turns
// by `firstArc` degrees over the first half and by `secondArc` over the
// second half, so the tangent never jumps where the arcs meet.
type Blade = {
  x: number;
  length: number;
  // Initial tilt from vertical in degrees, positive leans right.
  angle: number;
  firstArc: number;
  secondArc: number;
  shade: number;
};

type Cell = {
  x: number;
  // Rows above the base of the blade.
  rise: number;
  width: number;
  height: number;
};

function createRandom(seed: number) {
  let state = seed;

  // mulberry32: small, fast and good enough for pixel art.
  return () => {
    state = (state + 0x6d2b79f5) | 0;

    let mixed = Math.imul(state ^ (state >>> 15), 1 | state);
    mixed = (mixed + Math.imul(mixed ^ (mixed >>> 7), 61 | mixed)) ^ mixed;

    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296;
  };
}

// Blades are spread evenly: each one gets its own slot of the tuft and a
// uniformly random position inside it. Taller blades are drawn first so
// shorter ones sit in front of them.
function createBlades(seed: number) {
  const random = createRandom(seed);
  const between = (min: number, max: number) => min + random() * (max - min);
  const slotWidth = GRID_WIDTH / BLADE_COUNT;

  return Array.from({ length: BLADE_COUNT }, (_, slot): Blade => ({
    x: Math.min(GRID_WIDTH - 1, Math.round((slot + random()) * slotWidth)),
    length: between(LENGTH_MIN, LENGTH_MAX),
    angle: between(-ANGLE_MAX, ANGLE_MAX),
    firstArc: between(-ARC_MAX, ARC_MAX),
    secondArc: between(-ARC_MAX, ARC_MAX),
    shade: Math.floor(random() * SHADE_COUNT),
  })).sort((a, b) => b.length - a.length);
}

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

// Walks along the blade, turning the heading at a constant rate on each half,
// and records the pixel cells it passes through. Steep stretches are two
// pixels wide, flat stretches are two pixels tall and the tip is one pixel.
function getBladeCells({ x, length, angle, firstArc, secondArc }: Blade) {
  const cells = new Map<string, Cell>();
  const steps = Math.round(length * STEPS_PER_PIXEL);
  const stepLength = length / steps;

  let positionX = x;
  let rise = 0;

  for (let step = 0; step <= steps; step++) {
    const progress = step / steps;
    const heading = toRadians(
      progress < 0.5
        ? angle + firstArc * (progress / 0.5)
        : angle + firstArc + secondArc * ((progress - 0.5) / 0.5),
    );

    const isTip = progress > TIP_START;
    const isFlat = Math.abs(Math.sin(heading)) > STEEP_LIMIT;
    const cell: Cell = {
      x: Math.round(positionX),
      rise: Math.round(rise),
      width: isTip || isFlat ? 1 : 2,
      height: isTip || !isFlat ? 1 : 2,
    };

    cells.set(`${cell.x},${cell.rise},${cell.width},${cell.height}`, cell);

    positionX += Math.sin(heading) * stepLength;
    rise += Math.cos(heading) * stepLength;
  }

  return [...cells.values()];
}

function getCellsPath(cells: Cell[]) {
  return cells
    .map(({ x, rise, width, height }) => {
      const top = GRID_HEIGHT - rise - height;

      return `M${x} ${top}h${width}v${height}h-${width}z`;
    })
    .join("");
}

const TUFTS = new Map<number, { path: string; shade: number }[]>();

// Every tuft has its own seed, so the field does not repeat.
export function getTuftBlades(tuft: number) {
  let blades = TUFTS.get(tuft);

  if (!blades) {
    blades = createBlades(SEED + tuft * 7919).map((blade) => ({
      path: getCellsPath(getBladeCells(blade)),
      shade: blade.shade,
    }));

    TUFTS.set(tuft, blades);
  }

  return blades;
}

// Mirrors the CSS sizing, for code that needs to know how wide a tuft is.
export function getGrassTuftWidthPx() {
  const pixelSize = Math.max(
    1,
    Math.floor((window.innerHeight * GRASS_HEIGHT_DVH) / 100 / GRID_HEIGHT),
  );

  return GRID_WIDTH * pixelSize;
}
