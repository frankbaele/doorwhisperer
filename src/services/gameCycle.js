var cycle = 0;
var mediator;
var interval;
var mediator = require('../services/mediator');

function gameCycle(){
    cycle++;
    mediator.trigger('new.gamecycle', cycle);
}

module.exports = function(){
    mediator.on('game.start', function(){
        interval = setInterval(gameCycle, 100)
    });

    mediator.trigger('game.end', function(){
        cycle = 0;
        clearInterval(interval);
    });
};