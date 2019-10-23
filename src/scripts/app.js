// Aliases
let Application = PIXI.Application,
  Container = PIXI.Container,
  loader = PIXI.loader,
  resources = PIXI.loader.resources,
  Graphics = PIXI.Graphics,
  Sprite = PIXI.Sprite,
  TextureCache = PIXI.utils.TextureCache;

// Create a Pixi Application
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

// To change the background color
app.renderer.backgroundColor = 0x061639;
// CSS styling:
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

let space, ship, state, bulet, alien, menu, healthBar, reloadingGuns;
let numberOfAliens,
  spacingBetwinAliens,
  xOffsetAliens,
  directionAliens,
  topPositionAliens,
  speedAliens;

// an array to store all the alein

const aliens = [];

function setup() {

  //Make the game scene and add it to the stage
  gameScene = new Container();
  app.stage.addChild(gameScene);

  // create the space 
  const spaceTexture = TextureCache['Space.png'];
  space = new Sprite(spaceTexture);
  gameScene.addChild(space);

  // create the ship sprite
  ship = new Sprite(
    resources['src/img/sprite-Data.json'].textures['ship.png']
  );

  gameScene.addChild(ship);
  // ship scale
  ship.scale.set(0.6, 0.6);

  // start position of ship
  ship.x = gameScene.width / 2 - ship.width / 2;
  ship.y = gameScene.height - ship.height;
  ship.vx = 0;
  ship.vy = 0;

  // capture the keyboard arrow keys
  let left = keyboard(37),
    up = keyboard(38),
    right = keyboard(39),
    down = keyboard(40),
    short = keyboard(32);

  // move ship on left  
  left.press = () => {
    ship.vx = -5;
    ship.vy = 0;
  };
  left.release = () => {
    if (!right.isDown && ship.vy === 0) {
      ship.vx = 0;
    }
  };

  //  move ship on up
  up.press = () => {
    ship.vy = -5;
    ship.vx = 0;
  };
  up.release = () => {
    if (!down.isDown && ship.vx === 0) {
      ship.vy = 0;
    }
  };

  //  move ship on right
  right.press = () => {
    ship.vx = 5;
    ship.vy = 0;
  };
  right.release = () => {
    if (!left.isDown && ship.vy === 0) {
      ship.vx = 0;
    }
  };

  //  move ship on down
  down.press = () => {
    ship.vy = 5;
    ship.vx = 0;
  };
  down.release = () => {
    if (!up.isDown && ship.vx === 0) {
      ship.vy = 0;
    }
  };

  // Short

  // create the bulet sprite 
  bulet = new Sprite(
    resources['src/img/sprite-Data.json'].textures['bulet.png']
  );

  bulet.scale.set(0.6, 0.6);
  reloadingGuns = false;
  short.press = () => {
    if (reloadingGuns === false) {
      gameScene.addChild(bulet);
      reloadingGuns = true;
      bulet.x = ship.x + ship.width / 2 - bulet.width / 2;
      bulet.y = ship.y - bulet.height;
      bulet.vx = 0;
      bulet.vy = -10;
    } else {
      console.log('reload');
    }
  };
  short.release = () => {
    if (!up.isDown && bulet.vx === 0) {
      reloadingGuns = true;
    }
  };

  // create the aliens sprites
  numberOfAliens = 8,
    spacingBetwinAliens = 80,
    xOffsetAliens = 50,
    directionAliens = 1,
    topPositionAliens = 60,
    speedAliens = 2;

  // make as many aliens 1 line
  for (let i = 0; i < numberOfAliens; i++) {

    alien = new Sprite(resources['src/img/sprite-Data.json'].textures['alien.png']);
    alien.scale.set(0.4, 0.4);
    let x = spacingBetwinAliens * i;
    let y = topPositionAliens;

    alien.x = x + xOffsetAliens;
    alien.y = y;

    alien.vx = speedAliens * directionAliens;

    alien.id = i + 100;

    directionAliens *= -1;

    aliens.push(alien);

    gameScene.addChild(alien);
    // console.log(alien);

    console.log(aliens);
  }
  // make as many aliens 2 line
  // for (let i = 0; i < numberOfAliens; i++) {
  //   alien = new Sprite(resources['src/img/sprite-Data.json'].textures['alien.png']);
  //   alien.scale.set(0.4, 0.4);
  //   let x = spacing * i + xOffset;
  //   let y = 120;

  //   alien.x = x;
  //   alien.y = y;

  //   alien.vx = speed * direction;

  //   direction *= -1;

  //   alines.push(alien);

  //   gameScene.addChild(alien);
  // }

  // Create info game
  menu = new Container();
  menu.position.set(0, 0);
  gameScene.addChild(menu);

  // Create the background menu
  let innerMenu = new Graphics();
  innerMenu.beginFill(0x0e3846);
  innerMenu.drawRect(0, 0, 700, 40);
  innerMenu.endFill();
  menu.addChild(innerMenu);

  //Create the health bar
  healthBar = new Container();
  healthBar.position.set(app.stage.width - 220, 15)
  gameScene.addChild(healthBar);

  //Create the background helth-line
  let innerBar = new Graphics();
  innerBar.beginFill(0xfafaff);
  innerBar.drawRect(0, 0, 200, 10);
  innerBar.endFill();
  healthBar.addChild(innerBar);

  //Create the front red helth-line
  let outerBar = new Graphics();
  outerBar.beginFill(0xFF3300);
  outerBar.drawRect(1, 1, 198, 8);
  outerBar.endFill();
  healthBar.addChild(outerBar);

  healthBar.outer = outerBar;

  // Set the game state
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

  // Contain the ship inside the area of the space
  contain(ship, { x: 0, y: 400, width: 700, height: 600 });

  // if you hit the enemy  
  contain(bulet, { y: 40, height: 600 });
  if (bulet.y === 40) {
    gameScene.removeChild(bulet);
    reloadingGuns = false;
  } else {
    for (let i = 0; i < aliens.length; i++) {
      if (hitTestRectangle(bulet, aliens[i])) {
        gameScene.removeChild(bulet);
        gameScene.removeChild(aliens[i]);
        console.log('hit!!!!!!!!!!' + aliens[i].id);
      }
    }
  }

  // Area for liens
  aliens.forEach(function (alien) {
    alien.x += alien.vx;
    let areaForMuveAlien = contain(alien, { x: 10, width: 690 });
    if (areaForMuveAlien === 'left' || areaForMuveAlien === "right") {
      alien.vx *= -1;
    }
  })
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

function keyboard(value) {
  let key = {};
  key.value = value;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  //The `downHandler`
  key.downHandler = event => {
    if (event.keyCode === key.value) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
      event.preventDefault();
    }
  };

  //The `upHandler`
  key.upHandler = event => {
    if (event.keyCode === key.value) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
      event.preventDefault();
    }
  };

  //Attach event listeners
  const downListener = key.downHandler.bind(key);
  const upListener = key.upHandler.bind(key);

  window.addEventListener(
    "keydown", downListener, false
  );
  window.addEventListener(
    "keyup", upListener, false
  );

  // Detach event listeners
  key.unsubscribe = () => {
    window.removeEventListener("keydown", downListener);
    window.removeEventListener("keyup", upListener);
  };

  return key;
}

