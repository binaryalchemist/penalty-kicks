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
    let newScore = { total: 0, attemptNumber: 0, chanceResults: new Array<boolean>(MAX_KICKS_PER_PLAYER).fill(false) };
    
    if (attemptNumber < MAX_KICKS_PER_PLAYER) {
      let results = playerScore.chanceResults.slice();
      results[attemptNumber] = scored;
      newScore = { total, attemptNumber, chanceResults: results };
    }

    console.log(`${Date.now()} total ${total} where last attempt was ${scored ? "scored" : "missed"} for attempt #${attemptNumber}`);

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
