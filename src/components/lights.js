var THREE = require('three');
var CONST = require('../const');
module.exports = function(opts){
    var group = new THREE.Object3D();
    var light = new THREE.PointLight( 0xE25822, 1, 75);
    var light2 = new THREE.PointLight( 0xE25822, 1, 75);

    light.position.z = 40;
    light.position.y = -32;
    group.add(light);

    light2.position.z = -40;
    light2.position.y = -32;
    group.add(light2);

    group.position.x = opts.x;
    group.position.y = opts.y;
    group.position.z = opts.z;
    group.rotateY(opts.rotation);

    return group;
};