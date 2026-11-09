import { CurrentPokemonStates } from "../helpers";
import { useCurrentPokemonActions, useCurrentPokemonState } from "../hooks";
import { IdAnimation } from "./id-animation";
import { PokemonReveal } from "./pokemon-reveal";
import { SilhouetteAnimation } from "./silhouette-animation";

type StageProps = {
  targetId: number;
};

export const Stage = ({ targetId }: StageProps) => {
  const state = useCurrentPokemonState();
  const { finishSilhouetteAnimation } = useCurrentPokemonActions();

  switch (state.phase) {
    case CurrentPokemonStates.Idle:
    case CurrentPokemonStates.Shaking:
      return null;

    case CurrentPokemonStates.IdAnimation:
      return <IdAnimation targetId={targetId} />;

    case CurrentPokemonStates.SilhouetteAnimation:
      return (
        <SilhouetteAnimation
          pokemon={state.pokemon}
          onFinish={finishSilhouetteAnimation}
        />
      );

    case CurrentPokemonStates.Revealed:
      return <PokemonReveal pokemon={state.pokemon} />;
  }
};
