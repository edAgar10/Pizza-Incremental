import { clamp } from "three/src/math/MathUtils.js"

const gen1 = document.getElementById("gen1")
const gen2 = document.getElementById("gen2")
const gen3 = document.getElementById("gen3")

var totalmoney = 20000000

let wheat = {
	name: "wheat",
	total: 500
} 
var milk = {
	name: "milk",
	total: 1000,
	cap: 2000
}



var generators = []
var buildings = []
var lastUpdate = Date.now()

let wheatField = {
	cost: Math.pow(Math.pow(50,1), 1),
	name: "Wheat Field",
	amount: 1, 
	mult: 1
}

generators.push(wheatField)
document.getElementById("gen1Title").innerHTML = wheatField.name + "<br>";


let cowsGen = {
	cost: Math.pow(Math.pow(50,1), 1),
	name: "Cows",
	amount: 0, 
	mult: 1
}

generators.push(cowsGen)
document.getElementById("gen2Title").innerHTML = cowsGen.name  + "<br>";

var maxPlants = 0;
var unnassignedPlants = 0;

let vegPatch = {
	cost: Math.pow(Math.pow(50,1), 1),
	name: "Vegetable Patch",
	amount: 0,
	value: maxPlants, 
	increase: 1
}


var tomatos = 16


buildings.push(vegPatch)
document.getElementById("gen3Title").innerHTML = vegPatch.name  + "<br>";

const button1 = document.getElementById("button1")
button1.addEventListener("click",  () => buyGenerator(1));
const button2 = document.getElementById("button2")
button2.addEventListener("click",  () => buyGenerator(2));
const button3 = document.getElementById("button3")
button2.addEventListener("click",  () => buyBuilding(1));


function format(amount) {
	let power = Math.floor(Math.log10(amount))
	let mantissa = amount / Math.pow(1, power)
	if (power < 3) return amount.toFixed(2)
	return mantissa.toFixed(2) + "e" + power
	
}

function clampResource(resource, min, max) {
	return Math.min(Math.max(this,min), max);
}


function updateUI() {
	document.getElementById("money").textContent = "Money: £" + format(totalmoney);
	document.getElementById("wheat").textContent = "Wheat: " + format(wheat.total);
	document.getElementById("milk").textContent = "Milk: " + (milk.total).toFixed(2) + " / " + (milk.cap).toFixed(2);

	document.getElementById("availablePlants").textContent = unnassignedPlants + " / " + maxPlants


	gen1.innerHTML = "<br>Amount: " + wheatField.amount + "<br>Cost: " + format(wheatField.cost);
	gen2.innerHTML = "<br>Amount: " + cowsGen.amount + "<br>Cost: " + format(cowsGen.cost);
	gen3.innerHTML = "<br>Amount: " + vegPatch.amount + "<br>Cost: " + format(vegPatch.cost);
}

function productionLoop(diff){
	wheat.total += wheatField.amount * wheatField.mult * diff
	milk.total += cowsGen.amount * cowsGen.mult * diff
	milk.total = clamp(milk.total, 0, milk.cap)
	
}

function buyGenerator(i) {
	console.log("gen bought")
	let g = generators[i-1]
	if (g.cost > totalmoney) return
	totalmoney -= g.cost
	g.amount += 1
	g.bought += 1
	g.mult *= 1.05
	g.cost *= 1.5
}

function buyBuilding(i) {
	console.log("building bought")
	let b = buildings[i-1]
	if (b.cost > totalmoney) return
	totalmoney -= b.cost
}



function mainLoop() {
	var diff = (Date.now() - lastUpdate) / 1000

	productionLoop(diff)
	updateUI()
	
	lastUpdate = Date.now()
}

setInterval(mainLoop, 50)

