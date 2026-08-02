const STORAGE_KEY_PREFIX = "pokemon-randomizer";

export const StorageKey = {
  CurrentPokemonId: `${STORAGE_KEY_PREFIX}:current-pokemon-id`,
} as const;
