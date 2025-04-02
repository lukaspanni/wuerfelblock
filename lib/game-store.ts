import { create } from "zustand";

export type GameState =
  | "landing-page"
  | "history-stats"
  | "game-init"
  | "game-running"
  | "game-over";

interface GameStore {
  // Game state management
  gameState: GameState;
  setGameState: (state: GameState) => void;

  // Player management
  players: string[];
  setPlayers: (players: string[]) => void;

  // Scoring system
  scores: Record<string, Record<string, number | null>>;
  setScores: (scores: Record<string, Record<string, number | null>>) => void;
  updatePlayerScore: (
    player: string,
    category: string,
    score: number,
  ) => Record<string, Record<string, number | null>>;

  // Statistics
  stats: Record<string, number>;
  setStats: (stats: Record<string, number>) => void;
  updateStats: (newScores: Record<string, number>) => void;

  // Game progression
  currentPlayerIndex: number;
  setCurrentPlayerIndex: (index: number) => void;
  nextPlayer: () => void;

  // Final scores
  finalScores: Record<string, number>;
  setFinalScores: (scores: Record<string, number>) => void;

  // Game flow controls
  startGame: (playerNames: string[]) => void;
  endGame: (scores: Record<string, number>) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameStore>()((set, get) => ({
  // Initial state
  gameState: "landing-page",
  players: [],
  scores: {},
  stats: {},
  currentPlayerIndex: 0,
  finalScores: {},

  // State setters
  setGameState: (state) => set({ gameState: state }),
  setPlayers: (players) => set({ players }),
  setScores: (scores) => set({ scores }),
  setStats: (stats) => set({ stats }),
  setCurrentPlayerIndex: (index) => set({ currentPlayerIndex: index }),
  setFinalScores: (finalScores) => set({ finalScores }),

  // Complex actions
  updatePlayerScore: (player, category, value) => {
    const currentScores = { ...get().scores };

    if (!currentScores[player]) {
      currentScores[player] = {};
    }

    currentScores[player][category] = value;

    set({ scores: currentScores });

    // Return the updated scores
    return currentScores;
  },

  updateStats: (newScores) => {
    set((state) => {
      const updatedStats = { ...state.stats };
      Object.entries(newScores).forEach(([player, score]) => {
        updatedStats[player] = score;
      });
      return { stats: updatedStats };
    });
  },

  nextPlayer: () => {
    set((state) => ({
      currentPlayerIndex: (state.currentPlayerIndex + 1) % state.players.length,
    }));
  },

  // Game flow methods
  startGame: (playerNames) => {
    // Initialize scores structure
    const initialScores: Record<string, Record<string, number | null>> = {};
    playerNames.forEach((player) => {
      initialScores[player] = {};
    });

    set({
      players: playerNames,
      scores: initialScores,
      gameState: "game-running",
      currentPlayerIndex: 0,
    });
  },

  endGame: (scores) => {
    set((state) => {
      // Update statistics
      const newStats = { ...state.stats };
      Object.entries(scores).forEach(([player, score]) => {
        newStats[player] = score;
      });

      return {
        finalScores: scores,
        gameState: "game-over",
        stats: newStats,
      };
    });
  },

  resetGame: () => {
    set({
      gameState: "history-stats",
      currentPlayerIndex: 0,
      scores: {},
      finalScores: {},
    });
  },
}));
