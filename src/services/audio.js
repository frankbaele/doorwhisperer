var Howl = require('howler').Howl;
var audioList = require('../config/sounds.json');
var $q = require('q');
var _ = {
    forEach : require('lodash.foreach')
};
var sounds = {};
module.exports = function(mediator){
    var defers = [];
    _.forEach(audioList, function (file){
        var defer = $q.defer();
        sounds[file] = new Howl({
            src: ['audio/' + file],
            preload: true,
            onload: defer.resolve
        });

        defers.push(defer.promise);
    });

    mediator.subscribe('audio.play', function(opts){
        sounds[opts.id].play();
    });

    mediator.subscribe('audio.stop', function(opts){
        sounds[opts.id].stop();
    });

    return $q.all(defers);
};