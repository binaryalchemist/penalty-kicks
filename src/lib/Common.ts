export const MODAL_MESSAGES = [
  "Click to fix vertical direction",
  "Click to fix horizontal direction",
  "Click to adjust power and kick",
  "Click to try again",
  "Goal!",
  "Go on, give it another shot",
  "Congrats! You won!"
];

export const MAX_KICKS_PER_PLAYER = 5;
export const MAX_PLAYERS = 1; // reserved for future multiplayer support

export enum GameState {
  Ready = "READY",
  Kicking = "KICKING"
}

export type BallPosition = {
  top: number,
  left: number,
  x3: number
};

export type Score = {
  total: number,
  attemptNumber: number,
  chanceResults: boolean[]
}
