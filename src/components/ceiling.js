var THREE = require('three');
var CONST = require('../const');
var floorTexture = new THREE.TextureLoader().load('img/cobblestone_mossy.png');
floorTexture.wrapS = THREE.RepeatWrapping;
floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set(20,20);
var geometry = new THREE.PlaneGeometry( CONST.room.width, CONST.room.width, CONST.room.width);
var material = new THREE.MeshPhongMaterial( {map: floorTexture,  side: THREE.DoubleSide} );

module.exports = function(){
    var floor = new THREE.Mesh( geometry, material );
    floor.position.y = CONST.room.height/2;
    floor.position.z = CONST.room.width/2;
    floor.rotateX(Math.PI / 2);
    return floor;
};
