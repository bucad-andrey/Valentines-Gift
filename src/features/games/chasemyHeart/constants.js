// constants.js
import bombImg from "/bomb.png";

export const GAME_CONFIG = {
  HEARTS_TO_WIN: 2,
  STARTING_LIVES: 3,
  TIME_LIMIT: 30,
  MAX_ITEMS: 15,
  BOMB_CHANCE: 0.3,
};

export const MESSAGES = {
  encouragement: "Try again 💖 Don’t give up!",
  win: "You touched my heart successfully 💘",
  lose: "Oops! My heart slipped away 💔",
};

export const bombImages = [
  bombImg,
  bombImg,
  bombImg,
];