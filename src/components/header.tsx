import { padPokemonNumber } from "../helpers";
import { usePokedex, usePokemonCount } from "../hooks";
import { BallIcon } from "./ball-icon";
import { PokedexFilter } from "./pokedex-filter";

interface HeaderProps {
  open: boolean;
  onChange: (checked: boolean) => void;
}

export const Header = ({ open, onChange }: HeaderProps) => {
  const pokemonCount = usePokemonCount();
  const { caughtPokemonCount } = usePokedex();

  return (
    <header className="header">
      <label className="header__badge">
        <input
          type="checkbox"
          checked={open}
          onChange={(e) => onChange(e.currentTarget.checked)}
          hidden
        />

        <BallIcon />

        <span className="header__count">
          {padPokemonNumber(caughtPokemonCount, pokemonCount)}/{pokemonCount}
        </span>

        <progress
          className="header__bar"
          aria-label="Pokémon found"
          max={pokemonCount}
          value={caughtPokemonCount}
        />
      </label>

      {open && <PokedexFilter />}
    </header>
  );
};
