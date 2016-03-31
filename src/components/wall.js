var THREE = require('three');
var wallTexture = new THREE.TextureLoader().load('img/cobblestone.png');
wallTexture.wrapS = THREE.RepeatWrapping;
wallTexture.wrapT = THREE.RepeatWrapping;
wallTexture.repeat.set(8,8);
var woodTexture = new THREE.TextureLoader().load('img/planks.png');
woodTexture.wrapS = THREE.RepeatWrapping;
woodTexture.wrapT = THREE.RepeatWrapping;
woodTexture.repeat.set(2,4);

var wallMat = new THREE.MeshBasicMaterial( { map:wallTexture, color: 'white'} );
var woodMat = new THREE.MeshBasicMaterial( { map:woodTexture, color: 'white'} );
var mergeGeometry = new THREE.Geometry();
var wallPiece = new THREE.BoxGeometry(250,300,10);
var wallPieceTop = new THREE.BoxGeometry(100,50,10);
var doorPiece = new THREE.BoxGeometry(100,250,10);

wallPieceTop.applyMatrix( new THREE.Matrix4().makeTranslation(175, 125, 0) );
mergeGeometry.merge( wallPiece, wallPiece.matrix);
mergeGeometry.merge( wallPieceTop, wallPieceTop.matrix);
wallPiece.applyMatrix( new THREE.Matrix4().makeTranslation(350, 0, 0));
mergeGeometry.merge( wallPiece, wallPieceTop.matrix);
module.exports = function(opts){
    var wallMesh = new THREE.Mesh(mergeGeometry, wallMat);
    var doorMesh = new THREE.Mesh(doorPiece,woodMat);
    var group = new THREE.Object3D();
    //right.position.x = 350;
    group.add(wallMesh);
    doorMesh.position.x = 175;
    doorMesh.position.y = -25;
    group.add(doorMesh);
    group.position.x = opts.x;
    group.position.y = opts.y;
    group.position.z = opts.z;
    group.rotateY(opts.rotation);
    return group;
};