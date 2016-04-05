var THREE = require('three');
var CONST = require('../const');
module.exports = function(){
    var group = new THREE.Object3D();
    var light = new THREE.PointLight( 0xE25822, 1, 50);

    group.add(light);
    return group;
};