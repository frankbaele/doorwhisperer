_ = {
    clone: require('lodash.clone')
};

var CONST = require('../const');
var map = require('../config/map.json');
module.exports = function (mediator) {
    var direction = 0;
    var moving = false;
    var directions = ['N', 'E', 'S', 'W'];
    var center = true;
    var position = {
        x: 0,
        z: 0
    };
    mediator.publish('camera.center', position);
    mediator.publish('room.add', position);
    mediator.subscribe('input', function (type) {
        if(!moving){
            if (center) {
                if (type == 'left') {
                    if (direction == 0) {
                        direction = directions.length - 1;
                    } else {
                        direction = direction - 1;
                    }
                    moving = true;
                    mediator.publish('camera.rotate', {
                        'direction': 'left',
                        'callback': function () {
                            moving = false;
                        }
                    });
                } else if (type == 'right') {
                    moving = true;
                    if (direction == directions.length - 1) {
                        direction = 0;
                    } else {
                        direction = direction + 1;
                    }
                    mediator.publish('camera.rotate', {
                        'direction': 'right',
                        'callback': function () {
                            moving = false;
                        }
                    });
                }
                if (type == 'forward') {
                    var coords = _.clone(position);
                    if (direction == 0) {
                        coords.z--;
                    } else if (direction == 1) {
                        coords.x++;
                    } else if (direction == 2) {
                        coords.z++;
                    } else if (direction == 3) {
                        coords.x--;
                    }
                    console.log(coords);
                    console.log(map);
                    if(map[coords.z] && map[coords.z][coords.x]){
                        moving = true;
                        mediator.publish('camera.move', {
                            'direction': 'forward',
                            'callback': function () {
                                center = false;
                                moving = false;
                            }
                        });
                        mediator.publish('room.add', coords);
                    }
                }
            } else {
                var coords = _.clone(position);
                if (direction == 0) {
                    coords.z--;
                } else if (direction == 1) {
                    coords.x++;
                } else if (direction == 2) {
                    coords.z++;
                } else if (direction == 3) {
                    coords.x--;
                }

                if (type == 'back') {
                    moving = true;
                    mediator.publish('camera.move', {
                        'direction': 'back',
                        'callback': function () {
                            center = true;
                            moving = false;
                            mediator.publish('room.remove', coords);
                        }
                    });
                }
                if (type == 'forward') {
                    moving = true;
                    mediator.publish('camera.move.room', {
                        'coords': coords,
                        'callback': function () {
                            mediator.publish('room.remove', position);
                            position = coords;
                            center = true;
                            moving = false;
                        }
                    });
                }
            }
        }

    });
    return {
        direction: direction,
        center: center,
        position: position
    }

};