var THREE = require('three');
var mediator = require('../services/mediator');
module.exports = function(){
    var scene = new THREE.Scene();
    mediator.on('scene.add',function(object){
        scene.add(object);
    });
    mediator.on('scene.remove',function(object){
        scene.remove(object);
    });
    return scene;

};