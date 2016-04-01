var THREE = require('three');
var wall = require('./wall');
var floorTexture = new THREE.TextureLoader().load('img/stonebrick.png');
floorTexture.wrapS = THREE.RepeatWrapping;
floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set(20,20);

module.exports = function(opts){
    var group = new THREE.Object3D();
    group.position.x = opts.x;
    group.position.y = opts.y;
    group.position.z = opts.z;
    if(opts.walls.top){
        group.add(wall({x:0, y:0, z:0, rotation: 0}));
    }
    if(opts.walls.left){
        group.add(wall({x:-320, y:0, z:320, rotation: Math.PI / 2}));
    }
    if(opts.walls.right){
        group.add(wall({x:320, y:0, z:320, rotation: Math.PI / 2}));
    }
    if(opts.walls.bottom){
        group.add(wall({x:0, y:0, z:640, rotation: 0}));
    }
    var geometry = new THREE.PlaneGeometry( 640, 640, 640);
    var material = new THREE.MeshBasicMaterial( {map: floorTexture,  side: THREE.DoubleSide} );
    var floor = new THREE.Mesh( geometry, material );
    floor.position.y = -128;
    floor.position.z = 320;
    floor.rotateX(Math.PI / 2);
    group.add(floor);
    return group;
};