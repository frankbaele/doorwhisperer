var THREE = require('three');
module.exports = function(mediator, listener){
    var group = new THREE.Object3D();
    var audio = new THREE.PositionalAudio(listener);
    var light = new THREE.PointLight( 0xE25822 , 2, 125, 1);
    light.castShadow = true;
    light.position.set(0,0,0);
    audio.load('audio/torch__burning.mp3');
    audio.autoplay = true;
    audio.setLoop(true);
    audio.setVolume(0.20);
    var flickerPointLight = ( function() {
        var lastAdjuster;
        return function flickerPointLight() {
            var adjuster = ( Math.random() - 0.5 );
            if ( lastAdjuster ) {

                diff = ( adjuster - lastAdjuster ) * .2;
                adjuster = lastAdjuster + diff;

            }
            var intensity = 4;
            intensity += adjuster * 4;
            light.intensity = intensity;
            light.distance = adjuster * 50 + 200;
            light.decay = adjuster * 5 + 3;
            lastAdjuster = adjuster;
        }
    } )();
    mediator.on('animate', function(){
        flickerPointLight();
    });
    group.add(audio);
    group.add(light);
    return group;
};