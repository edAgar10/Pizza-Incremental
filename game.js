import { KeyframeTrack } from "three"
import { clamp } from "three/src/math/MathUtils.js"

const gen1 = document.getElementById("gen1")
const gen2 = document.getElementById("gen2")
const gen3 = document.getElementById("gen3")

var totalmoney = 20000000


var ingredients = [];

class Ingredient {
	constructor(ing) {
		this.name = ing.name;
		this.total = ing.total;
		this.cap = ing.cap;
	}
}

function ingName(name) {
	for (let i = 0; i < ingredients.length; i++)
		if (ingredients[i].name == name) {
			return ingredients[i]
		}
}

let ingredientDefaultData = [
["wheat", 500, 2000],
["milk",0,50],
["tomatos",0, 50],
["flour", 300, 1000],
["water",0,100],
["dough",0,30]
]

function createIngredient(data) {
	const ing = {
		name: data[0],
		total: data[1],
		cap: data[2]
	}

	
	ingredients.push(new Ingredient(ing))


}

for (let i = 0; i < ingredientDefaultData.length; i++) {
	createIngredient(ingredientDefaultData[i])
}



var tempgenerators = []

class t1Generator {
	constructor(gen) {
		this.name = gen.name;
		this.cost = gen.cost;
		this.amount = gen.amount;
		this.mult = gen.mult;
	}
}

class t2Generator {
	constructor(gen) {
		this.name = gen.name;
		this.cost = gen.cost;
		this.amount = gen.amount;
		this.mult = gen.mult;
		this.increase = gen.increase;
		this.decrease = gen.decrease;
	}
}


function genName(name) {
	for (let i = 0; i < generators.length; i++)
		if (generators[i].name == name) {
			return generators[i]
		}
}

//Name, Cost, Amount, Mult, Increase, Decrease
let generatorDefaultData = [
["Wheat Field", Math.pow(Math.pow(25,1), 1), 1, 2],
["Cows", Math.pow(Math.pow(50,1), 1), 0, 1],
["Mill", Math.pow(Math.pow(50,1), 1), 0, 1, 2, 1],
["Water Pump", Math.pow(Math.pow(50,1), 1), 1, 10],
["Dough Mixer", Math.pow(Math.pow(50,1), 1), 0, 1, 10, [300,100]]
]



function createGenerators(data) {
	const gen = {
		name: data[0],
		cost: data[1],
	 	amount: data[2],
		mult: data[3],
	}
	if (data.length == 6) {
		Object.assign(gen, {increase: data[4]}, {decrease: data[5]})
		tempgenerators.push(new t2Generator(gen))
	}
	else {
		tempgenerators.push(new t1Generator(gen))
	}
}

for (let i = 0; i < generatorDefaultData.length; i++) {
	createGenerators(generatorDefaultData[i])
}



var selectGenerators= [];

class SelectGenerator {
	constructor(gen) {
		this.name = gen.name;
		this.cost = gen.cost;
		this.amount = gen.amount;
		this.mult = gen.mult;
		this.increase = gen.increase;
		this.value = gen.value;
	}
}

function slctGenName(name) {
	for (let i = 0; i < ingredients.length; i++)
		if (ingredients[i].name == name) {
			return ingredients[i]
		}
}

let selectgenDefaultData = [
["Vegetable Patch", Math.pow(Math.pow(50,1), 1), 0, 1, 1, ("maxPlants")],
]

function createSelectGen(data) {
	const ing = {
		name: data[0],
		cost:  data[1],
		amount:  data[2],
		mult:  data[3], 
		increase:  data[4],
		value:  data[5]
	}
	
	selectGenerators.push(new SelectGenerator(ing))


}

for (let i = 0; i < selectgenDefaultData.length; i++) {
	createSelectGen(selectgenDefaultData[i])
}

console.log(selectGenerators)



var generators = []
var buildings = []
var lastUpdate = Date.now()

