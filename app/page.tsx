"use client";

import { useState, useEffect } from "react";
import PlayerForm from "@/components/player-form";
import GameBoard from "@/components/game-board";
import GameOver from "@/components/game-over";
import PlayerStats from "@/components/player-stats";

export default function Scorekeeper() {
  const [players, setPlayers] = useState<string[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [finalScores, setFinalScores] = useState<Record<string, number>>({});
  const [showStats, setShowStats] = useState(true);

  // Load past scores on initial render
  useEffect(() => {
    const storedStats = localStorage.getItem("wuerfelblock-stats");
    if (storedStats) {
      setShowStats(true);
    }
  }, []);

  const startGame = (playerNames: string[]) => {
    setPlayers(playerNames);
    setGameStarted(true);
    setGameOver(false);
    setShowStats(false);
  };

  const endGame = (scores: Record<string, number>) => {
    setFinalScores(scores);
    setGameOver(true);
    setGameStarted(false);

    // Save scores to local storage
    // TODO: abstract storage access out
    const storedStats = localStorage.getItem("wuerfelblock-stats");
    const stats = storedStats ? JSON.parse(storedStats) : {};

    Object.entries(scores).forEach(([player, score]) => {
      stats[player] = score;
    });

    localStorage.setItem("wuerfelblock-stats", JSON.stringify(stats));
  };

  const startNewGame = () => {
    setGameOver(false);
    setShowStats(true);
  };

  return (
    <main className="bg-background min-h-screen p-4">
      <div className="mx-auto max-w-md">
        <h1 className="text-primary mb-6 text-center text-3xl font-bold">
          Wuerfelblock
        </h1>

        {showStats && <PlayerStats onStartGame={() => setShowStats(false)} />}

        {!gameStarted && !gameOver && !showStats && (
          <PlayerForm onStartGame={startGame} />
        )}

        {gameStarted && <GameBoard players={players} onGameOver={endGame} />}

        {gameOver && <GameOver scores={finalScores} onNewGame={startNewGame} />}
      </div>
    </main>
  );
}
