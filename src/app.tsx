import { use } from "react";
import { useLocalStorage } from "@yamori-shared/react-utilities";
import { RandomizeButton } from "./components";
import { StorageKey } from "./constants";
import { fetchPokemonCount } from "./utilities";

const pokemonCountPromise = fetchPokemonCount();

export const App = () => {
  const pokemonCount = use(pokemonCountPromise);
  const [currentPokemonId] = useLocalStorage<number>(
    StorageKey.CurrentPokemonId,
  );

  return (
    <main>
      <RandomizeButton pokemonCount={pokemonCount} />
      <output>{currentPokemonId ?? "—"}</output>
    </main>
  );
};
