var messages = require('../config/messages.json');
var vDom = {
    h: require('virtual-dom/h'),
    create: require('virtual-dom/create-element')
};
var StateMachine = require('javascript-state-machine');
module.exports = function (mediator, container) {


    var text;
    var title;
    function close(){
        text.innerHTML = '';
        title.innerHTML = '';
        popup.style.display = 'none';
    }

    function open(opts){
        text.innerHTML = opts.text;
        title.innerHTML = opts.title;
        popup.style.display = 'block';
    }

    var AfterRenderText = function () {};
    AfterRenderText.prototype.hook = function (node) {
        text = node;
    };
    var AfterRenderTitle = function () {};
    AfterRenderTitle.prototype.hook = function (node) {
        title = node;
    };

    var popup = vDom.create(
        vDom.h('div.popup', [
            vDom.h('h2.title', {
                afterRender: new AfterRenderTitle()
            }),
            vDom.h('p.text', {
                afterRender: new AfterRenderText()
            }),
            vDom.h('button', {
                "ev-click" : function(){
                    close();
                }
            }, 'close')
        ])
    );


    mediator.on('message.show', function (type) {
        open(messages[type]);
    });


    container.appendChild(popup)
};