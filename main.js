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
	// $("#resourceSection").hide();
	// $("#generatorSection").hide();
});

const textureLoader = new THREE.TextureLoader();

// Rendering the planet section

const renderer = new THREE.WebGLRenderer({antialias:true, canvas: document.querySelector('canvas'), alpha: true});
renderer.setPixelRatio(window.devicePixelRatio)

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100000 );

camera.updateProjectionMatrix();
const controls = new OrbitControls(camera, renderer.domElement)


controls.autoRotate = false;
controls.maxDistance = 100;
controls.minDistance = 1;
controls.minTargetRadius = 10;




const group = new THREE.Group()


const globeGeometry = new THREE.IcosahedronGeometry( 5, 50 );


const sphereMaterial = new THREE.MeshStandardMaterial({
	map: textureLoader.load('./Assets/earthuv.png')
});
const sphere = new THREE.Mesh( globeGeometry, sphereMaterial);

const darksideMat = new THREE.MeshBasicMaterial({ 
 	map: textureLoader.load('./Assets/earthuvnight.png'),
 	blending: THREE.AdditiveBlending

}); 




const darksideMesh = new THREE.Mesh(globeGeometry, darksideMat);
const borderMat = new THREE.ShaderMaterial({vertexShader: borderVrtxShader, fragmentShader: borderFrgmShader, blending: THREE.AdditiveBlending, side: THREE.BackSide})
const sphereBorder = new THREE.Mesh(globeGeometry, borderMat);

sphereBorder.scale.set(1.01, 1.01, 1.01);
group.add(sphereBorder);

const atmGeometry = globeGeometry;
const atmMaterial = new THREE.ShaderMaterial({vertexShader: atmVertexShader, fragmentShader: atmFragmentShader, blending: THREE.AdditiveBlending, side: THREE.BackSide});
const atmosphere = new THREE.Mesh( atmGeometry, atmMaterial );



atmosphere.scale.set(1.1, 1.1, 1.1)
group.add(atmosphere)



group.add(sphere)
group.add(darksideMesh)




const starGeometry = new THREE.BufferGeometry()
const starMaterial = new THREE.PointsMaterial({color: 0xffffff})

const starVertices = []
for (let i = 0; i < 20000; i++) {
	const x = (Math.random() - 0.5) * 30000
	const y = (Math.random() - 0.5) * 30000
	const z = (Math.random() - 0.5) * 30000
	starVertices.push(x, y, z)
}
starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3))

const stars = new THREE.Points(starGeometry, starMaterial)

scene.add(stars)

const sunGroup = new THREE.Group()


const sunGeometry = new THREE.IcosahedronGeometry( 50, 100 );
const sunMat = new THREE.MeshStandardMaterial({
	map: textureLoader.load('./Assets/sun.png')

});
const sunMesh = new THREE.Mesh(sunGeometry, sunMat)
const sunlight = new THREE.PointLight(0xffffff, 1000000);
	
const sunAtmosphere = new THREE.Mesh( sunGeometry, atmMaterial );
sunAtmosphere.scale.set(1.1, 1.1, 1.1);

sunGroup.add(sunMesh);
sunGroup.add(sunlight);
sunGroup.add(sunAtmosphere);

scene.add(sunGroup);

const sunCurve = new THREE.EllipseCurve(
	0, 0,
	500, 500,
	0, 2 * Math.PI, false
);

const linePoints = sunCurve.getSpacedPoints(200)

for (let i = 0; i < linePoints.length; i++) {
	linePoints[i].z = linePoints[i].y
	linePoints[i].y = 0
}

const lineMat = new THREE.PointsMaterial({color:0xffffff, size: 0.5, transparent:true, opacity: 0.4});
const lineGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
const curveMesh = new THREE.Points(lineGeo, lineMat);
scene.add(curveMesh)


const moonGroup = new THREE.Group()

const moonMaterial = new THREE.MeshStandardMaterial({
	map: textureLoader.load('./Assets/moon.jpg'),
	emissiveIntensity: 0
});
const moonGeometry = new THREE.IcosahedronGeometry( 1, 50 );
const moon = new THREE.Mesh( moonGeometry, moonMaterial);

moonGroup.add(moon)

let moonOrbit = new THREE.EllipseCurve(
	0, 0,
	20, 20,
	0, 2 * Math.PI, false, 50
);

const moonPoints = moonOrbit.getSpacedPoints(200)

for (let i = 0; i < moonPoints.length; i++) {
	moonPoints[i].z = moonPoints[i].y
	moonPoints[i].y = 0
}

const moonBorder = new THREE.Mesh(moonGeometry, borderMat)
	
moonBorder.scale.set(1.01, 1.01, 1.01);
moonGroup.add(moonBorder);

const moonAtmosphere = new THREE.Mesh( moonGeometry, atmMaterial );
moonAtmosphere.scale.set(1.03, 1.03, 1.03);
moonGroup.add(moonAtmosphere)

const moonLineGeo = new THREE.BufferGeometry().setFromPoints(moonPoints);
const moonLineMesh = new THREE.Points(moonLineGeo, lineMat);
//group.add(moonLineMesh)


scene.add(group)
scene.add(moonGroup)


	
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



// var dir = new THREE.Vector3();
// var sunPosition = sunlight.position;
// const origin = new THREE.Vector3(0,0,0);


controls.target = group.position
controls.update();


let cameraDistance = 50;

//https://www.reddit.com/r/threejs/comments/1chmjm5/making_orbitcontrols_lock_onto_an_object/
function cameraLock() {
	const worldPos = new THREE.Vector3();
	group.getWorldPosition(worldPos)

	const direction = new THREE.Vector3();
	camera.getWorldDirection(direction)

	const distance = 5 + cameraDistance

	const targetPosition = new THREE.Vector3().copy(worldPos).add(direction.multiplyScalar(-distance));

	camera.position.copy(targetPosition)

	controls.target.copy(worldPos)

}


var mouseOnDiv = false;
$(worldSection).mouseenter(function(){mouseOnDiv = true});
$(worldSection).mouseleave(function(){mouseOnDiv = false});

addEventListener("wheel", (event) => {

	if (mouseOnDiv == true) {
		cameraDistance += event.deltaY;
		cameraDistance = clamp(cameraDistance, 10, 150)
	}
	

});

function getTime(speed,loopTime) {
	return ((speed*performance.now()) % loopTime ) / loopTime;
}

const loopTime = 1;
const sunOrbitSpeed = 0.00001;
const moonOrbitSpeed = 0.00002;

function animate() {
	let t = getTime(sunOrbitSpeed, loopTime);

	

	let p = sunCurve.getPoint(t);

	group.position.x = p.x;
	group.position.z = p.y;

	group.rotation.y +=0.002;

	moonOrbit = new THREE.EllipseCurve(
		group.position.x, group.position.z,
		20, 20,
		0, 2 * Math.PI, false
	);

	t = getTime(moonOrbitSpeed, 1)

	p = moonOrbit.getPoint(t)

	moonGroup.position.x = p.x;
	moonGroup.position.z = p.y;

	cameraLock();
	controls.update();

	resizeCanvas();
	
	renderer.render( scene, camera );
	requestAnimationFrame(animate);
	
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


//Resource Page GUI

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

//World Page GUI

$("#worldFullscreen").on("click", function() {
	$("#resourceSection").slideToggle(0)
	$("#generatorSection").slideToggle(0)

});