import { Suspense, useSyncExternalStore } from "react";
import { App } from "./app.tsx";
import { StoragePage } from "./components/storage-page.tsx";
import { STORAGE_KEY_PREFIX } from "./helpers.ts";

const subscribeToHash = (onChange: () => void) => {
  window.addEventListener("hashchange", onChange);

  return () => window.removeEventListener("hashchange", onChange);
};

const getHash = () => window.location.hash;

export const Root = () => {
  const hash = useSyncExternalStore(subscribeToHash, getHash);

  if (hash === "#storage") {
    return <StoragePage prefix={STORAGE_KEY_PREFIX} />;
  }

  return (
    <Suspense fallback={<progress />}>
      <App />
    </Suspense>
  );
};
