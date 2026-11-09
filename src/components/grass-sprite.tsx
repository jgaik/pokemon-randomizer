import { memo, useId, type CSSProperties } from "react";
import { GRASS_HEIGHT_DVH, RUSTLE_MS } from "../constants";
import {
  getTuftBlades,
  GRID_HEIGHT,
  GRID_WIDTH,
  GROUND_HEIGHT,
  SHADE_COLORS,
} from "../grass";

type GrassSpriteProps = {
  tuft: number;
  rustling: boolean;
};

// The blades move sideways when they shake, so they are clipped above the
// ground, however far they go, instead of relying on the ground covering them.
const CLIP_MARGIN = 100;

export const GrassSprite = memo(({ tuft, rustling }: GrassSpriteProps) => {
  const clipId = `grass-clip-${useId().replaceAll(":", "")}`;

  return (
    <svg
      className="grass-sprite"
      data-rustling={rustling}
      style={
        {
          "--tuft": tuft,
          "--rustle-ms": `${RUSTLE_MS}ms`,
          "--grass-height": `${GRASS_HEIGHT_DVH}dvh`,
          "--grid-height": GRID_HEIGHT,
        } as CSSProperties
      }
      viewBox={`0 0 ${GRID_WIDTH} ${GRID_HEIGHT}`}
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      <defs>
        <clipPath id={clipId}>
          <rect
            x={-CLIP_MARGIN}
            y={-CLIP_MARGIN}
            width={GRID_WIDTH + CLIP_MARGIN * 2}
            height={CLIP_MARGIN + GRID_HEIGHT - GROUND_HEIGHT}
          />
        </clipPath>
      </defs>

      <g className="grass-sprite__blades" clipPath={`url(#${clipId})`}>
        {getTuftBlades(tuft).map(({ path, shade }, index) => (
          <path
            key={index}
            d={path}
            className="grass-sprite__blade"
            style={
              { fill: SHADE_COLORS[shade], "--index": index } as CSSProperties
            }
          />
        ))}
      </g>

      <path
        className="grass-sprite__ground"
        d={`M-1 ${GRID_HEIGHT - GROUND_HEIGHT}h${GRID_WIDTH + 2}v${GROUND_HEIGHT}h-${GRID_WIDTH + 2}z`}
      />
    </svg>
  );
});
