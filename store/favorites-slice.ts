"use client";

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { FAVORITES_STORAGE_KEY } from "@/lib/pokeapi/constants";
import type { FavoritePokemon } from "@/lib/pokeapi/types";

interface FavoritesState {
  items: FavoritePokemon[];
  hydrated: boolean;
}

const initialState: FavoritesState = {
  items: [],
  hydrated: false,
};

function readFavoritesFromStorage(): FavoritePokemon[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (item): item is FavoritePokemon =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as FavoritePokemon).id === "number" &&
        typeof (item as FavoritePokemon).name === "string",
    );
  } catch {
    return [];
  }
}

function writeFavoritesToStorage(items: FavoritePokemon[]): void {
  window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(items));
}

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    hydrateFavorites(state) {
      state.items = readFavoritesFromStorage();
      state.hydrated = true;
    },
    toggleFavorite(state, action: PayloadAction<FavoritePokemon>) {
      const index = state.items.findIndex((item) => item.id === action.payload.id);
      if (index >= 0) {
        state.items.splice(index, 1);
      } else {
        state.items.push(action.payload);
      }
      writeFavoritesToStorage(state.items);
    },
    removeFavorite(state, action: PayloadAction<number>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
      writeFavoritesToStorage(state.items);
    },
  },
});

export const { hydrateFavorites, toggleFavorite, removeFavorite } = favoritesSlice.actions;
export const favoritesReducer = favoritesSlice.reducer;

export const selectFavorites = (state: { favorites: FavoritesState }) =>
  state.favorites.items;
export const selectFavoritesHydrated = (state: { favorites: FavoritesState }) =>
  state.favorites.hydrated;
export const selectIsFavorite =
  (id: number) =>
  (state: { favorites: FavoritesState }) =>
    state.favorites.items.some((item) => item.id === id);
