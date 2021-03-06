var THREE = require('three');
var CONST = require('../const');
var upperTex = new THREE.TextureLoader().load('img/door/door_wood_upper.png');
var bottomTex = new THREE.TextureLoader().load('img/door/door_wood_lower.png');
var upperMat = new THREE.MeshPhongMaterial({map: upperTex,transparent: true});
var bottomMat = new THREE.MeshPhongMaterial({map: bottomTex,transparent: true});
var doorPiece = new THREE.BoxGeometry(32, 32, 4);
var TWEEN = require('tween.js');
var StateMachine = require('javascript-state-machin\e');
var mediator = require('../services/mediator');
var listener;

function create(opts) {
    var x = 0;
    var z = 0;
    var vertical = false;
    var group = new THREE.Object3D();
    var upper = new THREE.Mesh(doorPiece, upperMat);
    var bottom = new THREE.Mesh(doorPiece, bottomMat);
    var context = opts.id;
    upper.position.x = 16;
    bottom.position.y = -32;
    bottom.position.x = 16;
    // First check if how we are moving
    if (opts.from.x != opts.to.x) {
        //horizontal movement
        x = opts.to.x * CONST.room.width - CONST.room.width / 2;
        z = opts.from.z * CONST.room.width + CONST.room.width / 2;
        group.position.set(x, CONST.room.height / 2, z + 16);
        group.rotateY(Math.PI / 2);
    }

    else {
        x = opts.from.x * CONST.room.width;
        z = opts.to.z * CONST.room.width;
        group.position.set(x - 16, CONST.room.height / 2, z);
    }

    var openSound = new THREE.PositionalAudio(listener);
    var closeSound = new THREE.PositionalAudio(listener);
    openSound.load('audio/door__open--long.wav');
    closeSound.load('audio/door__close--short.wav');
    openSound.setRefDistance(15);
    openSound.setVolume(1);
    closeSound.setRefDistance(20);
    closeSound.setVolume(1);
    group.add(upper);
    group.add(bottom);
    group.add(openSound);
    group.add(closeSound);
    mediator.trigger('scene.add', group);
    var state = StateMachine.create({
        initial: 'closed',
        error: function (eventName, from, to, args, errorCode, errorMessage) {
            console.log(eventName);
            console.log(from);
            console.log(to);
            console.log(args);
            console.log(errorCode);
            console.log(errorMessage);
        },
        events: [
            {name: 'open', from: 'closed', to: 'opened'},
            {name: 'close', from: 'opened', to: 'closed'}
        ],
        callbacks: {
            onleavestate: function (event, from, to, args) {
                if (event == 'open') {
                    var value;
                    openSound.play();
                    if (args.x == opts.from.x && args.z == opts.from.z) {
                        // reverse opening
                        value = '-' + Math.PI / 2;
                    } else {
                        value = '+' + Math.PI / 2;
                    }
                    new TWEEN.Tween(group.rotation)
                        .to({y: value}, 300)
                        .onComplete(function () {
                            state.transition();
                        })
                        .start();
                    return StateMachine.ASYNC;
                }
                else if (event == 'close') {
                    var value;
                    closeSound.play();
                    if (args.x == opts.from.x && args.z == opts.from.z) {
                        value = '+' + Math.PI / 2;
                    } else {
                        value = '-' + Math.PI / 2;
                    }
                    new TWEEN.Tween(group.rotation)
                        .to({y: value}, 300)
                        .onComplete(function () {
                            state.transition();
                        })
                        .start();
                    return StateMachine.ASYNC;
                }
            }
        }
    });
    mediator.on('door.open.' + opts.id, function (from) {
        if(state.can('open')){
            state.open(from);
        }
    }, context);

    mediator.on('door.close.' + opts.id, function (from) {
        if(state.can('close')){
            state.close(from);

        }
    }, context);

    mediator.on('door.remove.' + opts.id, function () {
        mediator.trigger('scene.remove', group);
        mediator.off(null, null, context);
    }, context);

    mediator.on('doors.remove', function () {
        mediator.trigger('scene.remove', group);
        mediator.off(null, null, context);
    }, context);

    return group;
}

module.exports = function (_listener_) {
    listener = _listener_;
    return {
        create: create
    };
};