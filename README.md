# Mini Game Framework

This is a small mini-game framework written in TypeScript, including basic classes to make it easy to build simple 2D games.

## Getting Started

This mini-game framework is implemented in TypeScript, therefore it requires a TypeScript compiler to be installed.

To use the framework, follow these steps:

1. Clone the repository to your local machine.
2. Compile the TypeScript files using the TypeScript compiler.
3. Open the index.html file in your browser.

```bash
  git clone https://github.com/<username>/mini-game-framework.git
```

## Usage

The mini-game framework consists of several classes that can be used to create simple 2D games.

### GameObject

The GameObject class is the base class for all game objects. It contains properties for the object's position and dimensions, and methods for updating and rendering the object.

### InputController

The InputController class is used to handle input events for a game object. It can be extended to handle keyboard, mouse, or touch input.

### Scene

The Scene class represents a collection of game objects that are updated and rendered together. It contains an array of child objects and a physics engine for handling collisions between objects.

### Game

The Game class represents the main game loop. It updates and renders the game scenes and objects.

## Example

Below is an example of how to use the mini-game framework to create a simple game:

```typescript
const COLOR_BACKGROUND: string = '#000';
const SWATTER_COLOR: string = '#FFF';
const SWATTER_WIDTH: number = 40;
const SWATTER_HEIGHT: number = 40;
const BUG_COLOR: string = '#F00';
const BUG_RADIUS: number = 10;

class Swatter extends GameObject {
  constructor() {
    super(new SwatterInputController());
    this.width = SWATTER_WIDTH;
    this.height = SWATTER_HEIGHT;
  }

  update() {
    super.update();
  }

  render() {
    super.render();

    ctx.fillStyle = SWATTER_COLOR;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

class Bug extends GameObject {
  constructor() {
    super();
    let bugLength = BUG_RADIUS * 2;
    this.x = Util.getRandomInt(bugLength, canvas.width - bugLength);
    this.y = Util.getRandomInt(bugLength, canvas.height - bugLength);
    this.width = BUG_RADIUS * 2;
    this.height = BUG_RADIUS * 2;
  }

  update() {
    super.update();
  }

  render() {
    super.render();

    ctx.fillStyle = BUG_COLOR;
    ctx.beginPath();
    ctx.arc(this.x, this.y, BUG_RADIUS, 0, 2 * Math.PI);
    ctx.fill();
  }
}

class MyScene extends Scene {
  constructor() {
    super();

    let swatter = new Swatter();
    let bug = new Bug();

    this.add(swatter);
    this.add(bug);

    this.physics.onCollide(swatter, bug, function () {
      bug.destroy();
    }, this);
  }
}

let myScene = new MyScene();
let game = new Game(myScene);
```

In this example, we create a Swatter and a Bug object, add them to a MyScene, and define a collision callback between the two objects. Finally, we create a new Game object and pass in MyScene as the scene to be rendered.
