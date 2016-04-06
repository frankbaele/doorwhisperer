var Tone = require('tone');
var audioList = require('../config/sounds.json');
var $q = require('q');
var _ = {
    forEach : require('lodash.foreach')
};
var sounds = {};
module.exports = function(){
    var defer = $q.defer();
    Tone.Buffer.on('load', defer.resolve);
    _.forEach(audioList, function (file){
        sounds[file] = new Tone.Player('./audio/' + file);
    });
    return defer.promise
};