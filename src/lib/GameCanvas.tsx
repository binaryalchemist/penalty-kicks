import { BallPosition, GameState, MAX_KICKS_PER_PLAYER, MODAL_MESSAGES, Score } from "./Common";
import { PathAnimator } from "./PathAnimator";

type GameCanvasProps = {
  gameState: GameState,
  playerScore: Score,
  ballPosition: BallPosition,
  onAnimationComplete: (total: number, scored: boolean, attemptNumber: number) => void,
}

type SpriteOptions = {
  context: CanvasRenderingContext2D | null,
  width: number,
  height: number,
  image: HTMLImageElement,
  numberOfFrames: number,
  ticksPerFrame: number
}

export class Sprite {
  public context: CanvasRenderingContext2D;
  public width: number;
  public height: number;
  public image: HTMLImageElement;
  frameIndex: number;
  tickCount: number;
  ticksPerFrame: number;
  numberOfFrames: number;
  isItOver: boolean;

  constructor (options: SpriteOptions) {
    this.frameIndex = 0,
    this.tickCount = 0,
    this.ticksPerFrame = options.ticksPerFrame || 0,
    this.numberOfFrames = options.numberOfFrames || 1;
    this.context = options.context || {} as CanvasRenderingContext2D;
    this.width = options.width;
    this.height = options.height;
    this.image = options.image;
    this.isItOver = false;
  }

  public update(onNearEnd: () => void) {
    this.tickCount += 1;

    if (this.tickCount > this.ticksPerFrame) {

      this.tickCount = 0;

      // If the current frame index is in range
      if (this.frameIndex < this.numberOfFrames - 2) {
        // Go to the next frame
        this.frameIndex += 1;
      }
      else if (this.frameIndex == this.numberOfFrames - 2) {
        this.frameIndex += 1;
        onNearEnd();
      }
      else if (this.frameIndex < this.numberOfFrames - 1) {
        this.frameIndex += 1;
      }
      else {
        // frameIndex = 0; // don't repeat the animation
        this.isItOver = true;
      }
    }

    return this.isItOver;
  };

  public render() {

    // Clear the canvas
    this.context.clearRect(0, 0, this.width, this.height);

    // Draw the animation
    this.context.drawImage(
      this.image,
      this.frameIndex * this.width / this.numberOfFrames,
      0,
      this.width / this.numberOfFrames,
      this.height,
      0,
      0,
      this.width / this.numberOfFrames,
      this.height);
  };
}


