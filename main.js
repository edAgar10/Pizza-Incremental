import * as THREE from 'three';
import vertexShader from './Shaders/vertex.glsl?raw'
import fragmentShader from './Shaders/fragment.glsl?raw'

import atmVertexShader from './Shaders/atmVertex.glsl?raw'
import atmFragmentShader from './Shaders/atmFragment.glsl?raw'

const scene = new THREE.Scene();
const  camera = new THREE.PerspectiveCamera(70, 2, 1, 1000);
// const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({antialias:true, canvas: document.querySelector('canvas')});

const sphere = new THREE.Mesh( new THREE.SphereGeometry( 5, 50, 50 ), 
new THREE.ShaderMaterial({vertexShader, fragmentShader, uniforms: {globeTexture: {value: new THREE.TextureLoader().load('./Assets/worldmap.jpg')}}}) );


const atmGeometry = new THREE.SphereGeometry( 5, 50, 50 );
const atmMaterial = new THREE.ShaderMaterial({vertexShader: atmVertexShader, fragmentShader: atmFragmentShader, blending: THREE.AdditiveBlending, side: THREE.BackSide});
const atmosphere = new THREE.Mesh( atmGeometry, atmMaterial );

atmosphere.scale.set(1.1, 1.1, 1.1)
scene.add(atmosphere)

const group = new THREE.Group()
group.add(sphere)


const starGeometry = new THREE.BufferGeometry()
const starMaterial = new THREE.PointsMaterial({color: 0xffffff})

const starVertices = []
for (let i = 0; i < 10000; i++) {
	const x = (Math.random() - 0.5) * 2000
	const y = (Math.random() - 0.5) * 2000
	const z = (Math.random() - 0.5) * 2000
	starVertices.push(x, y, z)
}
starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3))

const stars = new THREE.Points(starGeometry, starMaterial)

group.add(stars)

scene.add(group)

camera.position.z = 20;
camera.position.z.clamp

var mouseDown = false,
	mouseX = 0,
	mouseY = 0;
	
function resizeCanvas() {
	const canvas = renderer.domElement;
	const width = canvas.clientWidth;
	const height = canvas.clientHeight;
	if (canvas.width !== width || canvas.height !== height) {
		renderer.setSize(width, height, false);
		camera.aspect = width/height;
		camera.updateProjectionMatrix();
	}
	
}

	
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
    group.rotation.y += deltaX / 100;
    group.rotation.x += deltaY / 100;
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

function animate(time) {
	time *= 0.001;
	
	resizeCanvas();
	
	sphere.rotation.y += 0.001;
	renderer.render( scene, camera );
	requestAnimationFrame(animate)
	
}
requestAnimationFrame(animate);

addEventListener('mousemove', function (e) {onMouseMove(e);}, false);
addEventListener('mousedown', function (e) {onMouseDown(e);}, false);
addEventListener('mouseup', function (e) {onMouseUp(e);}, false);
addEventListener('wheel', function (e) {updateCamera(e);}, false);