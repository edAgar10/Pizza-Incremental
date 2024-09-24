import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import vertexShader from './Shaders/vertex.glsl?raw'
import fragmentShader from './Shaders/fragment.glsl?raw'

import borderVrtxShader from './Shaders/borderVertex.glsl?raw'
import borderFrgmShader from './Shaders/borderFragment.glsl?raw'

import atmVertexShader from './Shaders/atmVertex.glsl?raw'
import atmFragmentShader from './Shaders/atmFragment.glsl?raw'


//Ready document

$(document).ready(function() {
	$("#buildingPage").hide();
	$("#ordersPage").hide();
});

const textureLoader = new THREE.TextureLoader();

// Rendering the planet section

const renderer = new THREE.WebGLRenderer({antialias:true, canvas: document.querySelector('canvas'), alpha: true});
renderer.setPixelRatio(window.devicePixelRatio)

const scene = new THREE.Scene();
const  camera = new THREE.PerspectiveCamera(70, 2, 1, 1000);
const controls = new OrbitControls(camera, renderer.domElement)



const globeGeometry = new THREE.IcosahedronGeometry( 5, 50 );


// const uniforms = {
// 	sunDirection: {value: new THREE.Vector3(0,1,0)},
// 	dayTexture: {value: textureLoader.load('./Assets/earthuv.png')},
// 	nightTexture: {value: textureLoader.load('./Assets/earthuvnight.png')}
// }


// /const sphereMaterial = new THREE.ShaderMaterial({
// 	vertexShader, 
// 	fragmentShader, 
// 	uniforms: {globeTexture: {value: textureLoader.load('./Assets/earthuv.png')}}
// });
// const sphereMaterial = new THREE.ShaderMaterial({ 
// 	uniforms: uniforms,
// 	vertexShader: vertexShader,
// 	fragmentShader: fragmentShader
// });

const sphereMaterial = new THREE.MeshStandardMaterial({
	color: new THREE.Color(0xffffff),
	map: textureLoader.load('./Assets/earthuv.png')
});
const sphere = new THREE.Mesh( globeGeometry, sphereMaterial);

 const darksideMat = new THREE.MeshBasicMaterial({ 
 	map: textureLoader.load('./Assets/earthuvnight.png'),
 	blending: THREE.AdditiveBlending,

}); 

const darksideMesh = new THREE.Mesh(globeGeometry, darksideMat);

const sphereBorder = new THREE.Mesh(globeGeometry, 
new THREE.ShaderMaterial({vertexShader: borderVrtxShader, fragmentShader: borderFrgmShader, blending: THREE.AdditiveBlending, side: THREE.BackSide}));

sphereBorder.scale.set(1.01, 1.01, 1.01);
scene.add(sphereBorder);

const atmGeometry = globeGeometry;
const atmMaterial = new THREE.ShaderMaterial({vertexShader: atmVertexShader, fragmentShader: atmFragmentShader, blending: THREE.AdditiveBlending, side: THREE.BackSide});
const atmosphere = new THREE.Mesh( atmGeometry, atmMaterial );

atmosphere.scale.set(1.1, 1.1, 1.1)
scene.add(atmosphere)

const group = new THREE.Group()

group.add(sphere)
group.add(darksideMesh)



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

scene.add(stars)

const sunMat = new THREE.MeshStandardMaterial({
	color: new THREE.Color(0xffffff)
});

const sunMesh = new THREE.Mesh(globeGeometry, sunMat)


const sunlight = new THREE.DirectionalLight(0xffffff, 5);
group.add(sunMesh)
group.add(sunlight);

scene.add(group)

const sunCurve = new THREE.EllipseCurve(
	0, 0,
	200, 200,
	0, 2 * Math.PI, false
);
const point = sunCurve.getSpacedPoints(200)

camera.position.z = 20;
camera.position.z.clamp
controls.update();

	
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


function clamp(num, min, max){
	return Math.min(Math.max(num, min), max);
}

const loopTime = 1;
const sunOrbitSpeed = 0.00001;

// var dir = new THREE.Vector3();
// var sunPosition = sunlight.position;
// const origin = new THREE.Vector3(0,0,0);

function animate() {
	const time = sunOrbitSpeed * performance.now();
	const t = (time % loopTime) / loopTime;

	let p = sunCurve.getPoint(t);
	sunlight.position.x = p.x;
	sunlight.position.z = p.y;

	sunMesh.position.x = p.x;
	sunMesh.position.z = p.y;
	
	// sunPosition = new THREE.Vector3(p.x, p.y, p.y)
	

	// console.log(p)
	// dir.subVectors( sunPosition, origin ).normalize();
	// uniforms.sunDirection.value.x = dir.x;
	// uniforms.sunDirection.value.y = dir.z;

	resizeCanvas();
	controls.update();
	renderer.render( scene, camera );
	requestAnimationFrame(animate)
	
}
requestAnimationFrame(animate);


// Building page 

const tabList = [document.getElementById("tab1"), document.getElementById("tab2"), document.getElementById("tab3")]
const pages = document.getElementsByClassName("tabPage")
let genTitles = document.getElementById("generatorTitle")
const titles = ["Farm", "Buildings", "Orders"]


for (let i = 0; i < tabList.length; i++){
	
	tabList[i].addEventListener("click",  () => changeTab(tabList[i]));
}


function changeTab(tabName) {
	for (let i = 0; i < tabList.length; i++) {
		if (tabName == tabList[i]) {
			$(pages[i]).slideToggle();
 			genTitles.innerHTML = titles[i];
			tabList[i].classList.remove("tabButton");
 			tabList[i].classList.add("tabButtonActive");
 		}
 		else {
 			$(pages[i]).hide();
			tabList[i].classList.remove("tabButtonActive");
 			tabList[i].classList.add("tabButton");
 		}
	}

}


//Resource Page

const resourceLists = [document.getElementById("mainIngList"), document.getElementById("sideIngList"), document.getElementById("farmIngList")]

$(".dropdownButton").on("click", function() {
	var currentButtonId = $(this).attr("id");

	for (let i = 0; i < resourceLists.length; i++){
		console.log()
		if ((currentButtonId.split("Button").join("")) == ((resourceLists[i].id).split("List").join(""))){
			$(resourceLists[i]).slideToggle(1000);
		}
	}
});
