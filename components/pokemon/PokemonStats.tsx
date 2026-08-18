import type { PokemonStat } from "@/lib/pokeapi/types";
import { POKEMON_BRAND } from "@/lib/pokeapi/constants";

interface PokemonStatsProps {
  stats: PokemonStat[];
}

const MAX_STAT = 255;

export default function PokemonStats({ stats }: PokemonStatsProps) {
  return (
    <ul className="space-y-4">
      {stats.map((stat) => {
        const percentage = Math.min(100, Math.round((stat.baseStat / MAX_STAT) * 100));
        return (
          <li key={stat.name} className="space-y-2">
            <div className="flex items-center justify-between gap-4">
              <span className="font-bold text-navy">{stat.label}</span>
              <span className="tabular-nums font-bold text-[var(--pokemon-blue)]">{stat.baseStat}</span>
            </div>
            <div
              role="progressbar"
              aria-label={`${stat.label} base stat`}
              aria-valuemin={0}
              aria-valuemax={MAX_STAT}
              aria-valuenow={stat.baseStat}
              aria-valuetext={`${stat.baseStat} out of ${MAX_STAT}`}
              className="h-3 overflow-hidden rounded-full bg-[var(--pokemon-gray-light)]"
            >
              <div
                className="h-full rounded-full motion-reduce:transition-none"
                style={{
                  width: `${percentage}%`,
                  background: `linear-gradient(90deg, ${POKEMON_BRAND.blue} 0%, ${POKEMON_BRAND.yellow} 100%)`,
                }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
