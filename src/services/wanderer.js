var CONST = require('../const');
var THREE = require('three');
var map = require('../config/map.json');
var TWEEN = require('tween.js');
var StateMachine = require('javascript-state-machine');
var height = CONST.texture.height + CONST.texture.height * 0.5;

module.exports = function(mediator, listener){
    var steps = new THREE.PositionalAudio(listener);
    steps.load('audio/character__steps--cement.mp3');
    steps.position.y = -5;

    var group = new THREE.Object3D();
    var position;
    var directionMap = [{z: -1, x: 0}, {z: 0, x: 1}, {z: 1, x: 0}, {z: 0, x: -1}];
    var directions = ['north', 'east', 'south', 'west'];
    var direction;
    var geom = new THREE.BoxGeometry(25, 25, 25);
    var mat = new THREE.MeshLambertMaterial();
    var mesh = new THREE.Mesh(geom, mat);
    group.add(steps);
    group.add(mesh);
    var state = StateMachine.create({
        initial: 'center',
        error: function (eventName, from, to, args, errorCode, errorMessage) {},
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
                return typeof map[coords.z] !== 'undefined' && typeof map[coords.z][coords.x] !== 'undefined';
            },
            onforward: function (event, from, to) {
                if(from == 'center'){
                    mediator.trigger('room.add', nextRoom(position, direction));
                }
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
            onback: function (event, from, to) {
                if(from =='door.open'){
                    var id = doorId(position, direction);
                    mediator.trigger('door.close.' + id, position);
                }
            },
            onturning: function(){
                state.stopped()
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
                            //mediator.trigger('room.remove', nextRoom(position, direction));
                        }
                    });
                    return StateMachine.ASYNC;
                }
                else if (event == 'enter') {
                    var coords = nextRoom(position, direction);
                    var id = doorId(position, direction);
                    mediator.trigger('door.open.' + id, position);
                    moveRoom({
                        'coords': coords,
                        'callback': function () {
                            //mediator.trigger('room.remove', position);
                            mediator.trigger('door.close.' + doorId(position, direction), position);
                            position = coords;
                            state.transition();
                        }
                    });
                    return StateMachine.ASYNC;
                }
            }
        }
    });
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
            value.x = value.x - temp;
        } else if (worldDirection.x == -1) {
            value.x = value.x + temp;
        } else if (worldDirection.z == 1) {
            value.z = value.z - temp;
        } else if (worldDirection.z == -1) {
            value.z = value.z + temp;
        }
        var time = Math.round(Math.abs(temp) /CONST.speed * 1000);
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
        var distance = libs.distanceVector(group.position, value);
        var time = Math.round(Math.abs(distance)/CONST.speed * 1000);
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
    /**
    * Returns a random integer between min (inclusive) and max (inclusive)
    * Using Math.round() will give you a non-uniform distribution!
    */
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function init(coords){
        position = coords;
        direction =  0;
        group.position.z = coords.z * CONST.room.width + CONST.room.width / 2;
        group.position.y = height;
        group.position.x = coords.x * CONST.room.width;
    }

    mediator.trigger('scene.add', group);
    mediator.on('new.gamecycle', function(){
        var availableStates = state.transitions();
        var index = getRandomInt(0, availableStates.length -1);
        if(state.can(availableStates[index])){
            state[availableStates[index]]();
            console.log(availableStates[index])
        }
    });

    mediator.on('game.reset', function(){
        init({
            x: 2,
            z: 0
        });
    });
    init({
        x: 2,
        z: 0
    });
};