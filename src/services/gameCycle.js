var cycle = 0;
var mediator;

function gameCycle(){
    cycle++;
    mediator.trigger('new.gamecycle', cycle);
    setTimeout(gameCycle, 200);
}

module.exports = function(_mediator_){
    mediator = _mediator_;
    gameCycle();
};