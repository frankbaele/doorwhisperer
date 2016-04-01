var THREE = require('three');
var TWEEN = require('tween.js');
module.exports = function (mediator) {
    var birdView = false;
    var rotating = false;
    var camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 1, 10000);
    if (birdView) {
        camera.position.z = 600;
        camera.position.y = 2000;
        camera.rotation.x = camera.rotation.x - Math.PI / 2;
    } else {
        camera.position.z = 300;
    }

    mediator.subscribe('keypress', function (input) {
        switch (input) {
            case '<left>' :
                rotate('left');
                break;
            case '<right>' :
                rotate('right');
                break;
            case '<up>' :
                break;
            case '<down>' :
                break;
        }
    });
    function rotate(direction) {
        if (!rotating) {
            rotating = true;
            var value;
            if (direction == 'left') {
                value = camera.rotation.y + Math.PI / 2;
            } else {
                value = camera.rotation.y - Math.PI / 2;
            }
            new TWEEN.Tween(camera.rotation)
                .to({y: value}, 400)
                .onComplete(function(){
                    rotating = false
                })
                .start();
        }

    }

    return camera;
};
