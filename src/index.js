var THREE = require('three');
var TWEEN = require('tween.js');
var _ = {
    forEach : require('lodash.foreach')
};
var map = require('./config/map.json');
var scene, camera, renderer;
var geometry, material, mesh, wireframe;
var room = require('./components/room');
var textureLoader = require('./services/textures');

function init() {

    textureLoader(function(){
        var floorTexture = new THREE.TextureLoader().load('img/stonebrick.png');
        var birdView = false;
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 1, 10000 );
        if(birdView){
            camera.position.z = 600;
            camera.position.y = 2000;
            camera.rotation.x = camera.rotation.x - Math.PI/2;
        } else {
            camera.position.z = 300;
        }
        _.forEach(map, function(row, index){
            var z = index * 600;
            _.forEach(row, function(cell , cellIndex){
                var x = cellIndex * 600;
                var walls = {};
                walls.left = true;
                walls.top = true;
                if(cellIndex == row.length - 1){
                    walls.right = true;
                }
                if(index == map.length - 1){
                    walls.bottom = true;
                }
                scene.add(room({x:x,y:0,z:z, walls: walls}));
            })
        });
        /*
        var geometry = new THREE.PlaneGeometry( map.length * 600, 0, map[0].length * 600 );
        var material = new THREE.MeshBasicMaterial( {color: 0xffff00, map: floorTexture} );
        var plane = new THREE.Mesh( geometry, material );
        scene.add(plane);
        */
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
                .to({ y: camera.rotation.y + Math.PI/2 }, 200)
                .start();
            break;
        case 38 : // up arrow 向上箭头
            camera.translateZ(-100);
            break;
        case 39 : // right arrow 向右箭头`
            new TWEEN.Tween(camera.rotation)
                .to({ y: camera.rotation.y - Math.PI/2 }, 200)
                .start();
            break;

        case 40 : //down arrow向下箭头
            camera.translateZ(100);
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