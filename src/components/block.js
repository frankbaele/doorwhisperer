var THREE = require('three');
var CONST = require('../const');
// Textures
var wallTexture = new THREE.TextureLoader().load('img/cobblestone.png');
wallTexture.wrapS = THREE.RepeatWrapping;
wallTexture.wrapT = THREE.RepeatWrapping;
wallTexture.repeat.set(CONST.room.width / CONST.texture.widht, CONST.room.height / CONST.texture.height);

// Materials
var wallMat = new THREE.MeshLambertMaterial({map: wallTexture});
// Objects
var wallGem = new THREE.BoxGeometry(CONST.room.width, CONST.room.height, 32);
module.exports = function (opts) {
    var group = new THREE.Object3D();
    var wallMesh = new THREE.Mesh(wallGem, wallMat);
    var light = new THREE.PointLight( 0xE25822, 0.15, 150);
    light.position.z = 32;
    light.position.y = 32;
    var light2 = new THREE.PointLight( 0xE25822, 0.15, 150);
    light2.position.z = -32;
    light2.position.y = 32;
    group.add(light);
    group.add(light2);
    group.add(wallMesh);
    group.position.set(opts.x,opts.y,opts.z);
    group.rotation.y = opts.rotation;

    return group;
};