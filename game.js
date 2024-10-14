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
		this.decreaseVals = ing.decreaseVals;
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

//Name, Total, Cap, UI ID, Increase, Decrease
let ingredientDefaultData = [
["Wheat", 500, 2000, "wheatIng"],
["Milk",0,50, "milkIng"],
["Tomatos",0, 50, "tomatosIng"],
["Flour", 300, 1000, "flourIng"],
["Water",0,100, "waterIng"],
["Dough",0,30, "doughIng", 2, [1,2], ["Flour","Water"]],
["Cheese",0,30, "cheeseIng"],
["Tomato Sauce",0, 30, "tmtSauceIng", 2, [1],["Tomatos"]]
]


function createIngredient(data) {
	const ing = {
		name: data[0],
		total: data[1],
		cap: data[2],
		uiID: data[3],
	}
	if (data.length == 7) {
		Object.assign(ing, {increase: data[4]}, {decrease: data[5]}, {decreaseVals: data[6]})
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
		this.value = gen.value;
		this.cost = gen.cost;
		this.amount = gen.amount;
		this.mult = gen.mult;
		this.prodType = gen.prodType;
	}

}

class t2Generator {
	constructor(gen) {
		this.id = gen.id;
		this.name = gen.name;
		this.value = gen.value;
		this.cost = gen.cost;
		this.amount = gen.amount;
		this.mult = gen.mult;
		this.prodType = gen.prodType;
		this.increase = gen.increase;
		this.decrease = gen.decrease;
		this.dcrsVals = gen.dcrsVals;
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

//ID, Name, Value, Cost, Amount, Mult, Production Type, Increase, Decrease
let generatorDefaultData = [
[1,"Wheat Field","Wheat", Math.pow(Math.pow(25,1), 1), 1, 2, "stnd"],
[2,"Cows","Milk", Math.pow(Math.pow(50,1), 1), 0, 1, "stnd"],
[3,"Mill","Flour", Math.pow(Math.pow(50,1), 1), 0, 1,"dcrs", 2, [1], ["Wheat"]],
[4,"Water Pump","Water", Math.pow(Math.pow(50,1), 1), 1, 10, "stnd"],
[5,"Cheese Factory","Cheese", Math.pow(Math.pow(50,1), 1), 0, 1, "dcrs", 1, [2], ["Milk"]]
]



function createGenerators(data) {
	const gen = {
		id: data[0],
		name: data[1],
		value: data[2],
		cost: data[3],
	 	amount: data[4],
		mult: data[5],
		prodType: data[6]
	}
	if (data.length == 10) {
		Object.assign(gen, {increase: data[7]}, {decrease: data[8]}, {dcrsVals: data[9]})
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
	selects[b.value].max += b.increase
	b.cost *= 1.5

	selects[b.value] = updateSelectValues(selects[b.value])
}

function buildingName(name) {
	for (let i = 0; i < buildings.length; i++)
		if (buildings[i].name == name) {
			return buildings[i]
		}
}

let buildingDefaultData = [
[1,"Vegetable Patch", Math.pow(Math.pow(50,1), 1), 0, 1, 1,0],
[2, "Kitchen", Math.pow(Math.pow(100,1), 1), 1, 1, 1 ,1]
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

var selects = []

class Select {
	constructor(slct) {
		this.title = slct.title;
		this.max = slct.max;
		this.unassigned = slct.unassigned;
		this.names = slct.names;
		this.values = slct.values;
	}

}

let selectDefaultData = [
	["Plants", 0, 0, ["Tomatos"], [0]],
	["Kitchen", 0, 0, ["Dough", "Tomato Sauce"], [0,0]]
	]
	
	function createSelect(data) {
		const ing = {
			title: data[0],
			max: data[1],
			unassigned:  data[2],
			names:  data[3],
			values:  data[4]
		}
		
		selects.push(new Select(ing))
	
	
	}
	
	
	for (let i = 0; i < selectDefaultData.length; i++) {
		createSelect(selectDefaultData[i])
	}

	console.log(selects)


const increaseButtons = document.getElementsByClassName("increaseBtn")
const decreaseButtons = document.getElementsByClassName("decreaseBtn")


for (let i = 0; i < increaseButtons.length; i++){
	let selectType = increaseButtons[i].parentNode.parentNode.id
	if (selectType == "plantSelect"){
		increaseButtons[i].addEventListener("click", () => increaseValue(increaseButtons[i].parentNode.id,0));
	}
	else if (selectType == "workerSelect") {
		increaseButtons[i].addEventListener("click", () => increaseValue(increaseButtons[i].parentNode.id,1));
	}
	
}

for (let i = 0; i < decreaseButtons.length; i++){
	let selectType = decreaseButtons[i].parentNode.parentNode.id
	if (selectType == "plantSelect"){
		decreaseButtons[i].addEventListener("click", () => decreaseValue(decreaseButtons[i].parentNode.id, 0));
	}
	else if (selectType == "workerSelect") {
		decreaseButtons[i].addEventListener("click", () => decreaseValue(decreaseButtons[i].parentNode.id, 1));
	}
}

function increaseValue(domID, slctID) {

	if (selects[slctID].unassigned == 0) {return}

	let index = domID.replace(selects[slctID].title, "")
	selects[slctID].values[index] += 1
	selects[slctID] = updateSelectValues(selects[slctID])
}
function decreaseValue(domID, slctID) {

	let index = domID.replace(selects[slctID].title, "")
	if (selects[slctID].values[index] == 0) {return}

	selects[slctID].values[index] -= 1
	selects[slctID] = updateSelectValues(selects[slctID])

}

function updateAvailable(values, max) {
	var result = max;
	for (let i = 0; i < values.length; i++) {
		result -= values[i];
	}
	return result
	
}

function updateSelectValues(slct) {
	slct.unassigned = updateAvailable(slct.values, slct.max)
	document.getElementById("available" + slct.title).textContent = "Available " + slct.title + ": " + slct.unassigned + " / " + slct.max

	for (let i = 0; i < slct.names.length; i++) {
		let id = slct.names[i] + "Select"
		document.getElementById(id).textContent = slct.names[i] + ":  " + slct.values[i]
	}

	return slct
}


for (let i = 0; i < selects.length; i++) {
	updateSelectValues(selects[i])
}

function format(amount) {
	let power = Math.floor(Math.log10(amount))
	let mantissa = amount / Math.pow(1, power)
	if (power < 3) return amount.toFixed(2)
	return mantissa.toFixed(2) + "e" + power
	
}

function updateUI() {

	document.getElementById("money").textContent = "Money: £" + format(totalmoney);

	for (let i = 0; i < ingredients.length; i++) {
		updateIngredientUI(ingredients[i])
	}


	updateContainerUI("gen", generators)
	updateContainerUI("bui", buildings)
}



function standardProduction(value, gen, diff) {
	ingName(value).total += genName(gen).amount * genName(gen).mult * diff
	ingName(value).total = clamp(ingName(value).total, 0, ingName(value).cap) 
}



function decreaseProduction(value, gen, diff, decreaseVals) {
	for (let i = 0; i < decreaseVals.length; i++) {
		if (ingName(value).total < (ingName(decreaseVals[i]).amount * genName(gen).decrease[i])){
			return
		}
	}

	for (let i = 0; i < decreaseVals.length; i++) {
		ingName(decreaseVals[i]).total -= (genName(gen).amount * genName(gen).decrease)
		ingName(decreaseVals[i]).total = clamp(ingName(decreaseVals[i]).total, 0 , ingName(decreaseVals[i]).cap)
	}

	ingName(value).total += (genName(gen).amount * genName(gen).mult * diff)
	ingName(value).total = clamp(ingName(value).total, 0, ingName(value).cap) 
	

}

function selectProduction(buil, diff){

	for (let i = 0; i < selects[buil.value].values.length; i++) {
		if (Object.keys(ingName(selects[buil.value].names[i])).length == 4){
			ingName(selects[buil.value].names[i]).total += selects[buil.value].values[i] * buil.mult * diff;
		}
		
	}

}

function productionLoop(diff){

	for (let i = 0; i < generators.length; i++) {
		
		if (generators[i].prodType == "stnd") {
			standardProduction(generators[i].value, generators[i].name, diff)
		}
		else if (generators[i].prodType == "dcrs") {
			decreaseProduction(generators[i].value, generators[i].name, diff, generators[i].dcrsVals)
		}
	}

	for (let i = 0; i < buildings.length; i++) {
		selectProduction(buildings[i], diff)
	}


	// ingName("Tomatos").total += plantValues.tomatos * buildingName("Vegetable Patch").mult * diff;

	// if (ingName("Flour").total >= (ingName("Dough").decrease[0] * kitchenValues.dough) && ingName("Water").total >= (ingName("Dough").decrease[1] * kitchenValues.dough)){
	// 	ingName("Flour").total -= ingName("Dough").decrease[0] * kitchenValues.dough
	// 	ingName("Water").total -= ingName("Dough").decrease[1] * kitchenValues.dough
	// 	doughCheck = true
	// }

	// if (doughCheck == true) {
	// 	ingName("Dough").total += kitchenValues.dough * buildingName("Kitchen").mult * diff;
	// 	ingName("Dough").total = clamp(ingName("Dough").total, 0, ingName("Dough").cap)
	// 	doughCheck = false
	// }



	
}








function mainLoop() {
	var diff = (Date.now() - lastUpdate) / 1000
	productionLoop(diff)
	updateUI()
	
	lastUpdate = Date.now()
}

setInterval(mainLoop, 50)

