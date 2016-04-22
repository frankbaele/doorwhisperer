console.log = null;
delete console.log;
var _ = {
    forEach: require('lodash.foreach')
};
var mediator = require('./services/mediator');
var THREE = require('three');
var TWEEN = require('tween.js');
var scene = require('./services/scene')();
require("dom-delegator")();
var dungeon = require("./services/dungeon");
var listener = new THREE.AudioListener();
var controls = require('./controls/controls')();
var camera = require('./services/camera')(listener);
var roomGen = require('./services/roomGenerator')(listener);
var gameCycle = require('./services/gameCycle')();
var textures = require('./services/textures');
var popup = require('./ui/popup');
var renderer;
function init(container) {
    var defers = [];
    defers.push();
    popup(container);
    textures().then(function(){
        dungeon.generate();
        var user = require('./services/user')(listener);
        //var wanderer = require('./services/wanderer')(listener);
        renderer = new THREE.WebGLRenderer();
        renderer.setSize( window.innerWidth, window.innerHeight - 4);
        container.appendChild( renderer.domElement );
        mediator.trigger('message.show', 'start');
        mediator.trigger('game.start');
        animate();
    });
    window.addEventListener( 'resize', onWindowResize, false );
    mediator.on('game.end', function(){
        TWEEN.removeAll();
        dungeon.generate();
        setTimeout(function(){
            console.log('restart');
            mediator.trigger('game.start');
        }, 500);
    });
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