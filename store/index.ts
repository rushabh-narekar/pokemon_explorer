import { configureStore } from "@reduxjs/toolkit";
import { favoritesReducer } from "./favorites-slice";
import { pokemonApi } from "./pokemon-api";

export function makeStore() {
  return configureStore({
    reducer: {
      favorites: favoritesReducer,
      [pokemonApi.reducerPath]: pokemonApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(pokemonApi.middleware),
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
