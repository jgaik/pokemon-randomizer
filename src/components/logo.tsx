import type { CSSProperties } from "react";
import minun from "../assets/minun.png";
import plusle from "../assets/plusle.png";

const LINES = ["Pokémon", "Randomizer"].map((line) => line.toUpperCase());

export const Logo = () => {
  let index = 0;

  return (
    <>
      <img
        className="logo__mascot logo__mascot--left"
        src={plusle}
        alt=""
        draggable={false}
      />
      <img
        className="logo__mascot logo__mascot--right"
        src={minun}
        alt=""
        draggable={false}
      />

      <h1 className="logo" aria-label="Pokémon Randomizer">
        {LINES.flatMap((line, lineIndex) => [
          ...(lineIndex > 0 ? [<br key={`break-${lineIndex}`} />] : []),
          ...Array.from(line, (letter, letterIndex) => (
            <span
              key={`${lineIndex}-${letterIndex}`}
              className={`logo__letter logo__letter--${lineIndex === 0 ? "first" : "second"}${letterIndex === 0 && lineIndex > 0 ? " logo__letter--indent" : ""}`}
              style={{ "--index": index++ } as CSSProperties}
            >
              {letter}
            </span>
          )),
        ])}
      </h1>
    </>
  );
};
