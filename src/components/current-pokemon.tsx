import { useCurrentPokemonId } from "../hooks";
import { PokemonActions } from "./pokemon-actions";

export const CurrentPokemon = () => {
  const { currentPokemonId } = useCurrentPokemonId();
  return (
    <div id="current-pokemon">
      <p>{currentPokemonId}</p>
      {currentPokemonId && <PokemonActions />}
    </div>
  );
};
