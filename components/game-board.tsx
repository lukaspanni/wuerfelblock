"use client";

import ScoreCard from "@/components/score-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMobile } from "@/hooks/use-mobile";
import { useEffect, useMemo, useRef, useState } from "react";
import ScoreInput from "@/components/score-input";
import { useGameStore } from "@/providers/game-store-provider";
import { Undo, Redo } from "lucide-react";

type Section = "upper" | "lower";

export type Category = {
  id: string;
  name: string;
  max: number;
  section: Section;
  validate: (val: number) => boolean;
  type: "number" | "special";
  points?: number;
};

const DICE_COUNT = 5;
const MAX_ROLLS = 3;
const ROLL_ANIMATION_DURATION_MS = 600;
const ROLL_ANIMATION_INTERVAL_MS = 90;
const RECOMMENDATION_LABEL = "Empfehlung";
const createDiceValues = () =>
  Array.from({ length: DICE_COUNT }, () => null);
const createKeptDice = () => Array.from({ length: DICE_COUNT }, () => false);
const createRollIndices = () => new Set<number>();

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

const getDiceCounts = (values: number[]) => {
  // Index 0 is unused to align indices with die faces (1-6).
  const counts = Array.from({ length: 7 }, () => 0);
  values.forEach((value) => {
    if (value < 1 || value > 6) {
      console.warn("Ungültiger Würfelwert erkannt:", value);
      return;
    }
    counts[value] += 1;
  });
  return counts;
};

const getSuggestedScore = (
  categoryId: string,
  diceValues: Array<number | null>,
): string | null => {
  if (diceValues.some((value) => value === null)) return null;
  const values = diceValues as number[];
  const counts = getDiceCounts(values);
  const total = values.reduce((sum, value) => sum + value, 0);
  const hasThreeOfAKind = counts.some((count) => count >= 3);
  const hasFourOfAKind = counts.some((count) => count >= 4);
  const hasKniffel = counts.some((count) => count === 5);
  const hasFullHouse =
    counts.some((count) => count === 3) && counts.some((count) => count === 2);
  const uniqueValues = new Set(values);
  const smallStraightSequences = [
    [1, 2, 3, 4],
    [2, 3, 4, 5],
    [3, 4, 5, 6],
  ];
  const hasSmallStraight = smallStraightSequences.some((sequence) =>
    sequence.every((value) => uniqueValues.has(value)),
  );
  const hasLargeStraight =
    uniqueValues.size === 5 &&
    (uniqueValues.has(1)
      ? [1, 2, 3, 4, 5].every((value) => uniqueValues.has(value))
      : [2, 3, 4, 5, 6].every((value) => uniqueValues.has(value)));

  switch (categoryId) {
    case "ones":
      return (counts[1] * 1).toString();
    case "twos":
      return (counts[2] * 2).toString();
    case "threes":
      return (counts[3] * 3).toString();
    case "fours":
      return (counts[4] * 4).toString();
    case "fives":
      return (counts[5] * 5).toString();
    case "sixes":
      return (counts[6] * 6).toString();
    case "threeOfAKind":
      return hasThreeOfAKind ? total.toString() : "0";
    case "fourOfAKind":
      return hasFourOfAKind ? total.toString() : "0";
    case "chance":
      return total.toString();
    case "fullHouse":
      return hasFullHouse ? "25" : "0";
    case "smallStraight":
      return hasSmallStraight ? "30" : "0";
    case "largeStraight":
      return hasLargeStraight ? "40" : "0";
    case "kniffel":
      return hasKniffel ? "50" : "0";
    default:
      return null;
  }
};

type DiceRollerProps = {
  diceValues: Array<number | null>;
  onDiceChange: (dice: Array<number | null>) => void;
  onFinalRoll: (dice: Array<number | null>) => void;
  resetToken: number;
  lastRollRecommendation: string | null;
};

