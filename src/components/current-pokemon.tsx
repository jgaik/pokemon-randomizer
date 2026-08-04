import { useCallback } from "react";
import { CurrentPokemonStates } from "../helpers";
import { fetchPokemon } from "../services";
import {
  useCurrentPokemonActions,
  useCurrentPokemon,
  useCurrentPokemonState,
  useRandomPokemonId,
} from "../hooks";
import { IdAnimation } from "./id-animation";
import { PokemonActions } from "./pokemon-actions";

import { RandomizeButton } from "./randomize-button";
import { SilhouetteAnimation } from "./silhouette-animation";
import { PokemonReveal } from "./pokemon-reveal";

const ID_ANIMATION_MIN_DURATION_MS = 1500;

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function CurrentPokemon() {
  const currentPokemonState = useCurrentPokemonState();

  const { startRandomization, finishIdAnimation, finishSilhouetteAnimation } =
    useCurrentPokemonActions();

  const { getRandomPokemonId } = useRandomPokemonId();

  const { setCurrentPokemon } = useCurrentPokemon();

  const randomize = useCallback(async () => {
    const pokemonId = getRandomPokemonId();

    if (pokemonId == null) {
      return;
    }

    startRandomization();

    const [pokemon] = await Promise.all([
      fetchPokemon(pokemonId),
      wait(ID_ANIMATION_MIN_DURATION_MS),
    ]);

    setCurrentPokemon(pokemon);

    finishIdAnimation();
  }, [
    finishIdAnimation,
    getRandomPokemonId,
    setCurrentPokemon,
    startRandomization,
  ]);

  switch (currentPokemonState) {
    case CurrentPokemonStates.Idle:
      return <RandomizeButton onClick={randomize} />;

    case CurrentPokemonStates.IdAnimation:
      return <IdAnimation />;

    case CurrentPokemonStates.SilhouetteAnimation:
      return <SilhouetteAnimation onAnimationEnd={finishSilhouetteAnimation} />;

    case CurrentPokemonStates.Revealed:
      return (
        <>
          <PokemonReveal />

          <PokemonActions />
        </>
      );
  }
}
