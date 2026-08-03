import { assertNonNullable } from "@yamori-shared/react-utilities";
import { useCurrentPokemonId, useFoundPokemonIds } from "../hooks";

export const PokemonActions = () => {
  const { currentPokemonId, removeCurrentPokemonId } = useCurrentPokemonId();

  const { addFoundPokemonId } = useFoundPokemonIds();

  const handleFound = () => {
    assertNonNullable(currentPokemonId, "Current pokemon ID");
    addFoundPokemonId(currentPokemonId);

    removeCurrentPokemonId();
  };

  return (
    <div id="pokemon-actions">
      <button onClick={handleFound}>Found</button>
      <button onClick={removeCurrentPokemonId}>Skip</button>
    </div>
  );
};