function hitTestRectangle(r1, r2) {

  //Define the variables we'll need to calculate
  let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

  //hit will determine whether there's a collision
  hit = false;

  //Find the center points of each sprite
  r1.centerX = r1.x + r1.width / 2;
  r1.centerY = r1.y + r1.height / 2;
  r2.centerX = r2.x + r2.width / 2;
  r2.centerY = r2.y + r2.height / 2;

  //Find the half-widths and half-heights of each sprite
  r1.halfWidth = r1.width / 2;
  r1.halfHeight = r1.height / 2;
  r2.halfWidth = r2.width / 2;
  r2.halfHeight = r2.height / 2;

  //Calculate the distance vector between the sprites
  vx = r1.centerX - r2.centerX;
  vy = r1.centerY - r2.centerY;

  //Figure out the combined half-widths and half-heights
  combinedHalfWidths = r1.halfWidth + r2.halfWidth;
  combinedHalfHeights = r1.halfHeight + r2.halfHeight;

  //Check for a collision on the x axis
  if (Math.abs(vx) < combinedHalfWidths) {

    //A collision might be occuring. Check for a collision on the y axis
    if (Math.abs(vy) < combinedHalfHeights) {

      //There's definitely a collision happening
      hit = true;
    } else {

      //There's no collision on the y axis
      hit = false;
    }
  } else {

    //There's no collision on the x axis
    hit = false;
  }

  //`hit` will be either `true` or `false`
  return hit;
}
