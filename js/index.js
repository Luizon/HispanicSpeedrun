import { RunBar } from "./POO/RunBar.js";

var runnersArray = [];
var runnersDiv = null;

function crearTarjetas() {
	runnersArray.push(new RunBar({
		nombre: "Mr. Bean",
		parentNode: runnersDiv,
	}));
	runnersArray.push(new RunBar({
		nombre: "Goku",
		parentNode: runnersDiv,
	}));
	runnersArray.push(new RunBar({
		nombre: "Chavelo",
		parentNode: runnersDiv,
	}));
	
	// runnersArray.forEach( (runBar, i) => {
	// 	let nodoRunBar = document.createElement("div");
	// 	nodoRunBar.innerHTML = runBar.innerHTML;
		
	// 	runnersDiv.appendChild(nodoRunBar);
	// });
}

window.onload = function() {
	runnersDiv = document.getElementById("divTest");
	crearTarjetas();
}