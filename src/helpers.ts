import { createContext } from "react";
import { z } from "zod";

export const STORAGE_KEY_PREFIX = "pokemon-randomizer:";

export const StorageKeys = {
  CurrentPokemon: `${STORAGE_KEY_PREFIX}current-pokemon-id`,
  Pokedex: `${STORAGE_KEY_PREFIX}pokedex`,
  PokedexFilter: `${STORAGE_KEY_PREFIX}pokedex-filter`,
} as const;

// A Pokémon without a status has not been seen yet. Caught implies seen.
export type PokedexStatus = "seen" | "caught";

export type PokedexRecord = Record<number, PokedexStatus>;

// The groups of the pokedex list that can be switched on and off.
export type PokedexGroup = PokedexStatus | "unseen";

// Only the caught Pokémon are shown until more groups are switched on.
export const DEFAULT_POKEDEX_GROUPS: PokedexGroup[] = ["caught"];

export const PokemonCountContext = createContext<number>(0);

export const pokemonListResponseSchema = z.object({
  count: z.number().int().nonnegative(),
});

// The Pokémon as the app keeps it, and as it is saved in local storage.
const pokemonSchema = z.object({
  id: z.number(),
  name: z.string(),
  names: z.partialRecord(z.string(), z.string()),
  imgUrl: z.string(),
});

export const pokemonResponseSchema = z
  .object({
    id: z.number(),
    name: z.string(),
    sprites: z.object({
      front_default: z.string(),
    }),
  })
  .transform(({ id, name, sprites: { front_default: imgUrl } }) => ({
    id,
    name,
    imgUrl,
  }));

// The names of a species by language code, e.g. `{ en: "Mr. Mime", ja: "バリヤード" }`.
export const pokemonSpeciesResponseSchema = z
  .object({
    names: z.array(
      z.object({ name: z.string(), language: z.object({ name: z.string() }) }),
    ),
  })
  .transform(
    ({ names }) =>
      Object.fromEntries(
        names.map(({ name, language }) => [language.name, name]),
      ) as Partial<Record<string, string>>,
  );

export type PokemonResponse = z.infer<typeof pokemonSchema>;

export const CurrentPokemonStates = {
  Idle: "idle",
  Shaking: "shaking",
  IdAnimation: "id-animation",
  SilhouetteAnimation: "silhouette-animation",
  Revealed: "revealed",
} as const;

type CurrentPokemonState =
  | { phase: typeof CurrentPokemonStates.Idle }
  | { phase: typeof CurrentPokemonStates.Shaking }
  | { phase: typeof CurrentPokemonStates.IdAnimation }
  | {
      phase: typeof CurrentPokemonStates.SilhouetteAnimation;
      pokemon: PokemonResponse;
    }
  | {
      phase: typeof CurrentPokemonStates.Revealed;
      pokemon: PokemonResponse;
    };

type CurrentPokemonAction =
  | { type: "startRandomization" }
  | { type: "failRandomization" }
  | { type: "finishShake" }
  | { type: "finishIdAnimation"; pokemon: PokemonResponse }
  | { type: "finishSilhouetteAnimation" }
  | { type: "reset" };

export type CurrentPokemonActions = {
  startRandomization: () => void;
  failRandomization: () => void;
  finishShake: () => void;
  finishIdAnimation: (pokemon: PokemonResponse) => void;
  finishSilhouetteAnimation: () => void;
  reset: () => void;
};

export const CurrentPokemonStateContext =
  createContext<CurrentPokemonState | null>(null);

export const CurrentPokemonActionsContext =
  createContext<CurrentPokemonActions | null>(null);

// The saved Pokémon is read once, on load. After that the reducer owns it
// and the app only writes it back (see `storeCurrentPokemon`).
// Anything that is not a valid saved Pokémon is dropped instead of crashing.
function readStoredPokemon() {
  const storedPokemon = window.localStorage.getItem(StorageKeys.CurrentPokemon);

  if (!storedPokemon) return null;

  try {
    const result = pokemonSchema.safeParse(JSON.parse(storedPokemon));

    if (result.success) return result.data;
  } catch {
    // Not valid JSON, treated like any other invalid value.
  }

  storeCurrentPokemon(null);

  return null;
}

export function getInitialCurrentPokemonState(): CurrentPokemonState {
  const pokemon = readStoredPokemon();

  return pokemon
    ? { phase: CurrentPokemonStates.Revealed, pokemon }
    : { phase: CurrentPokemonStates.Idle };
}

function storeCurrentPokemon(pokemon: PokemonResponse | null) {
  if (pokemon) {
    window.localStorage.setItem(
      StorageKeys.CurrentPokemon,
      JSON.stringify(pokemon),
    );
  } else {
    window.localStorage.removeItem(StorageKeys.CurrentPokemon);
  }
}

function getPokemon(state: CurrentPokemonState) {
  return "pokemon" in state ? state.pokemon : null;
}

// Not strictly pure: it persists the Pokémon whenever it changes.
// The writes are idempotent, so StrictMode's double invocation is harmless.
export function currentPokemonStateReducer(
  state: CurrentPokemonState,
  action: CurrentPokemonAction,
): CurrentPokemonState {
  const nextState = reduceCurrentPokemonState(state, action);

  if (getPokemon(nextState) !== getPokemon(state)) {
    storeCurrentPokemon(getPokemon(nextState));
  }

  return nextState;
}

function reduceCurrentPokemonState(
  state: CurrentPokemonState,
  action: CurrentPokemonAction,
): CurrentPokemonState {
  switch (state.phase) {
    case CurrentPokemonStates.Idle:
      return action.type === "startRandomization"
        ? { phase: CurrentPokemonStates.Shaking }
        : state;

    case CurrentPokemonStates.Shaking:
      switch (action.type) {
        case "finishShake":
          return { phase: CurrentPokemonStates.IdAnimation };
        case "failRandomization":
          return { phase: CurrentPokemonStates.Idle };
        default:
          return state;
      }

    case CurrentPokemonStates.IdAnimation:
      switch (action.type) {
        case "finishIdAnimation":
          return {
            phase: CurrentPokemonStates.SilhouetteAnimation,
            pokemon: action.pokemon,
          };
        case "failRandomization":
          return { phase: CurrentPokemonStates.Idle };
        default:
          return state;
      }

    case CurrentPokemonStates.SilhouetteAnimation:
      return action.type === "finishSilhouetteAnimation"
        ? { phase: CurrentPokemonStates.Revealed, pokemon: state.pokemon }
        : state;

    case CurrentPokemonStates.Revealed:
      return action.type === "reset"
        ? { phase: CurrentPokemonStates.Idle }
        : state;
  }
}

export function padPokemonNumber(value: number, pokemonCount: number) {
  return String(value).padStart(String(pokemonCount).length, "0");
}

export function formatPokemonId(id: number, pokemonCount: number) {
  return `#${padPokemonNumber(id, pokemonCount)}`;
}
