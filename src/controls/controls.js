var THREE = require('three');
var vkey = require('vkey');

module.exports = function (mediator) {
    document.addEventListener('keydown', function (ev) {
        var code = vkey[ev.keyCode];
        if (code == '<left>') {
            mediator.publish('input', 'left');
        }
        if (code == '<right>') {
            mediator.publish('input', 'right');
        }
        if (code == '<up>') {
            mediator.publish('input', 'forward');
        }
        if (code == '<down>') {
            mediator.publish('input', 'back');
        }
    }, false)
};