import { usePokedex, usePokedexFilter, usePokemonCount } from "../hooks";
import { PokedexEntry } from "./pokedex-entry";

interface PokedexProps {
  open: boolean;
}

export const Pokedex = ({ open }: PokedexProps) => {
  const pokemonCount = usePokemonCount();
  const { getStatus } = usePokedex();
  const { shownGroups } = usePokedexFilter();

  const visibleIds = Array.from(
    { length: pokemonCount },
    (_, index) => index + 1,
  ).filter((id) => shownGroups.has(getStatus(id) ?? "unseen"));

  return (
    <div className="pokedex" data-open={open}>
      <ol className="pokedex__list">
        {visibleIds.map((id) => (
          <li key={id} className="pokedex__entry">
            {open ? <PokedexEntry id={id} /> : <PokedexEntry.Index id={id} />}
          </li>
        ))}
      </ol>
    </div>
  );
};
