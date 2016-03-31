var THREE = require('three.js');
var wall = require('./wall');

module.exports = function(opts){

    var group = new THREE.Object3D();
    group.position.x = opts.x;
    group.position.y = opts.y;
    group.position.z = opts.z;
    group.add(wall({x:0, y:0, z:0, rotation: 0}));
    group.add(wall({x:-125, y:0, z:475, rotation: Math.PI / 2}));
    group.add(wall({x:475, y:0, z:475, rotation: Math.PI / 2}));
    group.add(wall({x:0, y:0, z:600, rotation: 0}));
    return group;
};