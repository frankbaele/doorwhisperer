var THREE = require('three');
var CONST = require('../const');
var upperTex = new THREE.TextureLoader().load('img/door/door_wood_upper.png');
var bottomTex = new THREE.TextureLoader().load('img/door/door_wood_lower.png');
var upperMat = new THREE.MeshBasicMaterial({map: upperTex});
var bottomMat = new THREE.MeshBasicMaterial({map: bottomTex});
var doorPiece = new THREE.BoxGeometry(32, 32, 8);
module.exports = function(opts){
    var group = new THREE.Object3D();
    var upper = new THREE.Mesh(doorPiece, upperMat);
    var bottom = new THREE.Mesh(doorPiece, bottomMat);
    group.add(upper);
    bottom.position.y = -32;
    group.add(bottom);

    group.position.x = opts.x;
    group.position.y = opts.y;
    group.position.z = opts.z;
    group.rotateY(opts.rotation);
    return group;
};