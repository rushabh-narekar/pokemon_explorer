export const POKEAPI_BASE_URL = "https://pokeapi.co/api/v2";

export const PAGE_SIZE = 20;

/** Cache Pokémon responses for 24 hours — the public API data rarely changes. */
export const REVALIDATE_SECONDS = 86_400;

export const FEATURED_POKEMON = [
  "pikachu",
  "charizard",
  "garchomp",
  "gengar",
  "snorlax",
  "rayquaza",
] as const;

export const FAVORITES_STORAGE_KEY = "pokemon-explorer-favorites";

export const STAT_LABELS: Record<string, string> = {
  hp: "HP",
  attack: "Attack",
  defense: "Defense",
  "special-attack": "Sp. Atk",
  "special-defense": "Sp. Def",
  speed: "Speed",
};

/** Official Pokémon brand colors used in the UI. */
export const POKEMON_BRAND = {
  yellow: "#FFCB05",
  yellowDark: "#E6B800",
  blue: "#0072CE",
  blueDark: "#005A9E",
  navy: "#1B2A5B",
  red: "#CC0000",
  cream: "#FFFDF5",
  gray: "#5C6478",
  grayLight: "#E8ECF4",
  white: "#FFFFFF",
} as const;

export interface TypeStyle {
  bg: string;
  text: string;
}

/** Type badge colors matched to the games. */
export const TYPE_STYLES: Record<string, TypeStyle> = {
  normal: { bg: "#A8A878", text: "#FFFFFF" },
  fire: { bg: "#F08030", text: "#FFFFFF" },
  water: { bg: "#6890F0", text: "#FFFFFF" },
  electric: { bg: "#F8D030", text: "#1B2A5B" },
  grass: { bg: "#78C850", text: "#FFFFFF" },
  ice: { bg: "#98D8D8", text: "#1B2A5B" },
  fighting: { bg: "#C03028", text: "#FFFFFF" },
  poison: { bg: "#A040A0", text: "#FFFFFF" },
  ground: { bg: "#E0C068", text: "#1B2A5B" },
  flying: { bg: "#A890F0", text: "#FFFFFF" },
  psychic: { bg: "#F85888", text: "#FFFFFF" },
  bug: { bg: "#A8B820", text: "#1B2A5B" },
  rock: { bg: "#B8A038", text: "#FFFFFF" },
  ghost: { bg: "#705898", text: "#FFFFFF" },
  dragon: { bg: "#7038F8", text: "#FFFFFF" },
  dark: { bg: "#705848", text: "#FFFFFF" },
  steel: { bg: "#B8B8D0", text: "#1B2A5B" },
  fairy: { bg: "#EE99AC", text: "#1B2A5B" },
};

export function getTypeStyle(typeName: string): TypeStyle {
  return TYPE_STYLES[typeName] ?? TYPE_STYLES.normal;
}
