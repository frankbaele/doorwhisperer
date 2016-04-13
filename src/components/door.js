var THREE = require('three');
var CONST = require('../const');
var upperTex = new THREE.TextureLoader().load('img/door/door_wood_upper.png');
var bottomTex = new THREE.TextureLoader().load('img/door/door_wood_lower.png');
var upperMat = new THREE.MeshLambertMaterial({map: upperTex});
var bottomMat = new THREE.MeshLambertMaterial({map: bottomTex});
var doorPiece = new THREE.BoxGeometry(32, 32, 4);
var TWEEN = require('tween.js');
var mediator;
var listener;
function create(opts) {
    var x = 0;
    var z = 0;
    var light = new THREE.PointLight( 0xE25822, 0.60, 100);
    light.position.z = 32;
    light.position.x = 16;
    light.position.y = -10;
    var light2 = new THREE.PointLight( 0xE25822, 0.60, 100);
    light2.position.z = -32;
    light2.position.x = 16;
    light2.position.y = -10;
    var group = new THREE.Object3D();
    var upper = new THREE.Mesh(doorPiece, upperMat);
    var bottom = new THREE.Mesh(doorPiece, bottomMat);
    upper.position.x = 16;
    bottom.position.y = -32;
    bottom.position.x = 16;
    // First check if how we are moving
    if (opts.from.x != opts.to.x) {
        //horizontal movement
        x = opts.to.x * CONST.room.width - CONST.room.width/2;
        z = opts.from.z * CONST.room.width + CONST.room.width/2;
        group.position.set(x, CONST.room.height/2, z +16);
        group.rotateY(Math.PI/2);
    }

    else {
        //vertical movement
        x = opts.from.x * CONST.room.width;
        z = opts.to.z * CONST.room.width;
        group.position.set(x - 16, CONST.room.height/2, z);
    }

    var openSound = new THREE.PositionalAudio(listener);
    var closeSound = new THREE.PositionalAudio(listener);
    openSound.load('audio/door__open-close--knob.mp3');
    closeSound.load('audio/door__slam--wood.mp3');
    openSound.setRefDistance( 75 );
    closeSound.setRefDistance( 75 );
    group.add(upper);
    group.add(bottom);
    group.add(light);
    group.add(light2);
    group.add(openSound);
    mediator.trigger('scene.add', group);
    mediator.on('door.open.' + opts.id, function(from){
        var value;
        openSound.play();
        setTimeout(function(){
            openSound.stop();
        }, 500);
        if(from.x == opts.from.x  && from.z == opts.from.z){
            value = '-' + Math.PI/2;
        } else {
            value = '+' + Math.PI/2;
        }
        new TWEEN.Tween(group.rotation)
            .to({y: value}, 300)
            .start();
    });

    mediator.on('door.close.' + opts.id, function(from){
        var value;

        setTimeout(function(){
            closeSound.play();
        }, 150);
        if(from.x == opts.from.x  && from.z == opts.from.z){
            value = '+' + Math.PI/2;
        } else {
            value = '-' + Math.PI/2;
        }
        new TWEEN.Tween(group.rotation)
            .to({y: value}, 300)
            .start();
    });
    mediator.on('door.remove.' + opts.id, function(){
        mediator.trigger('scene.remove', group);
    });
    return group;
}

module.exports = function (_mediator_, _listener_) {
    mediator = _mediator_;
    listener = _listener_;
    return {
        create: create
    };
};