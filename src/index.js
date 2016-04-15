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
var gameCycle = require('./services/gameCycle')(mediator);
var textures = require('./services/textures');
var popup = require('./ui/popup');
var renderer;
function init(container) {
    var defers = [];
    defers.push(textures());
    popup(mediator, container);
    $q.all(defers).then(function(){
        var user = require('./services/user')(mediator, listener);
        var wanderer = require('./services/wanderer')(mediator, listener);
        renderer = new THREE.WebGLRenderer();
        renderer.setSize( window.innerWidth, window.innerHeight - 4);
        container.appendChild( renderer.domElement );
        mediator.trigger('message.show', 'start');
        animate();
    });
    window.addEventListener( 'resize', onWindowResize, false );

    function onWindowResize(){
        renderer.setSize( window.innerWidth, window.innerHeight );

    }
}


function animate() {
    requestAnimationFrame( animate );
    TWEEN.update();
    mediator.trigger('animate');
    renderer.render( scene, camera);
}

window.app = init;