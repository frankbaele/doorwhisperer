var THREE = require('three.js');
var scene, camera, renderer;
var geometry, material, mesh, wireframe;
require('./pointerlock');


function init() {
    scene = new THREE.Scene();
    var texture = THREE.ImageUtils.loadTexture('img/wall.jpg', {}, function() {
        camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 1, 10000 );
        camera.position.z = 300;
        var light = new THREE.PointLight(0xffffff);
        light.position.set(-100,200,100);
        scene.add(light);

        material = new THREE.MeshBasicMaterial( { wireframe:false, map:texture, color: 'gray'} );
        wireframe = new THREE.MeshBasicMaterial( { wireframe:true, color: 'gray'} );
        geometry = new THREE.BoxGeometry( 600, 300,10  );
        var center = new THREE.Mesh( geometry, material );
        scene.add(center);

        var left =  new THREE.Mesh( geometry, material );
        left.rotateY(Math.PI / 2);
        left.position.x = -300;
        left.position.z = 300;
        scene.add(left);

        var right =  new THREE.Mesh( geometry, material);
        right.rotateY(Math.PI / 2);
        right.position.x = 300;
        right.position.z = 300;
        scene.add(right);

        var behind =  new THREE.Mesh( geometry, wireframe);
        behind.position.z = 600;

        scene.add(behind);

        renderer = new THREE.WebGLRenderer();

        renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( renderer.domElement );
        animate();
    })


}

document.onkeydown = checkKey;

function checkKey(e) {

    e = e || window.event;
    var delta = 200;
    switch(e.keyCode){
        case 37 : //left arrow 向左箭头
            camera.rotation.y = camera.rotation.y + Math.PI/2;
            break;
        case 38 : // up arrow 向上箭头
            break;
        case 39 : // right arrow 向右箭头
            camera.rotation.y = camera.rotation.y - Math.PI/2;
            break;
        case 40 : //down arrow向下箭头
            break;
    }
    animate();
}

function animate() {
    requestAnimationFrame( animate );
    renderer.render( scene, camera);
}

window.app = init;