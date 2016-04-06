var THREE = require('three');
var _ = {
    forEach : require('lodash.foreach')
};
var $q = require('q');
var textureList = require('../config/textures.json');
// instantiate a loader
var textureManager = new THREE.LoadingManager();
var textureLoader = new THREE.ImageLoader( textureManager );

module.exports = function(){
    var defer = $q.defer();
    textureManager.onLoad = function () {
        defer.resolve();
    };
    _.forEach(textureList, function(texture){
        textureLoader.load(texture);
    });
    return defer.promise;
};