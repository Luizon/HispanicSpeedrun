import { RunBar } from "./POO/RunBar.js";
import { formatTime } from "./functions.js"

var runnersArray = [];
var runsDiv = null, runsDivLoading = null;
var leaderboard = {
	game : {
		ID : null,
	},
	category : {
		ID : null,
		name : null,
	},
	subcategory : {
		ID : null,
		key : null,
		name : null,
		label : null,
	},
	variables : {},
	runners : {}
};
var startedAt = null;
var finished = false;

async function luizonShouldOptimizeThisWebPage() {
	while(!finished) {//!finished) {
		await sleep(333);
		if((new Date() - startedAt.getTime()) / 1000 > 10 && $("#loadingLeaderboardText").html().length == 0)
			$("#loadingLeaderboardText").html("Speedrun.com está demorándose en contestar, por favor espere.");
	}
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}
  
async function loadCategories(json) {
	let apiURL = `${SPEEDRUN_API}/games/${json.game}?embed=categories`;
	await $.get(apiURL)
		.done(apiAnswer => {
			console.log(apiAnswer);
			$("html").get(0).style.backgroundImage = `url('${apiAnswer.data.assets["cover-small"].uri}')`; // background
			if($("#divDiscord")[0].href.length == 0) {
				$("#divDiscord")[0].href = apiAnswer.data.discord;
				$("#divDiscord")[0].title = `Comunidad angloparlante de ${apiAnswer.data.names.international}`;
			}
			leaderboard.game.ID = apiAnswer.data.id;
			let categories = [];
			leaderboard.category.name = null;
			leaderboard.category.ID = null;
			$("#categories").html("");
			apiAnswer.data.categories.data.forEach((iCategory, i) => {
				if(iCategory.type == "per-level")
					return false;
				categories.push(iCategory);
				let categoryNode = document.createElement("a");
				categoryNode.innerHTML = iCategory.name;
				categoryNode.classList.add("btn", "btn-secondary", "me-2", "mb-2");
				categoryNode.id = "btnCa"+i;
				categoryNode.href = `../leaderboard?juego=${json.game}&categoria=${iCategory.name.replace(/ /g, "_").replace(/%/g, "")}`;
				if(urlParams.has('categoria'))
					if(urlParams.get('categoria').toLowerCase() == iCategory.name.toLowerCase().replace(/ /g, "_").replace(/%/g, "")) {
						leaderboard.category.name = iCategory.name;
						leaderboard.category.ID = iCategory.id;
						categoryNode.classList.add("btn-active");
					}
				
				let elmentListNode = document.createElement("li");
				elmentListNode.appendChild(categoryNode);
				$("#categories").append(elmentListNode);
			});
			if(leaderboard.category.name == null) {
				leaderboard.category.name = categories[0].name;
				leaderboard.category.ID = categories[0].id;
				$("#btnCa0").addClass("btn-active");
			}
			$("#divGameTitle").html(`${apiAnswer.data.names.international} - ${ leaderboard.category.name }`);
		})
		.fail(err => {
			finished = true;
			$("#loadingLeaderboardText").html('Ocurrió un error al intentar cargar la información del juego.');
			$("#loadingLeaderboard").remove();
			$("#subcategories").remove();
			$("#categories").remove();
			$("#divGameTitle").remove();
			$(".loading-leaderboard-img").remove();
			console.log('error al cargar la info del juego');
			console.log(err);
			if(err.responseJSON)
				if(err.responseJSON.message) {
					// alert(err.responseJSON.message);
					$("#loadingLeaderboardText").html($("#loadingLeaderboardText").html()
						+ "<br><br><h6 style='text-align: left;font-weight: normal;'>Respuesta de speedrun.com:"
						+ `<br>${err.responseJSON.message}</h6>`
					);
				}
	});
}

