"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import ScoreCard from "@/components/score-card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useMobile } from "@/hooks/use-mobile";
import { useGameStore } from "@/lib/game-store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type Section = "upper" | "lower";

interface Category {
  id: string;
  name: string;
  max: number;
  section: Section;
  validate: (val: number) => boolean;
  type: "number" | "special";
  points?: number;
}

// Define the scoring categories and their validation rules
const categories: Category[] = [
  {
    id: "ones",
    name: "Einser",
    max: 5,
    section: "upper",
    type: "number",
    validate: (val: number) => val >= 0 && val <= 5 && Number.isInteger(val),
  },
  {
    id: "twos",
    name: "Zweier",
    max: 10,
    section: "upper",
    type: "number",
    validate: (val: number) => val >= 0 && val <= 10 && val % 2 === 0,
  },
  {
    id: "threes",
    name: "Dreier",
    max: 15,
    section: "upper",
    type: "number",
    validate: (val: number) => val >= 0 && val <= 15 && val % 3 === 0,
  },
  {
    id: "fours",
    name: "Vierer",
    max: 20,
    section: "upper",
    type: "number",
    validate: (val: number) => val >= 0 && val <= 20 && val % 4 === 0,
  },
  {
    id: "fives",
    name: "Fünfer",
    max: 25,
    section: "upper",
    type: "number",
    validate: (val: number) => val >= 0 && val <= 25 && val % 5 === 0,
  },
  {
    id: "sixes",
    name: "Sechser",
    max: 30,
    section: "upper",
    type: "number",
    validate: (val: number) => val >= 0 && val <= 30 && val % 6 === 0,
  },
  {
    id: "threeOfAKind",
    name: "Dreierpasch",
    max: 30,
    section: "lower",
    type: "number",
    validate: (val: number) => val >= 0 && val <= 30 && Number.isInteger(val),
  },
  {
    id: "fourOfAKind",
    name: "Viererpasch",
    max: 30,
    section: "lower",
    type: "number",
    validate: (val: number) => val >= 0 && val <= 30 && Number.isInteger(val),
  },
  {
    id: "fullHouse",
    name: "Full House",
    max: 25,
    section: "lower",
    type: "special",
    points: 25,
    validate: (val: number) => val === 0 || val === 25,
  },
  {
    id: "smallStraight",
    name: "Kleine Straße",
    max: 30,
    section: "lower",
    type: "special",
    points: 30,
    validate: (val: number) => val === 0 || val === 30,
  },
  {
    id: "largeStraight",
    name: "Große Straße",
    max: 40,
    section: "lower",
    type: "special",
    points: 40,
    validate: (val: number) => val === 0 || val === 40,
  },
  {
    id: "kniffel",
    name: "Kniffel",
    max: 50,
    section: "lower",
    type: "special",
    points: 50,
    validate: (val: number) => val === 0 || val === 50,
  },
  {
    id: "chance",
    name: "Chance",
    max: 30,
    section: "lower",
    type: "number",
    validate: (val: number) => val >= 0 && val <= 30 && Number.isInteger(val),
  },
];

const calculateUpperSectionTotal = (
  playerScores: Record<string, number | null>,
): number => {
  return categories
    .filter((c) => c.section === "upper")
    .reduce((sum, category) => sum + (playerScores[category.id] || 0), 0);
};

const calculateBonus = (upperTotal: number): number =>
  upperTotal >= 63 ? 35 : 0;

const calculateLowerSectionTotal = (
  playerScores: Record<string, number | null>,
): number => {
  return categories
    .filter((c) => c.section === "lower")
    .reduce((sum, category) => sum + (playerScores[category.id] || 0), 0);
};

