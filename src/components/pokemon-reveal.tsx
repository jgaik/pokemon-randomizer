import { useCurrentPokemon } from "../hooks";

export const PokemonReveal = () => {
  const { currentPokemon } = useCurrentPokemon();

  if (!currentPokemon) return null;

  return (
    <section className="pokemon-reveal">
      <img
        src={currentPokemon.imgUrl}
        alt={currentPokemon.name}
        className="pokemon-reveal__image"
        draggable={false}
      />

      <div className="pokemon-reveal__info">
        <output>#{currentPokemon.id}</output>

        <h2>{currentPokemon.name}</h2>
      </div>
    </section>
  );
};
