import { RunBar } from "./POO/RunBar.js";
import { formatTime } from "./functions.js"

var runnersArray = [];
var runsDiv = null, runsDivLoading = null;

async function createRunBars() {
	let newRunsDivInnerHTML = document.createElement("div");//
	let apiURL = `${SPEEDRUN_API}/leaderboards/smo/category/any`;
	apiURL+= "?embed=players,game"; // info extra para mostrar
	apiURL+= "&var-68km3w4l=zqoyz021"; // any 1P
	await $.get(apiURL, (runsAnswer) => {
		console.log(runsAnswer)
		let runs = runsAnswer.data.runs;
		let players = runsAnswer.data.players;
		let hPosition = 1;
		runs.forEach(async (run, i) => {
			if(players.data[i].location == null) // hay runners que no tienen su pais puesto
				return false;
			let runnersCountry = players.data[i].location.country.names.international;

			// si el pais no es hispano, no se agrega la run
			if(!Object.keys(HISPANIC_COUNTRYS).includes(runnersCountry.toLowerCase()))
				return false;
			let runnerName = players.data[i].names.international;
			runnersCountry = HISPANIC_COUNTRYS[runnersCountry.toLowerCase()]; // traduce pais a español
			let name = `(Ñ: ${hPosition++} Global: ${run.place}) - ${runnerName} de ${runnersCountry}<br>[${run.run.date}] (${formatTime(run.run.times.primary_t)})`;
			runnersArray.push(new RunBar({
				name: name,
				parentNode: newRunsDivInnerHTML,
			}));
		});
	});
	runsDiv.removeChild(runsDivLoading);
	runsDiv.appendChild(newRunsDivInnerHTML);
}

window.onload = function() {
	runsDiv = document.getElementById("divTest");
	runsDivLoading = document.getElementById("divTestLoading");
	createRunBars();
}