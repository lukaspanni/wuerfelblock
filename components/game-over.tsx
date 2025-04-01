"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";

interface GameOverProps {
  scores: Record<string, number>;
  onNewGame: () => void;
}

export default function GameOver({ scores, onNewGame }: GameOverProps) {
  const [rankings, setRankings] = useState<
    Array<{ player: string; score: number; rank: number }>
  >([]);

  useEffect(() => {
    // Sort players by score in descending order
    const sortedPlayers = Object.entries(scores)
      .map(([player, score]) => ({ player, score }))
      .sort((a, b) => b.score - a.score);

    // Assign ranks (players with the same score get the same rank)
    let currentRank = 1;
    const rankedPlayers = sortedPlayers.map((player, index) => {
      if (index > 0 && player.score < sortedPlayers[index - 1].score) {
        currentRank = index + 1;
      }
      return { ...player, rank: currentRank };
    });

    setRankings(rankedPlayers);

    // Trigger confetti for the winner
    if (sortedPlayers.length > 0) {
      void confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [scores]);

  return (
    <div className="animate-fadeIn rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
      <h2 className="mb-6 text-center text-2xl font-bold">Spiel Vorbei!</h2>

      <div className="mb-8">
        <h3 className="mb-4 text-center text-xl font-semibold">
          Endstand
        </h3>

        <div className="space-y-3">
          {rankings.map(({ player, score, rank }) => (
            <div
              key={player}
              className={`flex items-center justify-between rounded-lg p-3 ${
                rank === 1
                  ? "border border-yellow-300 bg-yellow-100 dark:border-yellow-700 dark:bg-yellow-900/30"
                  : "bg-gray-100 dark:bg-gray-700"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full font-bold ${
                    rank === 1
                      ? "bg-yellow-400 text-yellow-900"
                      : rank === 2
                        ? "bg-gray-300 text-gray-700"
                        : rank === 3
                          ? "bg-amber-700 text-amber-100"
                          : "bg-gray-200 text-gray-700"
                  } `}
                >
                  {rank}
                </div>
                <span className="font-medium">{player}</span>
              </div>
              <span className="text-lg font-bold">{score}</span>
            </div>
          ))}
        </div>
      </div>

      <Button onClick={onNewGame} className="w-full">
        Neues Spiel Starten
      </Button>
    </div>
  );
}
