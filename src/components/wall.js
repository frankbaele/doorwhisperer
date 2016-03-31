var THREE = require('three.js');

module.exports = function(opts){
    var group = new THREE.Object3D();
    var wallTexture = new THREE.TextureLoader().load('img/wall.jpg');
    var woodTexture = new THREE.TextureLoader().load('img/wood.jpg');
    var wallMat = new THREE.MeshBasicMaterial( { map:wallTexture, color: 'white'} );
    var woodMat = new THREE.MeshBasicMaterial( { map:woodTexture, color: 'white'} );
    var wallPiece = new THREE.BoxGeometry(250, 300,10 );
    var left = new THREE.Mesh( wallPiece, wallMat);
    var right = new THREE.Mesh( wallPiece, woodMat);
    right.position.x = 350;
    group.add(left);
    group.add(right);

    group.position.x = opts.x;
    group.position.y = opts.y;
    group.position.z = opts.z;
    group.rotateY(opts.rotation);

    return group;
}