import { describe, expect, it } from "vitest";
import { filterPokemonNames, isNumericPokemonSearch } from "@/lib/pokeapi/search";

const names = [
  { name: "pikachu" },
  { name: "pidgey" },
  { name: "charizard" },
];

describe("filterPokemonNames", () => {
  it("finds names that start with the query", () => {
    expect(filterPokemonNames(names, "pi", 5).map((e) => e.name)).toEqual(["pidgey", "pikachu"]);
  });

  it("finds partial matches anywhere in the name", () => {
    expect(filterPokemonNames(names, "char", 5).map((e) => e.name)).toEqual(["charizard"]);
  });
});

describe("isNumericPokemonSearch", () => {
  it("detects numeric-only input", () => {
    expect(isNumericPokemonSearch("25")).toBe(true);
    expect(isNumericPokemonSearch("pikachu")).toBe(false);
  });
});