const DiceRoller = ({
  diceValues,
  onDiceChange,
  onFinalRoll,
  resetToken,
  lastRollRecommendation,
}: DiceRollerProps) => {
  const [keptDice, setKeptDice] = useState<boolean[]>(createKeptDice);
  const [rollCount, setRollCount] = useState(0);
  const [rollingIndices, setRollingIndices] =
    useState<Set<number>>(createRollIndices);
  const animationFrameId = useRef<number | null>(null);
  const diceValuesRef = useRef(diceValues);

  useEffect(() => {
    diceValuesRef.current = diceValues;
  }, [diceValues]);

  useEffect(() => {
    setKeptDice(createKeptDice());
    setRollCount(0);
    setRollingIndices(createRollIndices());
    if (animationFrameId.current !== null) {
      window.cancelAnimationFrame(animationFrameId.current);
    }
    animationFrameId.current = null;
  }, [resetToken]);

  useEffect(() => {
    return () => {
      if (animationFrameId.current !== null) {
        window.cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  const handleRollDice = () => {
    if (rollCount >= MAX_ROLLS) return;
    const indicesToRoll = diceValues.reduce<number[]>((indices, _, index) => {
      if (rollCount === 0 || !keptDice[index]) {
        indices.push(index);
      }
      return indices;
    }, []);
    const rollValues = (values: Array<number | null>) =>
      values.map((value, index) => {
        if (!indicesToRoll.includes(index)) return value;
        return Math.floor(Math.random() * 6) + 1;
      });
    const finalizeRoll = () => {
      const finalValues = rollValues(diceValuesRef.current);
      onDiceChange(finalValues);
      const nextRollCount = rollCount + 1;
      setRollCount(nextRollCount);
      setRollingIndices(createRollIndices());
      if (nextRollCount === MAX_ROLLS) {
        onFinalRoll(finalValues);
      }
    };
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      finalizeRoll();
      return;
    }
    setRollingIndices(new Set(indicesToRoll));
    if (animationFrameId.current !== null) {
      window.cancelAnimationFrame(animationFrameId.current);
    }
    let startTime: number | null = null;
    let lastTick = 0;
    const step = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const elapsed = timestamp - startTime;
      if (elapsed >= ROLL_ANIMATION_DURATION_MS) {
        animationFrameId.current = null;
        finalizeRoll();
        setRollingIndices(createRollIndices());
        return;
      }
      if (timestamp - lastTick >= ROLL_ANIMATION_INTERVAL_MS) {
        onDiceChange(rollValues(diceValuesRef.current));
        lastTick = timestamp;
      }
      animationFrameId.current = window.requestAnimationFrame(step);
    };
    animationFrameId.current = window.requestAnimationFrame(step);
  };

  const toggleKeepDie = (index: number) => {
    if (rollCount === 0) return;
    setKeptDice((previousDice) =>
      previousDice.map((keep, currentIndex) =>
        currentIndex === index ? !keep : keep,
      ),
    );
  };

  return (
    <div className="mb-4 rounded-lg border p-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium">Würfel</p>
          <p className="text-muted-foreground text-xs">
            {rollCount === 0
              ? "Erster Wurf würfelt alle 5 Würfel."
              : `Wurf ${rollCount} von ${MAX_ROLLS}`}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRollDice}
          disabled={rollCount >= MAX_ROLLS}
        >
          {rollCount === 0 ? "Würfeln" : "Nochmal würfeln"}
        </Button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {diceValues.map((value, index) => (
          <Button
            key={`dice-${index}`}
            type="button"
            variant={keptDice[index] ? "default" : "outline"}
            className="size-12 text-lg font-semibold"
            aria-pressed={keptDice[index]}
            disabled={rollCount === 0}
            onClick={() => toggleKeepDie(index)}
            title={
              rollCount === 0
                ? "Erst würfeln"
                : keptDice[index]
                  ? "Zum erneuten Würfeln freigeben"
                  : "Würfel behalten"
            }
          >
            <span
              className={
                rollingIndices.has(index) ? "motion-safe:animate-pulse" : ""
              }
            >
              {value ?? "-"}
            </span>
          </Button>
        ))}
      </div>
      <p className="text-muted-foreground mt-2 text-xs">
        {rollCount >= MAX_ROLLS
          ? "Keine Würfe mehr verfügbar."
          : "Tippe auf einen Würfel, um ihn für den nächsten Wurf zu behalten oder erneut zu würfeln."}
      </p>
      {rollCount >= MAX_ROLLS && lastRollRecommendation && (
        <p className="text-muted-foreground mt-1 text-xs">
          {lastRollRecommendation}
        </p>
      )}
    </div>
  );
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
    lastMove,
    undoneMove,
    undoLastMove,
    redoLastMove,
    diceEnabled,
  } = useGameStore((state) => state);

  const [error, setError] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  const [totals, setTotals] = useState<Record<string, number>>({});
  const isMobile = useMobile();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [diceValues, setDiceValues] = useState<Array<number | null>>(
    createDiceValues,
  );
  const [finalDiceValues, setFinalDiceValues] = useState<Array<number | null>>(
    createDiceValues,
  );
  const [diceResetToken, setDiceResetToken] = useState(0);

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

  const hasAllDice = useMemo(
    () => finalDiceValues.every((value) => value !== null),
    [finalDiceValues],
  );
  const diceTotal = useMemo(
    () =>
      finalDiceValues.reduce<number>((sum, value) => sum + (value ?? 0), 0),
    [finalDiceValues],
  );
  const scoreSuggestions = useMemo(() => {
    if (!diceEnabled || !hasAllDice) return [];
    const currentPlayer = players[currentPlayerIndex];
    return categories
      .filter((category) => scores[currentPlayer]?.[category.id] === null)
      .map((category) => {
        const suggested = getSuggestedScore(category.id, finalDiceValues);
        if (suggested === null) return null;
        const scoreValue = Number(suggested);
        if (!Number.isFinite(scoreValue)) return null;
        return { name: category.name, score: scoreValue };
      })
      .filter(
        (entry): entry is { name: string; score: number } => entry !== null,
      )
      .sort((a, b) => b.score - a.score);
  }, [
    diceEnabled,
    finalDiceValues,
    hasAllDice,
    players,
    currentPlayerIndex,
    scores,
  ]);
  const lastRollRecommendation = useMemo(() => {
    if (!hasAllDice || scoreSuggestions.length === 0) return null;
    const topSuggestions = scoreSuggestions.slice(0, 3);
    return `${RECOMMENDATION_LABEL}: ${topSuggestions
      .map((entry) => `${entry.name} (${entry.score})`)
      .join(" · ")}`;
  }, [hasAllDice, scoreSuggestions]);

  useEffect(() => {
    // Recalculate totals whenever scores change (including after undo/redo)
    const updatedTotals: Record<string, number> = {};

    players.forEach((player) => {
      if (scores[player]) {
        const playerScores = scores[player];
        const upperTotal = calculateUpperSectionTotal(playerScores);
        const bonus = calculateBonus(upperTotal);
        const lowerTotal = calculateLowerSectionTotal(playerScores);

        updatedTotals[player] = upperTotal + bonus + lowerTotal;
      } else {
        updatedTotals[player] = 0;
      }
    });

    setTotals(updatedTotals);
  }, [scores, players]);

  const handleScoreSelect = (category: string) => {
    const currentPlayer = players[currentPlayerIndex];

    // Check if this category is already filled for the current player
    if (scores[currentPlayer]?.[category] !== null) {
      setError("Diese Kategorie ist bereits ausgefüllt");
      return;
    }

    const categoryObj = categories.find((c) => c.id === category);
    const suggestedScore =
      diceEnabled && hasAllDice && categoryObj
        ? getSuggestedScore(categoryObj.id, finalDiceValues)
        : null;
    setCurrentCategory(category);
    setInputValue(suggestedScore ?? "");
    setError("");

    setDialogOpen(true);
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

    setDialogOpen(false);
    setDiceValues(createDiceValues());
    setFinalDiceValues(createDiceValues());
    setDiceResetToken((token) => token + 1);

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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>
            Aktueller Spieler:{" "}
            <span className="text-primary text-xl font-bold">
              {players[currentPlayerIndex]}
            </span>
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={undoLastMove}
              disabled={!lastMove}
              title="Letzten Zug rückgängig machen"
            >
              <Undo className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={redoLastMove}
              disabled={!undoneMove}
              title="Letzten rückgängig gemachten Zug wiederherstellen"
            >
              <Redo className="size-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {currentCategory && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className={`${isMobile ? "" : "sm:max-w-[500px]"}`}>
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
                <ScoreInput
                  category={categories.find((c) => c.id === currentCategory)!}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                />
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleScoreSubmit}>
                  Absenden
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {diceEnabled && (
          <DiceRoller
            diceValues={diceValues}
            onDiceChange={setDiceValues}
            onFinalRoll={setFinalDiceValues}
            resetToken={diceResetToken}
            lastRollRecommendation={lastRollRecommendation}
          />
        )}

        <ScoreCard
          players={players}
          categories={categories}
          scores={scores}
          totals={totals}
          currentPlayer={players[currentPlayerIndex]}
          onCategorySelect={handleScoreSelect}
        />
      </CardContent>
    </Card>
  );
}
