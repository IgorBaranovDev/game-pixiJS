//Aliases
let Application = PIXI.Application,
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

let space, ship, state;

//This `setup` function will run when the image has loaded
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
  const shipPositionX = app.stage.width / 2 - ship.width / 2,
    shipPositionY = app.stage.height - ship.height;

  ship.position.set(shipPositionX, shipPositionY);
  ship.vx = 0;
  ship.vy = 0;

  //Set the game state
  state = play;


}
