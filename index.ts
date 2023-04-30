// Import stylesheets
import './style.css';

// boiler plate setup the canvas for the game
var canvas = <HTMLCanvasElement>document.getElementById('canvas');
var ctx = canvas.getContext('2d');
canvas.setAttribute('tabindex', '1');
canvas.style.outline = 'none';
canvas.focus();

// manipuating game mechanics
const COLOR_BACKGROUND: string = '#000';
const SWATTER_COLOR: string = '#FFF';
const SWATTER_WIDTH: number = 40;
const SWATTER_LENGTH: number = 40;
const BUG_COLOR: string = '#F00';
const BUG_RADIUS: number = 10;

// utility functions to use everywhere
class Util {
  static getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    // The maximum is inclusive and the minimum is inclusive
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}

// Sprite
class Swatter {
  public x: number;
  public y: number;
  private inputController: CustomInputController;

  // initial state
  constructor() {
    this.inputController = new CustomInputController();
  }

  // update the state
  update() {
    this.inputController.update(this);
  }

  // display the results of state
  render() {
    ctx.fillStyle = SWATTER_COLOR;
    ctx.fillRect(this.x, this.y, SWATTER_WIDTH, SWATTER_LENGTH);
  }
}

// Sprite
class Bug {
  public x: number;
  public y: number;

  // initial state
  constructor() {
    let bugLength = BUG_RADIUS * 2;
    this.x = Util.getRandomInt(bugLength, 400 - bugLength);
    this.y = Util.getRandomInt(bugLength, 400 - bugLength);
  }

  // update the state
  update() {}

  // display the results of state
  render() {
    ctx.fillStyle = BUG_COLOR;
    ctx.beginPath();
    ctx.arc(this.x, this.y, BUG_RADIUS, 0, 2 * Math.PI);
    ctx.fill();
  }

  reset() {
    let bugLength = BUG_RADIUS * 2;
    this.x = Util.getRandomInt(bugLength, 400 - bugLength);
    this.y = Util.getRandomInt(bugLength, 400 - bugLength);
  }
}

class CustomInputController {
  private x: number;
  private y: number;

  constructor() {
    document.addEventListener(
      'mousemove',
      (evt) => {
        let rect = canvas.getBoundingClientRect();
        this.x = evt.clientX - rect.left;
        this.y = evt.clientY - rect.top;
      },
      false
    );
  }

  update(swatter: Swatter) {
    swatter.x = this.x - SWATTER_WIDTH / 2;
    swatter.y = this.y - SWATTER_LENGTH / 2;
  }
}

class Scene {
  private children: Array<any>;

  constructor() {
    this.children = [];
  }

  add(gameObject: any) {
    this.children.push(gameObject);
  }

  create() {}

  update() {
    for (let index in this.children) {
      this.children[index].update();
    }
  }

  render() {
    // update the game background
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = COLOR_BACKGROUND;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let index in this.children) {
      this.children[index].render();
    }
  }
}

class MainLevel extends Scene {
  private swatter: Swatter;
  private bug: Bug;

  constructor() {
    super();
  }

  create() {
    this.swatter = new Swatter();
    this.add(this.swatter);

    this.bug = new Bug();
    this.add(this.bug);
  }

  update() {
    super.update();

    // collision and behavior functions
    this.onSwatterHitBug(this.bug, this.swatter);
  }

  render() {
    super.render();
  }

  onSwatterHitBug(bug: Bug, swatter: Swatter) {
    if (
      bug &&
      swatter &&
      bug.x > 0 &&
      bug.x < canvas.height &&
      bug.x >= swatter.x &&
      bug.x <= swatter.x + SWATTER_LENGTH &&
      bug.y >= swatter.y &&
      bug.y <= swatter.y + SWATTER_WIDTH
    ) {
      this.bug.reset();
    }
  }
}

class Game {
  private scene: Scene;
  private id: number;

  constructor(scene: any) {
    this.scene = scene;
    this.scene.create();
    //Setup Components
    this.id = requestAnimationFrame(this.gameLoop);
  }

  gameLoop(timestamp) {
    // WARNING: This pattern is not using Times Step and as such
    // Entities must be kept low, when needing multiple entities, scenes,
    // or other components it's recommended to move to a Game Framework

    // game lifecycle events
    game.scene.update();
    game.scene.render();

    // call next frame
    cancelAnimationFrame(game.id);
    game.id = requestAnimationFrame(game.gameLoop);
  }
}

let mainLevel = new MainLevel();
let game = new Game(mainLevel);
