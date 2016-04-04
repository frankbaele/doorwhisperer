var THREE = require('three');
var CONST = require('../const');
module.exports = function(opts){
    var group = new THREE.Object3D();
    var light = new THREE.PointLight( 0xff0000, 0.5, 100 );
    light.position.z = 32;
    var light2 = new THREE.PointLight( 0xff0000, 0.5, 100 );
    light2.position.z = -32;
    group.add(light);
    group.add(light2);
    group.position.x = opts.x;
    group.position.y = opts.y;
    group.position.z = opts.z;
    group.rotateY(opts.rotation);
    return group;
};