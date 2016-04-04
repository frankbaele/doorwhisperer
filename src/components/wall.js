var THREE = require('three');
var CONST = require('../const');
// Textures
var wallTexture = new THREE.TextureLoader().load('img/cobblestone.png');
wallTexture.wrapS = THREE.RepeatWrapping;
wallTexture.wrapT = THREE.RepeatWrapping;
wallTexture.repeat.set((CONST.room.width - CONST.door.width) / 2 / CONST.texture.widht, CONST.room.height / CONST.texture.height);

var topTexture = new THREE.TextureLoader().load('img/cobblestone.png');
topTexture.wrapS = THREE.RepeatWrapping;
topTexture.wrapT = THREE.RepeatWrapping;
topTexture.repeat.set(CONST.door.width / CONST.texture.widht, (CONST.room.height - CONST.door.height) / CONST.texture.height);
// Materials
var wallMat = new THREE.MeshBasicMaterial({map: wallTexture});
var topMat = new THREE.MeshBasicMaterial({map: topTexture});
// Objects
var mergeGeometry = new THREE.Geometry();
var wallPiece = new THREE.BoxGeometry((CONST.room.width - CONST.door.width) / 2, CONST.room.height, 8);
mergeGeometry.merge(wallPiece, wallPiece.matrix);
wallPiece.applyMatrix(new THREE.Matrix4().makeTranslation((CONST.room.width - CONST.door.width) / 2 + CONST.door.width, 0, 0));
mergeGeometry.merge(wallPiece, wallPiece.matrix);
mergeGeometry.center()
var wallPieceTop = new THREE.BoxGeometry(CONST.door.width, CONST.room.height - CONST.door.height, 8);
wallPieceTop.applyMatrix(new THREE.Matrix4().makeTranslation(0, CONST.door.height / 2, 0));
module.exports = function (opts) {
    var wallMesh = new THREE.Mesh(mergeGeometry, wallMat);
    var topMesh = new THREE.Mesh(wallPieceTop, topMat);
    var group = new THREE.Object3D();
    group.add(wallMesh);
    group.add(topMesh);
    group.position.x = opts.x;
    group.position.y = opts.y;
    group.position.z = opts.z;
    group.rotateY(opts.rotation);
    return group;
};