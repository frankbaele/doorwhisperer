var messages = require('../config/messages.json');
var vDom = {
    h: require('virtual-dom/h'),
    create: require('virtual-dom/create-element')
};

module.exports = function(mediator, container){
    var popup = vDom.h('div.popup');
    mediator.subscribe('message.show',function(type){

    });
    container.appendChild(vDom.create(popup))
};