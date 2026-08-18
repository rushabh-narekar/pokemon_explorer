import { getTypeStyle } from "@/lib/pokeapi/constants";
import { formatPokemonName } from "@/lib/pokeapi/normalize";
import type { PokemonTypeInfo } from "@/lib/pokeapi/types";
import { cn } from "@/lib/utils";

interface PokemonTypesProps {
  types: PokemonTypeInfo[];
  size?: "sm" | "md";
}

export default function PokemonTypes({ types, size = "md" }: PokemonTypesProps) {
  if (types.length === 0) {
    return <span className="text-sm text-muted">Type unknown</span>;
  }

  return (
    <ul className="flex flex-wrap gap-2" aria-label="Pokémon types">
      {types.map((type) => {
        const style = getTypeStyle(type.name);
        return (
          <li key={`${type.name}-${type.slot}`}>
            <span
              className={cn(
                "font-display inline-flex rounded-full font-bold uppercase tracking-wide shadow-sm",
                size === "sm" ? "px-2.5 py-0.5 text-[11px]" : "px-3 py-1 text-xs",
              )}
              style={{ backgroundColor: style.bg, color: style.text }}
            >
              {formatPokemonName(type.name)}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
