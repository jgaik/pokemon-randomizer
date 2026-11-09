import { Component, Suspense, use, type ReactNode } from "react";
import { formatPokemonId, type PokedexStatus } from "../helpers";
import { fetchPokemon } from "../services";
import { usePokedex, usePokemonCount } from "../hooks";
import { BallIcon } from "./ball-icon";

interface PokedexEntryProps {
  id: number;
}

const pokemonPromises = new Map<number, ReturnType<typeof fetchPokemon>>();

// A card has three parts: the number in the header, the picture in the main
// part and the name in the footer. The footer stays empty until caught.
const PokedexEntryCard = ({
  id,
  image,
  name = null,
}: PokedexEntryProps & { image: ReactNode; name?: string | null }) => {
  const pokemonCount = usePokemonCount();

  return (
    <>
      <span className="pokedex__id">{formatPokemonId(id, pokemonCount)}</span>
      <span className="pokedex__image">{image}</span>
      <span className="pokedex__name">{name}</span>
    </>
  );
};

function getPokemonPromise(id: number) {
  let promise = pokemonPromises.get(id);

  if (promise == null) {
    promise = fetchPokemon(id);
    pokemonPromises.set(id, promise);
  }

  return promise;
}

// A seen Pokémon is only a silhouette, a caught one is shown in full.
const PokedexEntryContent = ({
  id,
  status,
}: PokedexEntryProps & { status: PokedexStatus }) => {
  const pokemon = use(getPokemonPromise(id));
  const isCaught = status === "caught";

  return (
    <PokedexEntryCard
      id={id}
      name={isCaught ? pokemon.name : null}
      image={
        <img
          className={isCaught ? undefined : "pokedex__silhouette"}
          src={pokemon.imgUrl}
          alt={isCaught ? pokemon.name : ""}
        />
      }
    />
  );
};

const PokedexEntryFallback = ({ id }: PokedexEntryProps) => (
  <PokedexEntryCard
    id={id}
    image={
      <span role="img" aria-label="Loading">
        <BallIcon tone="gray" spinning />
      </span>
    }
  />
);

// Not seen yet: the gray ball, like the loading and error states.
const PokedexEntryIndex = ({ id }: PokedexEntryProps) => (
  <PokedexEntryCard id={id} image={<BallIcon tone="gray" />} />
);

const PokedexEntryError = ({ id }: PokedexEntryProps) => (
  <PokedexEntryCard
    id={id}
    image={
      <span role="img" aria-label="Could not load">
        <BallIcon tone="gray" />
      </span>
    }
  />
);

// Catches a failed load of a single entry and shows it as an error entry.
class PokedexEntryErrorBoundary extends Component<
  PokedexEntryProps & { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    // Dropped only now, so React's own retries reuse the failed request.
    // The next time the Pokédex opens, the entry fetches again.
    pokemonPromises.delete(this.props.id);

    console.error(error);
  }

  render() {
    return this.state.hasError ? (
      <PokedexEntryError id={this.props.id} />
    ) : (
      this.props.children
    );
  }
}

export const PokedexEntry = ({ id }: PokedexEntryProps) => {
  const { getStatus } = usePokedex();
  const status = getStatus(id);

  if (!status) {
    return <PokedexEntryIndex id={id} />;
  }

  return (
    <PokedexEntryErrorBoundary id={id}>
      <Suspense fallback={<PokedexEntryFallback id={id} />}>
        <PokedexEntryContent id={id} status={status} />
      </Suspense>
    </PokedexEntryErrorBoundary>
  );
};

PokedexEntry.Index = PokedexEntryIndex;