export default ({ gameState, playerScore, ballPosition, onAnimationComplete }: GameCanvasProps) => {
  // recording the direction of the jump by the player, goal or not and the end co-ordinates of the ball
  var direction = "";
  const { left, top, x3 } = ballPosition;

  // all the modals to be displayed
  const modalElem1 = document.getElementById('modal-1') as HTMLElement;
  const modalElem2 = document.getElementById('modal-2') as HTMLElement;
  const modalElem3 = document.getElementById('modal-3') as HTMLElement;
  const modalElem4 = document.getElementById('modal-4') as HTMLElement;
  const modalElem5 = document.getElementById('modal-5') as HTMLElement;
  const modalElem6 = document.getElementById('modal-6') as HTMLElement;
  const modalElem7 = document.getElementById('modal-7') as HTMLElement;

  function handleKick() {
    var player: Sprite,
      playerImage,
      canvas;

    var isItOver = false;

    function gameLoop() {
      if (isItOver == false) {
        requestAnimationFrame(gameLoop);

        isItOver = player.update(() => {
          // start moving the ball
          moveBall();
          // make the goal keeper jump
          keeperJump(x3);
        });
        player.render();
      }
    }

    // Get canvas
    canvas = document.getElementById("kickAnimation") as HTMLCanvasElement;
    canvas.width = 150;
    canvas.height = 270;

    // Create sprite sheet
    playerImage = new Image();

    // Create sprite
    player = new Sprite({
      context: canvas.getContext("2d"),
      width: 300,
      height: 270,
      image: playerImage,
      numberOfFrames: 2,
      ticksPerFrame: 20
    });

    // Load sprite sheet
    playerImage.addEventListener("load", gameLoop);
    playerImage.src = "img/slow-kick-right.png";

  }

  function keeperJump(x3: number) {
    var randomBinary = Math.floor(Math.random() * 2);
    var someTimeAfter = window.setTimeout(function () {
      if ((randomBinary == 0) && (x3 >= 0.55)) {
        (document.getElementById('goal-keeper-state-1') as HTMLElement).style.display = "none";
        (document.getElementById('goal-keeper-state-2') as HTMLElement).style.display = "block";
        direction = "left";
      }
      else if ((randomBinary == 1) && (x3 >= 0.55)) {
        (document.getElementById('goal-keeper-state-1') as HTMLElement).style.display = "none";
        (document.getElementById('goal-keeper-state-3') as HTMLElement).style.display = "block";
        direction = "right";
      }
    }, 0);
  }

  function moveBall() {
    var path = "M " + "390" + "," + "440" + " " + left + "," + top; // Ml Mt Ql Qt El Et " Q " + "460" + "," + "340" + 
    var pathAnimator = new PathAnimator(path),	// initiate a new pathAnimator object
      objToAnimate = document.getElementById('zee-ball') as HTMLElement,	// The object that will move along the path
      speed = 0.5,	 		// seconds that will take going through the whole path
      reverse = false,	// go back of forward along the path
      startOffset = 0		// between 0% to 100%

    // start animating the ball
    pathAnimator.start(speed, step, reverse, startOffset, finish);

    // make the ball smaller in size with respect to the distance from the eye please!

    function step(point: { x: number, y: number }, angle: number) {
      // do something every "frame" with: point.x, point.y & angle
      objToAnimate.style.cssText = "top:" + point.y + "px;" +
        "left:" + point.x + "px;" +
        "transform:rotate(" + angle + "deg);" +
        "-webkit-transform:rotate(" + angle + "deg);";
    }

    function finish() {
      const chanceCount = playerScore.attemptNumber;
      let total = playerScore.total;
      let scored = false;
      // see if the ball has reached the goal
      if ((top >= 98) && (top <= 292) && (left >= 114) && (left <= 710)) {
        if ((direction == "right") && (left < 362)) {
          // increase the score and indicate it on the score board
          total++;
          scored = true;
          if (chanceCount < 4) { modalElem5.setAttribute("class", "modal active"); }
          else {
            if (playerScore.total > 4) { modalElem7.setAttribute("class", "modal active"); }
            else {
              modalElem6.innerHTML = `You scored ${playerScore.total} goal(s) out of ${MAX_KICKS_PER_PLAYER}. Click to try again`;
              modalElem6.setAttribute("class", "modal active");
            }
          }
        }
        else if ((direction == "left") && (left >= 362)) {
          // increase the score and indicate it on the score board
          total++;
          scored = true;
          if (chanceCount < 4) { modalElem5.setAttribute("class", "modal active"); }
          else {
            if (playerScore.total > 4) { modalElem7.setAttribute("class", "modal active"); }
            else {
              modalElem6.innerHTML = `You scored ${playerScore.total} goal(s) out of ${MAX_KICKS_PER_PLAYER}. Click to try again`;
              modalElem6.setAttribute("class", "modal active");
            }
          }
        }
        else {
          if (chanceCount < 4) { modalElem4.setAttribute("class", "modal active"); }
          else {
            modalElem6.innerHTML = `You scored ${playerScore.total} goal(s) out of ${MAX_KICKS_PER_PLAYER}. Click to try again`;
            modalElem6.setAttribute("class", "modal active");
          }
        }
      }
      else {
        if (chanceCount < 4) { modalElem4.setAttribute("class", "modal active"); }
        else {
          modalElem6.innerHTML = `You scored ${playerScore.total} goal(s) out of ${MAX_KICKS_PER_PLAYER}. Click to try again`;
          modalElem6.setAttribute("class", "modal active");
        }
      }

      onAnimationComplete(total, scored, chanceCount + 1);
    }
  }

  if (gameState == GameState.Kicking) {
    handleKick();
  }

  return (
    <>
      <div className="goal-keeper standing" id="goal-keeper-state-1"></div>
      <div className="goal-keeper left-jump" id="goal-keeper-state-2"></div>
      <div className="goal-keeper right-jump" id="goal-keeper-state-3"></div>
      <img id="zee-ball" src="img/zee-ball.png" width="43" height="43" /> 
      <canvas id="kickAnimation"></canvas>
      {MODAL_MESSAGES.map((text, index) => <div id={`modal-${index}`} key={`pk-modal-${index}`} className={`modal ${gameState}`}>{text}</div>)}
    </>
  )
};
