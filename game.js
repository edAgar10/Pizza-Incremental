const gen1 = document.getElementById("gen1")

var totalmoney = 150
var generators = []
var lastUpdate = Date.now()

let generator = {
	cost: Math.pow(Math.pow(50,1), 1),
	bought: 0,
	amount: 0, 
	mult: 1
}

generators.push(generator)

const button1 = document.getElementById("button1")
button1.addEventListener("click",  () => buyGenerator(1));

function format(amount) {
	let power = Math.floor(Math.log10(amount))
	let mantissa = amount / Math.pow(10, power)
	if (power < 3) return amount.toFixed(2)
	return mantissa.toFixed(2) + "e" + power
	
}


function updateUI() {
	document.getElementById("money").textContent = "Money: £" + format(totalmoney);
	gen1.innerHTML = "Amount: " + generator.amount + "<br>Cost: " + format(generator.cost);
}

function productionLoop(diff){
	totalmoney += generator.amount * generator.mult * diff
	
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



function mainLoop() {
	var diff = (Date.now() - lastUpdate) / 1000

	productionLoop(diff)
	updateUI()
	
	lastUpdate = Date.now()
}

setInterval(mainLoop, 50)

