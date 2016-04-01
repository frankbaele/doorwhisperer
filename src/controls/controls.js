var THREE = require('three');
var vkey = require('vkey');

module.exports  = function(mediator){
    document.addEventListener('keydown', function(ev) {
        mediator.publish('keypress', vkey[ev.keyCode]);
    }, false)
};