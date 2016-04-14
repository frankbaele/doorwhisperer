var THREE = require('three');
var TWEEN = require('tween.js');
var CONST = require('../const');
var libs = require('../libs');
var _ = {
    clone: require('lodash.clone')
};
var height = CONST.texture.height + CONST.texture.height * 0.5;
module.exports = function (mediator, listener) {
    var camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 1, 10000);
    var light = new THREE.PointLight( 0xE25822 , 1, 125);
    light.position.set(0,0,0);
    camera.add(light);
    camera.add(listener);
    var steps = new THREE.PositionalAudio(listener);
    var torch = new THREE.PositionalAudio(listener);
    var ambient = new THREE.PositionalAudio(listener);
    steps.load('audio/character__steps--cement.mp3');
    torch.load('audio/torch__burning.mp3');
    ambient.load('audio/ambient.mp3');
    torch.autoplay = true;
    ambient.autoplay = true;
    torch.setLoop(true);
    ambient.setLoop(true);
    ambient.setVolume(0.6);
    torch.setVolume(0.15);
    steps.position.y = -5;
    camera.add(steps);
    camera.add(torch);
    camera.add(ambient);
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
        var distance = libs.distanceVector(camera.position, value);
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
        }
        if (opts.direction == 'forward') {
            temp = -CONST.room.width * 0.25;
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
        steps.play();
        new TWEEN.Tween(camera.position)
            .to({z: value.z, x: value.x}, time)
            .onComplete(function () {
                steps.stop();
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
        steps.play();
        new TWEEN.Tween(camera.rotation)
            .to({y: value}, time)
            .onComplete(function () {
                steps.stop();
                if(opts.callback){
                    opts.callback();
                }
            })
            .start();
    }

    return camera;
};
