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

const mouse = {
	x: undefined,
	y: undefined
}

function animate() {
	sphere.rotation.y += 0.001;
	group.rotation.y  = mouse.x
	renderer.render( scene, camera );
}
renderer.setAnimationLoop( animate )



addEventListener('click', () => {
	mouse.x = (event.clientX / innerWidth) * 2 - 1
	mouse.y = -(event.clientY / innerHeight) * 2 + 1
	
	
	
})