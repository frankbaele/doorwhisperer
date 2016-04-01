var THREE = require('three');

module.exports = function(mediator){
    var scene = new THREE.Scene();
    mediator.subscribe('scene.add',function(object){
        scene.add(object);
    });

    return scene;

};