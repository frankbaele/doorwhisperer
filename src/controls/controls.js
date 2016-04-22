var THREE = require('three');
var vkey = require('vkey');
var _ = {
    debounce : require('lodash.debounce')
};
var mediator = require('../services/mediator');
module.exports = function () {
    document.addEventListener('keydown', inputListner, false);

    function inputListner (ev){
        var code = vkey[ev.keyCode];
        if (code == '<left>') {
            mediator.trigger('input', 'left');
        }
        if (code == '<right>') {
            mediator.trigger('input', 'right');
        }
        if (code == '<up>') {
            mediator.trigger('input', 'forward');
        }
        if (code == '<down>') {
            mediator.trigger('input', 'back');
        }
        if (code == '<space>') {
            mediator.trigger('input', 'enter');
        }
        if (code == '<escape>' || code == '<enter>' ) {
            mediator.trigger('input', 'exit');
        }
    }
};