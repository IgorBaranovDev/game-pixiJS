//Aliases
let Application = PIXI.Application,
  loader = PIXI.loader,
  resources = PIXI.loader.resources,
  Sprite = PIXI.Sprite;

//Create a Pixi Application
let app = new Application({
  width: 768,
  height: 550,
  antialiasing: false,
  transparent: false,
  resolution: 1
}
);

//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);

//To change the background color
app.renderer.backgroundColor = 0x061639;

//If you want to make the canvas fill the entire window, you can apply this
//CSS styling:
app.renderer.view.style.display = 'block';
app.renderer.view.style.margin = '20px auto';


//load an image and run the `setup` function when it's done
loader
  .add('src/img/spriteData.json')
  .on('progress', loadProgressHandler)
  .load(setup);

function loadProgressHandler(loader, resource) {
  console.log(`loading: ${resource.url}`);
  console.log(`progress: ${Math.round(loader.progress)}%`);
}

let ship, alien;

//This `setup` function will run when the image has loaded
function setup() {
  ship = new Sprite(
    resources['src/img/spriteData.json'].textures['ship.png']
  );
  app.stage.addChild(ship);
  //ship scale
  ship.scale.set(0.6, 0.6);

  //Start position of ship
  const bottomPositionOfShip = 550 - ship.height;
  ship.position.set(354, bottomPositionOfShip);
}
