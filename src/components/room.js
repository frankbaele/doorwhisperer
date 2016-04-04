var THREE = require('three');
var CONST = require('../const');
var door = require('./door');
var wall = require('./wall');
var floor = require('./floor');

module.exports = function(opts){
    var group = new THREE.Object3D();
    group.position.x = opts.x;
    group.position.y = opts.y;
    group.position.z = opts.z;
    if(opts.walls.top){
        group.add(wall({x:0, y:0, z:0, rotation: 0}));
        group.add(door({x:0, y:0, z:0, rotation: 0}));
    }

    if(opts.walls.left){
        group.add(wall({x:-CONST.room.width/2, y:0, z:CONST.room.width/2, rotation: Math.PI / 2}));
        group.add(door({x:-CONST.room.width/2, y:0, z:CONST.room.width/2, rotation: Math.PI / 2}));
    }

    if(opts.walls.right){
        group.add(wall({x:CONST.room.width/2, y:0, z:CONST.room.width/2, rotation: Math.PI / 2}));
        group.add(door({x:CONST.room.width/2, y:0, z:CONST.room.width/2, rotation: Math.PI / 2}));

    }

    if(opts.walls.bottom){
        group.add(wall({x:0, y:0, z:CONST.room.width, rotation: 0}));
        group.add(door({x:0, y:0, z:CONST.room.width, rotation: 0}));
    }
    group.add(floor());
    group.position.y = CONST.room.height/2;
    return group;
};