import { use, useMemo, useReducer, useState, type CSSProperties } from "react";
import { fetchPokemonCount } from "./services";
import {
  CurrentPokemonActionsContext,
  CurrentPokemonStateContext,
  currentPokemonStateReducer,
  getInitialCurrentPokemonState,
  PokemonCountContext,
  type CurrentPokemonActions,
} from "./helpers";
import { CurrentPokemon, Header, Pokedex, RotateNotice } from "./components";

const BACKGROUND_FADE_MS = 1800;
const EXIT_MS = 1200;
const SLIDE_MS = 1800;

const POKEMON_COUNT_PROMISE = fetchPokemonCount();

export const App = () => {
  const pokemonCount = use(POKEMON_COUNT_PROMISE);
  const [showPokedex, setShowPokedex] = useState(false);
  const [state, dispatch] = useReducer(
    currentPokemonStateReducer,
    undefined,
    getInitialCurrentPokemonState,
  );

  const actions = useMemo<CurrentPokemonActions>(
    () => ({
      startRandomization: () => dispatch({ type: "startRandomization" }),

      failRandomization: () => dispatch({ type: "failRandomization" }),

      finishShake: () => dispatch({ type: "finishShake" }),

      finishIdAnimation: (pokemon) =>
        dispatch({ type: "finishIdAnimation", pokemon }),

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
          <main
            data-state={state.phase}
            data-pokedex={showPokedex}
            style={
              {
                "--bg-fade-ms": `${BACKGROUND_FADE_MS}ms`,
                "--exit-ms": `${EXIT_MS}ms`,
                "--slide-ms": `${SLIDE_MS}ms`,
              } as CSSProperties
            }
          >
            <Header open={showPokedex} onChange={setShowPokedex} />
            <Pokedex open={showPokedex} />
            <CurrentPokemon />
          </main>

          <RotateNotice />
        </PokemonCountContext.Provider>
      </CurrentPokemonStateContext.Provider>
    </CurrentPokemonActionsContext.Provider>
  );
};
