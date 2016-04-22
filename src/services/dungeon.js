var Dungeon = require('dungeon-generator');
var roomTypes = require('../config/roomTypes');
var map = [];
var CONST = require('../const');
var libs = require('../libs');
var _ = {
    difference: require('lodash.difference'),
    forEach: require('lodash.foreach'),
    filter: require('lodash.filter'),
    clone: require('lodash.clone')
};

var roomsCount = 30;
var dungeon;
var startPos;
var exitPos;
var wandererPos;
function generate() {
    map = [];
    dungeon = new Dungeon(
        {
            "size": [100, 100],
            "rooms": {
                "initial": {
                    "min_size": [5, 5],
                    "max_size": [5, 5],
                    "max_exits": 1
                },
                "any": {
                    "min_size": [5, 5],
                    "max_size": [5, 5],
                    "max_exits": 4
                }
            },
            "max_corridor_length": 0,
            "min_corridor_length": 0,
            "corridor_density": 0,
            "symmetric_rooms": true,
            "interconnects": 3,
            "max_interconnect_length": 1,
            "room_count": roomsCount
        }
    );

    dungeon.generate();
    dungeon.print();
    // calculate maxs
    var max = {
        x: 0,
        z: 0
    };
    _.forEach(dungeon.children, function (child) {
        var pos = {
            z: child.position[1] / 6,
            x: child.position[0] / 6
        };

        if (pos.z > max.z) {
            max.z = pos.z
        }
        if (pos.x > max.x) {
            max.x = pos.x
        }
    });
    // generate grid based on max values
    for (var i = 0; i <= max.z; i++) {
        var row = [];
        for (var b = 0; b <= max.x; b++) {
            row.push(null);
        }
        map.push(row);
    }
    // populate the map with the rooms
    _.forEach(dungeon.children, function(child){
        var pos = {
            z: child.position[1] / 6,
            x: child.position[0] / 6
        };
        var textureIndex = libs.getRandomInt(0, CONST.wallTextures.length - 1);
        map[pos.z][pos.x] = {
            texture: CONST.wallTextures[textureIndex]
        }
    });

    startPos = {
        z: dungeon.children[0].position[1]/ 6,
        x: dungeon.children[0].position[0]/ 6
    };
    map[startPos.z][startPos.x].texture = 'img/walls/nether_brick.png';
    var lastRoom = dungeon.children[dungeon.children.length - 1];
    exitPos = {
        z: lastRoom.position[1]/ 6,
        x: lastRoom.position[0]/ 6
    };

    map[exitPos.z][exitPos.x].type = "win";
    map[exitPos.z][exitPos.x].id = "exit";

    var wandererRoom = dungeon.children[libs.getRandomInt(5, roomsCount - 1)];

    wandererPos = {
        z: wandererRoom.position[1]/ 6,
        x: wandererRoom.position[0]/ 6
    };

    var rooms = _.clone(dungeon.children);
    // remove first and last room (start and exit);
    rooms.shift();
    rooms.pop();

    // we only want rooms with one exit, so we never block the player in a passage room
    rooms = _.filter(rooms, function (room) {
        return room.exits.length == 1;
    });

    _.forEach(rooms, function (room) {
        var roomTypeIndex = libs.getRandomInt(0, roomTypes.length - 1);
        var roomPos = {
            z: room.position[1]/ 6,
            x: room.position[0]/ 6
        };
        map[roomPos.z][roomPos.x] = _.clone(roomTypes[roomTypeIndex]);
    });
}

module.exports = {

    map: function () {
        return map;
    },
    generate: function () {
        generate();
    },
    startPos: function () {
        return startPos;
    },
    exitPos: function () {
        return exitPos;
    },
    wandererPos: function () {
        return wandererPos;
    }
};