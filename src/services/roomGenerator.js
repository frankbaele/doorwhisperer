var room = require('../components/room');
var map = require('../config/map.json');
var CONST = require('../const');
module.exports = function (mediator) {
    var rooms = {};
    mediator.subscribe('room.add', function (coords) {
        var walls = {};

        if(map[coords.z - 1] && map[coords.z - 1][coords.x]){
            walls.top = true;
        }
        if(map[coords.z + 1] && map[coords.z + 1][coords.x]){
            walls.bottom = true;
        }
        if(map[coords.z] && map[coords.z][coords.x - 1]){
            walls.left = true;
        }
        if(map[coords.z] && map[coords.z][coords.x + 1]){
            walls.right = true;
        }
        var instance = room({x: coords.x * CONST.room.width, y: 0, z: coords.z * CONST.room.width, walls: walls});
        mediator.publish('scene.add', instance);
        rooms[coords.x + '_' + coords.z] = instance;
    });

    mediator.subscribe('room.remove', function (coords) {
        mediator.publish('scene.remove', rooms[coords.x + '_' + coords.z]);
    });
};