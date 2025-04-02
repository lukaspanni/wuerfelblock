import type { Category } from "./game-board";
import { ScoreCell } from "./score-cell";

interface ScoreRowProps {
  category: Category;
  players: string[];
  scores: Record<string, Record<string, number | null>>;
  currentPlayer: string;
  onCategorySelect: (category: string) => void;
}

export const ScoreRow = ({
  category,
  players,
  scores,
  currentPlayer,
  onCategorySelect,
}: ScoreRowProps) => (
  <tr className="border-border/25 border-t">
    <td className="border-border/25 sticky left-0 border-r px-3 py-2 text-sm font-medium">
      {category.name}
    </td>
    {players.map((player) => (
      <ScoreCell
        key={`${player}-${category.id}`}
        category={category}
        player={player}
        score={scores[player]?.[category.id]}
        isCurrentPlayer={player === currentPlayer}
        onCategorySelect={onCategorySelect}
      />
    ))}
  </tr>
);
