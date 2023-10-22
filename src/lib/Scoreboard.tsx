import { GameState, Score } from "./Common";

export type ScoreBoardProps = {
  score: Score
}


export default ({ score }: ScoreBoardProps) => {
  let chanceIdPrefix = `list-item-chance-`;

  return (
    <>
      <ul id="score-board">
        {score.chanceResults.map((scored, idx) => <li id={chanceIdPrefix + idx} key={chanceIdPrefix + idx} className={scored ? "scored" : ""}><img src="img/zee-ball.png" width="32" height="32" /></li>)}
      </ul>
    </>
  );
}
