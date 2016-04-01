module.exports = function (mediator) {
    var direction = 'N';
    var center = true;

    var coords = {
        x: 0,
        y: 0
    };
    mediator.subscribe('input', function (type) {
        if (center) {
            if (type == 'left') {
                mediator.publish('camera.rotate', 'left');
            } else if (type == 'right') {
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