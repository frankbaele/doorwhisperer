var THREE = require('three');
var wallTexture = new THREE.TextureLoader().load('img/cobblestone.png');
wallTexture.wrapS = THREE.RepeatWrapping;
wallTexture.wrapT = THREE.RepeatWrapping;
wallTexture.repeat.set(4,4);

var topTexture = new THREE.TextureLoader().load('img/cobblestone.png');
topTexture.wrapS = THREE.RepeatWrapping;
topTexture.wrapT = THREE.RepeatWrapping;
topTexture.repeat.set(2,1);

var wallMat = new THREE.MeshBasicMaterial( { map:wallTexture} );
var topMat = new THREE.MeshBasicMaterial( { map:topTexture} );
var mergeGeometry = new THREE.Geometry();
var wallPiece = new THREE.BoxGeometry(256,256,8);
mergeGeometry.merge( wallPiece, wallPiece.matrix);
wallPiece.applyMatrix( new THREE.Matrix4().makeTranslation(384, 0, 0));
mergeGeometry.merge( wallPiece, wallPiece.matrix);
mergeGeometry.applyMatrix( new THREE.Matrix4().makeTranslation(-192,  0, 0));
var wallPieceTop = new THREE.BoxGeometry(128,64,8);
wallPieceTop.applyMatrix( new THREE.Matrix4().makeTranslation(0,96, 0));


module.exports = function(opts){
    var wallMesh = new THREE.Mesh(mergeGeometry, wallMat);
    var topMesh = new THREE.Mesh(wallPieceTop,topMat);
    var group = new THREE.Object3D();
    group.add(wallMesh);
    group.add(topMesh);
    group.position.x = opts.x;
    group.position.y = opts.y;
    group.position.z = opts.z;
    group.rotateY(opts.rotation);
    return group;
};