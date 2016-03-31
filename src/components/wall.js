var THREE = require('three');
var wallTexture = new THREE.TextureLoader().load('img/wall.jpg');
wallTexture.wrapS = THREE.RepeatWrapping;
wallTexture.wrapT = THREE.RepeatWrapping;
wallTexture.repeat.set( 1, 1 );
var woodTexture = new THREE.TextureLoader().load('img/wood.jpg');
woodTexture.wrapS = THREE.RepeatWrapping;
woodTexture.wrapT = THREE.RepeatWrapping;
woodTexture.repeat.set( 1, 1 );

var wallMat = new THREE.MeshBasicMaterial( { map:wallTexture, color: 'white'} );
var woodMat = new THREE.MeshBasicMaterial( { map:woodTexture, color: 'white'} );
var mergeGeometry = new THREE.Geometry();
var wallPiece = new THREE.BoxGeometry(250,300,10);
var walltop = new THREE.BoxGeometry(100,50,10);
walltop.applyMatrix( new THREE.Matrix4().makeTranslation(175, 125, 0) );
mergeGeometry.merge( wallPiece, wallPiece.matrix);
mergeGeometry.merge( walltop, walltop.matrix);
wallPiece.applyMatrix( new THREE.Matrix4().makeTranslation(350, 0, 0) );
mergeGeometry.merge( wallPiece, walltop.matrix);

module.exports = function(opts){
    var group = new THREE.Object3D();
    //right.position.x = 350;
    group.add(new THREE.Mesh(mergeGeometry));
    group.position.x = opts.x;
    group.position.y = opts.y;
    group.position.z = opts.z;
    group.rotateY(opts.rotation);
    return group;
};