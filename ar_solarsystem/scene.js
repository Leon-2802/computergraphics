import { GUI } from 'https://cdn.jsdelivr.net/npm/lil-gui@0.18/+esm';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js';
import * as THREE from 'https://unpkg.com/three@0.120.1/build/three.module.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.120.1/examples/jsm/loaders/GLTFLoader.js';
import { ARButton } from './ARButton.js';
import { UiPanel } from './CanvasUI/uiPanel.js';

import * as infoUIText from './info.js';
import * as planets from './planets.js';

//changing variables
let time = 0;
let solarSystemOffset = -3;

//constant Variables ----------------------------------------------------------------
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight
}

const sunPos = {
	x: 0,
	y: 0,
	z: 0
}

const can1 = {
	rx: 30,
	ry: 60,
	rz: 180,
}

const can2 = {
	rx: 90,
	ry: 20,
	rz: 0,
}

const can3 = {
	rx: 30,
	ry: 25,
	rz: 25,
}

const can4 = {
	rx: 33,
	ry: 90,
	rz: 90,
}

const can5 = {
	rx: 5,
	ry: 20,
	rz: 100,
}

const canRotations = [
	can1,
	can2,
	can3,
	can4,
	can5,
]
//-----------------------------------------------------------------------------------


//create base components
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
const renderer = new THREE.WebGLRenderer(
	{ alpha: true }
);

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.enabled = true;
renderer.xr.enabled = true;
document.body.appendChild(renderer.domElement);

// parent of all objects
var solarSystem = new THREE.Group();
solarSystem.position.set(0, 0, solarSystemOffset);
const solarSystemWidth = 100;
const solarSystemScale = planets.getScaleForSolarSystem(solarSystemWidth);
solarSystem.scale.set(solarSystemScale, solarSystemScale, solarSystemScale);
scene.add(solarSystem);

//AR-Button
const arButton = ARButton.createButton(renderer);
arButton.id = "ar-btn";
document.body.appendChild(arButton);


//AR controller (for touch input on mobile devices) --------------------------------
let scenePlaced = false;
function onSelect() {
	onPointerMove();
	checkRay();
}

const controller = renderer.xr.getController(0); //renderer.xr.getController(0) = first touch input onto the scene
controller.addEventListener("select", onSelect);
scene.add(controller);
//----------------------------------------------------------------------------------


//Lights
const sunLight = new THREE.PointLight(0xffffff, 1.5);
sunLight.position.set(sunPos.x, sunPos.y, sunPos.z);
scene.add(sunLight);
const ambientLight = new THREE.AmbientLight(0xffffff, .2);
scene.add(ambientLight);

//Camera settings
camera.position.set(3.5, 0.5, 5);
scene.add(camera);

//load banners for the cans
var canBanners = loadBanners();;
function loadBanners() {
	//load the bannernames into an array, so their loading process can be started within one for-loop
	var bannerNames = ["Merkury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto"];

	var canBanners = [];
	for (let i = 0; i < (planets.amount); i++) {
		const texture = new THREE.TextureLoader().load('Assets/Planetbanners/' + bannerNames[i] + '.png');
		texture.flipY = false;
		texture.encoding = THREE.sRGBEncoding;
		const material = new THREE.MeshPhysicalMaterial({ map: texture });
		canBanners.push(material);
	}
	return canBanners;
}

//GLTF-Loader for Can
const loader = new GLTFLoader();
var cans = loadCans(loader, planets.amount);

// loads the cans using the supplied loader and returns them in a list
function loadCans(loader, amountOfCans) {
	var cans = [];
	loader.load('Assets/Can_Self_Material.glb', function (glb) {
		const can = glb.scene;

		const canObject = can.getObjectByName("Can");
		const canDimensionFactorToOneMeter = 1 / 3.65;
		canObject.scale.set(canDimensionFactorToOneMeter, canDimensionFactorToOneMeter, canDimensionFactorToOneMeter);


		// set the initial Position of the can once
		var canPositions = planets.getAllPlanetPositions(time);
		var canScales = planets.getAllCanScales();

		// clone the cans and put them into the array to be returned later
		for (var i = 0; i < amountOfCans; i++) {
			var thisCan = can;

			if (i != 0) {
				thisCan = can.clone();
			}
			thisCan.position.set(canPositions[i].x, canPositions[i].y, canPositions[i].z);
			thisCan.rotation.set(canRotations[i % 5].rx, canRotations[i % 5].ry, canRotations[i % 5].rz);
			thisCan.scale.set(canScales[i], canScales[i], canScales[i]);
			//add banner to can
			thisCan.getObjectByName("Cylinder.002_0").material = canBanners[i];
			solarSystem.add(thisCan);
			cans.push(thisCan);
		}
		animateCans(cans);
	}, function (xhr) {
		console.log((xhr.loaded / xhr.total * 100) + "% loaded")
	}, function (error) {
		console.log("An error occured" + error)
	});
	return cans;
}

var currentPlanetSpeedFactor = 1;
var currentPlanetDistanceScaleFactor = 1;
function animateCans() {
	// the counter is used to differentiate between the planets
	let canCounter = 0;
	for (const can of cans) {
		can.rotation.x = can.rotation.x + .0008;
		can.rotation.y = can.rotation.y + .0009;
		can.rotation.z = can.rotation.z + .0003;

		const timeFactor = 1 / 2000
		can.position.x = planets.getAllPlanetPositions(time * timeFactor, currentPlanetSpeedFactor, currentPlanetDistanceScaleFactor)[canCounter].x;
		can.position.z = planets.getAllPlanetPositions(time * timeFactor, currentPlanetSpeedFactor, currentPlanetDistanceScaleFactor)[canCounter].z;
		canCounter += 1;
	}
	requestAnimationFrame(animateCans);
};



