import {
  pokemonListResponseSchema,
  pokemonResponseSchema,
  pokemonSpeciesResponseSchema,
} from "./helpers";

export async function fetchPokemonCount() {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon-species");

  if (!response.ok)
    throw new Error(`Could not load Pokémon list: ${response.status}`);

  return pokemonListResponseSchema.parse(await response.json()).count;
}

export async function fetchPokemon(id: number) {
  const [response, speciesResponse] = await Promise.all([
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`),
    fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`),
  ]);

  if (!response.ok)
    throw new Error(`Could not load Pokemon info: ${response.status}`);

  if (!speciesResponse.ok)
    throw new Error(`Could not load Pokemon species: ${speciesResponse.status}`);

  const pokemon = pokemonResponseSchema.parse(await response.json());
  const names = pokemonSpeciesResponseSchema.parse(
    await speciesResponse.json(),
  );

  return { ...pokemon, name: names.en ?? pokemon.name, names };
}

export async function preloadImage(url: string) {
  const image = new Image();
  image.src = url;

  await image.decode();
}
