"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import confetti from "canvas-confetti"

interface GameOverProps {
  scores: Record<string, number>
  onNewGame: () => void
}

export default function GameOver({ scores, onNewGame }: GameOverProps) {
  const [rankings, setRankings] = useState<Array<{ player: string; score: number; rank: number }>>([])

  useEffect(() => {
    // Sort players by score in descending order
    const sortedPlayers = Object.entries(scores)
      .map(([player, score]) => ({ player, score }))
      .sort((a, b) => b.score - a.score)

    // Assign ranks (players with the same score get the same rank)
    let currentRank = 1
    const rankedPlayers = sortedPlayers.map((player, index) => {
      if (index > 0 && player.score < sortedPlayers[index - 1].score) {
        currentRank = index + 1
      }
      return { ...player, rank: currentRank }
    })

    setRankings(rankedPlayers)

    // Trigger confetti for the winner
    if (sortedPlayers.length > 0) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })
    }
  }, [scores])

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md animate-fadeIn">
      <h2 className="text-2xl font-bold mb-6 text-center">Game Over!</h2>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-center">Final Rankings</h3>

        <div className="space-y-3">
          {rankings.map(({ player, score, rank }) => (
            <div
              key={player}
              className={`flex items-center justify-between p-3 rounded-lg ${
                rank === 1
                  ? "bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700"
                  : "bg-gray-100 dark:bg-gray-700"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`
                  w-8 h-8 rounded-full flex items-center justify-center font-bold
                  ${
                    rank === 1
                      ? "bg-yellow-400 text-yellow-900"
                      : rank === 2
                        ? "bg-gray-300 text-gray-700"
                        : rank === 3
                          ? "bg-amber-700 text-amber-100"
                          : "bg-gray-200 text-gray-700"
                  }
                `}
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
        Start New Game
      </Button>
    </div>
  )
}

