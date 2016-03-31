var THREE = require('three.js');
var _ = {
    forEach : require('lodash.foreach')
};
var textureList = require('../config/textures.json');
// instantiate a loader
var textureManager = new THREE.LoadingManager();
var textureLoader = new THREE.ImageLoader( textureManager );

module.exports = function(callback){
    textureManager.onLoad = function () {
        callback();
    };
    _.forEach(textureList, function(texture){
        textureLoader.load(texture, function(){
            console.log(texture);
        });
    });

};