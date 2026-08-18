import { test, expect } from "@playwright/test";

const catalogListMock = {
  count: 3,
  next: null,
  previous: null,
  results: [
    { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
    { name: "charmander", url: "https://pokeapi.co/api/v2/pokemon/4/" },
    { name: "pikachu", url: "https://pokeapi.co/api/v2/pokemon/25/" },
  ],
};

const pokemonDetails: Record<string, object> = {
  bulbasaur: {
    id: 1,
    name: "bulbasaur",
    height: 7,
    weight: 69,
    sprites: { front_default: null },
    types: [{ slot: 1, type: { name: "grass", url: "" } }],
    abilities: [],
    stats: [],
  },
  charmander: {
    id: 4,
    name: "charmander",
    height: 6,
    weight: 85,
    sprites: { front_default: null },
    types: [{ slot: 1, type: { name: "fire", url: "" } }],
    abilities: [],
    stats: [],
  },
  pikachu: {
    id: 25,
    name: "pikachu",
    height: 4,
    weight: 60,
    sprites: { front_default: null },
    types: [{ slot: 1, type: { name: "electric", url: "" } }],
    abilities: [],
    stats: [],
  },
};

async function mockCatalogApi(page: import("@playwright/test").Page) {
  await page.route("**/api/v2/pokemon?limit=20&offset=0", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(catalogListMock),
    });
  });

  await page.route("**/api/v2/pokemon/**", async (route) => {
    const url = route.request().url();
    if (url.includes("?limit=")) {
      await route.continue();
      return;
    }

    const slug = url.split("/pokemon/")[1]?.split("?")[0] ?? "";
    const idToName: Record<string, string> = {
      "1": "bulbasaur",
      "4": "charmander",
      "25": "pikachu",
    };
    const name = idToName[slug] ?? slug;
    const detail = pokemonDetails[name];

    if (!detail) {
      await route.fulfill({
        status: 404,
        contentType: "application/json",
        body: JSON.stringify({ detail: "Not found" }),
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(detail),
    });
  });
}

test.describe("Catalog search and sort", () => {
  test.beforeEach(async ({ page }) => {
    await mockCatalogApi(page);
  });

  test("loads catalog and sorts Z-A on the loaded page", async ({ page }) => {
    await page.goto("/pokemon");
    await expect(page.getByRole("heading", { name: "Bulbasaur", level: 2 })).toBeVisible();

    await page.getByRole("button", { name: "Name Z–A", pressed: false }).click();

    await expect(page).toHaveURL(/sort=name-desc/);
    const names = page.locator("article h2 a");
    await expect(names.nth(0)).toHaveText("Pikachu");
    await expect(names.nth(1)).toHaveText("Charmander");
    await expect(names.nth(2)).toHaveText("Bulbasaur");
  });

  test("searches by exact name and clears back to catalog", async ({ page }) => {
    await page.goto("/pokemon");
    await page.getByRole("searchbox").fill("pikachu");
    await page.getByRole("button", { name: "Search", exact: true }).click();

    await expect(page).toHaveURL(/search=pikachu/);
    await expect(page.getByText("Found")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Pikachu", level: 2 })).toHaveCount(1);

    await page.getByRole("button", { name: "Clear search" }).click();
    await expect(page).toHaveURL(/\/pokemon(?:\?sort=name-asc)?$/);
    await expect(page.getByRole("searchbox")).toHaveValue("");
    await expect(page.getByRole("heading", { name: "Bulbasaur", level: 2 })).toBeVisible();
  });

  test("searches by numeric id", async ({ page }) => {
    await page.goto("/pokemon");
    await page.getByRole("searchbox").fill("25");
    await page.getByRole("button", { name: "Search", exact: true }).click();

    await expect(page).toHaveURL(/search=25/);
    await expect(page.getByRole("heading", { name: "Pikachu", level: 2 })).toBeVisible({
      timeout: 10_000,
    });
  });

  test("shows not-found for invalid search without breaking navigation", async ({ page }) => {
    await page.goto("/pokemon");
    await page.getByRole("searchbox").fill("not-a-real-mon");
    await page.getByRole("button", { name: "Search", exact: true }).click();

    await expect(page).toHaveURL(/search=not-a-real-mon/);
    await expect(page.getByRole("heading", { name: "No Pokémon found" })).toBeVisible({
      timeout: 10_000,
    });
    await expect(page.getByRole("navigation", { name: "Primary" })).toBeVisible();
  });
});
