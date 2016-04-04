var THREE = require('three');
var CONST = require('../const');
var wall = require('./wall');
var floorTexture = new THREE.TextureLoader().load('img/stonebrick.png');
floorTexture.wrapS = THREE.RepeatWrapping;
floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set(20,20);

module.exports = function(opts){
    var group = new THREE.Object3D();
    group.position.x = opts.x;
    group.position.y = opts.y;
    group.position.z = opts.z;
    if(opts.walls.top){
        group.add(wall({x:0, y:0, z:0, rotation: 0}));
    }
    if(opts.walls.left){
        group.add(wall({x:-CONST.room.width/2, y:0, z:CONST.room.width/2, rotation: Math.PI / 2}));
    }
    if(opts.walls.right){
        group.add(wall({x:CONST.room.width/2, y:0, z:CONST.room.width/2, rotation: Math.PI / 2}));
    }
    if(opts.walls.bottom){
        group.add(wall({x:0, y:0, z:CONST.room.width, rotation: 0}));
    }
    var geometry = new THREE.PlaneGeometry( CONST.room.width, CONST.room.width, CONST.room.width);
    var material = new THREE.MeshBasicMaterial( {map: floorTexture,  side: THREE.DoubleSide} );
    var floor = new THREE.Mesh( geometry, material );
    floor.position.y = - CONST.room.height/2;
    floor.position.z = CONST.room.width/2;

    floor.rotateX(Math.PI / 2);
    group.add(floor);
    group.position.y = CONST.room.height/2;
    return group;
};