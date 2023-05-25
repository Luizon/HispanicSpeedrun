import { RunBar } from "./POO/RunBar.js";
import { formatTime } from "./functions.js"

var runnersArray = [];
var runsDiv = null, runsDivLoading = null;
// var game.ID = null, category = null;
var leaderboard = {
	game : {
		ID : null,
	},
	category : {
		code : null,
		ID : null,
	},
	subcategory : {
		ID : null,
		key : null,
		name : null,
		label : null,
	},
	variables : {}
};

async function loadCategories(json) {
	let apiURL = `${SPEEDRUN_API}/games/${json.game}?embed=categories`;
	await $.get(apiURL)
		.done(apiAnswer => {
			console.log(apiAnswer);
			leaderboard.game.ID = apiAnswer.data.id;
			let categories = [];
			leaderboard.category.code = null;
			leaderboard.category.ID = null;
			apiAnswer.data.categories.data.forEach(iCategory => {
				if(iCategory.type == "per-level")
					return false;
				categories.push(iCategory);
				if(urlParams.has('categoria'))
					if(urlParams.get('categoria').toLowerCase() == iCategory.name.toLowerCase().replace(/ /g, "_").replace(/%/g, "")) {
						leaderboard.category.code = iCategory.name;
						leaderboard.category.ID = iCategory.id;
					}
				
				let categoryNode = document.createElement("a");
				categoryNode.innerHTML = iCategory.name;
				categoryNode.classList.add("btn", "btn-dark", "me-2", "mb-2");
				categoryNode.href = `${hostname}/leaderboard?juego=${json.game}&categoria=${iCategory.name.replace(/ /g, "_").replace(/%/g, "")}`;
				let elmentListNode = document.createElement("li");
				elmentListNode.appendChild(categoryNode);
				$("#categories").append(elmentListNode);
			});
			if(leaderboard.category.code == null) {
				leaderboard.category.code = categories[0].name;
				leaderboard.category.ID = categories[0].id;
			}
			$("#divTituloJuego").html(`${apiAnswer.data.names.international} - ${ leaderboard.category.code }`);
		})
		.fail(err => {
			console.log('error al cargar la informacion del juego');
			console.log(err);
			if(err.responseJSON)
				if(err.responseJSON.message)
					alert(err.responseJSON.message);
		});
}

async function createSubcategories(categoryID) {
	let apiURL = `${SPEEDRUN_API}/categories/${categoryID}/variables`;
	await $.get(apiURL)
		.done(apiAnswer => {
			let variables = apiAnswer.data
			console.log(apiAnswer);
			variables.forEach(variable => {
				// en teoria ya carga solo las variables buenas, no se necesita checar el scope
				if(variable['is-subcategory']) { // && ['full-game', 'global'].includes(variable.scope.type.toLowerCase())
					leaderboard.subcategory.key = variable.id;
					leaderboard.subcategory.name = variable.name;
					let subcategoryKey = Object.keys(variable.values.values)[0];
					for(let iSubcategoryKey in variable.values.values) {
						let iSubcategoryName = variable.values.values[iSubcategoryKey].label;
						if(urlParams.has('subcategoria'))
							if(urlParams.get('subcategoria').toLowerCase() == iSubcategoryName.toLowerCase().replace(/ /g, "_").replace(/%/g, "")) {
								subcategoryKey = iSubcategoryKey;
							}
		
						let subcategoryNode = document.createElement("a");
						subcategoryNode.innerHTML = iSubcategoryName;
						subcategoryNode.classList.add("btn", "btn-dark", "mb-2");
						let category = leaderboard.category.code.replace(/ /g, "_").replace(/%/g, "");
						iSubcategoryName = iSubcategoryName.replace(/ /g, "_").replace(/%/g, "");
						subcategoryNode.href = `${hostname}/leaderboard?juego=${urlParams.get('juego')}&categoria=${category}&subcategoria=${iSubcategoryName}`;
						let elmentListNode = document.createElement("li");
						elmentListNode.appendChild(subcategoryNode);
						$("#subcategories").append(elmentListNode);
					}
					variable.values.values[subcategoryKey].rules; // reglas
		
					// terminara tomando la ultima subcategoria encontrada
					leaderboard.subcategory.ID = subcategoryKey;
					leaderboard.subcategory.label = variable.values.values[subcategoryKey].label;
				}
				else {
					leaderboard.variables[variable.id] = {};
					leaderboard.variables[variable.id].name = variable.name;
					for(let iSubcategoryKey in variable.values.values) {
						let variableLabel = variable.values.values[iSubcategoryKey].label;
						leaderboard.variables[variable.id][iSubcategoryKey] = variableLabel;
					}
				}
			});
		})
		.fail(err => {
			console.log('error al cargar las subcategorias del juego');
			console.log(err);
			if(err.responseJSON)
				if(err.responseJSON.message)
					alert(err.responseJSON.message);
		});
	
	console.log(leaderboard.variables)
	let variables = "";
	for(let iVariable in leaderboard.variables) {
		variables+= `${leaderboard.variables[iVariable].name}, `;
	}
	if(variables)
		variables = variables.substring(0, variables.length - 2); // quita el ", " del final

	new RunBar({
		hPosition : "Ñ",
		globalPosition : "#",
		country : "País",
		player : "Runner",
		time : "Tiempo",
		date : "Fecha",
		subcategory : variables || leaderboard.subcategory.name || "",
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

				let variables = "";
				for(let iVariable in run.run.values)
					if(leaderboard.variables[iVariable])
						variables+= `${leaderboard.variables[iVariable][run.run.values[iVariable]]}, `;
				if(variables)
					variables = variables.substring(0, variables.length - 2); // quita el ", " del final

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
					subcategory : variables || leaderboard.subcategory.label || '',
					class_ : `row-${hPosition % 2 > 0 ? 'odd' : 'even'}`,
				}));
			});
			runsDiv.removeChild(runsDivLoading);

			document.title = `${$("#divTituloJuego").html()} - ${leaderboard.subcategory.label}`;
		})
		.fail(err => {
			console.log('error al cargar la leaderboard');
			runsDivLoading.innerText = 'Error al cargar la leaderboard, culpa de Luizón por no optimizar esto.';
			console.log(err);
			console.log(leaderboard.category.ID)
			if(err.responseJSON)
				if(err.responseJSON.message)
					alert(err.responseJSON.message);
		});
}

window.onload = async function() {
	if(!urlParams.has('juego'))
		window.location.href = "../";
	document.title = `${urlParams.get('juego')} | Cargando informacion`;
	runsDiv = document.getElementById("divRunBars");
	runsDivLoading = document.getElementById("divRunBarsLoading");
	await loadCategories({ game : urlParams.get('juego') });
	await createSubcategories( leaderboard.category.ID );
	let vars = null;
	if(leaderboard.subcategory.ID)
		vars = leaderboard.subcategory;
	createRunBars({
		game : leaderboard.game.ID,
		category : leaderboard.category.ID
	});
}