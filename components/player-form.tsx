"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { z } from "zod";
import { saveToLocalStorage, loadFromLocalStorage } from "@/lib/local-storage";

const lastGamePlayersSchema = z.array(z.string());

interface PlayerFormProps {
  onStartGame: (players: string[]) => void;
}

export default function PlayerForm({ onStartGame }: PlayerFormProps) {
  const [players, setPlayers] = useState<string[]>([""]);
  const [error, setError] = useState("");
  const [hasLastGame, setHasLastGame] = useState(false);

  useEffect(() => {
    const { ok, result } = loadFromLocalStorage(
      "lastGamePlayers",
      lastGamePlayersSchema,
    );
    if (ok && result) {
      setHasLastGame(result.length > 0);
    } else {
      setHasLastGame(false);
    }
  }, []);

  const addPlayer = () => {
    setPlayers([...players, ""]);
  };

  const removePlayer = (index: number) => {
    if (players.length > 1) {
      const newPlayers = [...players];
      newPlayers.splice(index, 1);
      setPlayers(newPlayers);
    }
  };

  const updatePlayer = (index: number, name: string) => {
    const newPlayers = [...players];
    newPlayers[index] = name;
    setPlayers(newPlayers);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Filter out empty player names
    const validPlayers = players.filter((name) => name.trim() !== "");

    if (validPlayers.length === 0) {
      setError("Bitte geben Sie mindestens einen Spielernamen ein");
      return;
    }

    // Save current valid players for quick start
    saveToLocalStorage("lastGamePlayers", validPlayers);
    setHasLastGame(true);
    onStartGame(validPlayers);
  };

  const handleQuickStart = () => {
    const { ok, result } = loadFromLocalStorage(
      "lastGamePlayers",
      lastGamePlayersSchema,
    );
    if (ok && result) {
      onStartGame(result);
    } else {
      setError("Kein gespeichertes Spiel gefunden");
    }
  };

  return (
    <div className="animate-fadeIn rounded-lg p-6 shadow-md">
      <h2 className="mb-4 text-center text-2xl font-bold">Neues Spiel</h2>

      {error && (
        <span className="bg-destructive text-destructive-foreground mb-4 block rounded-md p-2 text-sm">
          {error}
        </span>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-6 space-y-4">
          {players.map((player, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="flex-1">
                <Label htmlFor={`player-${index}`} className="sr-only">
                  Spieler {index + 1}
                </Label>
                <Input
                  id={`player-${index}`}
                  placeholder={`Spieler ${index + 1} Name`}
                  value={player}
                  onChange={(e) => updatePlayer(index, e.target.value)}
                  className="w-full"
                />
              </div>
              {players.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removePlayer(index)}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Spieler entfernen</span>
                </Button>
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={addPlayer}
            className="w-full"
          >
            Spieler Hinzufügen
          </Button>

          <Button type="submit" className="w-full" variant="default">
            Spiel Starten
          </Button>
          {hasLastGame && (
            <Button
              type="button"
              onClick={handleQuickStart}
              className="bg-accent text-accent-foreground w-full"
              variant="default"
            >
              Schnellstart letztes Spiel
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
