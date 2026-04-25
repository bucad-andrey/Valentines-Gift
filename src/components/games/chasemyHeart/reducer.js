// reducer.js

import { GAME_CONFIG, MESSAGES } from "./constants";

/*
FUNCTIONALITY:
Initial state of the game
*/
export const initialState = {
  status: "idle",
  score: 0,
  lives: GAME_CONFIG.STARTING_LIVES,
  timeLeft: GAME_CONFIG.TIME_LIMIT,
  items: [],
  message: "",
};

/*
FUNCTIONALITY:
Handles all game state transitions
*/
export function gameReducer(state, action) {
  switch (action.type) {

    case "START_GAME":
      return {
        ...initialState,
        status: "playing",
      };

    case "TICK":
      if (state.timeLeft <= 1) {
        return {
          ...state,
          status: "lost",
          message: MESSAGES.encouragement,
        };
      }
      return {
        ...state,
        timeLeft: state.timeLeft - 1,
      };

    case "GAIN_POINT": {
      const newScore = state.score + 1;

      if (newScore >= GAME_CONFIG.HEARTS_TO_WIN) {
        return {
          ...state,
          score: newScore,
          status: "won",
          message: MESSAGES.win,
        };
      }

      return { ...state, score: newScore };
    }

    case "HIT_BOMB": {
      const newLives = state.lives - 1;

      if (newLives <= 0) {
        return {
          ...state,
          lives: 0,
          status: "lost",
          message: MESSAGES.encouragement,
        };
      }

      return { ...state, lives: newLives };
    }

    case "SPAWN_ITEM":
      return {
        ...state,
        items: [...state.items, action.payload],
      };

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
      };

    case "CLEAR_ITEMS":
      return {
        ...state,
        items: [],
      };

    default:
      return state;
  }
}