import { createContext } from "react";
import { z } from "zod";

const STORAGE_KEY_PREFIX = "pokemon-randomizer";

export const StorageKeys = {
  CurrentPokemonId: `${STORAGE_KEY_PREFIX}:current-pokemon-id`,
  FoundPokemonIds: `${STORAGE_KEY_PREFIX}:found-pokemon-ids`,
} as const;

export const PokemonCountContext = createContext<number>(0);

export const pokemonListResponseSchema = z.object({
  count: z.number().int().nonnegative(),
});

export const pokemonResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  sprites: z.object({
    other: z.object({
      "official-artwork": z.object({
        front_default: z.string().nullable(),
      }),
      "home": z.object({
        front_default: z.string().nullable(),
      }),
    }),
  }),
});
