var THREE = require('three');
var libs = require('../libs');
var CONST = require('../const');
module.exports = function (mediator, listener) {
    var group = new THREE.Object3D();
    var audio = new THREE.PositionalAudio(listener);
    var heart = new THREE.PositionalAudio(listener);
    var light = new THREE.PointLight(0xE25822, 2, 125, 1);
    var red = 226 / 256;
    var blue = 34 / 256;
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
    heart.load('audio/heart__beat.mp3');
    audio.autoplay = true;
    heart.autoplay = true;
    audio.setLoop(true);
    heart.setLoop(true);
    audio.setRefDistance(15);
    heart.setRefDistance(15);
    audio.setVolume(0.40);
    heart.setVolume(0.40);
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
        var distance = libs.distanceVector3(userPos, wandererPos);
        if (!isNaN(distance)) {
            var value = distance / (CONST.room.width * 2);
            var green = (60 + value.clamp(0, 1) * 40) / 256;
            var volume = 0.90 - value.clamp(0, 1) * 0.40;
            light.color.setRGB(red, green, blue);
            heart.setVolume(volume);
        }
    }

    mediator.on('animate', function () {
        flickerPointLight();
    });

    mediator.on('user.position', function (coords) {
        userPos = coords;
    });

    mediator.on('wanderer.position', function (coords) {
        wandererPos = coords;
    });
    mediator.on('new.gamecycle', function () {
        setColor();
    });

    group.add(audio);
    group.add(heart);
    group.add(light);
    return group;
};