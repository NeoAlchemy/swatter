// Import stylesheets
import './style.css';

var canvas = <HTMLCanvasElement>document.getElementById('canvas');
var ctx = canvas.getContext('2d');
canvas.setAttribute('tabindex', '1');
canvas.style.outline = 'none';
canvas.focus();

const COLOR_BACKGROUND: string = '#000';
const SWATTER_COLOR: string = '#FFF';
const SWATTER_WIDTH: number = 40;
const SWATTER_LENGTH: number = 40;

class Swatter {
  public x: number;
  public y: number;

  constructor() {
    this.display();
  }

  display() {
    ctx.fillStyle = SWATTER_COLOR;
    ctx.fillRect(this.x, this.y, SWATTER_WIDTH, SWATTER_LENGTH);
  }

  update(progress) {
    this.display();
  }

  moveTo(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

class InputController {
  private swatter: Swatter;

  constructor(swatter: Swatter) {
    this.swatter = swatter;

    document.addEventListener(
      'mousemove',
      (evt) => {
        let rect = canvas.getBoundingClientRect();
        let x = evt.clientX - rect.top;
        let y = evt.clientY - rect.top;
        this.swatter.moveTo(x, y);
      },
      false
    );
  }
}

class Game {
  private swatter: Swatter = new Swatter();

  private id: number;
  private lastRenderer: number = 0;

  constructor() {
    //Setup Components
    let inputController = new InputController(this.swatter);
    this.id = requestAnimationFrame(this.gameLoop);
  }
  // Setup Game Area
  setup() {
    ctx.fillStyle = COLOR_BACKGROUND;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  gameLoop(timestamp) {
    var progress = timestamp - game.lastRenderer;
    game.lastRenderer = timestamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // use game object because of requewstAnimationFrame
    // calling function with this scope
    game.setup();
    game.swatter.update(progress);

    cancelAnimationFrame(game.id);
    game.id = requestAnimationFrame(game.gameLoop);
  }
}

let game = new Game();
