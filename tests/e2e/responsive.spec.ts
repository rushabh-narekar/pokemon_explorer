import { test, expect } from "@playwright/test";

const routes = ["/", "/pokemon", "/pokemon/pikachu", "/favorites", "/about"] as const;

const viewports = [
  { name: "mobile-small", width: 320, height: 568 },
  { name: "mobile", width: 390, height: 844 },
  { name: "ipad-mini", width: 768, height: 1024 },
  { name: "ipad-air", width: 820, height: 1180 },
  { name: "laptop", width: 1024, height: 768 },
  { name: "desktop", width: 1280, height: 800 },
  { name: "wide", width: 1920, height: 1080 },
] as const;

test.describe("Responsive layout", () => {
  for (const viewport of viewports) {
    test(`no horizontal overflow at ${viewport.name} (${viewport.width}px)`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });

      for (const route of routes) {
        await page.goto(route);
        await page.waitForLoadState("networkidle");

        const overflow = await page.evaluate(() => {
          const doc = document.documentElement;
          return doc.scrollWidth - doc.clientWidth;
        });

        expect(overflow, `horizontal overflow on ${route}`).toBeLessThanOrEqual(1);
      }
    });
  }

  test("mobile navigation and catalog controls remain usable", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto("/pokemon");

    await expect(page.getByRole("navigation").getByRole("link", { name: "Home" })).toBeVisible();
    await expect(page.getByRole("navigation").getByRole("link", { name: "Pokémon", exact: true })).toBeVisible();
    await expect(page.getByRole("searchbox")).toBeVisible();
    await expect(page.getByRole("button", { name: "Search", exact: true })).toBeVisible();
    await expect(page.getByRole("group", { name: "Sort" })).toBeVisible();
  });

  test("tablet layout keeps catalog controls stacked then side-by-side", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/pokemon");

    await expect(page.getByRole("searchbox")).toBeVisible();
    await expect(page.getByRole("button", { name: "Name A–Z" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Name Z–A" })).toBeVisible();
  });
});
