import { KeyframeTrack } from "three"
import { clamp } from "three/src/math/MathUtils.js"

var lastUpdate = Date.now()

var totalmoney = 20000000

//Ingredients

var ingredients = [];

class t1Ingredient {
	constructor(ing) {
		this.name = ing.name;
		this.total = ing.total;
		this.cap = ing.cap;
		this.uiID = ing.uiID;
	}
}

class t2Ingredient {
	constructor(ing) {
		this.name = ing.name;
		this.total = ing.total;
		this.cap = ing.cap;
		this.uiID = ing.uiID;
		this.increase = ing.increase;
		this.decrease = ing.decrease;
	}
}

function ingName(name) {
	for (let i = 0; i < ingredients.length; i++)
		if (ingredients[i].name == name) {
			return ingredients[i]
		}
}

function updateIngredientUI(ing) {
	document.getElementById(ing.uiID).textContent = ing.name + ": " + ((ing.total).toFixed(2)) + " / " + ((ing.cap).toFixed(2));
}

//Name, Total, Cap, UI ID
let ingredientDefaultData = [
["Wheat", 500, 2000, "wheatIng"],
["Milk",0,50, "milkIng"],
["Tomatos",0, 50, "tomatosIng"],
["Flour", 300, 1000, "flourIng"],
["Water",0,100, "waterIng"],
["Dough",0,30, "doughIng", 2, [1,2]],
["Cheese",0,30, "cheeseIng"],
["Tomato Sauce",0, 30, "tmtSauceIng", 2, 1]
]


function createIngredient(data) {
	const ing = {
		name: data[0],
		total: data[1],
		cap: data[2],
		uiID: data[3]
	}

	if (data.length == 6) {
		Object.assign(ing, {increase: data[4]}, {decrease: data[5]})
		ingredients.push(new t2Ingredient(ing))
	}
	else {
		ingredients.push(new t1Ingredient(ing))
	}

}

for (let i = 0; i < ingredientDefaultData.length; i++) {
	createIngredient(ingredientDefaultData[i])
}

console.log(ingredients)

//Generators//

var generators = []

class t1Generator {
	constructor(gen) {
		this.id = gen.id;
		this.name = gen.name;
		this.cost = gen.cost;
		this.amount = gen.amount;
		this.mult = gen.mult;
	}

}

