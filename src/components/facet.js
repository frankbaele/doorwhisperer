var THREE = require('three');
var CONST = require('../const');
var door = require('./door');
var wall = require('./wall');
var lights = require('./lights');

module.exports = function(opts){
    var group = new THREE.Object3D();
    group.add(wall());
    group.add(door());
    var lightLeft = lights();
    var lightRight = lights();
    lightLeft.position.z = 32;
    lightLeft.position.x = -32;
    lightRight.position.z = 32;
    lightRight.position.x = 48;
    group.add(lightLeft);
    //group.add(lightRight);
    group.position.set(opts.x,opts.y, opts.z);
    group.rotation.y = opts.rotation;
    return group;
};