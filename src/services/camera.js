var THREE = require('three');
var TWEEN = require('tween.js');
var CONST = require('../const');
var libs = require('../libs');
var torch = require('../components/torch');
var _ = {
    clone: require('lodash.clone')
};
var height = CONST.texture.height + CONST.texture.height * 0.5;
module.exports = function (mediator, listener) {
    var camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 1, 250);
    camera.add(listener);
    var torchInst = torch(mediator, listener);
    var steptodoor = new THREE.PositionalAudio(listener);
    var stepbackdoor = new THREE.PositionalAudio(listener);
    var steps = new THREE.PositionalAudio(listener);
    var turn = new THREE.PositionalAudio(listener);
    var ambient = new THREE.PositionalAudio(listener);
    steptodoor.load('audio/player__steptodoor.wav');
    steptodoor.setVolume(0.35);
    steptodoor.position.y = -16;
    steptodoor.setRefDistance(15);
    stepbackdoor.load('audio/player__stepbackdoor.wav');
    stepbackdoor.setVolume(0.35);
    stepbackdoor.position.y = -16;
    stepbackdoor.setRefDistance(15);
    steps.load('audio/player__stepforloop.wav');
    steps.setVolume(0.35);
    steps.position.y = -16;
    steps.setRefDistance(15);
    steps.setLoop(true);
    turn.load('audio/player__turn.wav');
    turn.setVolume(0.35);
    turn.position.y = -16;
    turn.setRefDistance(15);
    ambient.load('audio/ambient.mp3');
    ambient.autoplay = true;
    ambient.setLoop(true);
    ambient.setVolume(0.80);
    camera.add(steps);
    camera.add(steptodoor);
    camera.add(stepbackdoor);
    camera.add(turn);
    camera.add(torchInst);
    camera.add(ambient);
    mediator.on('new.gamecycle', function(){
        mediator.trigger('user.position', camera.position);
    });
    mediator.on('camera.rotate', rotate);
    mediator.on('camera.move', move);
    mediator.on('camera.move.room', moveRoom);
    mediator.on('camera.center', function (coords) {
        camera.rotation.y = 0;
        camera.position.z = coords.z * CONST.room.width + CONST.room.width / 2;
        camera.position.y = height;
        camera.position.x = coords.x * CONST.room.width;
    });

    mediator.trigger('scene.add', camera);

    function moveRoom(opts) {
        var value = {};
        value.x = opts.coords.x * CONST.room.width;
        value.z = opts.coords.z * CONST.room.width + CONST.room.width / 2;
        value.y = height;
        var distance = libs.distanceVector3(camera.position, value);
        var time = Math.round(Math.abs(distance)/CONST.speed * 1000);
        steps.play();
        new TWEEN.Tween(camera.position)
            .to({z: value.z, x: value.x},time)
            .onComplete(function () {
                steps.stop();
                if(opts.callback){
                    opts.callback();
                }
            })
            .start();
    }

    function move(opts) {
        if (opts.direction == 'back') {
            temp = CONST.room.width * 0.25;
            steptodoor.play();
        }
        if (opts.direction == 'forward') {
            temp = -CONST.room.width * 0.25;
            stepbackdoor.play();
        }
        var worldDirection = camera.getWorldDirection();
        var value = _.clone(camera.position);

        if (worldDirection.x == 1) {
            value.x = value.x - temp;
        } else if (worldDirection.x == -1) {
            value.x = value.x + temp;
        } else if (worldDirection.z == 1) {
            value.z = value.z - temp;
        } else if (worldDirection.z == -1) {
            value.z = value.z + temp;
        }
        var time = Math.round(Math.abs(temp) /CONST.speed * 1000);

        new TWEEN.Tween(camera.position)
            .to({z: value.z, x: value.x}, time)
            .onComplete(function () {
                if(opts.callback){
                    opts.callback();
                }
            })
            .start();
    }

    function rotate(opts) {
        var value = camera.rotation.y;
        if (opts.direction == 'left') {
            value = value + Math.PI / 2;
        } else {
            value = value - Math.PI / 2;
        }
        var time = 400;
        turn.play();
        new TWEEN.Tween(camera.rotation)
            .to({y: value}, time)
            .onComplete(function () {
                if(opts.callback){
                    opts.callback();
                }
            })
            .start();
    }

    return camera;
};
