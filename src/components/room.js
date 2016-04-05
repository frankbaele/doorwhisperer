var THREE = require('three');
var CONST = require('../const');
var facet = require('./facet');
var floor = require('./floor');
var ceiling = require('./ceiling');

module.exports = function(opts){
    var group = new THREE.Object3D();
    group.position.x = opts.x;
    group.position.y = opts.y;
    group.position.z = opts.z;
    if(opts.walls.top){
        group.add(facet({x:0, y:0, z:0, rotation: 0}));
    }
    if(opts.walls.left){
        group.add(facet({x:-CONST.room.width/2, y:0, z:CONST.room.width/2, rotation: Math.PI /2}));
    }
    if(opts.walls.right){
        group.add(facet({x:CONST.room.width/2, y:0, z:CONST.room.width/2, rotation: -Math.PI /2}));
    }
    if(opts.walls.bottom){
        group.add(facet({x:0, y:0, z:CONST.room.width, rotation: Math.PI}));
    }
    group.add(floor());
    group.add(ceiling());
    group.position.y = CONST.room.height/2;
    return group;
};