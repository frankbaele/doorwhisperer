var THREE = require('three');
var CONST = require('../const');
var _ = {
    forEach: require('lodash.foreach')
};

// Objects
var mergeGeometry = new THREE.Geometry();
var textures = {};
var wallPiece = new THREE.BoxGeometry((CONST.room.width - CONST.door.width) / 2, CONST.room.height, 16);
mergeGeometry.merge(wallPiece, wallPiece.matrix);
wallPiece.applyMatrix(new THREE.Matrix4().makeTranslation((CONST.room.width - CONST.door.width) / 2 + CONST.door.width, 0, 0));
mergeGeometry.merge(wallPiece, wallPiece.matrix);
mergeGeometry.center();

var wallPieceTop = new THREE.BoxGeometry(CONST.door.width, CONST.room.height - CONST.door.height, 16);
wallPieceTop.applyMatrix(new THREE.Matrix4().makeTranslation(0, CONST.door.height / 2, 0));
_.forEach(CONST.wallTextures, function(texture){
    var wallTexture = new THREE.TextureLoader().load(texture);
    wallTexture.wrapS = THREE.RepeatWrapping;
    wallTexture.wrapT = THREE.RepeatWrapping;
    wallTexture.repeat.set((CONST.room.width - CONST.door.width) / 2 / CONST.texture.widht, CONST.room.height / CONST.texture.height);

    var topTexture = new THREE.TextureLoader().load(texture);
    topTexture.wrapS = THREE.RepeatWrapping;
    topTexture.wrapT = THREE.RepeatWrapping;
    topTexture.repeat.set(CONST.door.width / CONST.texture.widht, (CONST.room.height - CONST.door.height) / CONST.texture.height);

    textures[texture] = {
        wall: wallTexture,
        top: topTexture
    }
});
module.exports = function (opts) {
    // Materials
    var wallMat = new THREE.MeshPhongMaterial({map: textures[opts.texture].wall});
    var topMat = new THREE.MeshPhongMaterial({map: textures[opts.texture].top});
    var wallMesh = new THREE.Mesh(mergeGeometry, wallMat);
    var topMesh = new THREE.Mesh(wallPieceTop, topMat);
    var group = new THREE.Object3D();
    group.add(wallMesh);
    group.add(topMesh);
    group.position.set(opts.x, opts.y, opts.z);
    group.rotation.y = opts.rotation;
    return group;
};