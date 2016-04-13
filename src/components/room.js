var THREE = require('three');
var CONST = require('../const');
var wall = require('./facet');
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
        group.add(wall({x: 0, y: 0, z: 8, rotation: 0}));
    } else {
        group.add(block({x: 0, y: 0, z: 8, rotation: 0}));
    }

    if (opts.walls.left) {
        group.add(wall({x: -CONST.room.width / 2 + 8, y: 0, z: CONST.room.width / 2, rotation: Math.PI / 2}));
    }else {
        group.add(wall({x: -CONST.room.width / 2 + 8, y: 0, z: CONST.room.width / 2, rotation: Math.PI / 2}));
    }

    if (opts.walls.right) {
        group.add(wall({x: CONST.room.width / 2 - 8, y: 0, z: CONST.room.width / 2, rotation: -Math.PI / 2}));
    }else {
        group.add(block({x: CONST.room.width / 2 - 8 , y: 0, z: CONST.room.width / 2, rotation: -Math.PI / 2}));
    }

    if (opts.walls.bottom) {
        group.add(wall({x: 0, y: 0, z: CONST.room.width - 8, rotation: -Math.PI}));
    }else {
        group.add(block({x: 0, y: 0, z: CONST.room.width - 8, rotation: -Math.PI}));
    }

    group.position.set(opts.x * (CONST.room.width), opts.y + CONST.room.height/2, opts.z * (CONST.room.width));
    // small performance optimisation, since we are not moving it anymore, no need for updates.
    setTimeout(function(){
        group.matrixAutoUpdate = false;
    });

    mediator.subscribe('room.enter.' + opts.z + '_' + opts.x, function(){
        if(opts.data.type){
            mediator.publish('message.show', opts.data.type);
        }
    });

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