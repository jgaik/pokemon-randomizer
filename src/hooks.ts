import {
  getNonNullable,
  useLocalStorage,
} from "@yamori-shared/react-utilities";
import { use, useCallback, useMemo, useState } from "react";
import { ROLL_MS } from "./constants";
import {
  CurrentPokemonActionsContext,
  CurrentPokemonStateContext,
  PokemonCountContext,
  StorageKeys,
  DEFAULT_POKEDEX_GROUPS,
  type PokedexGroup,
  type PokedexRecord,
  type PokedexStatus,
} from "./helpers";
import { fetchPokemon, preloadImage } from "./services";

export function usePokemonCount() {
  return use(PokemonCountContext);
}

export function usePokedex() {
  const [record, setRecord] = useLocalStorage<PokedexRecord>(
    StorageKeys.Pokedex,
  );

  return useMemo(() => {
    const entries = record ?? {};

    return {
      caughtPokemonCount: Object.values(entries).filter(
        (status) => status === "caught",
      ).length,
      getStatus: (id: number): PokedexStatus | null => entries[id] ?? null,
      // Seeing a Pokémon never downgrades one that is already caught.
      markSeen: (id: number) => {
        if (!entries[id]) setRecord({ ...entries, [id]: "seen" });
      },
      markCaught: (id: number) => setRecord({ ...entries, [id]: "caught" }),
    };
  }, [record, setRecord]);
}

// Which groups of the pokedex list are shown, kept between visits.
export function usePokedexFilter() {
  const [groups, setGroups] = useLocalStorage<PokedexGroup[]>(
    StorageKeys.PokedexFilter,
  );

  const shownGroups = useMemo<ReadonlySet<PokedexGroup>>(
    () => new Set(groups ?? DEFAULT_POKEDEX_GROUPS),
    [groups],
  );

  const toggleGroup = (group: PokedexGroup) => {
    const next = new Set(shownGroups);

    if (!next.delete(group)) next.add(group);

    setGroups(Array.from(next));
  };

  return { shownGroups, toggleGroup };
}

export function useRandomPokemonId() {
  const pokemonCount = usePokemonCount();
  const { caughtPokemonCount, getStatus } = usePokedex();

  const remainingPokemonIds = useMemo(() => {
    const remainingPokemonIds = new Array<number>(
      pokemonCount - caughtPokemonCount,
    );

    let index = 0;

    for (let id = 1; id <= pokemonCount; id++) {
      if (getStatus(id) !== "caught") {
        remainingPokemonIds[index++] = id;
      }
    }

    return remainingPokemonIds;
  }, [caughtPokemonCount, getStatus, pokemonCount]);

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

export function useCurrentPokemonState() {
  const state = use(CurrentPokemonStateContext);

  return getNonNullable(state, "Current Pokemon State Context");
}

export function useCurrentPokemonActions() {
  const actions = use(CurrentPokemonActionsContext);

  return getNonNullable(actions, "Current Pokemon Actions Context");
}

const SHAKE_MS = 900;

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function useRandomize() {
  const {
    startRandomization,
    failRandomization,
    finishShake,
    finishIdAnimation,
  } = useCurrentPokemonActions();

  const { getRandomPokemonId } = useRandomPokemonId();

  const [targetId, setTargetId] = useState(0);

  const randomize = useCallback(async () => {
    const pokemonId = getRandomPokemonId();

    if (pokemonId == null) {
      return;
    }

    setTargetId(pokemonId);

    startRandomization();

    // The grass shakes first, then the number rolls. The Pokémon is
    // fetched in the background the whole time.
    const runSequence = async () => {
      await wait(SHAKE_MS);

      finishShake();

      await wait(ROLL_MS);
    };

    try {
      const [pokemon] = await Promise.all([
        fetchPokemon(pokemonId).then(async (pokemon) => {
          await preloadImage(pokemon.imgUrl);

          return pokemon;
        }),
        runSequence(),
      ]);

      finishIdAnimation(pokemon);
    } catch (error) {
      console.error(error);

      failRandomization();
    }
  }, [
    failRandomization,
    finishIdAnimation,
    finishShake,
    getRandomPokemonId,
    startRandomization,
  ]);

  return { randomize, targetId };
}
