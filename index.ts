// Import stylesheets
import './style.css';
/* -------------------------------------------------------------------------- */
/*                                MINI FRAMEWORK.                             */
/* -------------------------------------------------------------------------- */

// boiler plate setup the canvas for the game
var canvas = <HTMLCanvasElement>document.getElementById('canvas');
var ctx = canvas.getContext('2d');
canvas.setAttribute('tabindex', '1');
canvas.style.outline = 'none';
canvas.focus();

// utility functions to use everywhere
class Util {
  static getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    // The maximum is inclusive and the minimum is inclusive
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}

// Input Controller to use everywhere
class InputController {
  public x: number;
  public y: number;

  constructor() {}

  update(gameObject: GameObject) {}
}

class GameObject {
  public x: number;
  public y: number;
  public width: number;
  public height: number;

  private inputController: InputController;

  constructor(inputController?) {
    this.inputController = inputController;
  }

  update() {
    this.inputController?.update(this);
  }

  render() {}
}

class Physics {
  private gameObjectCollisionRegister: Array<any> = [];
  private wallCollisionRegister: Array<any> = [];
  private objectA: GameObject;
  private objectB: GameObject;

  constructor() {}

  onCollide(
    objectA: GameObject,
    objectB: GameObject,
    callback: Function,
    scope: any
  ) {
    if (objectA && objectB) {
      this.gameObjectCollisionRegister.push({
        objectA: objectA,
        objectB: objectB,
        callback: callback,
        scope: scope,
      });
    }
  }

  onCollideWalls(objectA: GameObject, callback: Function, scope: any) {
    if (objectA) {
      this.wallCollisionRegister.push({
        objectA: objectA,
        callback: callback,
        scope: scope,
      });
    }
  }

  update() {
    for (let collisionEntry of this.gameObjectCollisionRegister) {
      if (
        collisionEntry.objectA.x > 0 &&
        collisionEntry.objectA.x < canvas.width &&
        collisionEntry.objectA.y > 0 &&
        collisionEntry.objectA.y < canvas.height &&
        collisionEntry.objectB.x > 0 &&
        collisionEntry.objectB.x < canvas.width &&
        collisionEntry.objectB.y > 0 &&
        collisionEntry.objectB.y < canvas.height &&
        collisionEntry.objectA.x >= collisionEntry.objectB.x &&
        collisionEntry.objectA.x <=
          collisionEntry.objectB.x + collisionEntry.objectB.width &&
        collisionEntry.objectA.y >= collisionEntry.objectB.y &&
        collisionEntry.objectA.y <=
          collisionEntry.objectB.y + collisionEntry.objectB.height
      ) {
        collisionEntry.callback.bind(collisionEntry.scope).apply();
      }
    }
    for (let wallCollisionEntry of this.wallCollisionRegister) {
      if (
        wallCollisionEntry.objectA.y < wallCollisionEntry.objectA.height ||
        wallCollisionEntry.objectA.y > canvas.height ||
        wallCollisionEntry.objectA.x < wallCollisionEntry.objectA.width ||
        wallCollisionEntry.objectA.x > canvas.width
      ) {
        wallCollisionEntry.callback.bind(wallCollisionEntry.scope).apply();
      }
    }
  }
}

class Scene {
  public children: Array<any>;
  public physics: Physics;

  constructor() {
    this.children = [];
    this.physics = new Physics();
  }

  add(gameObject: GameObject) {
    this.children.push(gameObject);
  }

  create() {}

  update() {
    for (let gameObject of this.children) {
      gameObject.update();
    }
    this.physics.update();
  }

  render() {
    // update the game background
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = COLOR_BACKGROUND;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let gameObject of this.children) {
      gameObject.render();
    }
  }
}

class Game {
  private scene: Scene;
  private id: number;

  constructor(scene: Scene) {
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

/* -------------------------------------------------------------------------- */
/*                               GAME SPECIFIC CODE                           */
/* -------------------------------------------------------------------------- */

/* ------------------------------ GAME MECHANICS ---------------------------- */
const COLOR_BACKGROUND: string = '#000';
const SWATTER_COLOR: string = '#FFF';
const SWATTER_WIDTH: number = 40;
const SWATTER_HEIGHT: number = 40;
const BUG_COLOR: string = '#F00';
const BUG_RADIUS: number = 10;
const SCORE_COLOR: string = '#FFF';

/* --------------------------------- ENTITIES ------------------------------- */
class Swatter extends GameObject {
  // initial state
  constructor() {
    super(new SwatterInputController());
    this.width = SWATTER_WIDTH;
    this.height = SWATTER_HEIGHT;
  }

  // update the state
  update() {
    super.update();
  }

  // display the results of state
  render() {
    super.render();

    ctx.fillStyle = SWATTER_COLOR;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

// Sprite
class Bug extends GameObject {
  // initial state
  constructor() {
    super();
    let bugLength = BUG_RADIUS * 2;
    this.x = Util.getRandomInt(bugLength, canvas.width - bugLength);
    this.y = Util.getRandomInt(bugLength, canvas.height - bugLength);
    this.width = BUG_RADIUS * 2;
    this.height = BUG_RADIUS * 2;
  }

  // update the state
  update() {
    super.update();
  }

  // display the results of state
  render() {
    super.render();

    ctx.fillStyle = BUG_COLOR;
    ctx.beginPath();
    ctx.arc(this.x, this.y, BUG_RADIUS, 0, 2 * Math.PI);
    ctx.fill();
  }

  reset() {
    let bugLength = BUG_RADIUS * 2;
    this.x = Util.getRandomInt(bugLength, canvas.width - bugLength);
    this.y = Util.getRandomInt(bugLength, canvas.height - bugLength);
  }
}

/* ------------------------------- InputController  ----------------------------- */

class SwatterInputController extends InputController {
  constructor() {
    super();
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

  update(gameObject: GameObject) {
    gameObject.x = this.x - gameObject.width / 2;
    gameObject.y = this.y - gameObject.height / 2;
  }
}

/* --------------------------------- SCENE ------------------------------- */
class MainLevel extends Scene {
  private swatter: Swatter;
  private bug: Bug;

  constructor() {
    super();
  }

  create() {
    this.bug = new Bug();
    this.add(this.bug);

    this.swatter = new Swatter();
    this.add(this.swatter);

    this.physics.onCollide(this.bug, this.swatter, this.onSwatterHitBug, this);
  }

  update() {
    super.update();
  }

  render() {
    super.render();
  }

  onSwatterHitBug() {
    this.bug.reset();
  }
}

/* -------------------------------------------------------------------------- */
/*                                RUN GAME.                                   */
/* -------------------------------------------------------------------------- */
let mainLevel = new MainLevel();
let game = new Game(mainLevel);