//Sun----------------------------------------------------------------
const sunGeometry = new THREE.SphereGeometry(.4, 32, 32);
const sunTexture = new THREE.TextureLoader().load('Assets/sun.jpg');
const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });


const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
sunMesh.position.x = sunPos.x;
sunMesh.position.y = sunPos.y;
sunMesh.position.z = sunPos.z;
// scaling messes with the shader
// const sunRadius = 696.340;
// sunMesh.scale(sunRadius, sunRadius, sunRadius);
solarSystem.add(sunMesh);
//-------------------------------------------------------------------


// 2D UI for setting properties--------------------------------------
function createPropertiesUIPanel() {
	const panel = new GUI({ width: 310 });

	const settings = {
		planetsScale: 1.0,
		planetsSpeed: 1.0,
		planetsDistanceScale: 1.0
	}
	panel.add(settings, 'planetsScale', 0.0, 2.0, 0.01);
	panel.add(settings, 'planetsSpeed', 0.0, 10.0, 0.01);
	panel.add(settings, 'planetsDistanceScale', 0.1, 3, 0.01);

	panel.onChange(event => {
		switch (event.property) {
			case "planetsScale":
				adjustPlanetScale(event.value);
				break;
			case "planetsSpeed":
				adjustPlanetSpeed(event.value);
				break;
			case "planetsDistanceScale":
				adjustPlanetDistanceScale(event.value);
				break;
		}
	});
}
createPropertiesUIPanel();

function adjustPlanetScale(scale) {
	var canScales = planets.getAllCanScales(scale);
	// update planets scales 
	for (var i = 0; i < cans.length; i++) {
		cans[i].scale.set(canScales[i], canScales[i], canScales[i]);
	}
}

function adjustPlanetSpeed(speedFactor) {
	currentPlanetSpeedFactor = speedFactor;
}

function adjustPlanetDistanceScale(planetDistanceScaleFactor) {
	currentPlanetDistanceScaleFactor = planetDistanceScaleFactor;
}
// ------------------------------------------------------------------

// Info UI ----------------------------------------------------------
let canPositions = planets.getAllPlanetPositions(time);
let InfoUIPanel;
function createInfoUIPanel() {
	let position = {
		x: sunPos.x,
		y: 1,
		z: sunPos.z
	}
	let headerText = "Sun";
	let mainText = "Placeholder";
	let headerColor = "#ff4f19";
	let textColor = "#CAA185";
	InfoUIPanel = UiPanel.createUI(solarSystem, position, headerText, mainText, headerColor, textColor);
}
createInfoUIPanel();

function updateInfoUIText(planetIndex) {
	const headerText  = infoUIText.getInfoUIPanelText(planetIndex).planet;
	const temp  = infoUIText.getInfoUIPanelText(planetIndex).temperature;
	const dist  = infoUIText.getInfoUIPanelText(planetIndex).distance;
	const mass  = infoUIText.getInfoUIPanelText(planetIndex).mass;
	const a  = infoUIText.getInfoUIPanelText(planetIndex).radius;
	const b  = infoUIText.getInfoUIPanelText(planetIndex).orbitalPeriod;
	const c = infoUIText.getInfoUIPanelText(planetIndex).dayLength;

	InfoUIPanel.updateElement("header", headerText);
	InfoUIPanel.updateElement("temp", temp);
	InfoUIPanel.updateElement("dist", dist);
	InfoUIPanel.updateElement("mass", mass);
	InfoUIPanel.updateElement("a", a);
	InfoUIPanel.updateElement("b", b);
	InfoUIPanel.updateElement("c", c);
}
updateInfoUIText(2);
// ------------------------------------------------------------------

// Raycaster --------------------------------------------------------
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const cursor = new THREE.Mesh(
	new THREE.RingBufferGeometry(0.1, 0.15),
	new THREE.MeshBasicMaterial({ color: "white" })
);

function onPointerMove(event) {
	// calculate pointer position in normalized device coordinates
	// (-1 to +1) for both components
	pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
	pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;
	checkRay();
}

function checkRay(event) {
	// update the ray with the camera and pointer position
	raycaster.set(camera.position, new THREE.Vector3(0, 0, -1));
	console.log("Testing");
	//raycaster.setFromCamera(pointer, camera);
	// calculate objects intersecting the ray
	for (const can of cans) {
		const intersect = raycaster.intersectObject(can);
		const selected = intersect.length > 0;
		cursor.material.color.set(selected ? "red" : "white");
		if (selected && event) {
			const index = cans.indexOf(can);
			updateInfoUIText(index);
		}
	}
}
window.addEventListener('pointermove', onPointerMove);
window.addEventListener('pointerdown', checkRay);
// ------------------------------------------------------------------

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", onWindowResize, false);

const controls = new OrbitControls(camera, renderer.domElement);
controls.autoRotate = false;
controls.enablePan = false;
controls.minDistance = 2;
controls.maxDistance = 15;
controls.maxPolarAngle = Math.PI;
controls.update()


function renderScene() {
	renderer.setAnimationLoop(() => {
		time += 1;
		controls.update();
		InfoUIPanel.update();
		renderer.render(scene, camera);
	});
};

renderScene();
