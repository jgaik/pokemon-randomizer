import { useFoundPokemonIds, usePokemonCount } from "../hooks";

export const Pokedex = () => {
  const pokemonCount = usePokemonCount();
  const { hasFoundPokemonId } = useFoundPokemonIds();

  return (
    <ol>
      {Array.from({ length: pokemonCount }, (_, index) => {
        const pokemonId = index + 1;

        return (
          <li key={pokemonId}>
            {hasFoundPokemonId(pokemonId) ? "⭐" : "☆"} #{pokemonId}
          </li>
        );
      })}
    </ol>
  );
};
