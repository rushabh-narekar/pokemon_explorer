import type { PokemonSummary } from "@/lib/pokeapi/types";
import PokemonCard from "./PokemonCard";

interface PokemonGridProps {
  pokemon: PokemonSummary[];
  catalogContext?: { page?: number; search?: string; sort?: string };
}

export default function PokemonGrid({ pokemon, catalogContext }: PokemonGridProps) {
  return (
    <ul className="pokemon-grid">
      {pokemon.map((item, index) => (
        <li key={item.id} className="flex min-w-0">
          <PokemonCard
            pokemon={item}
            catalogContext={catalogContext}
            prefetch={index < 4}
          />
        </li>
      ))}
    </ul>
  );
}
