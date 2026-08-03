import { use, useState } from "react";
import { fetchPokemonCount } from "./services";
import { PokemonCountContext } from "./helpers";
import { CurrentPokemon, Header, Pokedex, RandomizeButton } from "./components";

const POKEMON_COUNT_PROMISE = fetchPokemonCount();

export const App = () => {
  const pokemonCount = use(POKEMON_COUNT_PROMISE);
  const [showPokedex, setShowPokedex] = useState(false);

  return (
    <PokemonCountContext.Provider value={pokemonCount}>
      <main>
        <Header onChange={setShowPokedex} />
        {showPokedex && <Pokedex />}
        <CurrentPokemon />
        <RandomizeButton />
      </main>
    </PokemonCountContext.Provider>
  );
};
