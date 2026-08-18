import { describe, expect, it } from "vitest";
import { mapPokemonToSummary, mapSpeciesToInfo } from "@/lib/pokeapi/mappers";
import {
  normalizePokemonQuery,
  formatHeight,
  formatWeight,
} from "@/lib/pokeapi/normalize";
import type { PokemonApiResponse, PokemonSpeciesApiResponse } from "@/lib/pokeapi/types";

const samplePokemon: PokemonApiResponse = {
  id: 25,
  name: "pikachu",
  height: 4,
  weight: 60,
  sprites: {
    front_default: "https://example.com/pikachu.png",
    other: {
      "official-artwork": {
        front_default: "https://example.com/pikachu-art.png",
      },
    },
  },
  types: [{ slot: 1, type: { name: "electric", url: "" } }],
  abilities: [
    { is_hidden: false, ability: { name: "static", url: "" } },
    { is_hidden: true, ability: { name: "lightning-rod", url: "" } },
  ],
  stats: [{ base_stat: 55, stat: { name: "speed", url: "" } }],
};

describe("normalizePokemonQuery", () => {
  it("normalizes whitespace and casing for names", () => {
    expect(normalizePokemonQuery(" PIKACHU ")).toBe("pikachu");
    expect(normalizePokemonQuery("Mr Mime")).toBe("mr-mime");
  });

  it("returns null for invalid numeric ids", () => {
    expect(normalizePokemonQuery("0")).toBeNull();
    expect(normalizePokemonQuery("999999")).toBeNull();
    expect(normalizePokemonQuery("   ")).toBeNull();
  });

  it("accepts valid numeric ids", () => {
    expect(normalizePokemonQuery("25")).toBe(25);
  });
});

describe("mappers", () => {
  it("maps pokemon responses into compact summaries", () => {
    const summary = mapPokemonToSummary(samplePokemon);
    expect(summary).toEqual({
      id: 25,
      name: "pikachu",
      image: "https://example.com/pikachu-art.png",
      types: [{ slot: 1, name: "electric" }],
    });
  });

  it("extracts the latest english species description", () => {
    const species: PokemonSpeciesApiResponse = {
      genera: [{ genus: "Mouse Pokémon", language: { name: "en" } }],
      habitat: { name: "urban", url: "" },
      evolution_chain: { url: "https://pokeapi.co/api/v2/evolution-chain/10/" },
      flavor_text_entries: [
        {
          flavor_text: "Old entry.",
          language: { name: "en" },
        },
        {
          flavor_text: "When several of\fthese Pokémon gather,\ntheir electricity builds.",
          language: { name: "en" },
        },
      ],
      capture_rate: 190,
    };

    expect(mapSpeciesToInfo(species)).toMatchObject({
      genus: "Mouse Pokémon",
      habitat: "Urban",
      description:
        "When several of these Pokémon gather, their electricity builds.",
      captureRate: 190,
    });
  });
});

describe("formatting helpers", () => {
  it("formats measurements for display", () => {
    expect(formatHeight(4)).toBe("0.4 m");
    expect(formatWeight(60)).toBe("6.0 kg");
  });
});
