import { useFoundPokemonIds, usePokemonCount } from "../hooks";

interface HeaderProps {
  onChange: (checked: boolean) => void;
}

export const Header = ({ onChange }: HeaderProps) => {
  const pokemonCount = usePokemonCount();
  const { foundPokemonCount } = useFoundPokemonIds();

  return (
    <header>
      <label>
        <input
          type="checkbox"
          onChange={(e) => onChange(e.currentTarget.checked)}
          hidden
        />
        {foundPokemonCount} / {pokemonCount}
      </label>
    </header>
  );
};
