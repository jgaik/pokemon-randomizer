import { useState, useEffect } from "react";
import { ROLL_MS } from "../constants";
import { formatPokemonId } from "../helpers";
import { usePokemonCount } from "../hooks";

const MIN_DELAY_MS = 80;
const MAX_DELAY_MS = 500;

type IdAnimationProps = {
  targetId: number;
};

export const IdAnimation = ({ targetId }: IdAnimationProps) => {
  const pokemonCount = usePokemonCount();

  const [displayId, setDisplayId] = useState(targetId);

  useEffect(() => {
    let elapsed = 0;
    let timeout: ReturnType<typeof setTimeout>;

    const tick = () => {
      const delay =
        MIN_DELAY_MS + (MAX_DELAY_MS - MIN_DELAY_MS) * (elapsed / ROLL_MS) ** 3;

      elapsed += delay;

      if (elapsed >= ROLL_MS) {
        setDisplayId(targetId);
        return;
      }

      setDisplayId(Math.floor(Math.random() * pokemonCount) + 1);
      timeout = setTimeout(tick, delay);
    };

    tick();

    return () => clearTimeout(timeout);
  }, [pokemonCount, targetId]);

  return (
    <output className="id-animation">
      {formatPokemonId(displayId, pokemonCount)}
    </output>
  );
};
