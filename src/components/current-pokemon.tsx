import { useCurrentPokemonState, useRandomize } from "../hooks";
import { Logo } from "./logo";
import { RandomizeButton } from "./randomize-button";
import { Stage } from "./stage";

export const CurrentPokemon = () => {
  const { randomize, targetId } = useRandomize();
  const state = useCurrentPokemonState();

  return (
    <>
      {!("pokemon" in state) && <Logo />}
      <RandomizeButton onClick={randomize} />
      <Stage targetId={targetId} />
    </>
  );
};
