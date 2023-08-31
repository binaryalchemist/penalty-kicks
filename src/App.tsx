import GameCanvas from "./lib/GameCanvas";
import Controls from "./lib/Controls";
import Scoreboard from "./lib/Scoreboard";
import { GameState, MAX_KICKS_PER_PLAYER, BallPosition, Score } from "./lib/Common";
import { useState } from "react";

export default () => {
  const results: Score = {
    total: 0,
    attemptNumber: 0,
    chanceResults: new Array<boolean>(MAX_KICKS_PER_PLAYER).fill(false)
  };

  const readyBallPosition: BallPosition = { left: 0, top: 0, x3: 0 };
  const [playerScore, setPlayerScore] = useState(results);
  const [gameState, setGameState] = useState(GameState.Ready);
  const [ballPosition, setBallPosition] = useState(readyBallPosition);

  function onAnimationComplete(total: number, scored: boolean, attemptNumber: number) {
    let results = new Array<boolean>(MAX_KICKS_PER_PLAYER).fill(false)
    let attempts = 0;
    let newTotal = 0;
    let newScore = { total: newTotal, attemptNumber: attempts, chanceResults: results };
    
    if (attemptNumber < MAX_KICKS_PER_PLAYER) {
      results = playerScore.chanceResults.slice();
      results[attemptNumber] = scored;
      newScore = { total, attemptNumber, chanceResults: results };
    }

    setPlayerScore(newScore);
    setBallPosition(readyBallPosition);
    setGameState(GameState.Ready);
  }

  return (
    <>
      {/* scoring */}
      <Scoreboard score={playerScore} />

      {/* game objects */}
      <GameCanvas gameState={gameState} playerScore={playerScore} ballPosition={ballPosition} onAnimationComplete={onAnimationComplete} />
      
      {/* control meters */}
      <Controls gameState={gameState} changeGameState={setGameState} kickBall={setBallPosition}  />
    </>
  );
};
