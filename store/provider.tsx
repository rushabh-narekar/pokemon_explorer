"use client";

import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { hydrateFavorites } from "./favorites-slice";
import { makeStore, type AppStore } from "./index";

function FavoritesHydrator({ store }: { store: AppStore }) {
  useEffect(() => {
    store.dispatch(hydrateFavorites());
  }, [store]);

  return null;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [store] = useState(() => makeStore());

  return (
    <Provider store={store}>
      <FavoritesHydrator store={store} />
      {children}
    </Provider>
  );
}
