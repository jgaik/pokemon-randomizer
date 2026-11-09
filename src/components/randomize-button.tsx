import { useEffect, useState } from "react";
import { CurrentPokemonStates } from "../helpers";
import { useCurrentPokemonState } from "../hooks";
import { RUSTLE_MS } from "../constants";
import { getGrassTuftWidthPx } from "../grass";
import { GrassSprite } from "./grass-sprite";

const TUFT_COUNT = 32;
const RUSTLE_MIN_DELAY_MS = 3000;
const RUSTLE_MAX_DELAY_MS = 6000;

// Every now and then one visible tuft rustles, as if something is hiding in it.
function useRustlingTuft(enabled: boolean) {
  const [rustlingTuft, setRustlingTuft] = useState<number | null>(null);

  useEffect(() => {
    if (!enabled) return;

    let timeout: ReturnType<typeof setTimeout>;

    const scheduleRustle = () => {
      const delay =
        RUSTLE_MIN_DELAY_MS +
        Math.random() * (RUSTLE_MAX_DELAY_MS - RUSTLE_MIN_DELAY_MS);

      timeout = setTimeout(() => {
        const visibleHalf = Math.ceil(
          Math.ceil(window.innerWidth / getGrassTuftWidthPx()) / 2,
        );

        setRustlingTuft(
          TUFT_COUNT / 2 -
            visibleHalf +
            Math.floor(Math.random() * visibleHalf * 2),
        );

        timeout = setTimeout(() => {
          setRustlingTuft(null);
          scheduleRustle();
        }, RUSTLE_MS);
      }, delay);
    };

    scheduleRustle();

    return () => clearTimeout(timeout);
  }, [enabled]);

  return enabled ? rustlingTuft : null;
}

interface RandomizeButtonProps {
  onClick: () => void;
}

export const RandomizeButton = ({ onClick }: RandomizeButtonProps) => {
  const { phase } = useCurrentPokemonState();
  const isIdle = phase === CurrentPokemonStates.Idle;
  const rustlingTuft = useRustlingTuft(isIdle);

  return (
    <button
      id="randomize-button"
      type="button"
      aria-label="Randomize Pokémon"
      disabled={!isIdle}
      onClick={onClick}
    >
      <span className="grass-row">
        {Array.from({ length: TUFT_COUNT }, (_, tuft) => (
          <GrassSprite
            key={tuft}
            tuft={tuft}
            rustling={tuft === rustlingTuft}
          />
        ))}
      </span>
    </button>
  );
};
