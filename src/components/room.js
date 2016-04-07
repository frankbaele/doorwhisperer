var THREE = require('three');
var CONST = require('../const');
var facet = require('./facet');
var floor = require('./floor');
var block = require('./block');
var _ = {
    forEach : require('lodash.foreach')
};
var mediator;
var listener;

function create(opts){
    var sounds = {};
    var group = new THREE.Object3D();
    group.add(floor());
    if(opts.data){
        _.forEach(opts.data.sounds, function(sound){
            sounds[sound] = new THREE.PositionalAudio(listener);
            sounds[sound].load(CONST.audio.url + sound);
            sounds[sound].setRefDistance( 75 );
            sounds[sound].autoplay = true;
            group.add(sounds[sound]);
        })
    }
    if (opts.walls.top) {
        group.add(facet({x: 0, y: 0, z: 0, rotation: 0}));
    } else {
        group.add(block({x: 0, y: 0, z: 0, rotation: 0}));
    }

    if (opts.walls.left) {
        group.add(facet({x: -CONST.room.width / 2, y: 0, z: CONST.room.width / 2, rotation: Math.PI / 2}));
    }else {
        group.add(block({x: -CONST.room.width / 2, y: 0, z: CONST.room.width / 2, rotation: Math.PI / 2}));
    }

    if (opts.walls.right) {
        group.add(facet({x: CONST.room.width / 2, y: 0, z: CONST.room.width / 2, rotation: -Math.PI / 2}));
    }else {
        group.add(block({x: CONST.room.width / 2, y: 0, z: CONST.room.width / 2, rotation: -Math.PI / 2}));
    }

    if (opts.walls.bottom) {
        group.add(facet({x: 0, y: 0, z: CONST.room.width, rotation: -Math.PI}));
    }else {
        group.add(block({x: 0, y: 0, z: CONST.room.width, rotation: -Math.PI}));
    }

    group.position.set(opts.x * CONST.room.width, opts.y + CONST.room.height/2, opts.z * CONST.room.width);
    mediator.publish('scene.add', group);
    return group;
}

module.exports = function (_mediator_, _listener_) {
    mediator = _mediator_;
    listener = _listener_;
    return {
        create: create
    }
};