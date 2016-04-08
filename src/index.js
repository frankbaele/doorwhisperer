var THREE = require('three');
var TWEEN = require('tween.js');
var Mediator = require("mediator-js").Mediator,
    mediator = new Mediator();
var scene = require('./services/scene')(mediator);
var $q = require('q');
var listener = new THREE.AudioListener();
var controls = require('./controls/controls')(mediator);
var camera = require('./services/camera')(mediator, listener);
var roomGen = require('./services/roomGenerator')(mediator, listener);
var textures = require('./services/textures');
function init() {
    var defers = [];
    defers.push(textures());
    $q.all(defers).then(function(){
        var user = require('./services/user')(mediator, listener);
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