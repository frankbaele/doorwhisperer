var THREE = require('three');
var CONST = require('../const');
module.exports = function(){
    var group = new THREE.Object3D();
    var light = new THREE.PointLight( 0xE25822, 1, 75);
    var sphereSize = 1;
    light.position.z = 40;
    light.position.y = -32;
    group.add(light);
    var pointLightHelper = new THREE.PointLightHelper( light, sphereSize );
    group.add(pointLightHelper);
    return light;
};