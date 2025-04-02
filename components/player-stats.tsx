"use client";

import { CardContent, CardHeader, CardTitle } from "./ui/card";

interface PlayerStatsProps {
  stats: Record<string, number>;
}

export const PlayerStats = ({ stats }: PlayerStatsProps) => {
  return (
    <>
      <CardHeader>
        <CardTitle>Vorherige Scores</CardTitle>
      </CardHeader>
      <CardContent>
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                Spieler
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                Letzter Score
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
      </CardContent>
    </>
  );
};
