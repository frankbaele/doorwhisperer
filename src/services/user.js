_ = {
    clone: require('lodash.clone')
};
var CONST = require('../const');
module.exports = function (mediator) {
    var direction = 0;
    var directions = ['N', 'E', 'S', 'W'];
    var center = true;
    var position = {
        x: 0,
        z: 0
    };
    mediator.publish('camera.center', position);
    mediator.publish('room.add', position);
    mediator.subscribe('input', function (type) {
        if (center) {
            if (type == 'left') {
                if (direction == 0) {
                    direction = directions.length - 1;
                } else {
                    direction = direction - 1;
                }
                mediator.publish('camera.rotate', 'left');
            } else if (type == 'right') {
                if (direction == directions.length - 1) {
                    direction = 0;
                } else {
                    direction = direction + 1;
                }
                mediator.publish('camera.rotate', 'right');
            }
            if (type == 'forward') {
                mediator.publish('camera.move', 'forward');
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
                mediator.publish('room.add', coords);
                center = false;
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
                mediator.publish('camera.move', 'back');
                mediator.publish('room.remove', coords);
                center = true;
            }

            if(type =='forward'){
                mediator.publish('camera.move.room', coords);
                mediator.publish('room.remove', position);
                center = true;
                position = coords;
            }
        }
    });
    return {
        direction: direction,
        center: center,
        position: position
    }

};