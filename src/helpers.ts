import { createContext } from "react";
import { z } from "zod";

const STORAGE_KEY_PREFIX = "pokemon-randomizer";

export const StorageKeys = {
  CurrentPokemon: `${STORAGE_KEY_PREFIX}:current-pokemon-id`,
  FoundPokemonIds: `${STORAGE_KEY_PREFIX}:found-pokemon-ids`,
} as const;

export const PokemonCountContext = createContext<number>(0);

export const pokemonListResponseSchema = z.object({
  count: z.number().int().nonnegative(),
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

export type PokemonResponse = z.infer<typeof pokemonResponseSchema>;

export const CurrentPokemonStates = {
  Idle: "idle",
  IdAnimation: "id-animation",
  SilhouetteAnimation: "silhouette-animation",
  Revealed: "revealed",
} as const;

export type CurrentPokemonState =
  (typeof CurrentPokemonStates)[keyof typeof CurrentPokemonStates];

type CurrentPokemonAction =
  | { type: "startRandomization" }
  | { type: "finishIdAnimation" }
  | { type: "finishSilhouetteAnimation" }
  | { type: "reset" };

export type CurrentPokemonActions = {
  startRandomization: () => void;
  finishIdAnimation: () => void;
  finishSilhouetteAnimation: () => void;
  reset: () => void;
};

export const CurrentPokemonStateContext =
  createContext<CurrentPokemonState | null>(null);

export const CurrentPokemonActionsContext =
  createContext<CurrentPokemonActions | null>(null);

export function currentPokemonStateReducer(
  state: CurrentPokemonState,
  action: CurrentPokemonAction,
): CurrentPokemonState {
  switch (state) {
    case CurrentPokemonStates.Idle:
      return action.type === "startRandomization"
        ? CurrentPokemonStates.IdAnimation
        : state;

    case CurrentPokemonStates.IdAnimation:
      return action.type === "finishIdAnimation"
        ? CurrentPokemonStates.SilhouetteAnimation
        : state;

    case CurrentPokemonStates.SilhouetteAnimation:
      return action.type === "finishSilhouetteAnimation"
        ? CurrentPokemonStates.Revealed
        : state;

    case CurrentPokemonStates.Revealed:
      return action.type === "reset" ? CurrentPokemonStates.Idle : state;
  }
}
