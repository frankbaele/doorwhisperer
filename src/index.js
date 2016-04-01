var THREE = require('three');
var TWEEN = require('tween.js');
var Mediator = require("mediator-js").Mediator,
    mediator = new Mediator();
var scene = require('./services/scene')(mediator);
var map = require('./config/map.json');
var controls = require('./controls/controls')(mediator);
var camera = require('./components/camera')(mediator);
var user = require('./services/user')(mediator);
var room = require('./components/room');
var textureLoader = require('./services/textures');

function init() {
    textureLoader(function(){
        var walls = {};
        walls.left = true;
        walls.top = true;
        walls.right = true;
        walls.bottom = true;
        mediator.publish('scene.add',room({x:0,y:0,z:0, walls: walls}));
        renderer = new THREE.WebGLRenderer();
        renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( renderer.domElement );
        animate();
    });
}


function animate() {
    requestAnimationFrame( animate );
    TWEEN.update();
    renderer.render( scene, camera);
}

window.app = init;