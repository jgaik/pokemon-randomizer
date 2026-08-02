import { pokemonListResponseSchema } from "../types";

export async function fetchPokemonCount() {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon-species");

  if (!response.ok) {
    throw new Error(`Could not load Pokémon list: ${response.status}`);
  }

  return pokemonListResponseSchema.parse(await response.json()).count;
}
