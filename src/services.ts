import { pokemonListResponseSchema, pokemonResponseSchema } from "./helpers";

export async function fetchPokemonCount() {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon-species");

  if (!response.ok)
    throw new Error(`Could not load Pokémon list: ${response.status}`);

  return pokemonListResponseSchema.parse(await response.json()).count;
}

export async function fetchPokemon(id: number) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);

  if (!response.ok)
    throw new Error(`Could not load Pokemon info: ${response.status}`);

  return pokemonResponseSchema.parse(await response.json());
}
