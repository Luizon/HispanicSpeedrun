import { RunBar } from "./POO/RunBar.js";
import { formatTime } from "./functions.js"

var runnersArray = [];
var runsDiv = null, runsDivLoading = null;
// var game.ID = null, category = null;
var leaderboard = {
	game : {
		ID : null,
	},
	category : null,
	subcategory : {
		ID : null,
		key : null,
		name : null,
		label : null,
	}
};

async function loadCategories(json) {
	let apiURL = `${SPEEDRUN_API}/games/${json.game}?embed=categories,variables`;
	await $.get(apiURL)
		.done(apiAnswer => {
			console.log(apiAnswer);
			leaderboard.game.ID = apiAnswer.data.id;
			let categories = [];
			leaderboard.category = null;
			let categoryId = null;
			apiAnswer.data.categories.data.forEach(iCategory => {
				if(iCategory.type == "per-level")
					return false;
				categories.push(iCategory);
				if(urlParams.has('categoria'))
					if(urlParams.get('categoria').toLowerCase() == iCategory.name.toLowerCase().replace(" ", "_").replace("%", "")) {
						leaderboard.category = iCategory.name;
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
			if(leaderboard.category == null) {
				leaderboard.category = categories[0].name;
				categoryId = categories[0].id;
			}
			$("#divTituloJuego").html(`${apiAnswer.data.names.international} - ${ leaderboard.category }`);
			leaderboard.category = categoryId;

			createSubcategories(apiAnswer.data.variables.data);
		})
		.fail(err => {
			console.log('error al cargar la informacion del juego');
			console.log(err);
			if(err.responseJSON)
				if(err.responseJSON.message)
					alert(err.responseJSON.message);
		});
}

function createSubcategories(variables) {
	variables.forEach(variable => {
		if(variable['is-subcategory']) {
			leaderboard.subcategory.key = variable.id;
			let subcategoryKey = Object.keys(variable.values.values)[0];
			if(urlParams.has('subcategoria'))
				for(let iSubcategoryKey in variable.values.values) {
					let iSubcategoryName = variable.values.values[iSubcategoryKey].label;
					if(urlParams.get('subcategoria').toLowerCase() == iSubcategoryName.toLowerCase().replace(" ", "_").replace("%", "")) {
						subcategoryKey = iSubcategoryKey;
					}
				}
			variable.values.values[subcategoryKey].rules; // reglas

			// terminara tomando la ultima subcategoria encontrada
			leaderboard.subcategory.ID = subcategoryKey;
			leaderboard.subcategory.label = variable.values.values[subcategoryKey].label;
			leaderboard.subcategory.name = variable.name;
		}
	});

	new RunBar({
		hPosition : "Ñ",
		globalPosition : "#",
		country : "País",
		player : "Runner",
		time : "Tiempo",
		date : "Fecha",
		subcategory : leaderboard.subcategory.name || "",
		parentNode: $("#runBarHeader")[0],
		class_ : `odd run-bar-header`,
	});
}

async function createRunBars(json) {
	let hPosition = 1;
	let apiURL = `${SPEEDRUN_API}/leaderboards/${json.game}/category/${json.category}`;
	apiURL+= "?embed=players"; // info extra para mostrar
	// apiURL+= "&top=1000"; // limite
	if(leaderboard.subcategory.key) { // subcategorias
		apiURL+= "&var-";
		apiURL+= `${leaderboard.subcategory.key}=${leaderboard.subcategory.ID}`;
	}
	await $.get(apiURL)
		.done(apiAnswer => {
			console.log(apiAnswer)
			let runs = apiAnswer.data.runs;
			let players = apiAnswer.data.players;
			runs.forEach(async (run, i) => {
				if(players.data[i].location == null) // hay runners que no tienen su pais puesto
					return false; // estos runners se omiten
				let runnersCountry = players.data[i].location.country.names.international;

				// si el pais no es hispano, no se agrega la run
				if(!Object.keys(HISPANIC_COUNTRYS).includes(runnersCountry.toLowerCase()))
					return false;
				let runnerName = players.data[i].names.international;
				runnersCountry = HISPANIC_COUNTRYS[runnersCountry.toLowerCase()]; // traduce pais a español

				runnersArray.push(new RunBar({
					hPosition : hPosition++,
					globalPosition : run.place,
					countryCode : players.data[i].location.country.code,
					country : runnersCountry,
					player : runnerName,
					url : run.run.weblink,
					comment : run.run.comment,
					time : formatTime(run.run.times.primary_t),
					date : run.run.date,
					parentNode: runsDiv,
					subcategory : leaderboard.subcategory.label || '',
					class_ : `row-${hPosition % 2 > 0 ? 'odd' : 'even'}`,
				}));
			});
			runsDiv.removeChild(runsDivLoading);
		})
		.fail(err => {
			console.log('error al cargar la leaderboard');
			runsDivLoading.innerText = 'Error al cargar la leaderboard, culpa de Luizón por no optimizar esto.';
			console.log(err);
			console.log(leaderboard.category)
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
	await loadCategories({ game : urlParams.get('juego') });
	let vars = null;
	if(leaderboard.subcategory.ID)
		vars = leaderboard.subcategory;
	createRunBars({
		game : leaderboard.game.ID,
		category : leaderboard.category
	});
}