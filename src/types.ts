import { z } from "zod";

export const pokemonListResponseSchema = z.object({
  count: z.number().int().nonnegative(),
});

export type PokemonListResponse = z.infer<typeof pokemonListResponseSchema>;
