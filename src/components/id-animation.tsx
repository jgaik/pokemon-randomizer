import { useState, useEffect } from "react";
import { usePokemonCount } from "../hooks";

export function IdAnimation() {
  const pokemonCount = usePokemonCount();

  const [displayId, setDisplayId] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayId(Math.floor(Math.random() * pokemonCount) + 1);
    }, 40);

    return () => clearInterval(interval);
  }, [pokemonCount]);

  return <output>#{displayId}</output>;
}
