import { RunBar } from "./POO/RunBar.js";
import { formatTime } from "./functions.js"

var runnersArray = [];
var runsDiv = null, runsDivLoading = null;

async function createRunBars() {
	// runnersArray.push(new RunBar({
	// 	name: "Mr. Bean",
	// 	parentNode: runsDiv,
	// }));
	// runnersArray.push(new RunBar({
	// 	name: "Goku",
	// 	parentNode: runsDiv,
	// }));
	// runnersArray.push(new RunBar({
	// 	name: "Chavelo",
	// 	parentNode: runsDiv,
	// }));
	let newRunsDivInnerHTML = document.createElement("div");//
	let apiURL = `${speedrunAPI}/leaderboards/smo/category/any?top=100`;
	apiURL+= "&embed=players,game"; // info extra para mostrar
	apiURL+= "&var-68km3w4l=zqoyz021"; // any 1P
	await $.get(apiURL, (runsAnswer) => {
		console.log(runsAnswer)
		let runs = runsAnswer.data.runs;
		let players = runsAnswer.data.players;
		runs.forEach(async (run, i) => {
			let runnerName = players.data[i].names.international;
			let name = `${run.place} - ${runnerName} [${run.run.date}] (${formatTime(run.run.times.primary_t)})`;
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