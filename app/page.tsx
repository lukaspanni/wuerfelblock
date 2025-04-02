"use client";

import GameBoard from "@/components/game-board";
import GameOver from "@/components/game-over";
import PlayerForm from "@/components/player-form";
import { PlayerStats } from "@/components/player-stats";
import { StartGameButton } from "@/components/start-game-button";
import { Card, CardFooter } from "@/components/ui/card";
import { WelcomeComponent } from "@/components/welcome";
import { loadFromLocalStorage, saveToLocalStorage } from "@/lib/local-storage";
import { useEffect, useState } from "react";
import { z } from "zod";

const statsSchema = z.record(z.string(), z.number());

export default function Scorekeeper() {
  const [players, setPlayers] = useState<string[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [finalScores, setFinalScores] = useState<Record<string, number>>({});
  const [showStats, setShowStats] = useState(true);
  const [stats, setStats] = useState<Record<string, number>>({});

  useEffect(() => {
    // Load past scores on initial render
    const { ok, result } = loadFromLocalStorage(
      "wuerfelblock-stats",
      statsSchema,
    );
    if (ok) {
      setStats(result);
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

    // Update both local storage and state
    const newStats = { ...stats };
    Object.entries(scores).forEach(([player, score]) => {
      newStats[player] = score;
    });

    setStats(newStats);
    saveToLocalStorage("wuerfelblock-stats", newStats);
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

        {showStats && (
          <Card>
            {Object.keys(stats).length > 0 ? (
              <PlayerStats stats={stats} />
            ) : (
              <WelcomeComponent />
            )}
            <CardFooter>
              <StartGameButton onStartGame={() => setShowStats(false)} />
            </CardFooter>
          </Card>
        )}

        {!gameStarted && !gameOver && !showStats && (
          <PlayerForm onStartGame={startGame} />
        )}

        {gameStarted && <GameBoard players={players} onGameOver={endGame} />}

        {gameOver && <GameOver scores={finalScores} onNewGame={startNewGame} />}
      </div>
    </main>
  );
}
