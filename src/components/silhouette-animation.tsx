import { useCurrentPokemon } from "../hooks";

type SilhouetteAnimationProps = {
  onAnimationEnd: () => void;
};

export const SilhouetteAnimation = ({
  onAnimationEnd,
}: SilhouetteAnimationProps) => {
  const { currentPokemon } = useCurrentPokemon();

  if (!currentPokemon) return null;

  return (
    <section className="silhouette-animation" onAnimationEnd={onAnimationEnd}>
      <img
        src={currentPokemon.imgUrl}
        alt=""
        className="silhouette-animation__image"
        draggable={false}
      />
    </section>
  );
};
