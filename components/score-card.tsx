"use client";

import { useRef } from "react";
import { Category } from "./game-board";
import { ScoreRow } from "./score-row";
import { SectionTotalRow } from "./section-total-row";

interface ScoreCardProps {
  players: string[];
  categories: Category[];
  scores: Record<string, Record<string, number | null>>;
  totals: Record<string, number>;
  currentPlayer: string;
  onCategorySelect: (category: string) => void;
}

export default function ScoreCard({
  players,
  categories,
  scores,
  totals,
  currentPlayer,
  onCategorySelect,
}: ScoreCardProps) {
  const tableRef = useRef<HTMLDivElement>(null);
  const calculateUpperTotal = (player: string) =>
    categories
      .filter((c) => c.section === "upper")
      .reduce((sum, category) => sum + (scores[player]?.[category.id] ?? 0), 0);
  const getBonus = (upperTotal: number) => (upperTotal >= 63 ? 35 : 0);

  return (
    <div className="overflow-x-auto" ref={tableRef}>
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-muted">
            <th className="border-border/25 sticky left-0 min-w-[120px] border-r px-3 py-2 text-left text-sm font-medium">
              Category
            </th>
            {players.map((player) => (
              <th
                key={player}
                className={`min-w-[100px] px-3 py-2 text-center text-sm font-medium ${player === currentPlayer ? "bg-primary/10" : ""}`}
              >
                {player}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {categories
            .filter((c) => c.section === "upper")
            .map((category) => (
              <ScoreRow
                key={category.id}
                category={category}
                players={players}
                scores={scores}
                currentPlayer={currentPlayer}
                onCategorySelect={onCategorySelect}
              />
            ))}
          <SectionTotalRow
            label="Zwischensumme oben"
            values={players.map(calculateUpperTotal)}
          />
          <SectionTotalRow
            label="Bonus (bei 63 oder mehr)"
            values={players.map((p) => getBonus(calculateUpperTotal(p)))}
          />
          <tr className="bg-border h-2">
            <td
              colSpan={players.length + 1}
              className="border-border border-t border-b"
            ></td>
          </tr>
          {categories
            .filter((c) => c.section === "lower")
            .map((category) => (
              <ScoreRow
                key={category.id}
                category={category}
                players={players}
                scores={scores}
                currentPlayer={currentPlayer}
                onCategorySelect={onCategorySelect}
              />
            ))}
          <SectionTotalRow
            label="Total"
            className="bg-accent border-border border-t-4"
            values={players.map((p) => totals[p])}
          />
        </tbody>
      </table>
    </div>
  );
}
