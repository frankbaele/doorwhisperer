var CONST = require('../const');
var map;
var mediator = require('../services/mediator');
var _ = {
    difference: require('lodash.difference'),
    forEach: require('lodash.foreach')
};

module.exports = function (listener) {
    var room = require('../components/room')(listener);
    var door = require('../components/door')(listener);
    var rooms = {};
    var doorList = {};

    function addRoom(coords){
        console.log(coords);
        var map = require('../services/dungeon').map();
        var walls = {};
        if (map[coords.z - 1] && map[coords.z - 1][coords.x]) {
            walls.top = true;
        }
        if (map[coords.z + 1] && map[coords.z + 1][coords.x]) {
            walls.bottom = true;
        }

        if (map[coords.z] && map[coords.z][coords.x - 1]) {
            walls.left = true;
        }

        if (map[coords.z] && map[coords.z][coords.x + 1]) {
            walls.right = true;
        }
        rooms[coords.z + '_' + coords.x] = {
            instance: room.create({
                x: coords.x,
                y: 0,
                z: coords.z,
                walls: walls,
                data: map[coords.z][coords.x]
            }),
            x: coords.x,
            z: coords.z
        };
    }

    function addRoomDoors(coords){
        var map = require('../services/dungeon').map();
        if (map[coords.z - 1] && map[coords.z - 1][coords.x]) {
            var id = (coords.z - 1) + '_' + coords.x + '--' + coords.z + '_' + coords.x;
            if (!doorList[id]) {
                doorList[id] = door.create(
                    {
                        from: {x: coords.x, z: coords.z - 1},
                        to: {x: coords.x, z: coords.z},
                        id: id
                    }
                );
            }
        }
        if (map[coords.z + 1] && map[coords.z + 1][coords.x]) {
            var id = coords.z + '_' + coords.x + '--' + (coords.z + 1) + '_' + coords.x;
            if (!doorList[id]) {
                doorList[id] = door.create(
                    {
                        from: {x: coords.x, z: coords.z},
                        to: {x: coords.x, z: coords.z + 1},
                        id: id
                    }
                );
            }
        }

        if (map[coords.z] && map[coords.z][coords.x - 1]) {
            var id = coords.z + '_' + (coords.x - 1) + '--' + coords.z + '_' + coords.x;
            if (!doorList[id]) {
                doorList[id] = door.create(
                    {
                        from: {x: coords.x - 1, z: coords.z},
                        to: {x: coords.x, z: coords.z},
                        id: id
                    }
                );
            }

        }

        if (map[coords.z] && map[coords.z][coords.x + 1]) {
            var id = coords.z + '_' + coords.x + '--' + coords.z + '_' + (coords.x + 1);
            if (!doorList[id]) {
                doorList[id] = door.create(
                    {
                        from: {x: coords.x, z: coords.z},
                        to: {x: coords.x + 1, z: coords.z},
                        id: id
                    }
                );
            }
        }
    }

    function removeRoom(coords){
        mediator.trigger('room.remove.' + coords.z + '_' + coords.x);
        delete(rooms[coords.z + '_' + coords.x]);
    }

    function removeRoomDoors(coords){
        _.forEach(_.difference(roomDoors(coords), currentDoors()), function (id) {
            mediator.trigger('door.remove.' + id);
            delete(doorList[id]);
        });
    }

    function destroy(){
        _.forEach(rooms, function(room){
            removeRoomDoors(room);
            removeRoom(room);
        });
    }

    mediator.on('room.add',function(coords){
        addRoom(coords);
        addRoomDoors(coords);
    });

    mediator.on('room.add.doors',function(coords){
        addRoomDoors(coords);
    });

    mediator.on('room.center', function (coords) {
        setTimeout(function(){
            addRoom(coords);
            addRoomDoors(coords);
        }, 200);
    });

    mediator.on('room.remove', function(coords){
        removeRoom(coords);
        removeRoomDoors(coords);
    });

    mediator.on('room.remove.doors', function(coords){
        removeRoomDoors(coords);
    });

    function currentDoors() {
        var doors = [];
        _.forEach(rooms, function (room) {
            doors = doors.concat(roomDoors({x: room.x, z: room.z}));
        });
        return doors;
    }

    function roomDoors(coords) {
        var doors = [];
        var map = require('../services/dungeon').map();
        if (map[coords.z - 1] && map[coords.z - 1][coords.x]) {
            var id = (coords.z - 1) + '_' + coords.x + '--' + coords.z + '_' + coords.x;
            doors.push(id);
        }
        if (map[coords.z + 1] && map[coords.z + 1][coords.x]) {
            var id = coords.z + '_' + coords.x + '--' + (coords.z + 1) + '_' + coords.x;
            doors.push(id);
        }
        if (map[coords.z] && map[coords.z][coords.x - 1]) {
            var id = coords.z + '_' + (coords.x - 1) + '--' + coords.z + '_' + coords.x;
            doors.push(id);
        }
        if (map[coords.z] && map[coords.z][coords.x + 1]) {
            var id = coords.z + '_' + coords.x + '--' + coords.z + '_' + (coords.x + 1);
            doors.push(id);
        }
        return doors;
    }
    mediator.on('game.start', function(){

    });

    mediator.on('game.end', function(){
        destroy();
    });
};