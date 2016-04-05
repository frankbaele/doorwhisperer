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
    lightLeft.position.z = 20;
    lightLeft.position.x = 0;
    lightLeft.position.y = -10;
    group.add(lightLeft);
    group.position.set(opts.x,opts.y, opts.z);
    group.rotation.y = opts.rotation;
    return group;
};