async function createSubcategories(categoryID) {
	let apiURL = `${SPEEDRUN_API}/categories/${categoryID}/variables`;
	await $.get(apiURL)
		.done(apiAnswer => {
			let variables = apiAnswer.data
			console.log(apiAnswer);
			let hasSubcategories = false;
			variables.forEach(variable => {
				// en teoria ya carga solo las variables buenas, no se necesita checar el scope
				let i = 0;
				if(variable['is-subcategory']) { // && ['full-game', 'global'].includes(variable.scope.type.toLowerCase())
					hasSubcategories = true;
					leaderboard.subcategory.key = variable.id;
					leaderboard.subcategory.name = variable.name;
					let subcategoryKey = Object.keys(variable.values.values)[0];
					for(let iSubcategoryKey in variable.values.values) {
						let iSubcategoryName = variable.values.values[iSubcategoryKey].label;
						let subcategoryNode = document.createElement("a");
						subcategoryNode.innerHTML = iSubcategoryName;
						subcategoryNode.classList.add("btn", "btn-secondary", "mb-2");
						subcategoryNode.id = "btnSubCa" + i++;
						if(urlParams.has('subcategoria'))
							if(urlParams.get('subcategoria').toLowerCase() == iSubcategoryName.toLowerCase().replace(/ /g, "_").replace(/%/g, "")) {
								subcategoryKey = iSubcategoryKey;
								subcategoryNode.classList.add("btn-active");
							}
		
						let category = leaderboard.category.name.replace(/ /g, "_").replace(/%/g, "");
						iSubcategoryName = iSubcategoryName.replace(/ /g, "_").replace(/%/g, "");
						subcategoryNode.href = `../leaderboard?juego=${urlParams.get('juego')}&categoria=${category}&subcategoria=${iSubcategoryName}`;
						let elmentListNode = document.createElement("li");
						elmentListNode.appendChild(subcategoryNode);
						$("#subcategories").append(elmentListNode);
					}
					variable.values.values[subcategoryKey].rules; // reglas
		
					if(subcategoryKey == Object.keys(variable.values.values)[0])
						$("#btnSubCa0")[0].classList.add("btn-active");
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
			$("#subcategories div").remove(); // remueve del documento al div de "cargando subcategorias"
			if(!hasSubcategories) {
				let subcategoryTextNode = document.createElement('p');
				subcategoryTextNode.innerHTML = `<strong>${leaderboard.category.name}</strong> no tiene subcategorías.`
				$("#subcategories").append(subcategoryTextNode);
			}
		})
		.fail(err => {
			finished = true;
			$("#loadingLeaderboardText").html('Ocurrió un error al intentar cargar las subcategorías del juego.');
			$("#loadingLeaderboard").remove();
			$("#subcategories").remove();
			$(".loading-leaderboard-img").remove();
			console.log('error al cargar las subcategorias del juego');
			console.log(err);
			if(err.responseJSON)
				if(err.responseJSON.message) {
					// alert(err.responseJSON.message);
					$("#loadingLeaderboardText").html($("#loadingLeaderboardText").html()
						+ "<br><br><h6 style='text-align: left;font-weight: normal;'>Respuesta de speedrun.com:"
						+ `<br>${err.responseJSON.message}</h6>`
					);
				}
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
	if(urlParams.has("top"))
		apiURL+= "&top=" + urlParams.get("top"); // limite
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
			if(runnersArray.length > 0)
				runsDiv.removeChild(runsDivLoading);
			else {
				$("#loadingLeaderboardText").text(`Por ahora no hay ninguna run hispana en esta sección.`);
				$("#loadingLeaderboard").remove();
				$(".loading-leaderboard-img").remove();
			}

			document.title = `${$("#divGameTitle").html()} - ${leaderboard.subcategory.label}`;
			finished = true;
		})
		.fail(err => {
			finished = true;
			console.log('error al cargar la leaderboard');
			$("#loadingLeaderboardText").text('Error al cargar la leaderboard, culpa de Luizón.');
			$("#loadingLeaderboard").remove();
			$(".loading-leaderboard-img").remove();
			console.log(err);
			console.log(leaderboard.category.ID)
			if(err.responseJSON) {
				if(err.responseJSON.message) {
					// alert(err.responseJSON.message);
					$("#loadingLeaderboardText").html($("#loadingLeaderboardText").html()
						+ "<br><br><h6 style='text-align: left;font-weight: normal;'>Respuesta de speedrun.com:"
						+ `<br>${err.responseJSON.message}</h6>`
					);
				}
			}
			else {
				let game = urlParams.get("juego");
				let category = leaderboard.category.name;
				let subcategory = leaderboard.subcategory.label || null;
				let newParams = `?juego=${game}&categoria=${category}`;
				if(subcategory)
					newParams+= `&subcategoria=${subcategory}`;
				if(urlParams.has("top"))
					newParams+= `&top=${urlParams.get("top") / 2}`;
				else
					newParams+= `&top=2000`;
					
				$("#loadingLeaderboardText").html($("#loadingLeaderboardText").html()
					+ "<br><br><h6 style='text-align: left;font-weight: normal;'>Prueba recargando la página."
					+ "<br>En ocasiones speedrun.com tarda demasiado en cargar y aparece este error.</h6>"
					+ `<br><br>Si el problema persiste <a href="../leaderboard/${newParams}" class="hyperlink dark">intenta cargar menos información en este link.</a>`
				);
			}
	});
}

window.onload = async function() {
	if(!urlParams.has('juego'))
		window.location.href = "../";
	startedAt = new Date();
	luizonShouldOptimizeThisWebPage();
	if(urlParams.get("juego").toLowerCase() == 'sm64') {
		$("#divDiscord")[0].href = "https://discord.gg/2Vx5DeJvQP";
		$("#divDiscord")[0].title = "Comunidad Ñ del Mario 64";
	}
	else if(urlParams.get("juego").toLowerCase() == 'smo') {
		$("#divDiscord")[0].href = "https://discord.gg/HkRAgg7cNy";
		$("#divDiscord")[0].title = "Gruta del runner";
	}
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