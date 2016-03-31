var THREE = require('three.js');
var TWEEN = require('tween.js');

var scene, camera, renderer;
var geometry, material, mesh, wireframe;
var room = require('./components/room');
var textureLoader = require('./services/textures');

function init() {

    textureLoader(function(){
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 1, 10000 );
        camera.position.z = 300;
        var light = new THREE.PointLight(0xffffff);
        light.position.set(-100,200,100);
        scene.add(light);
        scene.add(room());

        renderer = new THREE.WebGLRenderer();

        renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( renderer.domElement );
        animate();
    });

}

document.onkeydown = checkKey;

function checkKey(e) {

    e = e || window.event;
    var delta = 200;
    switch(e.keyCode){
        case 37 : //left arrow 向左箭头
            new TWEEN.Tween(camera.rotation)
                .to({ y: camera.rotation.y + Math.PI/2 }, 500)
                .start();
            break;
        case 38 : // up arrow 向上箭头
            break;
        case 39 : // right arrow 向右箭头`
            new TWEEN.Tween(camera.rotation)
                .to({ y: camera.rotation.y - Math.PI/2 }, 500)
                .start();
            break;
        case 40 : //down arrow向下箭头
            break;
    }
    animate();
}

function animate() {
    requestAnimationFrame( animate );
    TWEEN.update();
    renderer.render( scene, camera);
}

window.app = init;