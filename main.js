import * as THREE from 'three';
import vertexShader from './Shaders/vertex.glsl?raw'
import fragmentShader from './Shaders/fragment.glsl?raw'

import atmVertexShader from './Shaders/atmVertex.glsl?raw'
import atmFragmentShader from './Shaders/atmFragment.glsl?raw'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild( renderer.domElement );

const geometry = new THREE.SphereGeometry( 5, 50, 50 );
const material = new THREE.ShaderMaterial({vertexShader, fragmentShader, uniforms: {globeTexture: {value: new THREE.TextureLoader().load('./Assets/worldmap.jpg')}}});
const sphere = new THREE.Mesh( geometry, material );


const atmGeometry = new THREE.SphereGeometry( 5, 50, 50 );
const atmMaterial = new THREE.ShaderMaterial({vertexShader: atmVertexShader, fragmentShader: atmFragmentShader, blending: THREE.AdditiveBlending, side: THREE.BackSide});
const atmosphere = new THREE.Mesh( atmGeometry, atmMaterial );

atmosphere.scale.set(1.1, 1.1, 1.1)
scene.add(atmosphere)

const group = new THREE.Group()
group.add(sphere)
scene.add(group)

camera.position.z = 20;
camera.position.z.clamp

// const mouse = {
	// x: undefined,
	// y: undefined
// }

var mouseDown = false,
	mouseX = 0,
	mouseY = 0;
	

	
function onMouseMove(evt) {
	if(!mouseDown) {
		return
	}
	
	evt.preventDefault();
	
	var deltaX = evt.clientX - mouseX;
	var deltaY = evt.clientY - mouseY;
	mouseX = evt.clientX;
	mouseY = evt.clientY;
	rotateScene(deltaX, deltaY);
}

function onMouseDown(evt) {
	evt.preventDefault();
	mouseDown = true;
	mouseX = evt.clientX;
	mouseY = evt.clientY;
	console.log(mouseX);
	console.log(mouseY);
	
}

function onMouseUp(evt) {
	evt.preventDefault();
	mouseDown = false;
	
}


function rotateScene(deltaX, deltaY) {
    sphere.rotation.y += deltaX / 100;
    sphere.rotation.x += deltaY / 100;
}

function updateCamera(evt) {
	camera.position.z = clamp((camera.position.z - evt.deltaY / 100.0), 10, 25)
	if (camera.position.z < 20) {
		atmosphere.scale.set(1.2, 1.2, 1.2)
	}
	else {
		atmosphere.scale.set(1.1, 1.1, 1.1)
	}
		
}

function clamp(num, min, max){
	return Math.min(Math.max(num, min), max);
}

function animate() {
	sphere.rotation.y += 0.001;
	renderer.render( scene, camera );
	
}
renderer.setAnimationLoop( animate )

addEventListener('mousemove', function (e) {onMouseMove(e);}, false);
addEventListener('mousedown', function (e) {onMouseDown(e);}, false);
addEventListener('mouseup', function (e) {onMouseUp(e);}, false);
addEventListener('wheel', function (e) {updateCamera(e);}, false);