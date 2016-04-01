var THREE = require('three');


module.exports  = function(mediator){
    var input = require('./input')(mediator);


    mediator.subscribe('keypress', function (code) {
        if (code == '<left>') {
            mediator.publish('camera.transform', 'left');
        }
        if(code == '<right>'){
            mediator.publish('camera.transform', 'right');
        }

    })


};