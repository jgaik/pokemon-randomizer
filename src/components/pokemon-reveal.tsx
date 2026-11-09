import { useRef, useState, type AnimationEvent } from "react";
import { formatPokemonId, type PokemonResponse } from "../helpers";
import {
  useCurrentPokemonActions,
  usePokedex,
  usePokemonCount,
} from "../hooks";
import { BallIcon } from "./ball-icon";
import { PokemonActions } from "./pokemon-actions";

const CATCH_BALL_SIZE = 45;

const RUN_DIRECTIONS = ["top", "left", "right"] as const;

type Action =
  | { kind: "run"; direction: (typeof RUN_DIRECTIONS)[number] }
  | { kind: "catch"; ball: { x: number; y: number } };

type Chosen = {
  action: Action;
  stage: "away" | "exit";
};

type PokemonRevealProps = {
  pokemon: PokemonResponse;
};

export const PokemonReveal = ({ pokemon }: PokemonRevealProps) => {
  const pokemonCount = usePokemonCount();
  const { reset } = useCurrentPokemonActions();
  const { markSeen, markCaught } = usePokedex();
  const [chosen, setChosen] = useState<Chosen | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleRun = () =>
    setChosen({
      action: {
        kind: "run",
        direction:
          RUN_DIRECTIONS[Math.floor(Math.random() * RUN_DIRECTIONS.length)],
      },
      stage: "away",
    });

  const handleCatch = () => {
    const section = sectionRef.current?.getBoundingClientRect();
    const image = imageRef.current?.getBoundingClientRect();

    if (!section || !image) return;

    setChosen({
      action: {
        kind: "catch",
        ball: {
          x: image.left + image.width / 2 - section.left,
          y: image.top + image.height / 2 - section.top,
        },
      },
      stage: "away",
    });
  };

  const handleAnimationEnd = ({ animationName }: AnimationEvent) => {
    if (
      chosen?.stage === "away" &&
      (animationName.startsWith("run") || animationName === "catchBall")
    ) {
      setChosen({ ...chosen, stage: "exit" });
    } else if (chosen?.stage === "exit" && animationName === "slideDown") {
      if (chosen.action.kind === "catch") {
        markCaught(pokemon.id);
      } else {
        markSeen(pokemon.id);
      }

      reset();
    }
  };

  return (
    <section
      ref={sectionRef}
      className="pokemon-reveal"
      data-running={chosen?.stage === "exit"}
      onAnimationEnd={handleAnimationEnd}
    >
      {chosen?.action.kind === "catch" && (
        <BallIcon
          className="pokemon-reveal__ball"
          size={CATCH_BALL_SIZE}
          style={{ left: chosen.action.ball.x, top: chosen.action.ball.y }}
        />
      )}

      <div className="pokemon-reveal__content">
        <img
          ref={imageRef}
          src={pokemon.imgUrl}
          alt={pokemon.name}
          className="pokemon-image"
          data-run={
            chosen?.action.kind === "run" ? chosen.action.direction : undefined
          }
          data-catch={chosen?.action.kind === "catch"}
          draggable={false}
        />

        <div className="pokemon-reveal__details">
          <div className="pokemon-reveal__details-content">
            <output>{formatPokemonId(pokemon.id, pokemonCount)}</output>

            <h2>{pokemon.name}</h2>

            {pokemon.names.ja && (
              <span className="pokemon-reveal__secondary-name" lang="ja">
                {pokemon.names.ja}
              </span>
            )}
          </div>
        </div>
      </div>

      <PokemonActions
        disabled={chosen !== null}
        onCatch={handleCatch}
        onRun={handleRun}
      />
    </section>
  );
};
