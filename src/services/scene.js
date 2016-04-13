var THREE = require('three');

module.exports = function(mediator){
    var scene = new THREE.Scene();
    mediator.on('scene.add',function(object){
        scene.add(object);
    });
    mediator.on('scene.remove',function(object){
        scene.remove(object);
    });
    return scene;

};