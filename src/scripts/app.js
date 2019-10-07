//Aliases
let Application = PIXI.Application,
  Container = PIXI.Container,
  loader = PIXI.loader,
  resources = PIXI.loader.resources,
  Sprite = PIXI.Sprite,
  TextureCache = PIXI.utils.TextureCache;

//Create a Pixi Application
let app = new Application({
  width: 700,
  height: 600,
  antialiasing: false,
  transparent: false,
  resolution: 1
}
);

//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);

//To change the background color
app.renderer.backgroundColor = 0x061639;
//CSS styling:
app.renderer.view.style.display = 'block';
app.renderer.view.style.margin = '10px auto';

loader
  .add('src/img/sprite-Data.json')
  .on('progress', loadProgressHandler)
  .load(setup);

function loadProgressHandler(loader, resource) {
  console.log(`loading: ${resource.url}`);
  console.log(`progress: ${Math.round(loader.progress)}%`);
}

let space, ship, state, bulet;

function setup() {

  let spaceTexture = TextureCache['Space.png'];
  space = new Sprite(spaceTexture);
  app.stage.addChild(space);

  //create the ship sprite
  ship = new Sprite(
    resources['src/img/sprite-Data.json'].textures['ship.png']
  );

  app.stage.addChild(ship);
  //ship scale
  ship.scale.set(0.6, 0.6);

  //Start position of ship
  ship.x = app.stage.width / 2 - ship.width / 2;
  ship.y = app.stage.height - ship.height;
  ship.vx = 0;
  ship.vy = 0;

  //Create the bulet sprite
  bulet = new Sprite(
    resources['src/img/sprite-Data.json'].textures['bulet.png']
  );

  //Capture the keyboard arrow keys
  let left = keyboard(37),
    up = keyboard(38),
    right = keyboard(39),
    down = keyboard(40),
    short = keyboard(32);

  //Left  
  left.press = () => {
    ship.vx = -5;
    ship.vy = 0;
  };
  left.release = () => {
    if (!right.isDown && ship.vy === 0) {
      ship.vx = 0;
    }
  };

  //Up
  up.press = () => {
    ship.vy = -5;
    ship.vx = 0;
  };
  up.release = () => {
    if (!down.isDown && ship.vx === 0) {
      ship.vy = 0;
    }
  };

  //Right
  right.press = () => {
    ship.vx = 5;
    ship.vy = 0;
  };
  right.release = () => {
    if (!left.isDown && ship.vy === 0) {
      ship.vx = 0;
    }
  };

  //Down
  down.press = () => {
    ship.vy = 5;
    ship.vx = 0;
  };
  down.release = () => {
    if (!up.isDown && ship.vx === 0) {
      ship.vy = 0;
    }
  };

  //Short
  short.press = () => {
    app.stage.addChild(bulet);
    bulet.x = ship.x + ship.width / 2 - bulet.width / 2;
    bulet.y = ship.y - bulet.height;
    bulet.vx = 0;
    bulet.vy = -20;
  };
  short.release = () => {
    if (!up.isDown && ship.vx === 0) {
      ship.vy = 0;
    }
  };

  //Set the game state
  state = play;
  app.ticker.add(delta => gameLoop(delta));
}

function gameLoop(delta) {
  //update the current game state:
  state(delta);
}

function play() {
  ship.x += ship.vx;
  ship.y += ship.vy;
  bulet.y += bulet.vy;

  //Contain the ship inside the area of the space
  contain(ship, { x: 0, y: 400, width: 700, height: 600 });
  //contain(ship, stage);
}

/* Helper functions */

function contain(sprite, container) {
  let collision = undefined;

  //Left
  if (sprite.x < container.x) {
    sprite.x = container.x;
    collision = 'left';
  }

  //Top
  if (sprite.y < container.y) {
    sprite.y = container.y;
    collision = "top";
  }

  //Right
  if (sprite.x + sprite.width > container.width) {
    sprite.x = container.width - sprite.width;
    collision = "right";
  }

  //Bottom
  if (sprite.y + sprite.height > container.height) {
    sprite.y = container.height - sprite.height;
    collision = "bottom";
  }

  //Return the `collision` value
  return collision;
}

// The 'keyboard' helper function
function keyboard(keyCode) {
  let key = {};
  key.code = keyCode;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;

  //The `downHandler`
  key.downHandler = event => {
    if (event.keyCode === key.code) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
    }
    event.preventDefault();
  };

  //The `upHandler`
  key.upHandler = event => {
    if (event.keyCode === key.code) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
    }
    event.preventDefault();
  };

  //Attach event listeners
  window.addEventListener(
    "keydown", key.downHandler.bind(key), false
  );
  window.addEventListener(
    "keyup", key.upHandler.bind(key), false
  );
  return key;
}
