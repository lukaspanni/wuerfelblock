"use client";

import GameBoard from "@/components/game-board";
import GameOver from "@/components/game-over";
import PlayerForm from "@/components/player-form";
import { PlayerStats } from "@/components/player-stats";
import { StartGameButton } from "@/components/start-game-button";
import { Card, CardFooter } from "@/components/ui/card";
import { WelcomeComponent } from "@/components/welcome";
import { loadFromLocalStorage, saveToLocalStorage } from "@/lib/local-storage";
import { useGameStore } from "@/lib/game-store";
import { useEffect } from "react";
import { z } from "zod";

const statsSchema = z.record(z.string(), z.number());

export default function Scorekeeper() {
  const {
    gameState,
    setGameState,
    setStats,
    stats,
    startGame,
    finalScores,
    resetGame,
  } = useGameStore();

  useEffect(() => {
    // Load past scores on initial render
    const { ok, result } = loadFromLocalStorage(
      "wuerfelblock-stats",
      statsSchema,
    );
    if (ok) {
      setStats(result);
      setGameState("history-stats");
    }
  }, [setStats, setGameState]);

  // Warn if leaving while game is running
  useEffect(() => {
    if (gameState !== "game-running") return;
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
  }, [gameState]);

  // Save stats to localStorage when they change
  useEffect(() => {
    if (Object.keys(stats).length > 0) {
      saveToLocalStorage("wuerfelblock-stats", stats);
    }
  }, [stats]);

  const handleStartGameClick = () => {
    setGameState("game-init");
  };

  return (
    <main className="bg-background min-h-screen p-4">
      <div className="mx-auto 2xl:max-w-7xl">
        <h1 className="text-primary mb-6 text-center text-3xl font-bold">
          Wuerfelblock
        </h1>

        {(gameState === "landing-page" || gameState === "history-stats") && (
          <Card>
            {(gameState === "history-stats" && (
              <PlayerStats stats={stats} />
            )) || <WelcomeComponent />}
            <CardFooter>
              <StartGameButton onStartGame={handleStartGameClick} />
            </CardFooter>
          </Card>
        )}

        {gameState === "game-init" && <PlayerForm onStartGame={startGame} />}

        {gameState === "game-running" && <GameBoard />}

        {gameState === "game-over" && (
          <GameOver scores={finalScores} onNewGame={resetGame} />
        )}
      </div>
    </main>
  );
}
