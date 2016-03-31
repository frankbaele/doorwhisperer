var THREE = require('three.js');
var wallTexture = new THREE.TextureLoader().load('img/wall.jpg');
wallTexture.wrapS = THREE.RepeatWrapping;
wallTexture.wrapT = THREE.RepeatWrapping;
wallTexture.repeat.set( 1, 1 );
var woodTexture = new THREE.TextureLoader().load('img/wood.jpg');
woodTexture.wrapS = THREE.RepeatWrapping;
woodTexture.wrapT = THREE.RepeatWrapping;
woodTexture.repeat.set( 1, 1 );
var wallPiece = new THREE.BoxGeometry(250, 300,10 );
var wallMat = new THREE.MeshBasicMaterial( { map:wallTexture, color: 'white'} );
var woodMat = new THREE.MeshBasicMaterial( { map:woodTexture, color: 'white'} );
module.exports = function(opts){
    var group = new THREE.Object3D();
    var left = new THREE.Mesh( wallPiece, wallMat);
    var right = new THREE.Mesh( wallPiece, woodMat);
    right.position.x = 350;
    group.add(left);
    group.add(right);
    group.position.x = opts.x - 300;
    group.position.y = opts.y;
    group.position.z = opts.z;
    group.rotateY(opts.rotation);
    return group;
};