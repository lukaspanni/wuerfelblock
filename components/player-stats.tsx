"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface PlayerStatsProps {
  onStartGame: () => void;
}

export default function PlayerStats({ onStartGame }: PlayerStatsProps) {
  const [stats, setStats] = useState<Record<string, number>>({});
  const [hasStats, setHasStats] = useState(false);

  useEffect(() => {
    const storedStats = localStorage.getItem("wuerfelblock-stats");
    if (storedStats) {
      // TODO: validate the stored stats
      setStats(JSON.parse(storedStats));
      setHasStats(true);
    }
  }, []);

  if (!hasStats) {
    return (
      <div className="animate-fadeIn rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
        <h2 className="mb-4 text-center text-2xl font-bold">
          Welcome to Wuerfelblock!
        </h2>
        <p className="mb-6 text-center text-gray-600 dark:text-gray-400">
          No previous games found. Start a new game to begin tracking scores.
        </p>
        <Button onClick={onStartGame} className="w-full">
          Start New Game
        </Button>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
      <h2 className="mb-4 text-center text-2xl font-bold">Previous Scores</h2>

      <div className="mb-6">
        <div className="overflow-hidden rounded-lg border">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  Player
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  Last Score
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
              {Object.entries(stats).map(([player, score]) => (
                <tr
                  key={player}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  <td className="px-4 py-3 text-sm font-medium">{player}</td>
                  <td className="px-4 py-3 text-right text-sm">{score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Button onClick={onStartGame} className="w-full">
        Start New Game
      </Button>
    </div>
  );
}
