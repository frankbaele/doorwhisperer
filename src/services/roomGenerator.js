var room = require('../components/room');
var map = require('../config/map.json');
var CONST = require('../const');
module.exports = function (mediator) {
    var rooms = {};
    mediator.subscribe('room.add', function (coords) {
        var walls = {};
        walls.left = true;
        walls.top = true;
        walls.right = true;
        walls.bottom = true;
        var instance = room({x: coords.x * CONST.room.width, y: 0, z: coords.z * CONST.room.width, walls: walls});
        mediator.publish('scene.add', instance);
        rooms[coords.x + '_' + coords.z] = instance;
    });

    mediator.subscribe('room.remove', function (coords) {
        mediator.publish('scene.remove', rooms[coords.x + '_' + coords.z]);
    });
};