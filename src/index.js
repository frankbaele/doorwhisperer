var THREE = require('three');
var TWEEN = require('tween.js');
var Mediator = require("mediator-js").Mediator,
    mediator = new Mediator();
var scene = require('./services/scene')(mediator);
var controls = require('./controls/controls')(mediator);
var camera = require('./components/camera')(mediator);
var roomGen = require('./services/roomGenerator')(mediator);
var sounds = require('./sound')(mediator);
var textureLoader = require('./services/textures');
function init() {
    textureLoader(function(){
        var user = require('./services/user')(mediator);
        renderer = new THREE.WebGLRenderer();
        renderer.setSize( window.innerWidth - 10, window.innerHeight -10);
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