let wheatField = {
	cost: Math.pow(Math.pow(25,1), 1),
	name: "Wheat Field",
	amount: 1, 
	mult: 2
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

let selectValues = {
	maxPlants: 0
}

var unnassignedPlants = 0;

let vegPatch = {
	cost: Math.pow(Math.pow(50,1), 1),
	name: "Vegetable Patch",
	amount: 0,
	value: ("maxPlants"), 
	increase: 1,
	mult: 1
}

buildings.push(vegPatch)
document.getElementById("gen3Title").innerHTML = vegPatch.name  + "<br>";

let wheatMill = {
	cost: Math.pow(Math.pow(50,1), 1),
	name: "Mill",
	amount: 0,
	increase: 2,
	decrease: 1,
	mult: 1
}

buildings.push(wheatMill)
document.getElementById("bui1Title").innerHTML = wheatMill.name  + "<br>";


let plantValues = {
	tomatos: 0
}

let waterPump = {
	cost: Math.pow(Math.pow(50,1), 1),
	name: "Water Pump",
	amount: 1, 
	mult: 10
}
generators.push(waterPump)
document.getElementById("bui2Title").innerHTML = waterPump.name  + "<br>";

let doughMixer = {
	cost: Math.pow(Math.pow(50,1), 1),
	name: "Dough Mixer",
	amount: 0,
	increase: 10,
	decrease: [300, 100],
	mult: 1
}

generators.push(doughMixer)
document.getElementById("gen4Title").innerHTML = doughMixer.name  + "<br>";



const button1 = document.getElementById("button1")
button1.addEventListener("click",  () => buyGenerator(1));
const button2 = document.getElementById("button2")
button2.addEventListener("click",  () => buyGenerator(2));
const button3 = document.getElementById("button3")
button3.addEventListener("click",  () => buyBuilding(1));
const button4 = document.getElementById("button4")
button4.addEventListener("click",  () => buyBuilding2(2));
const button5 = document.getElementById("button5")
button5.addEventListener("click",  () => buyGenerator(3));
const button6 = document.getElementById("button6")
button6.addEventListener("click",  () => buyGenerator(4));


const increaseButtons = document.getElementsByClassName("increaseBtn")
const decreaseButtons = document.getElementsByClassName("decreaseBtn")

console.log(increaseButtons)

for (let i = 0; i < increaseButtons.length; i++){
	increaseButtons[i].addEventListener("click", () => increaseValue(increaseButtons[i].parentNode.id));
}

for (let i = 0; i < decreaseButtons.length; i++){
	decreaseButtons[i].addEventListener("click", () => decreaseValue(decreaseButtons[i].parentNode.id));
}

function increaseValue(id) {
	if (unnassignedPlants == 0) {return}
	console.log(id)
	plantValues[id] += 1
}
function decreaseValue(id) {
	if (plantValues[id] == 0) {return}
	plantValues[id] -= 1
}


function format(amount) {
	let power = Math.floor(Math.log10(amount))
	let mantissa = amount / Math.pow(1, power)
	if (power < 3) return amount.toFixed(2)
	return mantissa.toFixed(2) + "e" + power
	
}

function clampResource(resource, min, max) {
	return Math.min(Math.max(this,min), max);
}

function updateAvailable(values, max) {
	var result = max;
	for (const [key, value] of Object.entries(values)) {
		result -= value;
	}
	return result
}


function updateUI() {
	document.getElementById("money").textContent = "Money: £" + format(totalmoney);

	document.getElementById("flourIng").textContent = "Flour: " + format(ingName("flour").total) + "g";
	document.getElementById("waterIng").textContent = "Water: " + (ingName("water").total).toFixed(2) + " / " + (ingName("water").cap).toFixed(2) + "l";

	document.getElementById("wheatIng").textContent = "Wheat: " + format(ingName("wheat").total);
	document.getElementById("milkIng").textContent = "Milk: " + (ingName("milk").total).toFixed(2) + " / " + (ingName("milk").cap).toFixed(2) + "l";
	document.getElementById("tomatosIng").textContent = "Tomatos: " + (ingName("tomatos").total).toFixed(0);

	document.getElementById("doughIng").textContent = "Dough: " + format(ingName("dough").total) + " / " + (ingName("dough").cap).toFixed(2);


	unnassignedPlants = updateAvailable(plantValues, selectValues.maxPlants)
	document.getElementById("availablePlants").textContent = "Available: " + unnassignedPlants + " / " + selectValues.maxPlants
	document.getElementById("tomatoPlants").textContent = "Tomatos:  " + plantValues.tomatos

	gen1.innerHTML = "<br>Amount: " + wheatField.amount + "<br>Cost: " + format(wheatField.cost);
	gen2.innerHTML = "<br>Amount: " + cowsGen.amount + "<br>Cost: " + format(cowsGen.cost);
	gen3.innerHTML = "<br>Amount: " + vegPatch.amount + "<br>Cost: " + format(vegPatch.cost);
	bui1.innerHTML = "<br>Amount: " + wheatMill.amount + "<br>Cost: " + format(wheatMill.cost);
	bui2.innerHTML = "<br>Amount: " + waterPump.amount + "<br>Cost: " + format(waterPump.cost);
	gen4.innerHTML = "<br>Amount: " + doughMixer.amount + "<br>Cost: " + format(doughMixer.cost);
}

console.log(plantValues.tomatos)

var flourCheck = false
var doughCheck = false

function productionLoop(diff){
	ingredients[0].total += wheatField.amount * wheatField.mult * diff * 2
	if (ingredients[0].total > (wheatMill.amount * wheatMill.decrease)){
		ingredients[0].total -= (wheatMill.amount * wheatMill.decrease)
		flourCheck = true
	}

	ingredients[4].total += waterPump.amount * waterPump.mult * diff * 2
	ingredients[4].total = clamp(ingredients[4].total, 0, ingredients[4].cap)

	
	ingredients[1].total += cowsGen.amount * cowsGen.mult * diff * 0.5
	ingredients[1].total = clamp(ingredients[1].total, 0, ingredients[1].cap)
	ingredients[2].total += plantValues.tomatos * vegPatch.mult * diff;
	
	if (flourCheck == true){
		ingredients[3].total += wheatMill.amount * wheatMill.mult * diff * 2;
		flourCheck = false
	}

	if (ingredients[3].total >= (doughMixer.amount * doughMixer.decrease[0]) && ingredients[4].total >= (doughMixer.amount * doughMixer.decrease[1])){
		ingredients[3].total -= doughMixer.amount * doughMixer.decrease[0]
		ingredients[4].total -= doughMixer.amount * doughMixer.decrease[1]
		doughCheck = true;
	}

	if (doughCheck == true) {
		ingredients[5].total += doughMixer.amount * doughMixer.increase * doughMixer.mult;
		doughCheck = false;
	}
	


	
}


function buyGenerator(i) {
	console.log("gen bought")
	let g = generators[i-1]
	if (g.cost > totalmoney) return
	totalmoney -= g.cost
	g.amount += 1
	g.mult *= 1.05
	g.cost *= 1.5
}

function buyBuilding(i) {
	console.log("building bought")
	let b = buildings[i-1]
	if (b.cost > totalmoney) return
	totalmoney -= b.cost
	b.amount += 1
	selectValues[b.value] += b.increase
	b.cost *= 1.5
	console.log(selectValues.maxPlants)
}

function buyBuilding2(i) {
	console.log("building bought")
	let b = buildings[i-1]
	if (b.cost > totalmoney) return
	totalmoney -= b.cost
	b.amount += 1
	b.cost *= 1.5
}



function mainLoop() {
	var diff = (Date.now() - lastUpdate) / 1000

	productionLoop(diff)
	updateUI()
	
	lastUpdate = Date.now()
}

setInterval(mainLoop, 50)

