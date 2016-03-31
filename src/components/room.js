var THREE = require('three.js');

module.exports = function(){
    var texture = new THREE.TextureLoader().load('img/wall.jpg');
    var group = new THREE.Object3D();//create an empty container
    var gray = new THREE.MeshBasicMaterial( { wireframe:false, map:texture, color: 'gray'} );
    var geometry = new THREE.BoxGeometry( 600, 300,10 );
    var center = new THREE.Mesh( geometry, gray );

    var left =  new THREE.Mesh( geometry, gray );
    left.rotateY(Math.PI / 2);
    left.position.x = -300;
    left.position.z = 300;

    var right =  new THREE.Mesh( geometry, gray);
    right.rotateY(Math.PI / 2);
    right.position.x = 300;
    right.position.z = 300;

    var behind =  new THREE.Mesh( geometry, gray);
    behind.position.z = 600;
    group.add(behind);
    group.add(center);
    group.add(left);
    group.add(right);


    return group;
};