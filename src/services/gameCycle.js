var cycle = 0;
var mediator;

function gameCycle(){
    cycle++;
    mediator.publish('new.gamecycle', cycle);
}

module.exports = function(_mediator_){
    mediator = _mediator_;
    setTimeout(gameCycle, 150);
};