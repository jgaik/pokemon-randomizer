import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Root } from "./root.tsx";
import "@fontsource/silkscreen/latin-400.css";
import "@fontsource/silkscreen/latin-700.css";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);
