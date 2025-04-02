import { Category } from "./game-board";

interface ScoreCellProps {
  category: Category;
  player: string;
  score: number | null;
  isCurrentPlayer: boolean;
  onCategorySelect: (category: string) => void;
}

const renderSpecialCategoryCell = (score: number | null) => {
  if (score === 0) {
    return "✗";
  }
  return "✓";
};

export const ScoreCell = ({
  category,
  score,
  isCurrentPlayer,
  onCategorySelect,
}: ScoreCellProps) => {
  const isSpecialCategory = category.type === "special" && score !== null;

  return (
    <td
      className={`px-3 py-2 text-center text-sm ${isCurrentPlayer ? "bg-primary/5" : ""}`}
      onClick={() => isCurrentPlayer && onCategorySelect(category.id)}
    >
      {isSpecialCategory && renderSpecialCategoryCell(score)}
      {!isSpecialCategory && score !== null && score}
      {isCurrentPlayer && score === null && (
        <button className="hover:bg-primary/10 h-full w-full rounded px-2 py-1 transition-colors">
          Ergebnis eintragen
        </button>
      )}
      {!isCurrentPlayer && score === null && (
        <span className="text-muted-foreground">-</span>
      )}
    </td>
  );
};
