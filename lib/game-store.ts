import { createStore } from "zustand/vanilla";

export type GameState =
  | "landing-page"
  | "history-stats"
  | "game-init"
  | "game-running"
  | "game-over";

export type GameStoreState = {
  gameState: GameState;
  players: string[];
  scores: Record<string, Record<string, number | null>>;
  stats: Record<string, number>;
  currentPlayerIndex: number;
  finalScores: Record<string, number>;
};

export type GameStateActions = {
  setGameState: (state: GameState) => void;
  setPlayers: (players: string[]) => void;
  setScores: (scores: Record<string, Record<string, number | null>>) => void;
  updatePlayerScore: (
    player: string,
    category: string,
    score: number,
  ) => Record<string, Record<string, number | null>>;
  setStats: (stats: Record<string, number>) => void;
  updateStats: (newScores: Record<string, number>) => void;
  setCurrentPlayerIndex: (index: number) => void;
  nextPlayer: () => void;
  setFinalScores: (scores: Record<string, number>) => void;
  startGame: (playerNames: string[]) => void;
  endGame: (scores: Record<string, number>) => void;
  resetGame: () => void;
};

export type GameStore = GameStoreState & GameStateActions;

export const initialGameState: GameStoreState = {
  gameState: "landing-page",
  players: [],
  scores: {},
  stats: {},
  currentPlayerIndex: 0,
  finalScores: {},
};

// Create the store outside of components
export const createGameStore = (initState: GameStoreState = initialGameState) =>
  createStore<GameStore>()((set, get) => ({
    ...initState,

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
        currentPlayerIndex:
          (state.currentPlayerIndex + 1) % state.players.length,
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
