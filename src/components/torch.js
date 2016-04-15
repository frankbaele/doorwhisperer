var THREE = require('three');
var libs = require('../libs');
module.exports = function (mediator, listener) {
    var group = new THREE.Object3D();
    var audio = new THREE.PositionalAudio(listener);
    var light = new THREE.PointLight(0xE25822, 2, 125, 1);
    var userPos = {
        x: 0,
        z: 0
    };
    var wandererPos = {
        x: 0,
        z: 0
    };
    light.castShadow = true;
    light.position.set(0, 0, 0);
    audio.load('audio/torch__burning.mp3');
    audio.autoplay = true;
    audio.setLoop(true);
    audio.setVolume(0.20);
    var flickerPointLight = (function () {
        var lastAdjuster;
        return function flickerPointLight() {
            var adjuster = ( Math.random() - 0.5 );
            if (lastAdjuster) {

                diff = ( adjuster - lastAdjuster ) * .2;
                adjuster = lastAdjuster + diff;

            }
            var intensity = 4;
            intensity += adjuster * 4;
            light.intensity = intensity;
            light.distance = adjuster * 50 + 150;
            light.decay = adjuster * 5 + 3;
            lastAdjuster = adjuster;
        }
    })();

    function setColor() {
        var distance = libs.distanceVector2(userPos, wandererPos);
        if (distance == 1) {
            light.color.setHex( '0xE24822' );
        } else if (distance < 2) {
            light.color.setHex( '0xE25822' );
        } else {
            light.color.setHex( '0xE26822' );
        }
    }

    mediator.on('animate', function () {
        flickerPointLight();
    });

    mediator.on('user.position', function (coords) {
        userPos = coords;
        setColor();
    });

    mediator.on('wanderer.position', function (coords) {
        wandererPos = coords;
        setColor();
    });

    group.add(audio);
    group.add(light);
    return group;
};