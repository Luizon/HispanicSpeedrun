import { RunBar } from "./POO/RunBar.js";
import { formatTime } from "./functions.js"

var runnersArray = [];
var runsDiv = null, runsDivLoading = null;
var gameId = null, category = null;

async function loadCategories(json) {
	let apiURL = `${SPEEDRUN_API}/games/${json.game}?embed=categories`;
	await $.get(apiURL)
		.done(apiAnswer => {
			console.log(apiAnswer);
			gameId = apiAnswer.data.id;
			let categories = [];
			category = null;
			let categoryId = null;
			apiAnswer.data.categories.data.forEach(iCategory => {
				if(iCategory.type == "per-level")
					return false;
				categories.push(iCategory);
				if(urlParams.has('categoria'))
					if(urlParams.get('categoria').toLowerCase() == iCategory.name.toLowerCase().replace(" ", "_").replace("%", "")) {
						category = iCategory.name;
						categoryId = iCategory.id;
					}
				
				let categoryNode = document.createElement("a");
				categoryNode.innerHTML = iCategory.name;
				categoryNode.classList.add("btn", "btn-dark", "me-2", "mb-2");
				categoryNode.href = `${hostname}/leaderboard?juego=${json.game}&categoria=${iCategory.name.replace(" ", "_").replace("%", "")}`;
				let elmentListNode = document.createElement("li");
				elmentListNode.appendChild(categoryNode);
				$("#categories").append(elmentListNode);
			});
			if(category == null) {
				category = categories[0].name;
				categoryId = categories[0].id;
			}
			$("#divTituloJuego").html(`${apiAnswer.data.names.international} - ${ category }`);
			category = categoryId;
		})
		.fail(err => {
			console.log('error al cargar la informacion del juego');
			console.log(err);
			if(err.responseJSON)
				if(err.responseJSON.message)
					alert(err.responseJSON.message);
		});
}

async function createRunBars(json) {
	let hPosition = 1;
	let apiURL = `${SPEEDRUN_API}/leaderboards/${json.game}/category/${json.category}`;
	apiURL+= "?embed=players"; // info extra para mostrar
	if(json.var) {
		apiURL+= "&var-";
		for(let key in json.var)
			apiURL+= `${key}=${json.var[key]},`; // any 1P
		apiURL = apiURL.substring(0, apiURL.length - 1);
	}
	await $.get(apiURL)
		.done(apiAnswer => {
			console.log(apiAnswer)
			let runs = apiAnswer.data.runs;
			let players = apiAnswer.data.players;
			runs.forEach(async (run, i) => {
				if(players.data[i].location == null) // hay runners que no tienen su pais puesto
					return false;
				let runnersCountry = players.data[i].location.country.names.international;

				// si el pais no es hispano, no se agrega la run
				if(!Object.keys(HISPANIC_COUNTRYS).includes(runnersCountry.toLowerCase()))
					return false;
				let runnerName = players.data[i].names.international;
				runnersCountry = HISPANIC_COUNTRYS[runnersCountry.toLowerCase()]; // traduce pais a español
				// let name = `(Ñ: ${} Global: ${}) - ${runnerName} de ${}<br>[${}] (${})`;
				runnersArray.push(new RunBar({
					hPosition : hPosition++,
					globalPosition : run.place,
					country : runnersCountry,
					player : runnerName,
					url : run.run.weblink,
					comment : run.run.comment,
					time : formatTime(run.run.times.primary_t),
					date : run.run.date,
					parentNode: runsDiv,
					class_ : `row-${hPosition % 2 > 0 ? 'odd' : 'even'}`,
				}));
			});
			runsDiv.removeChild(runsDivLoading);
		})
		.fail(err => {
			console.log('error al cargar la leaderboard');
			runsDivLoading.innerText = 'Error al cargar la leaderboard, culpa de Luizón por no optimizar esto.';
			console.log(err);
			console.log(category)
			if(err.responseJSON)
				if(err.responseJSON.message)
					alert(err.responseJSON.message);
		});
}

window.onload = async function() {
	if(!urlParams.has('juego'))
		window.location.href = "../";
	runsDiv = document.getElementById("divRunBars");
	runsDivLoading = document.getElementById("divRunBarsLoading");
	new RunBar({
		hPosition : "Ñ",
		globalPosition : "#",
		country : "País",
		player : "Runner",
		time : "Tiempo",
		date : "Fecha",
		parentNode: $("#runBarHeader")[0],
		class_ : `odd run-bar-header`,
	});
	await loadCategories({ game : urlParams.get('juego') });
	createRunBars({
		game : gameId,
		category : category,
		var : {
			"68km3w4l" : "zqoyz021",
		},
	});
}