var THREE = require('three');
var TWEEN = require('tween.js');
var CONST = require('../const');
var libs = require('../libs');
var _ = {
    clone: require('lodash.clone')
};
var height = CONST.texture.height + CONST.texture.height * 0.5;
module.exports = function (mediator) {
    var moving = false;
    var camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 1, 10000);
    var light = new THREE.PointLight( 0x404040 , 2, 100);

    light.position.set(0,0,0);
    camera.add(light);
    mediator.subscribe('camera.rotate', rotate);
    mediator.subscribe('camera.move', move);
    mediator.subscribe('camera.move.room', moveRoom);
    mediator.subscribe('camera.center', function (coords) {
        camera.position.z = coords.z * CONST.room.width + CONST.room.width / 2;
        camera.position.y = height;
        camera.position.x = coords.x * CONST.room.width;
    });
    mediator.publish('scene.add', camera);
    function moveRoom(coords) {
        moving = true;
        var value = {};
        value.x = coords.x * CONST.room.width;
        value.z = coords.z * CONST.room.width + CONST.room.width / 2;
        value.y = height;
        var distance = libs.distanceVector(camera.position, value);

        new TWEEN.Tween(camera.position)
            .to({z: value.z, x: value.x}, Math.abs(distance)/CONST.speed * 1000)
            .onComplete(function () {
                moving = false
            })
            .start();
    }

    function move(direction) {
        moving = true;
        if (direction == 'back') {
            temp = CONST.room.width * 0.25;
        }
        if (direction == 'forward') {
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

        new TWEEN.Tween(camera.position)
            .to({z: value.z, x: value.x}, Math.abs(temp) /CONST.speed * 1000)
            .onComplete(function () {
                moving = false
            })
            .start();
    }

    function rotate(direction) {
        if (!moving) {
            moving = true;
            var value = camera.rotation.y;
            if (direction == 'left') {
                value = value + Math.PI / 2;
            } else {
                value = value - Math.PI / 2;
            }
            new TWEEN.Tween(camera.rotation)
                .to({y: value}, 400)
                .onComplete(function () {
                    moving = false
                })
                .start();
        }
    }

    return camera;
};
