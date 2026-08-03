import { useLocalStorage } from "@yamori-shared/react-utilities";
import { use, useMemo } from "react";
import { PokemonCountContext, StorageKeys } from "./helpers";

export function usePokemonCount() {
  return use(PokemonCountContext);
}

export function useFoundPokemonIds() {
  const [foundPokemonIds, setFoundPokemonIds] = useLocalStorage<number[]>(
    StorageKeys.FoundPokemonIds,
  );

  const foundPokemonIdsSet = useMemo(
    () => new Set(foundPokemonIds ?? []),
    [foundPokemonIds],
  );

  return useMemo(
    () => ({
      foundPokemonCount: foundPokemonIdsSet.size,
      hasFoundPokemonId: (id: number) => foundPokemonIdsSet.has(id),
      addFoundPokemonId: (id: number) => {
        const newFoundIdsSet = new Set(foundPokemonIdsSet);
        newFoundIdsSet.add(id);
        setFoundPokemonIds(Array.from(newFoundIdsSet));
      },
      removeFoundPokemonId: (id: number) => {
        const newFoundIdsSet = new Set(foundPokemonIdsSet);
        newFoundIdsSet.delete(id);
        setFoundPokemonIds(Array.from(newFoundIdsSet));
      },
    }),
    [foundPokemonIdsSet, setFoundPokemonIds],
  );
}

export function useRandomPokemonId() {
  const pokemonCount = usePokemonCount();
  const { foundPokemonCount, hasFoundPokemonId } = useFoundPokemonIds();

  const remainingPokemonIds = useMemo(() => {
    const remainingPokemonIds = new Array<number>(
      pokemonCount - foundPokemonCount,
    );

    let index = 0;

    for (let id = 1; id <= pokemonCount; id++) {
      if (!hasFoundPokemonId(id)) {
        remainingPokemonIds[index++] = id;
      }
    }

    return remainingPokemonIds;
  }, [foundPokemonCount, hasFoundPokemonId, pokemonCount]);

  return useMemo(
    () => ({
      hasRemainingPokemonIds: remainingPokemonIds.length > 0,
      getRandomPokemonId: () =>
        remainingPokemonIds[
          Math.floor(Math.random() * remainingPokemonIds.length)
        ],
    }),
    [remainingPokemonIds],
  );
}

export function useCurrentPokemonId() {
  const [currentPokemonId, setCurrentPokemonId, removeCurrentPokemonId] =
    useLocalStorage<number>(StorageKeys.CurrentPokemonId);

  return { currentPokemonId, setCurrentPokemonId, removeCurrentPokemonId };
}
