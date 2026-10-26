import { Suspense, use } from "react";
import { fetchPokemon } from "../services";
import { useFoundPokemonIds } from "../hooks";

interface PokedexEntryProps {
  id: number;
}

const pokemonPromises = new Map<number, ReturnType<typeof fetchPokemon>>();

function getPokemonPromise(id: number) {
  let promise = pokemonPromises.get(id);

  if (promise == null) {
    promise = fetchPokemon(id);
    pokemonPromises.set(id, promise);
  }

  return promise;
}

function PokedexEntryContent({ id }: PokedexEntryProps) {
  const pokemon = use(getPokemonPromise(id));

  return (
    <>
      <span>#{pokemon.id}</span>
      <img src={pokemon.imgUrl} alt={pokemon.name} />

      <span>{pokemon.name}</span>
    </>
  );
}

function PokedexEntryFallback({ id }: PokedexEntryProps) {
  return (
    <>
      <span>#{id}</span>
      <span aria-label="Loading">…</span>
    </>
  );
}

const PokedexEntryIndex = ({ id }: PokedexEntryProps) => <span>#{id}</span>;

export const PokedexEntry = ({ id }: PokedexEntryProps) => {
  const { hasFoundPokemonId } = useFoundPokemonIds();

  if (!hasFoundPokemonId(id)) {
    return <PokedexEntryIndex id={id} />;
  }

  return (
    <Suspense fallback={<PokedexEntryFallback id={id} />}>
      <PokedexEntryContent id={id} />
    </Suspense>
  );
};

PokedexEntry.Index = PokedexEntryIndex;
