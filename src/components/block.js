var THREE = require('three');
var CONST = require('../const');
var lights = require('./lights');
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
    wallMesh.position.set(opts.x,opts.y, opts.z);
    wallMesh.rotation.y = opts.rotation;
    group.add(wallMesh);
    var light = lights();
    light.position.z = 32;
    light.position.x = 0;
    light.position.y = 64;
    group.add(light);

    return group;
};