"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"

interface PlayerFormProps {
  onStartGame: (players: string[]) => void
}

export default function PlayerForm({ onStartGame }: PlayerFormProps) {
  const [players, setPlayers] = useState<string[]>([""])
  const [error, setError] = useState("")

  const addPlayer = () => {
    setPlayers([...players, ""])
  }

  const removePlayer = (index: number) => {
    if (players.length > 1) {
      const newPlayers = [...players]
      newPlayers.splice(index, 1)
      setPlayers(newPlayers)
    }
  }

  const updatePlayer = (index: number, name: string) => {
    const newPlayers = [...players]
    newPlayers[index] = name
    setPlayers(newPlayers)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Filter out empty player names
    const validPlayers = players.filter((name) => name.trim() !== "")

    if (validPlayers.length === 0) {
      setError("Please enter at least one player name")
      return
    }

    onStartGame(validPlayers)
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md animate-fadeIn">
      <h2 className="text-2xl font-bold mb-4 text-center">New Game</h2>

      {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="space-y-4 mb-6">
          {players.map((player, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="flex-1">
                <Label htmlFor={`player-${index}`} className="sr-only">
                  Player {index + 1}
                </Label>
                <Input
                  id={`player-${index}`}
                  placeholder={`Player ${index + 1} name`}
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
                  <span className="sr-only">Remove player</span>
                </Button>
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <Button type="button" variant="outline" onClick={addPlayer} className="w-full">
            Add Player
          </Button>

          <Button type="submit" className="w-full">
            Start Game
          </Button>
        </div>
      </form>
    </div>
  )
}

