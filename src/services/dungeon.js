var Dungeon = require('dungeon-generator');
var roomTypes = require('../config/roomTypes');
var map = [];
var libs = require('../libs');
var _ = {
    difference: require('lodash.difference'),
    forEach: require('lodash.foreach'),
    filter: require('lodash.filter'),
    clone: require('lodash.clone')
};
var textures = [
    "img/walls/cobblestone.png",
    "img/walls/cobblestone_mossy.png",
    "img/walls/brick.png",
    "img/walls/sandstone.png",
    "img/walls/dirt.png"
];

var roomsCount = 6;
var dungeon;
var startPos;
var exitPos;
var wandererPos;
function generate(){

    dungeon = new Dungeon(
        {
            "size": [100, 100],
            "rooms": {
                "initial": {
                    "min_size": [1,1],
                    "max_size": [1,1],
                    "max_exits": 1
                },
                "any": {
                    "min_size": [1,1],
                    "max_size": [1,1],
                    "max_exits": 4
                }
            },
            "max_corridor_length": 0,
            "min_corridor_length": 0,
            "corridor_density": 0,
            "symmetric_rooms": true,
            "interconnects": 1,
            "max_interconnect_length": 10,
            "room_count": roomsCount
        }
    );

    dungeon.generate();
    for (var y = 0; y < dungeon.size[1]; y++) {
        var row = [];
        for (var x = 0; x < dungeon.size[0]; x++) {
            if(dungeon.walls.get([x, y])){
                row.push(null);
            }
            else {
                var textureIndex = libs.getRandomInt(0, textures.length - 1);
                row.push({
                    texture: textures[textureIndex]
                });
            }
        }
        map.push(row);
    }

    startPos = {
        z: dungeon.start_pos[1],
        x: dungeon.start_pos[0]
    };
    map[startPos.z][startPos.x].texture = 'img/walls/nether_brick.png';
    var lastRoom = dungeon.children[dungeon.children.length - 1];
    exitPos = {
        z: lastRoom.position[1] + 1,
        x: lastRoom.position[0] + 1
    };

    map[exitPos.z][exitPos.x].type = "win";
    map[exitPos.z][exitPos.x].id = "exit";

    var wandererRoom = dungeon.children[libs.getRandomInt(5, roomsCount - 1)];

    wandererPos = {
        z: wandererRoom.position[1] + 1,
        x: wandererRoom.position[0] + 1
    };

    var rooms = _.clone(dungeon.children);
    // remove first and last room (start and exit);
    rooms.shift();
    rooms.pop();

    // we only want rooms with one exit, so we never block the player in a passage room
    rooms = _.filter(rooms, function(room){
        return room.exits.length == 1;
    });
    _.forEach(rooms, function(room){
        var roomTypeIndex = libs.getRandomInt(0, roomTypes.length - 1);
        var roomPos = {
            z: room.position[1] + 1,
            x: room.position[0] + 1
        };
        map[roomPos.z][roomPos.x] = _.clone(roomTypes[roomTypeIndex]);
    });
}

module.exports = {

    map: function(){
        return map;
    },
    generate: function(){
        generate();
    },
    startPos: function(){
        return startPos;
    },
    exitPos: function(){
        return exitPos;
    },
    wandererPos: function(){
        return wandererPos;
    }
};