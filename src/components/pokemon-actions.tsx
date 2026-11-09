type PokemonActionsProps = {
  disabled: boolean;
  onCatch: () => void;
  onRun: () => void;
};

export const PokemonActions = ({
  disabled,
  onCatch,
  onRun,
}: PokemonActionsProps) => (
  <div className="pokemon-actions">
    <button disabled={disabled} onClick={onCatch}>
      CATCH
    </button>
    <button disabled={disabled} onClick={onRun}>
      RUN
    </button>
  </div>
);
