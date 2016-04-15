var messages = require('../config/messages.json');
var vDom = {
    h: require('virtual-dom/h'),
    create: require('virtual-dom/create-element')
};
var StateMachine = require('javascript-state-machine');
module.exports = function (mediator, container) {


    var text;
    var title;
    var img;
    function close(){
        text.innerHTML = '';
        title.innerHTML = '';
        img.src = '';
        popup.style.display = 'none';
    }

    function open(opts){
        text.innerHTML = opts.text;
        title.innerHTML = opts.title;
        if(opts.img){
            img.src = opts.img;
            img.style.display = 'block';
        } else {
            img.style.display = 'none';
        }

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

    var AfterRenderIMG = function () {};
    AfterRenderIMG.prototype.hook = function (node) {
        img = node;
    };
    var popup = vDom.create(
        vDom.h('div.popup', [
            vDom.h('h2.title', {
                afterRender: new AfterRenderTitle()
            }),
            vDom.h('img', {
                afterRender: new AfterRenderIMG()
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
    mediator.on('input', function (type) {
        if (type == 'exit'){
            close();
        }
    });

    container.appendChild(popup)
};