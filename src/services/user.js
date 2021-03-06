_ = {
    clone: require('lodash.clone')
};
var CONST = require('../const');
var map;
var dungeon = require('../services/dungeon');
var StateMachine = require('javascript-state-machine');
var mediator = require('../services/mediator');
module.exports = function () {
    var position;
    var directionMap = [{z: -1, x: 0}, {z: 0, x: 1}, {z: 1, x: 0}, {z: 0, x: -1}];
    var directions = ['north', 'east', 'south', 'west'];
    var direction;
    var state;

    function createStateMachine (){
        return StateMachine.create({
            initial: 'center',
            error: function (eventName, from, to, args, errorCode, errorMessage) {
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
                    mediator.trigger('room.add', nextRoom(position, direction));
                },
                onleft: function () {
                    if (direction == 0) {
                        direction = directions.length - 1;
                    } else {
                        direction = direction - 1;
                    }
                },
                onright: function () {
                    if (direction == directions.length - 1) {
                        direction = 0;
                    } else {
                        direction = direction + 1;
                    }
                },
                onturning: function () {
                    state.stopped()
                },
                onleavestate: function (event, from, to) {

                    if (event == 'right' || event == 'left') {
                        mediator.trigger('camera.rotate', {
                            'direction': event,
                            'callback': function () {
                                state.transition();
                            }
                        });
                        return StateMachine.ASYNC;
                    }

                    else if (event == 'forward') {
                        mediator.trigger('camera.move', {
                            'direction': 'forward',
                            'callback': function () {
                                state.transition();
                            }
                        });
                        return StateMachine.ASYNC;
                    }

                    else if (event == 'back') {
                        mediator.trigger('camera.move', {
                            'direction': 'back',
                            'callback': function () {
                                state.transition();
                                mediator.trigger('room.remove', nextRoom(position, direction));
                            }
                        });
                        return StateMachine.ASYNC;
                    }
                    else if (event == 'enter') {
                        var coords = nextRoom(position, direction);
                        mediator.trigger('door.open.' + doorId(position, direction), position);
                        mediator.trigger('room.enter.' + coords.z + '_' + coords.x, function () {
                            mediator.trigger('camera.move.room', {
                                'coords': coords,
                                'callback': function () {
                                    mediator.trigger('room.remove', position);
                                    mediator.trigger('door.close.' + doorId(position, direction), position);
                                    position = coords;
                                    state.transition();
                                }
                            });
                        });
                        return StateMachine.ASYNC;
                    }
                }
            }
        });
    }

    function nextRoom(position, direction) {
        return {
            x: position.x + directionMap[direction].x,
            z: position.z + directionMap[direction].z
        };
    }

    function doorId(position, direction) {
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

    function init() {
        map = dungeon.map();
        position = dungeon.startPos();
        direction = 0;
        state = createStateMachine();
        mediator.trigger('camera.center', position);
        mediator.trigger('room.center', position);
    }

    function destroy(){

    }

    mediator.on('game.start', function(){
        init();
    });

    mediator.on('game.end', function(){
        destroy();
    });

    mediator.on('input', function (type) {
        if (state.can(type)) {
            state[type]();
        }
    });
};