class t2Generator {
	constructor(gen) {
		this.id = gen.id;
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

function buyGenerator(i) {
	console.log("gen bought")
	let g = generators[i-1]
	if (g.cost > totalmoney) return
	totalmoney -= g.cost
	g.amount += 1
	g.mult *= 1.05
	g.cost *= 1.5
}

//ID, Name, Cost, Amount, Mult, Increase, Decrease
let generatorDefaultData = [
[1,"Wheat Field", Math.pow(Math.pow(25,1), 1), 1, 2],
[2,"Cows", Math.pow(Math.pow(50,1), 1), 0, 1],
[3,"Mill", Math.pow(Math.pow(50,1), 1), 0, 1, 2, 1],
[4,"Water Pump", Math.pow(Math.pow(50,1), 1), 1, 10],
[5,"Dough Mixer", Math.pow(Math.pow(50,1), 1), 0, 1, 10, [300,100]]
]



function createGenerators(data) {
	const gen = {
		id: data[0],
		name: data[1],
		cost: data[2],
	 	amount: data[3],
		mult: data[4],
	}
	if (data.length == 7) {
		Object.assign(gen, {increase: data[5]}, {decrease: data[6]})
		generators.push(new t2Generator(gen))
	}
	else {
		generators.push(new t1Generator(gen))
	}
}

for (let i = 0; i < generatorDefaultData.length; i++) {
	createGenerators(generatorDefaultData[i])
}

getTitles("gen", generators)
assignButtons("gen", generators)

console.log(generators)

//Buildings//

var buildings = []

class Building {
	constructor(bui) {
		this.id = bui.id;
		this.name = bui.name;
		this.cost = bui.cost;
		this.amount = bui.amount;
		this.mult = bui.mult;
		this.increase = bui.increase;
		this.value = bui.value;
	}

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

function buildingName(name) {
	for (let i = 0; i < buildings.length; i++)
		if (buildings[i].name == name) {
			return buildings[i]
		}
}

let buildingDefaultData = [
[1,"Vegetable Patch", Math.pow(Math.pow(50,1), 1), 0, 1, 1, ("maxPlants")],
[2, "Kitchen", Math.pow(Math.pow(100,1), 1), 1, 1, 1, ("maxWorkers")]
]

function createBuilding(data) {
	const ing = {
		id: data[0],
		name: data[1],
		cost:  data[2],
		amount:  data[3],
		mult:  data[4], 
		increase:  data[5],
		value:  data[6]
	}
	
	buildings.push(new Building(ing))


}


for (let i = 0; i < buildingDefaultData.length; i++) {
	createBuilding(buildingDefaultData[i])
}

getTitles("bui", buildings)
assignButtons("bui", buildings)



function getTitles(type,objects) {
	for (let i = 0; i < objects.length; i++) {
		let currentTitleID = type + objects[i].id + "Title";
		document.getElementById(currentTitleID).innerHTML = objects[i].name + "<br>";
	}
}

function assignButtons(type,objects) {
	for (let i = 0; i < objects.length; i++) {
		let currentButtonID = type + objects[i].id + "Button";
		if (type == "gen"){
			document.getElementById(currentButtonID).addEventListener("click", () => buyGenerator(objects[i].id))
		}
		else if (type == "bui") {
			document.getElementById(currentButtonID).addEventListener("click", () => buyBuilding(objects[i].id))
		}
		
	}
}

function updateContainerUI(type, objects) {
	for (let i = 0; i < objects.length; i++) {
		let currentContainerID = type + objects[i].id;
		document.getElementById(currentContainerID).innerHTML = "<br>Amount: " + objects[i].amount + "<br>Cost: " + objects[i].cost;
	}
	
}



let selectValues = {
	maxPlants: 0,
	maxWorkers: 1,
}

let selectUnassigned = {
	unassignedPlants: 0,
	unassignedWorkers: 0
}


let plantValues = {
	tomatos: 0
}

let kitchenValues = {
	dough: 0,
	tmtSauce: 0
}

const increaseButtons = document.getElementsByClassName("increaseBtn")
const decreaseButtons = document.getElementsByClassName("decreaseBtn")

console.log(increaseButtons)

for (let i = 0; i < increaseButtons.length; i++){
	let selectType = increaseButtons[i].parentNode.parentNode.id
	if (selectType == "plantSelect"){
		increaseButtons[i].addEventListener("click", () => increaseValue(increaseButtons[i].parentNode.id, selectUnassigned.unassignedPlants, plantValues));
	}
	else if (selectType == "workerSelect") {
		increaseButtons[i].addEventListener("click", () => increaseValue(increaseButtons[i].parentNode.id, selectUnassigned.unassignedWorkers, kitchenValues));
	}
	
}

for (let i = 0; i < decreaseButtons.length; i++){
	let selectType = decreaseButtons[i].parentNode.parentNode.id
	if (selectType == "plantSelect"){
		decreaseButtons[i].addEventListener("click", () => decreaseValue(decreaseButtons[i].parentNode.id, plantValues));
	}
	else if (selectType == "workerSelect") {
		decreaseButtons[i].addEventListener("click", () => decreaseValue(decreaseButtons[i].parentNode.id, kitchenValues));
	}
}

function increaseValue(id, unassignedValue, assignedValue) {
	if (unassignedValue == 0) {return}
	assignedValue[id] += 1
}
function decreaseValue(id, assignedValue) {
	if (assignedValue[id] == 0) {return}
	assignedValue[id] -= 1
}


function format(amount) {
	let power = Math.floor(Math.log10(amount))
	let mantissa = amount / Math.pow(1, power)
	if (power < 3) return amount.toFixed(2)
	return mantissa.toFixed(2) + "e" + power
	
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

	for (let i = 0; i < ingredients.length; i++) {
		updateIngredientUI(ingredients[i])
	}

	

	// document.getElementById("flourIng").textContent = "Flour: " + format(ingName("flour").total) + "g";
	// document.getElementById("waterIng").textContent = "Water: " + (ingName("water").total).toFixed(2) + " / " + (ingName("water").cap).toFixed(2) + "l";

	// document.getElementById("wheatIng").textContent = "Wheat: " + format(ingName("wheat").total);
	// document.getElementById("milkIng").textContent = "Milk: " + (ingName("milk").total).toFixed(2) + " / " + (ingName("milk").cap).toFixed(2) + "l";
	// document.getElementById("tomatosIng").textContent = "Tomatos: " + (ingName("tomatos").total).toFixed(0);

	// document.getElementById("doughIng").textContent = "Dough: " + format(ingName("dough").total) + " / " + (ingName("dough").cap).toFixed(2);


	selectUnassigned.unassignedPlants = updateAvailable(plantValues, selectValues.maxPlants)
	selectUnassigned.unassignedWorkers = updateAvailable(kitchenValues, selectValues.maxWorkers)
	document.getElementById("availablePlants").textContent = "Available Plants: " + selectUnassigned.unassignedPlants + " / " + selectValues.maxPlants
	document.getElementById("tomatoPlants").textContent = "Tomatos:  " + plantValues.tomatos

	document.getElementById("availableWorkers").textContent = "Available Workers: " + selectUnassigned.unassignedWorkers + " / " + selectValues.maxWorkers
	document.getElementById("doughKitchen").textContent = "Dough:  " + kitchenValues.dough
	document.getElementById("tmtsauceKitchen").textContent = "Tomato Sauce:  " + kitchenValues.tmtSauce

	updateContainerUI("gen", generators)
	updateContainerUI("bui", buildings)
}

console.log(ingName("Water"))

var flourCheck = false
var doughCheck = false

function productionLoop(diff){
	ingredients[0].total += genName("Wheat Field").amount * genName("Wheat Field").mult * diff * 2
	if (ingredients[0].total > (genName("Mill").amount * genName("Mill").decrease)){
		ingredients[0].total -= (genName("Mill").amount * genName("Mill").decrease)
		flourCheck = true
	}

	ingName("Water").total += (genName("Water Pump").amount * genName("Water Pump").mult * diff * 2)
	ingName("Water").total = clamp(ingName("Water").total, 0, ingName("Water").cap)

	
	ingName("Milk").total += genName("Cows").amount * genName("Cows").mult * diff * 0.5
	ingName("Milk").total = clamp(ingName("Milk").total, 0, ingName("Milk").cap)
	ingName("Tomatos").total += plantValues.tomatos * buildingName("Vegetable Patch").mult * diff;
	
	if (flourCheck == true){
		ingName("Flour").total += (genName("Mill").amount * genName("Mill").mult * diff * 2);
		ingName("Flour").total = clamp(ingName("Flour").total, 0, ingName("Flour").cap)
		flourCheck = false
	}

	if (ingName("Flour").total >= (ingName("Dough").decrease[0] * kitchenValues.dough) && ingName("Water").total >= (ingName("Dough").decrease[1] * kitchenValues.dough)){
		ingName("Flour").total -= ingName("Dough").decrease[0] * kitchenValues.dough
		ingName("Water").total -= ingName("Dough").decrease[1] * kitchenValues.dough
		doughCheck = true
	}

	if (doughCheck == true) {
		ingName("Dough").total += kitchenValues.dough * buildingName("Kitchen").mult * diff;
		ingName("Dough").total = clamp(ingName("Dough").total, 0, ingName("Dough").cap)
		doughCheck = false
	}



	// if (ingredients[3].total >= (genName("Dough Mixer").amount * genName("Dough Mixer").decrease[0]) && ingredients[4].total >= (genName("Dough Mixer").amount * genName("Dough Mixer").decrease[1])){
	// 	ingredients[3].total -= genName("Dough Mixer").amount * genName("Dough Mixer").decrease[0]
	// 	ingredients[4].total -= genName("Dough Mixer").amount * genName("Dough Mixer").decrease[1]
	// 	doughCheck = true;
	// }

	// if (doughCheck == true) {
	// 	ingredients[5].total += genName("Dough Mixer").amount * genName("Dough Mixer").increase * genName("Dough Mixer").mult;
		
	// 	doughCheck = false;
	// }

	
}








function mainLoop() {
	var diff = (Date.now() - lastUpdate) / 1000

	productionLoop(diff)
	updateUI()
	
	lastUpdate = Date.now()
}

setInterval(mainLoop, 50)

