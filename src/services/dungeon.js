var Dungeon = require('dungeon-generator');
var map = [];
var _ = {
    difference: require('lodash.difference'),
    forEach: require('lodash.foreach')
};
var dungeon = new Dungeon(
    {
        "size": [100, 100],
        "rooms": {
            "initial": {
                "min_size": [1, 1],
                "max_size": [1, 1],
                "max_exits": 1
            },
            "any": {
                "min_size": [1, 1],
                "max_size": [1, 1],
                "max_exits": 4
            }
        },
        "max_corridor_length": 0,
        "min_corridor_length": 0,
        "corridor_density": 0,
        "symmetric_rooms": true,
        "interconnects": 10,
        "max_interconnect_length": 1,
        "room_count": 30
    }
);

dungeon.generate();
for (var y = 0; y < dungeon.size[1]; y++) {
    var row = [];
    for (var x = 0; x < dungeon.size[0]; x++) {
        row.push(dungeon.walls.get([x, y]) ? null : {});
    }
    map.push(row);
}
module.exports = {
    dungeon: dungeon,
    map: map,
    startPos: function(){
        var coords = {
            z: dungeon.start_pos[1],
            x: dungeon.start_pos[0]
        };
        console.log(coords);
        return coords;
    }
};