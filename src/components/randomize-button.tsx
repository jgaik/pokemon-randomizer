import { useCurrentPokemonId, useRandomPokemonId } from "../hooks";

export const RandomizeButton = () => {
  const { setCurrentPokemonId } = useCurrentPokemonId();
  const { getRandomPokemonId } = useRandomPokemonId();

  return (
    <button
      id="randomize-button"
      type="button"
      onClick={() => setCurrentPokemonId(getRandomPokemonId())}
    >
      Randomize Pokémon
    </button>
  );
};
