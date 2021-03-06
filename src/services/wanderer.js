var CONST = require('../const');
var THREE = require('three');
var dungeon = require('../services/dungeon');
var map;
var TWEEN = require('tween.js');
var libs = require('../libs');
var StateMachine = require('javascript-state-machine');

var height = CONST.texture.height + CONST.texture.height * 0.5;
var wanTexture = new THREE.TextureLoader().load('img/char/wanderer.png');
wanTexture.wrapS = THREE.RepeatWrapping;
wanTexture.wrapT = THREE.RepeatWrapping;
wanTexture.repeat.set(1,1);
var wanMat = new THREE.MeshPhongMaterial({map: wanTexture});
var mediator = require('../services/mediator');
var ended = true;
module.exports = function(listener){
    var torchInst = new THREE.PointLight( 0xE25822, 1, 150);
    var steps = new THREE.PositionalAudio(listener);
    var growl = new THREE.PositionalAudio(listener);
    var state;
    steps.setRefDistance(15);
    growl.setRefDistance(15);
    steps.position.y = -16;
    steps.load('audio/player__stepforloop.wav');
    growl.load('audio/growl--close.mp3');
    growl.setLoop(true);
    growl.setRefDistance(10);
    growl.setVolume(1);
    steps.setVolume(0.7);
    var group = new THREE.Object3D();
    var position;
    var directionMap = [{z: -1, x: 0}, {z: 0, x: 1}, {z: 1, x: 0}, {z: 0, x: -1}];
    var directions = ['north', 'east', 'south', 'west'];
    var direction;
    var userPos = {
        x: 0,
        z: 0
    };

    var geom = new THREE.BoxGeometry(25, 25, 25);
    var mesh = new THREE.Mesh(geom, wanMat);
    group.add(steps);
    group.add(growl);
    group.add(mesh);
    group.add(torchInst);

    function createStateMachine(){
        return StateMachine.create({
            initial: 'center',
            error: function (eventName, from, to, args, errorCode, errorMessage) {
                console.log(eventName);
                console.log(from);
                console.log(to);
                console.log(args);
                console.log(errorCode);
                console.log(errorMessage);
            },
            events: [
                {name: 'left', from: 'center', to: 'turning'},
                {name: 'right', from: 'center', to: 'turning'},
                {name: 'stopped', from: 'turning', to: 'center'},
                {name: 'forward', from: 'center', to: 'door'},
                {name: 'back', from: 'door', to: 'center'},
                {name: 'enter', from: 'door', to: 'center'}
            ],
            callbacks: {
                onbeforeforward: function (event, from, to) {
                    var coords = nextRoom(position, direction);
                    return typeof map[coords.z] !== 'undefined' && typeof map[coords.z][coords.x] !== 'undefined' && map[coords.z][coords.x] !== null;
                },
                onforward: function (event, from, to) {
                    mediator.trigger('room.add.doors', nextRoom(position, direction));
                },
                onleft: function(){
                    if (direction == 0) {
                        direction = directions.length - 1;
                    } else {
                        direction = direction - 1;
                    }
                },
                onright: function(){
                    if (direction == directions.length - 1) {
                        direction = 0;
                    } else {
                        direction = direction + 1;
                    }
                },
                onturning: function(){
                    state.stopped();
                },
                onleavestate: function (event, from, to) {
                    if (event == 'right' || event == 'left') {
                        rotate({
                            'direction': event,
                            'callback': function () {
                                state.transition();
                            }
                        });
                        return StateMachine.ASYNC;
                    }
                    else if (event == 'forward') {
                        move({
                            'direction': 'forward',
                            'callback': function () {
                                state.transition();
                            }
                        });
                        return StateMachine.ASYNC;
                    }
                    else if (event == 'back') {
                        move({
                            'direction': 'back',
                            'callback': function () {
                                state.transition();
                                mediator.trigger('room.remove.doors', nextRoom(position, direction));
                            }
                        });
                        return StateMachine.ASYNC;
                    }
                    else if (event == 'enter') {
                        var coords = nextRoom(position, direction);
                        var id = doorId(position, direction);
                        mediator.trigger('door.open' + id, position);
                        moveRoom({
                            'coords': coords,
                            'callback': function () {
                                mediator.trigger('wanderer.position', coords);
                                position = coords;
                                mediator.trigger('room.remove.doors', position);
                                mediator.trigger('door.close.' + doorId(position, direction), position);
                                state.transition();
                            }
                        });
                        return StateMachine.ASYNC;
                    }
                }
            }
        });
    }

    function rotate(opts) {
        var value = group.rotation.y;
        if (opts.direction == 'left') {
            value = value + Math.PI / 2;
        } else {
            value = value - Math.PI / 2;
        }
        var time = 400;
        steps.play();
        new TWEEN.Tween(group.rotation)
            .to({y: value}, time)
            .onComplete(function () {
                steps.stop();
                if(opts.callback){
                    opts.callback();
                }
            })
            .start();
    }

    function move(opts) {
        if (opts.direction == 'back') {
            temp = CONST.room.width * 0.25;
        }
        if (opts.direction == 'forward') {
            temp = -CONST.room.width * 0.25;
        }
        var worldDirection = group.getWorldDirection();
        var value = _.clone(group.position);

        if (worldDirection.x == 1) {
            value.x = value.x + temp;
        } else if (worldDirection.x == -1) {
            value.x = value.x - temp;
        } else if (worldDirection.z == 1) {
            value.z = value.z + temp;
        } else if (worldDirection.z == -1) {
            value.z = value.z - temp;
        }
        var time = Math.round(Math.abs(temp) /CONST.speed/2 * 1000);
        steps.play();
        new TWEEN.Tween(group.position)
            .to({z: value.z, x: value.x}, time)
            .onComplete(function () {
                steps.stop();
                if(opts.callback){
                    opts.callback();
                }
            })
            .start();
    }

    function moveRoom(opts) {
        var value = {};
        value.x = opts.coords.x * CONST.room.width;
        value.z = opts.coords.z * CONST.room.width + CONST.room.width / 2;
        value.y = height;
        var distance = libs.distanceVector3(group.position, value);
        var time = Math.round(Math.abs(distance)/CONST.speed/2 * 1000);
        steps.play();
        new TWEEN.Tween(group.position)
            .to({z: value.z, x: value.x},time)
            .onComplete(function () {
                steps.stop();
                if(opts.callback){
                    opts.callback();
                }
            })
            .start();
    }

    function nextRoom(position, direction){
        return {
            x: position.x + directionMap[direction].x,
            z: position.z + directionMap[direction].z
        };
    }

    function doorId(position, direction){
        var id;
        var coords = nextRoom(position, direction);
        if (direction == 0) {
            id = coords.z + '_' + coords.x + '--' + position.z + '_' + position.x;
        } else if (direction == 1) {
            id = position.z + '_' + position.x + '--' + coords.z + '_' + coords.x;
        } else if (direction == 2) {
            id = position.z + '_' + position.x + '--' + coords.z + '_' + coords.x;
        } else if (direction == 3) {
            id = coords.z + '_' + coords.x + '--' + position.z + '_' + position.x;
        }
        return id;
    }

    function init(){
        growl.autoplay = true;
        map = dungeon.map();
        state = createStateMachine();
        position = dungeon.wandererPos();
        direction =  0;
        group.rotation.y = 0;
        group.position.z = position.z * CONST.room.width + CONST.room.width / 2;
        group.position.y = height;
        group.position.x = position.x * CONST.room.width;
        mediator.trigger('wanderer.position', position);
        mediator.trigger('scene.add', group);
        ended = false;
    }

    function destroy(){
        growl.stop();
        mediator.trigger('scene.remove', group);
    }

    mediator.on('new.gamecycle', function(cycle){
        if(!ended){
            //check if they are in the same room
            mediator.trigger('wanderer.position', group.position);
            var distance = libs.distanceVector3(group.position, userPos);
            if(distance < 75){
                ended = true;
                mediator.trigger('message.show', 'wanderer');
                mediator.trigger('game.death');
                mediator.trigger('game.end');
            }
            if(cycle % 10 == 0){
                var availableStates = state.transitions();
                var index = libs.getRandomInt(0, availableStates.length -1);
                if(state.can(availableStates[index])){
                    state[availableStates[index]]();
                }
            }
        }
    });

    mediator.on('game.start', function(){
        init();
    });

    mediator.on('game.end', function(){
        destroy();
    });

    mediator.on('user.position', function (coords) {
        userPos = coords;
    });

};