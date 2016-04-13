console.log = null;
delete console.log;

var THREE = require('three');
var TWEEN = require('tween.js');
var Mediator = require("mediatorjs").Mediator,
    mediator = new Mediator();
var scene = require('./services/scene')(mediator);
var $q = require('q');
require("dom-delegator")();
var listener = new THREE.AudioListener();
var controls = require('./controls/controls')(mediator);
var camera = require('./services/camera')(mediator, listener);
var roomGen = require('./services/roomGenerator')(mediator, listener);
var textures = require('./services/textures');
var popup = require('./ui/popup');
function init(container) {
    var defers = [];
    defers.push(textures());
    popup(mediator, container);
    $q.all(defers).then(function(){
        var user = require('./services/user')(mediator, listener);
        renderer = new THREE.WebGLRenderer();
        renderer.setSize( window.innerWidth - 10, window.innerHeight -10);
        container.appendChild( renderer.domElement );
        mediator.trigger('message.show', 'start');
        animate();
    });
}


function animate() {
    setTimeout( function() {

        requestAnimationFrame( animate );

    }, 1000 / 60 );
    TWEEN.update();
    renderer.render( scene, camera);
}

window.app = init;