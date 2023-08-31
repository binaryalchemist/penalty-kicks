import { useEffect, useState } from "react";
import { BallPosition, GameState } from "./Common";

type ControlsProps = {
  gameState: GameState,
  changeGameState: (state: GameState) => void,
  kickBall: (position: BallPosition) => void
}

function startIndicators() {
    // to osciallte the vertical direction indicator
    function moveVerticalSmallBall() {
      var thing = document.getElementById('vertical-direction-indicator') as HTMLElement;
      if (thing.getAttribute('class') == "small-ball one-end") {
        thing.setAttribute('class', 'small-ball other-end');
      }
      else if (thing.getAttribute('class') == "small-ball other-end") {
        thing.setAttribute('class', 'small-ball one-end');
      }
    }
  
    moveVerticalSmallBall();
  
    // to osciallte the horizontal direction indicator
    function moveHorizontalSmallBall() {
      var thing = document.getElementById('horizontal-direction-indicator') as HTMLElement;
      if (thing.getAttribute('class') == "small-ball one-end") {
        thing.setAttribute('class', 'small-ball other-end');
      }
      else if (thing.getAttribute('class') == "small-ball other-end") {
        thing.setAttribute('class', 'small-ball one-end');
      }
    }
  
    moveHorizontalSmallBall();
  
    // to osciallte the vertical direction indicator
    function movePowerSmallBall() {
      var thing = document.getElementById('power-level-indicator') as HTMLElement;
      if (thing.getAttribute('class') == "small-ball one-end") {
        thing.setAttribute('class', 'small-ball other-end');
      }
      else if (thing.getAttribute('class') == "small-ball other-end") {
        thing.setAttribute('class', 'small-ball one-end');
      }
    }
  
    movePowerSmallBall();
}


export default ({ gameState, changeGameState, kickBall }: ControlsProps) => {
  let verticalBallStopped = false;
  let horizontalBallStopped = false;
  let powerBallStopped = false;
  let x1: number, x2: number, x3: number;
  let endTop = 440;
  let endLeft = 390;

  const [whichEnd, setWhichEnd] = useState("one-end")

  useEffect(() => {
    const whichEndIndicator = setInterval(() => {
      const newEnd = whichEnd === "one-end" ? "other-end" : "one-end";
      if (gameState === GameState.Ready) setWhichEnd(newEnd);
    }, 1000);

    return () => clearInterval(whichEndIndicator);
  }, [whichEnd]);


  function stopVerticalBall() {
    const element = document.getElementById('vertical-direction-indicator') as HTMLElement,
      style = window.getComputedStyle(element),
      top = style.getPropertyValue('top');
    x1 = parseInt(top.substring(0, 3), 10);
    x1 = (459 - x1) / 117;
    console.log(x1);
    // fix the position of the small ball to wherever it is
    element.setAttribute("class", "small-ball");
    element.style.top = top;
    verticalBallStopped = true;
  }

  function stopHorizontalBall() {
    const element = document.getElementById('horizontal-direction-indicator') as HTMLElement,
      style = window.getComputedStyle(element),
      left = style.getPropertyValue('left');
    x2 = parseInt(left.substring(0, 3), 10);
    x2 = (x2 - 60) / 119;
    console.log(x2);
    // fix the position of the small ball to wherever it is
    element.setAttribute("class", "small-ball");
    element.style.left = left;
    horizontalBallStopped = true;
  }

  function stopPowerBallAndKick() {
    // get position of the small ball
    var element = document.getElementById('power-level-indicator') as HTMLElement,
      style = window.getComputedStyle(element),
      right = style.getPropertyValue('right');
    x3 = parseInt(right.substring(0, 3), 10);
    x3 = (191 - x3) / 121;
    console.log(x3);

    // fix the position of the small ball to wherever it is
    element.setAttribute("class", "small-ball");
    element.style.right = right;
    powerBallStopped = true;

    // Calculate the ending position of the ball
    var Et, El
    Et = 440 - ((0.8 + x1) / 1.8) * x3 * 440 + 0.3 * x3 * ((Math.abs(0.5 - x2)) / 0.5) * 440;
    var stringEt = Et.toString(10);
    El = 405 + x3 * (x2 - 0.5) * 810
    var stringEl = El.toString(10);

    // ending co-ordinates of the ball
    endTop = Et;
    endLeft = El;

    // let the player kick the ball now!
    console.log(stringEl + " " + stringEt + " " + x3);

    kickBall({ top: endTop, left: endLeft, x3 });
  }

  function handleKick() {
    changeGameState(GameState.Kicking);
    stopVerticalBall();
    stopHorizontalBall();
    stopPowerBallAndKick();
  }

  return (
    <>
      <div id="vertical-direction" onClick={stopVerticalBall}></div>
      <div id="vertical-direction-indicator" className={`small-ball ${whichEnd}`} onClick={stopVerticalBall}></div>
      <div id="horizontal-direction" onClick={stopHorizontalBall}></div>
      <div id="horizontal-direction-indicator" className={`small-ball ${whichEnd}`} onClick={stopHorizontalBall}></div>
      <div id="power-level" onClick={handleKick}></div>
      <div id="power-level-indicator" className={`small-ball ${whichEnd}`} onClick={handleKick}></div>
    </>
  );
}
