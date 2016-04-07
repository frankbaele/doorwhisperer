var THREE = require('three');
var CONST = require('../const');
var wall = require('./wall');

module.exports = function(opts){
    var group = new THREE.Object3D();
    group.add(wall());
    group.position.set(opts.x,opts.y, opts.z);
    group.rotation.y = opts.rotation;
    return group;
};