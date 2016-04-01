module.exports = function (mediator) {
    var direction = 0;
    var directions = ['N', 'E', 'S', 'W'];
    var center = true;

    var coords = {
        x: 0,
        y: 0
    };

    mediator.subscribe('input', function (type) {
        if (center) {
            if (type == 'left') {
                if(direction == 0){
                    direction = directions.length - 1;
                } else {
                    direction = direction - 1;
                }
                mediator.publish('camera.rotate', 'left');
            } else if (type == 'right') {
                if(direction == directions.length - 1){
                    direction = 0;
                } else {
                    direction = direction + 1;
                }
                mediator.publish('camera.rotate', 'right');
            }
            if(type == 'forward'){
                mediator.publish('camera.move', 'forward');
                center = false;
            }
        } else {
            if(type == 'back'){
                mediator.publish('camera.move', 'back');
                center = true;
            }

        }
    });
    return {
        direction: direction,
        center: center,
        coords: coords
    }
};