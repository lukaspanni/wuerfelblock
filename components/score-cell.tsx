import { Category } from "./game-board";

interface ScoreCellProps {
  category: Category;
  player: string;
  score: number | null;
  isCurrentPlayer: boolean;
  onCategorySelect: (category: string) => void;
}

export const ScoreCell = ({
  category,
  score,
  isCurrentPlayer,
  onCategorySelect,
}: ScoreCellProps) => {
  return (
    <td
      className={`px-3 py-2 text-center text-sm ${isCurrentPlayer ? "bg-primary/5" : ""}`}
      onClick={() => isCurrentPlayer && onCategorySelect(category.id)}
    >
      {category.type === "special" && score !== null ? (
        score === 0 ? (
          "✗"
        ) : (
          "✓"
        )
      ) : score !== null ? (
        score
      ) : isCurrentPlayer ? (
        <button className="hover:bg-primary/10 h-full w-full rounded px-2 py-1 transition-colors">
          Ergebnis eintragen
        </button>
      ) : (
        <span className="text-gray-400">-</span>
      )}
    </td>
  );
};
