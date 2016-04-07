var THREE = require('three');
var CONST = require('../const');
var lights = require('./lights');
var upperTex = new THREE.TextureLoader().load('img/door/door_wood_upper.png');
var bottomTex = new THREE.TextureLoader().load('img/door/door_wood_lower.png');
var upperMat = new THREE.MeshLambertMaterial({map: upperTex});
var bottomMat = new THREE.MeshLambertMaterial({map: bottomTex});
var doorPiece = new THREE.BoxGeometry(32, 32, 8);
var mediator;
function create(opts) {
    var x = 0;
    var z = 0;
    var light = lights();
    light.position.z = 0;
    light.position.x = 0;
    light.position.y = -10;

    var group = new THREE.Object3D();
    var upper = new THREE.Mesh(doorPiece, upperMat);
    var bottom = new THREE.Mesh(doorPiece, bottomMat);
    group.add(upper);
    bottom.position.y = -32;
    group.add(bottom);
    group.add(light);
    // First check if how we are moving
    if (opts.from.x != opts.to.x) {
        //horizontal movement
        x = opts.to.x * CONST.room.width - CONST.room.width/2;
        z = opts.from.z * CONST.room.width + CONST.room.width/2;
        group.position.set(x, CONST.room.height/2, z);
        group.rotateY(Math.PI/2);
    }
    else {
        //vertical movement
        x = opts.from.x * CONST.room.width;
        z = opts.to.z * CONST.room.width;
        group.position.set(x, CONST.room.height/2, z);
    }

    mediator.publish('scene.add', group);
    return group;
}

module.exports = function (_mediator_) {
    mediator = _mediator_;
    return {
        create: create
    };
};