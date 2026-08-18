import { test, expect } from "@playwright/test";

test.describe("Pokémon Explorer journeys", () => {
  test("happy path: catalog -> detail -> favorite -> favorites", async ({ page }) => {
    await page.route("**/api/v2/pokemon?limit=20&offset=0", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          count: 1,
          next: null,
          previous: null,
          results: [{ name: "pikachu", url: "https://pokeapi.co/api/v2/pokemon/25/" }],
        }),
      });
    });

    await page.route("**/api/v2/pokemon/pikachu", async (route) => {
      if (route.request().resourceType() === "document") {
        await route.continue();
        return;
      }

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: 25,
          name: "pikachu",
          height: 4,
          weight: 60,
          sprites: {
            front_default:
              "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
            other: {
              "official-artwork": {
                front_default:
                  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png",
              },
            },
          },
          types: [{ slot: 1, type: { name: "electric", url: "" } }],
          abilities: [{ is_hidden: false, ability: { name: "static", url: "" } }],
          stats: [{ base_stat: 90, stat: { name: "speed", url: "" } }],
        }),
      });
    });

    await page.route("**/api/v2/pokemon-species/pikachu", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          genera: [{ genus: "Mouse Pokémon", language: { name: "en" } }],
          habitat: { name: "urban", url: "" },
          evolution_chain: { url: "https://pokeapi.co/api/v2/evolution-chain/10/" },
          flavor_text_entries: [
            {
              flavor_text: "It has small electric sacs on its cheeks.",
              language: { name: "en" },
            },
          ],
          capture_rate: 190,
        }),
      });
    });

    await page.goto("/pokemon");
    await expect(page.getByRole("heading", { name: "Pikachu", level: 2 })).toBeVisible();

    await page.getByRole("link", { name: "Pikachu" }).first().click();
    await expect(page).toHaveURL(/\/pokemon\/pikachu\/?$/);
    await expect(page.getByRole("heading", { name: "Pikachu", level: 1 })).toBeVisible({
      timeout: 20_000,
    });

    await page.getByRole("button", { name: /add pikachu to favorites/i }).click();
    await page.getByRole("link", { name: "Favorites" }).click();
    await expect(page.getByRole("heading", { name: "Pikachu", level: 2 })).toBeVisible();
  });

  test("not-found path: invalid pokemon shows recovery UI", async ({ page }) => {
    await page.route("**/api/v2/pokemon/not-a-real-mon", async (route) => {
      await route.fulfill({ status: 404, body: "Not found" });
    });

    await page.route("**/api/v2/pokemon-species/not-a-real-mon", async (route) => {
      await route.fulfill({ status: 404, body: "Not found" });
    });

    await page.goto("/pokemon/not-a-real-mon");
    await expect(page.getByRole("heading", { name: "Pokémon not found" })).toBeVisible({
      timeout: 20_000,
    });
    await page.getByRole("link", { name: "Back to catalog" }).click();
    await expect(page).toHaveURL(/\/pokemon$/);
  });

  test("failure path: catalog API error shows retry UI", async ({ page }) => {
    await page.route("**/api/v2/pokemon?limit=20&offset=0", async (route) => {
      await route.fulfill({ status: 500, body: "Server error" });
    });

    await page.goto("/pokemon");
    await expect(page.getByRole("alert").filter({ hasText: "could not load" })).toBeVisible();

    await page.unroute("**/api/v2/pokemon?limit=20&offset=0");
    await page.route("**/api/v2/pokemon?limit=20&offset=0", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          count: 0,
          next: null,
          previous: null,
          results: [],
        }),
      });
    });

    await page.getByRole("button", { name: "Try again" }).click();
    await expect(page.getByRole("heading", { name: "No Pokémon on this page" })).toBeVisible();
  });
});
