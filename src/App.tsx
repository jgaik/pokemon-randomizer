import { use } from "react";
import { useLocalStorage } from "@yamori-shared/react-utilities";
import { StorageKey } from "./constants";
import { fetchPokemonCount } from "./utilities";

const pokemonCountPromise = fetchPokemonCount();

export const App = () => {
  const pokemonCount = use(pokemonCountPromise);
  const [currentPokemonId, setCurrentPokemonId] = useLocalStorage<number>(
    StorageKey.CurrentPokemonId,
  );

  const randomizePokemon = () => {
    setCurrentPokemonId(Math.floor(Math.random() * pokemonCount) + 1);
  };

  return (
    <main>
      <button type="button" onClick={randomizePokemon}>
        Randomize Pokémon
      </button>
      <output>{currentPokemonId ?? "—"}</output>
    </main>
  );
};
