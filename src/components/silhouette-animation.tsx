import { useEffect, useState, type CSSProperties } from "react";
import { formatPokemonId, type PokemonResponse } from "../helpers";
import { usePokemonCount } from "../hooks";

// A cycle is a number slot followed by a silhouette slot.
const CYCLE_COUNT = 3;
const SWAP_MS = 400;
const HOLD_MS = 600;

const SLOT_COUNT = CYCLE_COUNT * 2;

// Even slots show the number, odd slots show the silhouette. All of them last
// the same, except the last one, which is the final hold.
const getSlotMs = (step: number) =>
  step === SLOT_COUNT - 1 ? HOLD_MS : SWAP_MS;

type SilhouetteAnimationProps = {
  pokemon: PokemonResponse;
  onFinish: () => void;
};

export const SilhouetteAnimation = ({
  pokemon,
  onFinish,
}: SilhouetteAnimationProps) => {
  const pokemonCount = usePokemonCount();

  const [step, setStep] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (step === SLOT_COUNT - 1) {
        onFinish();
      } else {
        setStep(step + 1);
      }
    }, getSlotMs(step));

    return () => clearTimeout(timeout);
  }, [step, onFinish]);

  return (
    <section
      className="silhouette-animation"
      data-active={step % 2 === 0 ? "number" : "silhouette"}
      data-first={step === 0}
      data-last={step === SLOT_COUNT - 1}
      style={{ "--slot-ms": `${getSlotMs(step)}ms` } as CSSProperties}
    >
      <output className="silhouette-animation__number">
        {formatPokemonId(pokemon.id, pokemonCount)}
      </output>

      <img
        src={pokemon.imgUrl}
        alt=""
        className="pokemon-image silhouette-animation__image"
        draggable={false}
      />
    </section>
  );
};
