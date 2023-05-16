import { RunBar } from "./POO/RunBar.js";

var runnersArray = [];
var runnersDiv = null;

function crearTarjetas() {
	runnersArray.push(new RunBar({
		nombre: "Mr. Bean",
	}));
	runnersArray.push(new RunBar({
		nombre: "Goku",
	}));
	runnersArray.push(new RunBar({
		nombre: "Chavelo",
	}));
	
	runnersArray.forEach( (runBar, i) => {
		let nodoRunBar = document.createElement("div");
		nodoRunBar.className = "text-center col p-4";
		nodoRunBar.innerHTML = runBar.innerHTML;
		
		runnersDiv.appendChild(nodoRunBar);
	});
}

window.onload = function() {
	runnersDiv = document.getElementById("divTest");
	crearTarjetas();
}