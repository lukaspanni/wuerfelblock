import { createStore } from "zustand/vanilla";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";

export type GameState =
  | "landing-page"
  | "history-stats"
  | "game-init"
  | "game-running"
  | "game-over";

export type LastMove = {
  player: string;
  category: string;
  score: number;
  previousPlayerIndex: number;
};

export type GameStoreState = {
  gameState: GameState;
  players: string[];
  scores: Record<string, Record<string, number | null>>;
  stats: Record<string, number>;
  currentPlayerIndex: number;
  finalScores: Record<string, number>;
  lastMove: LastMove | null;
  undoneMove: LastMove | null;
  diceEnabled: boolean;
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
  undoLastMove: () => boolean;
  redoLastMove: () => boolean;
  setDiceEnabled: (enabled: boolean) => void;
};

export type GameStore = GameStoreState & GameStateActions;

export const initialGameState: GameStoreState = {
  gameState: "landing-page",
  players: [],
  scores: {},
  stats: {},
  currentPlayerIndex: 0,
  finalScores: {},
  lastMove: null,
  undoneMove: null,
  diceEnabled: true,
};

// Create the store outside of components
export const createGameStore = (initState: GameStoreState = initialGameState) =>
  createStore<GameStore>()(
    persist(
      immer((set, get) => ({
        ...initState,

        // State setters
        setGameState: (state) =>
          set((draft: GameStore) => {
            draft.gameState = state;
          }),
        setPlayers: (players) =>
          set((draft: GameStore) => {
            draft.players = players;
          }),
        setScores: (scores) =>
          set((draft: GameStore) => {
            draft.scores = scores;
          }),
        setStats: (stats) =>
          set((draft: GameStore) => {
            draft.stats = stats;
          }),
        setCurrentPlayerIndex: (index) =>
          set((draft: GameStore) => {
            draft.currentPlayerIndex = index;
          }),
        setFinalScores: (finalScores) =>
          set((draft: GameStore) => {
            draft.finalScores = finalScores;
          }),
        setDiceEnabled: (diceEnabled) =>
          set((draft: GameStore) => {
            draft.diceEnabled = diceEnabled;
          }),

        // Complex actions
        updatePlayerScore: (player, category, value) => {
          const currentPlayerIndex = get().currentPlayerIndex;

          set((draft: GameStore) => {
            if (!draft.scores[player]) {
              draft.scores[player] = {};
            }
            draft.lastMove = {
              player,
              category,
              score: value,
              previousPlayerIndex: currentPlayerIndex,
            };
            draft.undoneMove = null;
            draft.scores[player][category] = value;
          });

          return get().scores;
        },

        updateStats: (newScores) => {
          set((draft: GameStore) => {
            Object.entries(newScores).forEach(([player, score]) => {
              draft.stats[player] = score;
            });
          });
        },

        nextPlayer: () => {
          set((draft: GameStore) => {
            draft.currentPlayerIndex =
              (draft.currentPlayerIndex + 1) % draft.players.length;
          });
        },

        // Game flow methods
        startGame: (playerNames) => {
          // Initialize scores structure
          const initialScores: Record<
            string,
            Record<string, number | null>
          > = {};
          playerNames.forEach((player) => {
            initialScores[player] = {};
          });

          set((draft: GameStore) => {
            draft.players = playerNames;
            draft.scores = initialScores;
            draft.gameState = "game-running";
            draft.currentPlayerIndex = 0;
          });
        },

        endGame: (scores) => {
          set((draft: GameStore) => {
            Object.entries(scores).forEach(([player, score]) => {
              draft.stats[player] = score;
            });
            draft.finalScores = scores;
            draft.gameState = "game-over";
          });
        },

        resetGame: () => {
          set((draft: GameStore) => {
            draft.gameState = "history-stats";
            draft.currentPlayerIndex = 0;
            draft.scores = {};
            draft.finalScores = {};
            draft.lastMove = null;
            draft.undoneMove = null;
          });
        },

        undoLastMove: () => {
          const { lastMove } = get();
          if (!lastMove) return false;

          set((draft: GameStore) => {
            if (draft.scores[lastMove.player]) {
              draft.scores[lastMove.player][lastMove.category] = null;
            }
            draft.currentPlayerIndex = lastMove.previousPlayerIndex;
            draft.undoneMove = lastMove;
            draft.lastMove = null;
          });

          return true;
        },

        redoLastMove: () => {
          const { undoneMove } = get();
          if (!undoneMove) return false;

          set((draft: GameStore) => {
            if (!draft.scores[undoneMove.player]) {
              draft.scores[undoneMove.player] = {};
            }
            draft.scores[undoneMove.player][undoneMove.category] =
              undoneMove.score;
            draft.currentPlayerIndex =
              (undoneMove.previousPlayerIndex + 1) % draft.players.length;
            draft.lastMove = undoneMove;
            draft.undoneMove = null;
          });

          return true;
        },
      })),
      {
        name: "wuerfelblock-game-settings",
        partialize: (state) => ({ diceEnabled: state.diceEnabled }),
      },
    ),
  );
