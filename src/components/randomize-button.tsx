import { useCurrentPokemon } from "../hooks";

interface RandomizeButtonProps {
  onClick: () => void;
}

export const RandomizeButton = ({ onClick }: RandomizeButtonProps) => {
  const { currentPokemon } = useCurrentPokemon();

  return (
    <button
      id="randomize-button"
      type="button"
      disabled={!!currentPokemon}
      onClick={onClick}
    >
      Randomize Pokémon
    </button>
  );
};
