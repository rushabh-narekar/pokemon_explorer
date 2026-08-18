import { configureStore } from "@reduxjs/toolkit";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { describe, expect, it, vi, beforeEach } from "vitest";
import FavoriteButton from "@/components/pokemon/FavoriteButton";
import CatalogPage from "@/components/pokemon/CatalogPage";
import ToastProvider from "@/components/ui/toast/ToastProvider";
import { favoritesReducer, hydrateFavorites } from "@/store/favorites-slice";
import { pokemonApi } from "@/store/pokemon-api";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams("page=1"),
}));

vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    ...props
  }: {
    src: string;
    alt: string;
    fill?: boolean;
    priority?: boolean;
    sizes?: string;
    className?: string;
    onError?: () => void;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  ),
}));

function resolveFetchUrl(input: RequestInfo | URL): string {
  if (typeof input === "string") {
    return input;
  }
  if (input instanceof URL) {
    return input.href;
  }
  return input.url;
}

const mockFetch = vi.fn();

describe("FavoriteButton", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", mockFetch);
    window.localStorage.clear();
  });

  it("toggles favorite state for a pokemon", async () => {
    const store = configureStore({
      reducer: {
        favorites: favoritesReducer,
        [pokemonApi.reducerPath]: pokemonApi.reducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(pokemonApi.middleware),
    });

    store.dispatch(hydrateFavorites());

    render(
      <Provider store={store}>
        <ToastProvider>
          <FavoriteButton
            pokemon={{
              id: 25,
              name: "pikachu",
              image: null,
              types: [{ name: "electric", slot: 1 }],
            }}
          />
        </ToastProvider>
      </Provider>,
    );

    const button = screen.getByRole("button", { name: /add pikachu to favorites/i });
    expect(button).toHaveAttribute("aria-pressed", "false");

    await userEvent.click(button);
    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(window.localStorage.getItem("pokemon-explorer-favorites")).toContain("pikachu");

    await userEvent.click(button);
    expect(button).toHaveAttribute("aria-pressed", "false");
    expect(window.localStorage.getItem("pokemon-explorer-favorites")).not.toContain("pikachu");
  });
});

describe("CatalogPage RTK Query transition", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it("renders catalog cards after RTK Query resolves", async () => {
    mockFetch.mockImplementation(async (input: RequestInfo | URL) => {
      const url = resolveFetchUrl(input);

      if (url.includes("/pokemon?limit=20&offset=0")) {
        return new Response(
          JSON.stringify({
            count: 1,
            next: null,
            previous: null,
            results: [{ name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" }],
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        );
      }

      if (url.includes("/pokemon/bulbasaur")) {
        return new Response(
          JSON.stringify({
            id: 1,
            name: "bulbasaur",
            height: 7,
            weight: 69,
            sprites: { front_default: null },
            types: [{ slot: 1, type: { name: "grass", url: "" } }],
            abilities: [],
            stats: [],
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        );
      }

      return new Response("Not found", { status: 404 });
    });

    vi.stubGlobal("fetch", mockFetch);

    const store = configureStore({
      reducer: {
        favorites: favoritesReducer,
        [pokemonApi.reducerPath]: pokemonApi.reducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(pokemonApi.middleware),
    });

    store.dispatch(hydrateFavorites());

    render(
      <Provider store={store}>
        <ToastProvider>
          <CatalogPage />
        </ToastProvider>
      </Provider>,
    );

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "Bulbasaur" })).toBeInTheDocument();
    });
  });
});
