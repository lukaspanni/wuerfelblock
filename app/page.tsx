"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { saveToLocalStorage, loadFromLocalStorage } from "@/lib/local-storage";
import PlayerForm from "@/components/player-form";
import GameBoard from "@/components/game-board";
import GameOver from "@/components/game-over";
import PlayerStats from "@/components/player-stats";

const statsSchema = z.record(z.string(), z.number());

export default function Scorekeeper() {
  const [players, setPlayers] = useState<string[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [finalScores, setFinalScores] = useState<Record<string, number>>({});
  const [showStats, setShowStats] = useState(true);

  // Load past scores on initial render
  useEffect(() => {
    const { ok } = loadFromLocalStorage("wuerfelblock-stats", statsSchema);
    if (ok) {
      setShowStats(true);
    }
  }, []);

  // Warn if leaving while game is running
  useEffect(() => {
    if (!gameStarted) return;
    const abortController = new AbortController();
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };

    window.addEventListener("beforeunload", handleBeforeUnload, {
      signal: abortController.signal,
    });

    return () => {
      abortController.abort();
    };
  }, [gameStarted]);

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
    const { ok, result } = loadFromLocalStorage(
      "wuerfelblock-stats",
      statsSchema,
    );
    const stats = ok && result ? result : {};

    Object.entries(scores).forEach(([player, score]) => {
      stats[player] = score;
    });

    saveToLocalStorage("wuerfelblock-stats", stats);
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
