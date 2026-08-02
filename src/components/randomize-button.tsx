import { useLocalStorage } from "@yamori-shared/react-utilities";
import { StorageKey } from "../constants";

interface RandomizeButtonProps {
  pokemonCount: number;
}

export const RandomizeButton = ({ pokemonCount }: RandomizeButtonProps) => {
  const [, setCurrentPokemonId] = useLocalStorage<number>(
    StorageKey.CurrentPokemonId,
  );

  const randomizePokemon = () => {
    setCurrentPokemonId(Math.floor(Math.random() * pokemonCount) + 1);
  };

  return (
    <button type="button" onClick={randomizePokemon}>
      Randomize Pokémon
    </button>
  );
};
