var map = require('../config/map.json');
var CONST = require('../const');

module.exports = function (mediator, listener) {
    var room = require('../components/room')(mediator, listener);
    var door = require('../components/door')(mediator, listener);
    var rooms = {};
    var doors = {};
    mediator.subscribe('room.add', function (coords) {
        var walls = {};
        if (map[coords.z - 1] && map[coords.z - 1][coords.x]) {
            walls.top = true;
            var id = (coords.z - 1) + '_' + coords.x + '--' + coords.z + '_' + coords.x;
            if (!doors[id]) {
                doors[id] = door.create(
                    {
                        from: {x: coords.x, z: coords.z - 1},
                        to: {x: coords.x, z: coords.z},
                        id: id
                    }
                );
            }
        }

        if (map[coords.z + 1] && map[coords.z + 1][coords.x]) {
            walls.bottom = true;
            var id = coords.z + '_' + coords.x + '--' + (coords.z + 1) + '_' + coords.x;
            if (!doors[id]) {
                doors[id] = door.create(
                    {
                        from: {x: coords.x, z: coords.z},
                        to: {x: coords.x, z: coords.z + 1},
                        id: id
                    }
                );
            }
        }

        if (map[coords.z] && map[coords.z][coords.x - 1]) {
            walls.left = true;
            var id = coords.z + '_' + (coords.x - 1) + '--' + coords.z + '_' + coords.x;
            if (!doors[id]) {
                doors[id] = door.create(
                    {
                        from: {x: coords.x - 1, z: coords.z},
                        to: {x: coords.x, z: coords.z},
                        id: id
                    }
                );
            }

        }

        if (map[coords.z] && map[coords.z][coords.x + 1]) {
            walls.right = true;
            var id = coords.z + '_' + coords.x + '--' + coords.z + '_' + (coords.x + 1);
            if (!doors[id]) {
                doors[id] = door.create(
                    {
                        from: {x: coords.x, z: coords.z},
                        to: {x: coords.x + 1, z: coords.z},
                        id: id
                    }
                );
            }
        }

        rooms[coords.x + '_' + coords.z] = room.create({
            x: coords.x,
            y: 0,
            z: coords.z,
            walls: walls
        });

    });

    mediator.subscribe('room.remove', function (coords) {
        mediator.publish('scene.remove', rooms[coords.x + '_' + coords.z]);
    });
};