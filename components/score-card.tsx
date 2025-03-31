'use client';

import { useRef } from 'react';
import { useMobile } from '@/hooks/use-mobile';

interface ScoreCardProps {
  players: string[];
  categories: {
    id: string;
    name: string;
    max: number;
    section: 'upper' | 'lower';
    type: 'number' | 'special';
    validate: (val: number) => boolean;
  }[];
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
  onCategorySelect
}: ScoreCardProps) {
  const tableRef = useRef<HTMLDivElement>(null);
  const isMobile = useMobile();

  const calculateUpperTotal = (player: string): number => {
    return categories
      .filter((c) => c.section === 'upper')
      .reduce((sum, category) => sum + (scores[player]?.[category.id] || 0), 0);
  };

  const getBonus = (upperTotal: number): number => (upperTotal >= 63 ? 35 : 0);

  const renderScore = (
    category: ScoreCardProps['categories'][number],
    score: number | null,
    isCurrentPlayer: boolean
  ) => {
    if (category.type === 'special' && score !== null) {
      return score === 0 ? '✗' : '✓';
    }

    if (score !== null) {
      return score;
    }

    return isCurrentPlayer ? (
      <button className="w-full h-full py-1 px-2 rounded hover:bg-primary/10 transition-colors">
        Ergebnis eintragen
      </button>
    ) : (
      <span className="text-gray-400">-</span>
    );
  };

  return (
    <div className="overflow-x-auto" ref={tableRef}>
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-700">
            <th className="py-2 px-3 text-left font-medium text-sm sticky left-0 bg-gray-100 dark:bg-gray-700 min-w-[120px]">
              Category
            </th>
            {players.map((player) => (
              <th
                key={player}
                className={`py-2 px-3 text-center font-medium text-sm min-w-[100px] ${
                  player === currentPlayer ? 'bg-primary/10' : ''
                }`}
              >
                {player}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Upper Section */}
          {categories
            .filter((category) => category.section === 'upper')
            .map((category) => (
              <tr
                key={category.id}
                className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50"
              >
                <td className="py-2 px-3 text-sm font-medium sticky left-0 bg-white dark:bg-gray-800">
                  {category.name}
                </td>
                {players.map((player) => (
                  <td
                    key={`${player}-${category.id}`}
                    className={`py-2 px-3 text-center text-sm ${player === currentPlayer ? 'bg-primary/5' : ''}`}
                    onClick={() => player === currentPlayer && onCategorySelect(category.id)}
                  >
                    {renderScore(category, scores[player]?.[category.id], player === currentPlayer)}
                  </td>
                ))}
              </tr>
            ))}

          {/* Upper Section Subtotal */}
          <tr className="border-t border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-750">
            <td className="py-2 px-3 text-sm font-medium sticky left-0 bg-gray-50 dark:bg-gray-750">
              Zwischensumme oben
            </td>
            {players.map((player) => {
              const upperTotal = calculateUpperTotal(player);
              return (
                <td
                  key={`${player}-upperTotal`}
                  className={`py-2 px-3 text-center text-sm font-medium ${
                    player === currentPlayer ? 'bg-primary/5' : ''
                  }`}
                >
                  {upperTotal}
                </td>
              );
            })}
          </tr>

          {/* Bonus Row */}
          <tr className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
            <td className="py-2 px-3 text-sm font-medium sticky left-0 bg-gray-50 dark:bg-gray-750">
              Bonus (bei 63 oder mehr)
            </td>
            {players.map((player) => {
              const bonus = getBonus(calculateUpperTotal(player));
              return (
                <td
                  key={`${player}-bonus`}
                  className={`py-2 px-3 text-center text-sm font-medium ${
                    player === currentPlayer ? 'bg-primary/5' : ''
                  }`}
                >
                  {bonus}
                </td>
              );
            })}
          </tr>

          {/* Section Separator */}
          <tr className="h-4 bg-gray-200 dark:bg-gray-600">
            <td
              colSpan={players.length + 1}
              className="border-t-2 border-b-2 border-gray-300 dark:border-gray-500"
            ></td>
          </tr>

          {/* Lower Section */}
          {categories
            .filter((category) => category.section === 'lower')
            .map((category) => (
              <tr
                key={category.id}
                className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50"
              >
                <td className="py-2 px-3 text-sm font-medium sticky left-0 bg-white dark:bg-gray-800">
                  {category.name}
                </td>
                {players.map((player) => (
                  <td
                    key={`${player}-${category.id}`}
                    className={`py-2 px-3 text-center text-sm ${player === currentPlayer ? 'bg-primary/5' : ''}`}
                    onClick={() => player === currentPlayer && onCategorySelect(category.id)}
                  >
                    {renderScore(category, scores[player]?.[category.id], player === currentPlayer)}
                  </td>
                ))}
              </tr>
            ))}

          {/* Final Total Row */}
          <tr className="border-t-2 border-gray-300 dark:border-gray-600 font-bold bg-gray-100 dark:bg-gray-700">
            <td className="py-2 px-3 text-sm sticky left-0 bg-gray-100 dark:bg-gray-700">Total</td>
            {players.map((player) => (
              <td
                key={`${player}-total`}
                className={`py-2 px-3 text-center text-sm ${player === currentPlayer ? 'bg-primary/10' : ''}`}
              >
                {totals[player]}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
