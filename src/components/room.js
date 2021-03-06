var THREE = require('three');
var CONST = require('../const');
var wall = require('./wall');
var floor = require('./floor');
var ceiling = require('./ceiling');
var block = require('./block');
var _ = {
    forEach : require('lodash.foreach')
};
var mediator = require('../services/mediator');
var listener;
function create(opts){
    var context;
    var sounds = {};
    var group = new THREE.Object3D();
    context = opts.z + '_' + opts.x;

    group.add(floor());
    if(opts.data){
        _.forEach(opts.data.sounds, function(sound){
            sounds[sound] = new THREE.PositionalAudio(listener);
            sounds[sound].load(CONST.audio.url + sound);
            sounds[sound].setRefDistance( 15 );
            sounds[sound].autoplay = true;
            group.add(sounds[sound]);
        });
        if(opts.data.type == 'win'){
            // shiny shine end light
            var shinyShine = new THREE.PointLight( 0xE25822, 1, 250);
            group.add(shinyShine);
        }
    }
    if (opts.walls.top) {
        group.add(wall({x: 0, y: 0, z: 8, rotation: 0, texture: opts.data.texture}));
    } else {
        group.add(block({x: 0, y: 0, z: 8, rotation: 0, texture: opts.data.texture}));
    }

    if (opts.walls.left) {
        group.add(wall({x: -CONST.room.width / 2 + 8, y: 0, z: CONST.room.width / 2, rotation: Math.PI / 2, texture: opts.data.texture}));
    }else {
        group.add(block({x: -CONST.room.width / 2 + 8, y: 0, z: CONST.room.width / 2, rotation: Math.PI / 2, texture: opts.data.texture}));
    }

    if (opts.walls.right) {
        group.add(wall({x: CONST.room.width / 2 - 8, y: 0, z: CONST.room.width / 2, rotation: -Math.PI / 2, texture: opts.data.texture}));
    }else {
        group.add(block({x: CONST.room.width / 2 - 8 , y: 0, z: CONST.room.width / 2, rotation: -Math.PI / 2, texture: opts.data.texture}));
    }

    if (opts.walls.bottom) {
        group.add(wall({x: 0, y: 0, z: CONST.room.width - 8, rotation: -Math.PI, texture: opts.data.texture}));
    }else {
        group.add(block({x: 0, y: 0, z: CONST.room.width - 8, rotation: -Math.PI, texture: opts.data.texture}));
    }

    group.position.set(opts.x * (CONST.room.width), opts.y + CONST.room.height/2, opts.z * (CONST.room.width));

    mediator.on('room.enter.' + context, function(callback){
        if(opts.data  && opts.data.type){
            mediator.trigger('message.show', opts.data.id);
            if( opts.data.type == 'lose'){
                mediator.trigger('game.end');
                mediator.trigger('game.death');
            } else if(opts.data.type == 'win'){
                mediator.trigger('game.end');
            }
        }

        else {
            if(callback){
                callback();
            }
        }
    }, context);

    mediator.on('room.remove.' + context , function(){
        mediator.off(null, null, context);
        mediator.trigger('scene.remove', group);
    }, context);

    mediator.on('rooms.remove' , function(){
        mediator.trigger('scene.remove', group);
        mediator.off(null, null, context);
    }, context);

    mediator.trigger('scene.add', group);
    return group;
}

module.exports = function (_listener_) {
    listener = _listener_;
    return {
        create: create
    }
};