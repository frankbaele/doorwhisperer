var THREE = require('three');
var TWEEN = require('tween.js');
var _ = {
    clone: require('lodash.clone')
};

module.exports = function (mediator) {
    var birdView = false;
    var moving = false;
    var camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 1, 10000);

    if (birdView) {
        camera.position.z = 600;
        camera.position.y = 2000;
        camera.rotation.x = camera.rotation.x - Math.PI / 2;
    } else {
        camera.position.z = 300;
    }

    mediator.subscribe('camera.rotate', rotate);
    mediator.subscribe('camera.move', move);

    function move(direction) {
        moving = true;
        if (direction == 'back') {
            temp = 175;
        }
        if (direction == 'forward') {
            temp = - 175;
        }
        var worldDirection = camera.getWorldDirection();
        var value = _.clone(camera.position);

        if (worldDirection.x == 1) {
            value.x = value.x - temp;
        } else if (worldDirection.x == -1) {
            value.x = value.x + temp;
        } else if (worldDirection.z == 1) {
            value.z = value.z - temp;
        } else if (worldDirection.z == -1){
            value.z = value.z + temp;
        }

        new TWEEN.Tween(camera.position)
            .to({z: value.z, x: value.x}, 400)
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
