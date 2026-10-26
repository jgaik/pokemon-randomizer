import { usePokemonCount } from "../hooks";
import { PokedexEntry } from "./pokedex-entry";

interface PokedexProps {
  open: boolean;
}

export const Pokedex = ({ open }: PokedexProps) => {
  const pokemonCount = usePokemonCount();

  return (
    <ol data-open={open}>
      {Array.from({ length: pokemonCount }, (_, index) => (
        <li key={index + 1}>
          {open ? (
            <PokedexEntry id={index + 1} />
          ) : (
            <PokedexEntry.Index id={index + 1} />
          )}
        </li>
      ))}
    </ol>
  );
};