export default function GameBoard() {
  const {
    players,
    currentPlayerIndex,
    nextPlayer,
    scores,
    setScores,
    updatePlayerScore,
    endGame,
  } = useGameStore();

  const [error, setError] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  const [totals, setTotals] = useState<Record<string, number>>({});
  const isMobile = useMobile();
  const [dialogOpen, setDialogOpen] = useState(false);

  // Initialize scores
  useEffect(() => {
    const initialScores: Record<string, Record<string, number | null>> = {};
    const initialTotals: Record<string, number> = {};

    players.forEach((player) => {
      initialScores[player] = {};
      categories.forEach((category) => {
        initialScores[player][category.id] = null;
      });
      initialTotals[player] = 0;
    });

    setScores(initialScores);
    setTotals(initialTotals);
  }, [players, setScores]);

  const handleScoreSelect = (category: string) => {
    const currentPlayer = players[currentPlayerIndex];

    // Check if this category is already filled for the current player
    if (scores[currentPlayer]?.[category] !== null) {
      setError("Diese Kategorie ist bereits ausgefüllt");
      return;
    }

    setCurrentCategory(category);
    setInputValue("");
    setError("");

    if (isMobile) {
      setDialogOpen(true);
    }
  };

  const handleScoreSubmit = () => {
    if (!currentCategory) return;

    const currentPlayer = players[currentPlayerIndex];
    const categoryObj = categories.find((c) => c.id === currentCategory);

    if (!categoryObj) return;

    const value = Number.parseInt(inputValue);

    if (isNaN(value)) {
      setError("Bitte gib eine gültige Zahl ein");
      return;
    }

    if (!categoryObj.validate(value)) {
      setError(
        `Ungültige Eingabe für ${categoryObj.name}. ${getValidationMessage(categoryObj)}`,
      );
      return;
    }

    console.log("Submitting score:", { currentPlayer, currentCategory, value });

    // Update the store with the new score and get the updated scores back
    const updatedScores = updatePlayerScore(
      currentPlayer,
      currentCategory,
      value,
    );

    // Use the updated scores to calculate totals
    const updatedPlayerScores = updatedScores[currentPlayer];
    const upperTotal = calculateUpperSectionTotal(updatedPlayerScores);
    const bonus = calculateBonus(upperTotal);
    const lowerTotal = calculateLowerSectionTotal(updatedPlayerScores);

    // Update totals with bonus
    const newTotals = { ...totals };
    newTotals[currentPlayer] = upperTotal + bonus + lowerTotal;
    setTotals(newTotals);

    // Move to next player
    nextPlayer();
    setCurrentCategory(null);
    setInputValue("");
    setError("");

    if (isMobile) {
      setDialogOpen(false);
    }

    // Check if game is over
    const isGameOver = players.every((player) =>
      categories.every(
        (category) => updatedScores[player]?.[category.id] !== null,
      ),
    );

    if (isGameOver) {
      endGame(newTotals);
    }
  };

  const getValidationMessage = (category: Category): string => {
    switch (category.id) {
      case "ones":
        return "Muss eine ganze Zahl zwischen 0 und 5 sein.";
      case "twos":
        return "Muss eine gerade Zahl zwischen 0 und 10 sein.";
      case "threes":
        return "Muss ein Vielfaches von 3 zwischen 0 und 15 sein.";
      case "fours":
        return "Muss ein Vielfaches von 4 zwischen 0 und 20 sein.";
      case "fives":
        return "Muss ein Vielfaches von 5 zwischen 0 und 25 sein.";
      case "sixes":
        return "Muss ein Vielfaches von 6 zwischen 0 und 30 sein.";
      case "threeOfAKind":
      case "fourOfAKind":
        return "Muss eine ganze Zahl zwischen 0 und 30 sein.";
      case "fullHouse":
        return "Muss entweder 0 oder 25 sein.";
      case "smallStraight":
        return "Muss entweder 0 oder 30 sein.";
      case "largeStraight":
        return "Muss entweder 0 oder 40 sein.";
      case "kniffel":
        return "Muss entweder 0 oder 50 sein.";
      case "chance":
        return "Muss eine ganze Zahl zwischen 0 und 30 sein.";
      default:
        return "";
    }
  };

  const renderScoreInput = (category: Category) => {
    if (category.type === "special") {
      return (
        <div className="w-full">
          <RadioGroup
            value={inputValue}
            onValueChange={setInputValue}
            className="flex flex-col gap-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value={category.points?.toString() ?? "0"}
                id="success"
              />
              <Label htmlFor="success">Erfolg ({category.points} Punkte)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="0" id="failed" />
              <Label htmlFor="failed">Nicht geschafft (0 Punkte)</Label>
            </div>
          </RadioGroup>
        </div>
      );
    }

    return (
      <input
        type="number"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
        placeholder="Score eingeben"
      />
    );
  };

  return (
    <div className="animate-fadeIn bg-background rounded-lg p-4 shadow-md">
      <div className="mb-4">
        <h2 className="text-center text-xl font-bold">
          Aktueller Spieler:{" "}
          <span className="text-primary">{players[currentPlayerIndex]}</span>
        </h2>
      </div>

      {!isMobile && currentCategory && (
        <div className="bg-background mb-6 rounded-lg p-4">
          <h3 className="mb-2 text-lg font-medium">
            Gib den Score ein für{" "}
            {categories.find((c) => c.id === currentCategory)?.name}
          </h3>

          {error && (
            <div className="bg-destructive text-destructive-foreground mb-3 rounded-md p-2 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-2">
            {renderScoreInput(
              categories.find((c) => c.id === currentCategory)!,
            )}
            <Button onClick={handleScoreSubmit}>Absenden</Button>
          </div>

          <p className="text-muted dark mt-2 text-sm">
            {getValidationMessage(
              categories.find((c) => c.id === currentCategory)!,
            )}
          </p>
        </div>
      )}

      {isMobile && currentCategory && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Gib den Score ein für{" "}
                {categories.find((c) => c.id === currentCategory)?.name}
              </DialogTitle>
              <DialogDescription>
                {getValidationMessage(
                  categories.find((c) => c.id === currentCategory)!,
                )}
              </DialogDescription>
            </DialogHeader>
            {error && (
              <div className="bg-destructive text-destructive-foreground mb-3 rounded-md p-2 text-sm">
                {error}
              </div>
            )}
            <div className="flex gap-2">
              {renderScoreInput(
                categories.find((c) => c.id === currentCategory)!,
              )}
              <Button onClick={handleScoreSubmit}>Absenden</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <ScoreCard
        players={players}
        categories={categories}
        scores={scores}
        totals={totals}
        currentPlayer={players[currentPlayerIndex]}
        onCategorySelect={handleScoreSelect}
      />
    </div>
  );
}
