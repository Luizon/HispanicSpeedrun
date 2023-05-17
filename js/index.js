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
	let newRunsDivInnerHTML = document.createElement("div");
	await $.get(`${speedrunAPI}/leaderboards/76r55vd8/category/w20w1lzd?top=10`, (runsAnswer) => {
		let runs = runsAnswer.data.runs;
		console.log(runs)
		runs.forEach(async run => {
			let runnerName = "sinNombre";
			await $.get(`${speedrunAPI}/users/${run.run.players[0].id}`, runnerAnswer => {
				runnerName = runnerAnswer.data.names.international;
			});
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