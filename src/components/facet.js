var THREE = require('three');
var CONST = require('../const');
var door = require('./door');
var wall = require('./wall');
var lights = require('./lights');

module.exports = function(opts){
    var group = new THREE.Object3D();
    group.add(wall());
    group.add(door());
    group.add(lights());

    group.position.x = opts.x;
    group.position.y = opts.y;
    group.position.z = opts.z;
    group.rotateY(opts.rotation);

    return group;
};