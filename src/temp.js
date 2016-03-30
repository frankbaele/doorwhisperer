
// create an array of assets to load, in the form of json files generated from TexturePacker
var assetsToLoader = [ "SpriteSheet.json"];

// create a new loader
loader = new PIXI.loaders.Loader();
loader.add('spriteSheet', 'SpriteSheet.json');
// use callback
//    loader.onComplete = onAssetsLoaded

//begin load
loader.load(onAssetsLoaded);

// holder to store aliens
var aliens = [];
var alienFrames = ["eggHead.png", "flowerTop.png", "helmlok.png", "skully.png"];

var count = 0;

// create an new instance of a pixi stage
var stage = new PIXI.Stage(0xFFFFFF);

// create a renderer instance.
var renderer = new PIXI.WebGLRenderer(window.innerWidth, window.innerHeight, {resolution:1, autoResize:true});

// add the renderer view element to the DOM
document.body.appendChild(renderer.view);

// create an empty container
var alienContainer = new PIXI.flip.Container3d();
alienContainer.position.x = window.innerWidth/2;
alienContainer.position.y = window.innerHeight/2;
alienContainer.position.z = 300;

stage.addChild(alienContainer);

function onAssetsLoaded()
{
    // add a bunch of aliens with textures from image paths
    for (var i = 0; i < 1000; i++)
    {
        var frameName = alienFrames[i % 4];

        // create an alien using the frame name..
        var alien = PIXI.flip.Sprite3d.fromFrame(frameName);
        //   alien.tint = Math.random() * 0xFFFFFF;

        /*
         * fun fact for the day :)
         * another way of doing the above would be
         * var texture = PIXI.Texture.fromFrame(frameName);
         * var alien = new PIXI.Sprite(texture);
         */
        alien.position = new math3d.Point3d(10, 1, 1);
        /*
        alien.anchor.x = 0.5;

        alien.anchor.y = 0.5;
        alien.rotation.x  = Math.random() * 100;
        alien.rotation.y  = Math.random() * 100;
        alien.rotation.z  = Math.random() * 100;*/
        aliens.push(alien);
        //  alien.position.z =  200;
        alienContainer.addChild(alien);
    }

    // start animating
    requestAnimationFrame(animate);
}


function animate() {
    // just for fun, lets rotate mr rabbit a little
    for (var i = 0; i < 1000; i++)
    {
        var alien = aliens[i];
        // alien.rotation.x += 0.01;
        // alien.rotation.y += 0.01;
    }

    count += 0.01;
    // alienContainer.scale.x = Math.sin(count);
    // alienContainer.scale.y = Math.sin(count);

    alienContainer.rotation.x += 0.01;
    alienContainer.rotation.y += 0.01;

    // render the stage
    renderer.render(stage);

    requestAnimationFrame(animate);
}
    