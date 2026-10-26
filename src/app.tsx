import { use, useMemo, useReducer, useState } from "react";
import { fetchPokemonCount } from "./services";
import {
  CurrentPokemonActionsContext,
  CurrentPokemonStateContext,
  currentPokemonStateReducer,
  CurrentPokemonStates,
  PokemonCountContext,
  type CurrentPokemonActions,
} from "./helpers";
import { CurrentPokemon, Header, Pokedex } from "./components";
import { useCurrentPokemon } from "./hooks";

const POKEMON_COUNT_PROMISE = fetchPokemonCount();

export const App = () => {
  const pokemonCount = use(POKEMON_COUNT_PROMISE);
  const { currentPokemon } = useCurrentPokemon();
  const [showPokedex, setShowPokedex] = useState(false);
  const [state, dispatch] = useReducer(
    currentPokemonStateReducer,
    currentPokemon ? CurrentPokemonStates.Revealed : CurrentPokemonStates.Idle,
  );

  const actions = useMemo<CurrentPokemonActions>(
    () => ({
      startRandomization: () => dispatch({ type: "startRandomization" }),

      finishIdAnimation: () => dispatch({ type: "finishIdAnimation" }),

      finishSilhouetteAnimation: () =>
        dispatch({ type: "finishSilhouetteAnimation" }),

      reset: () => dispatch({ type: "reset" }),
    }),
    [],
  );

  return (
    <CurrentPokemonActionsContext.Provider value={actions}>
      <CurrentPokemonStateContext.Provider value={state}>
        <PokemonCountContext.Provider value={pokemonCount}>
          <main data-state={state}>
            <Header onChange={setShowPokedex} />
            <Pokedex open={showPokedex} />
            <CurrentPokemon />
          </main>
        </PokemonCountContext.Provider>
      </CurrentPokemonStateContext.Provider>
    </CurrentPokemonActionsContext.Provider>
  );
};
