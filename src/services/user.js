_ = {
    clone: require('lodash.clone')
};
var CONST = require('../const');
var map = require('../config/map.json');
var StateMachine = require('javascript-state-machine');
var libs = require('../libs');
module.exports = function (mediator) {
    var position = {
        x: 2,
        z: 0
    };
    var directionMap = [{z: -1, x: 0}, {z: 0, x: 1}, {z: 1, x: 0}, {z: 0, x: -1}];
    var directions = ['north', 'east', 'south', 'west'];
    var direction = 0;
    var state = StateMachine.create({
        initial: 'center',
        error: function (eventName, from, to, args, errorCode, errorMessage) {
            /*
            console.log(from);
            console.log(to);
            console.log(eventName);
            console.log(errorCode);
            console.log(errorMessage);
            */
        },
        events: [
            {name: 'left', from: 'center', to: 'turning'},
            {name: 'right', from: 'center', to: 'turning'},
            {name: 'stopped', from: 'turning', to: 'center'},
            {name: 'reset', from: 'turning', to: 'center'},
            {name: 'forward', from: 'center', to: 'door'},
            {name: 'forward', from: 'door.open', to: 'center'},
            {name: 'back', from: 'door', to: 'center'},
            {name: 'back', from: 'door.open', to: 'center'},
            {name: 'enter', from: 'door', to: 'door.open'},
            {name: 'enter', from: 'door.open', to: 'door'}
        ],
        callbacks: {
            onbeforeforward: function (event, from, to) {
                var coords = nextRoom(position, direction);
                return typeof map[coords.z] !== 'undefined' && typeof map[coords.z][coords.x] !== 'undefined';
            },
            onforward: function (event, from, to) {
                if(from == 'center'){
                    mediator.publish('room.add', nextRoom(position, direction));
                }
            },
            onenter: function (event, from, to) {
                var id = doorId(position, direction);
                if(to == 'door.open'){
                    mediator.publish('door.open.' + id, position);
                } else if(to == 'door'){
                    mediator.publish('door.close.' + id, position);
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
                    mediator.publish('door.close.' + id, position);
                }
            },
            onturning: function(){
                state.stopped()
            },
            onleavestate: function (event, from, to) {
                if (event == 'right' || event == 'left') {
                    mediator.publish('camera.rotate', {
                        'direction': event,
                        'callback': function () {
                            state.transition();
                        }
                    });
                    return StateMachine.ASYNC;
                }
                else if (event == 'forward') {
                    if(from == 'center'){
                        mediator.publish('camera.move', {
                            'direction': 'forward',
                            'callback': function () {
                                state.transition();
                            }
                        });
                    } else  if(from == 'door.open'){
                        var coords = nextRoom(position, direction);
                        mediator.publish('room.enter.' +  coords.z + '_' + coords.x);
                        mediator.publish('camera.move.room', {
                            'coords': coords,
                            'callback': function () {
                                mediator.publish('room.remove', position);
                                mediator.publish('door.close.' + doorId(position, direction), position);
                                position = coords;
                                state.transition();
                            }
                        });
                    }
                    return StateMachine.ASYNC;
                }
                else if (event == 'back') {
                    mediator.publish('camera.move', {
                        'direction': 'back',
                        'callback': function () {
                            state.transition();
                            mediator.publish('room.remove', nextRoom(position, direction));
                        }
                    });
                    return StateMachine.ASYNC;
                }
            }
        }
    });
    var center = true;

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
    mediator.publish('camera.center', position);
    mediator.publish('room.add', position);
    mediator.subscribe('input', function (type) {
        state[type]();
    });
};