import type { PokemonAbility } from "@/lib/pokeapi/types";

interface PokemonAbilitiesProps {
  abilities: PokemonAbility[];
}

export default function PokemonAbilities({ abilities }: PokemonAbilitiesProps) {
  if (abilities.length === 0) {
    return <p className="text-muted">No abilities listed.</p>;
  }

  return (
    <ul className="space-y-2">
      {abilities.map((ability) => (
        <li
          key={`${ability.name}-${ability.isHidden ? "hidden" : "normal"}`}
          className="rounded-xl border-2 border-[var(--pokemon-gray-light)] bg-[var(--pokemon-cream)] px-4 py-3"
        >
          <span className="font-bold text-navy">{ability.name}</span>
          {ability.isHidden ? (
            <span className="ml-2 text-sm font-semibold text-[var(--pokemon-blue)]">(Hidden ability)</span>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
