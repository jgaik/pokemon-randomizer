import { assertNonNullable } from "@yamori-shared/react-utilities";
import {
  useCurrentPokemonActions,
  useCurrentPokemon,
  useFoundPokemonIds,
} from "../hooks";

export const PokemonActions = () => {
  const { currentPokemon, removeCurrentPokemon } = useCurrentPokemon();
  const { reset } = useCurrentPokemonActions();

  const { addFoundPokemonId } = useFoundPokemonIds();

  const handleFound = () => {
    assertNonNullable(currentPokemon, "Current pokemon");
    addFoundPokemonId(currentPokemon.id);

    removeCurrentPokemon();
    reset();
  };

  return (
    <div id="pokemon-actions">
      <button onClick={handleFound}>Found</button>
      <button
        onClick={() => {
          removeCurrentPokemon();
          reset();
        }}
      >
        Skip
      </button>
    </div>
  );
};
