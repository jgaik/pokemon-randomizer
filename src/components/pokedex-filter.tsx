import { useRef, useState, type MouseEvent, type ReactNode } from "react";
import type { PokedexGroup } from "../helpers";
import { usePokedexFilter } from "../hooks";
import { BallIcon } from "./ball-icon";

const DOUBLE_TAP_MS = 350;

const GROUPS: { value: PokedexGroup; icon: ReactNode }[] = [
  { value: "caught", icon: <BallIcon /> },
  { value: "seen", icon: <BallIcon tone="dark" /> },
  { value: "unseen", icon: <BallIcon tone="gray" /> },
];

export const PokedexFilter = () => {
  const { shownGroups, toggleGroup } = usePokedexFilter();
  const [showLink, setShowLink] = useState(false);
  const lastTapAt = useRef(0);

  const handleClick = ({ target, timeStamp }: MouseEvent) => {
    if ((target as Element).closest("label")) return;

    if (timeStamp - lastTapAt.current < DOUBLE_TAP_MS) {
      setShowLink((shown) => !shown);
      lastTapAt.current = 0;
    } else {
      lastTapAt.current = timeStamp;
    }
  };

  return (
    <>
      <fieldset className="header__filters" onClick={handleClick}>
        {GROUPS.map(({ value, icon }) => (
          <label key={value} className="header__filter-option">
            <input
              type="checkbox"
              checked={shownGroups.has(value)}
              onChange={() => toggleGroup(value)}
              hidden
            />

            {icon}
          </label>
        ))}
      </fieldset>

      {showLink && shownGroups.size === 0 && <a href="#storage">Storage</a>}
    </>
  );
};
