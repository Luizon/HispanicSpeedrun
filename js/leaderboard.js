import { RunBar } from "./POO/RunBar.js";
import { formatTime, log } from "./functions.js"

var runnersArray = []; // se usa solo en la funcion "legacy" de createRunBars con API v1
var hPosition = 1;
// var runsArray = []; // array de runs (para cargar con api v2)
// var playersArray = []; // array de jugadores (para cargar con api v2)
var runsDiv = null, runsDivLoading = null;
var leaderboard = {
	game : {
		ID : null,
	},
	category : {
		ID : null,
		name : null,
	},
	levelId : null,
	subcategories : [],
	variables : {},
	runners : {}
};
var startedAt = null;
var finished = false;

async function luizonShouldOptimizeThisWebPage() {
	while(!finished) {
		await sleep(333);
		if($("#loadingLeaderboardText") > 0)
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
			log(apiAnswer);
			$("html").get(0).style.backgroundImage = `url('${apiAnswer.data.assets["cover-small"].uri.replace("gameasset", "static/game")}')`; // background
			$(".discord-leaderboard")[0].hidden = false;
			if($("#divDiscord")[0].href.length == 0) {
				if(apiAnswer.data.discord) {
					$("#divDiscord")[0].href = apiAnswer.data.discord;
					$("#divDiscord")[0].title = `Comunidad angloparlante de ${apiAnswer.data.names.international}`;
					activateTooltip($("#divDiscord")[0]);
				}
				else
					$(".discord-leaderboard").remove();
			}
			$("#btnMisc")[0].title = `Ver categorías secundarias`;
			activateTooltip($("#btnMisc")[0]);

			const btnMiscClickFunction = (e) => {
				$("#btnMisc").tooltip("dispose");
				if(!$("#misc_categories")[0].hidden) {
					$("#btnMisc")[0].title = `Ver categorías secundarias`;
					$("#btnMisc img")[0].src = "../img/open.svg";
				}
				else {
					$("#btnMisc")[0].title = `Minimizar`;
					$("#btnMisc img")[0].src = "../img/hide.svg";
				}
				activateTooltip($("#btnMisc")[0]);
				$("#misc_categories_description")[0].hidden = !$("#misc_categories_description")[0].hidden;
				$("#misc_categories")[0].hidden = !$("#misc_categories")[0].hidden;
			};

			$("#btnMisc").click( btnMiscClickFunction );
			
			if(apiAnswer.data.assets["trophy-1st"])
				topImg[1] = apiAnswer.data.assets["trophy-1st"].uri;
			if(apiAnswer.data.assets["trophy-2nd"])
				topImg[2] = apiAnswer.data.assets["trophy-2nd"].uri;
			if(apiAnswer.data.assets["trophy-3rd"])
				topImg[3] = apiAnswer.data.assets["trophy-3rd"].uri;
			if(apiAnswer.data.assets["trophy-4th"])
				topImg[4] = apiAnswer.data.assets["trophy-4th"].uri;
			for(let i=1; i <= 4; i++)
				if(topImg[i])
					topImg[i] = topImg[i].replace("themeasset", "static/theme");
			leaderboard.game.ID = apiAnswer.data.id;
			let categories = [];
			leaderboard.category.name = null;
			leaderboard.category.ID = null;
			$("#categories").html("");
			let idCounter = 0;
			apiAnswer.data.categories.data.forEach((iCategory) => {
				// let url = `../leaderboard/index.html?juego=${json.game}&categoria=${iCategory.name.replace(/ /g, "_").replace(/[%+]/g, "")}`;
				let url = `../leaderboard/?juego=${json.game}&categoria=${iCategory.name.replace(/ /g, "_").replace(/[%+]/g, "")}`;
				if(!urlParams.get('nivel')) {
					if(iCategory.type == "per-level") {
						return false; // only shows full game categories
					}
				}
				if(urlParams.get('nivel')) {
					if(iCategory.type != "per-level") {
						if($(`#levelSelect > optgroup > [text = "${urlParams.get('nivel').replace(/ /g, "_").replace(/[%+]/g, "")}"]`)) {
							return false; // only shows per-level categories
						}
					}
					url+=`&nivel=${urlParams.get('nivel')}`;
				}
				let categoryNode = document.createElement("a");
				categoryNode.innerHTML = iCategory.name;
				categoryNode.href = `javascript:redirectTo("${url}", getSubcategories());`;
				categoryNode.classList.add("btn", "btn-secondary", "me-2", "mb-2");
				categoryNode.id = "btnCa" + idCounter++;
				categories.push(iCategory);
				if(urlParams.has('categoria')) {
					if(urlParams.get('categoria').toLowerCase() == iCategory.name.toLowerCase().replace(/ /g, "_").replace(/[%+]/g, "")) {
						leaderboard.category.name = iCategory.name;
						leaderboard.category.ID = iCategory.id;
						categoryNode.classList.add("btn-active");
						if(iCategory.miscellaneous)
							btnMiscClickFunction();
					}
				}
				
				let elmentListNode = document.createElement("li");
				elmentListNode.appendChild(categoryNode);
				if(iCategory.miscellaneous)
					$("#misc_categories").append(elmentListNode);
				else
					$("#categories").append(elmentListNode);
			});
			if(leaderboard.category.name == null) {
				leaderboard.category.name = categories[0].name;
				leaderboard.category.ID = categories[0].id;
				$("#btnCa0").addClass("btn-active");
			}

			$("#divGameTitle").html(`${apiAnswer.data.names.international} (${ leaderboard.category.name })`);
			if($("#misc_categories").children().length > 0)
				$("#misc_categories_parent")[0].hidden = false;
		})
		.fail(err => {
			finished = true;
			errorLoadingRuns('Ocurrió un error al intentar cargar la información del juego.');
			$("#subcategories").remove();
			$("#categories").remove();
			$("#divGameTitle").remove();
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

async function loadLevels(gameID) {
	const apiURL = `${SPEEDRUN_API}/games/${gameID}/levels`;
	let levelSelect = document.createElement("select");
	levelSelect.classList.add("cursor-pointer", "form-select", "bg-secondary", "text-light", "border-0");
	levelSelect.innerHTML = `<option value="todo">Juego completo</option>`;
	levelSelect.id = "levelSelect";
	let optgroup = document.createElement("optgroup");
	optgroup.label = "-- Niveles individuales --";
	levelSelect.appendChild(optgroup);
	
	await $.get(apiURL)
		.done(apiAnswer => {
			if(apiAnswer.data.length === 0) return;

			
			apiAnswer.data.forEach(level => {
				let option = document.createElement("option");
				option.value = level.id;
				option.textContent = level.name;
				optgroup.appendChild(option);

				if((urlParams.get('nivel') || '').toLowerCase() == level.name.toLowerCase().replace(/ /g, "_").replace(/[%+]/g, "")) {
					leaderboard.levelId = level.id;
					levelSelect.value = level.id;
				}
			});

			levelSelect.addEventListener("change", () => {
				let url = "";
				if(levelSelect.value == "todo") {
					url = `../leaderboard/?juego=${urlParams.get('juego')}`;
					// url = `../leaderboard/index.html?juego=${urlParams.get('juego')}`;
				}
				else {
					const selectedLevel = optgroup.querySelector(`[value='${levelSelect.value}']`)
					.text.toLowerCase().replace(/ /g, "_").replace(/[%+]/g, "");
					url = `../leaderboard/?juego=${urlParams.get('juego')}&nivel=${selectedLevel}`;
					// url = `../leaderboard/index.html?juego=${urlParams.get('juego')}&nivel=${selectedLevel}`;
					if(urlParams.get('categoria'))
						url += "&categoria=" + urlParams.get('categoria');
					if(urlParams.get('subcategorias'))
						url += "&subcategorias=" + urlParams.get('subcategorias');
					}
				redirectTo(url);
			});

			let selectContainer = document.createElement("div");
			selectContainer.id = "levelSelectorContainer";
			selectContainer.classList.add("ps-0", "ms-3", "pt-3");
			selectContainer.appendChild(levelSelect);

			$("#categories").before(selectContainer);
		})
		.fail(err => {
			console.log("Error al cargar los niveles:");
			console.log(err);
		});
}


function errorLoadingRuns(message) {
	$("#loadingLeaderboard").remove();
	$(".loading-leaderboard-img").remove();
	$("#loadingLeaderboardText").html(message);
}

async function loadSubcategories(categoryID) {
	const apiURL = `${SPEEDRUN_API}/categories/${categoryID}/variables`;
	await $.get(apiURL)
		.done(apiAnswer => {
			let variables = apiAnswer.data
			// log(log(apiAnswer);
			let hasSubcategories = false;
			let numberOfSubcategories = 0;
			variables.forEach(variable => {
				log(variable.name);
				if(variable.name.toLowerCase().includes("(test)"))
					return false;
				let i = 0;
				if(variable['is-subcategory']) {
					if(variable['scope'])
						// idk why does "global" work correctly in some leaderboards, it does tho
						if(!["global", "full-game"].includes(variable['scope'].type))
							return;
					numberOfSubcategories++;
					// log(log(variable);
					hasSubcategories = true;
					const newSubcategory = {
						key : variable.id,
						name : variable.name
					}
					let subcategoryKey = Object.keys(variable.values.values)[0];
					let subcategoryLabel = "";

					const category = leaderboard.category.name.replace(/ /g, "_").replace(/[%+]/g, "");
					let url = `../leaderboard/?juego=${urlParams.get('juego')}&categoria=${category}`;
					// let url = `../leaderboard/index.html?juego=${urlParams.get('juego')}&categoria=${category}`;
					if(urlParams.get('nivel')) {
						if($(`#levelSelect > optgroup > [text = "${urlParams.get('nivel').replace(/ /g, "_").replace(/[%+]/g, "")}"]`)) {
							url+=`&nivel=${urlParams.get('nivel')}`;
						}
					}

					const divNewSubcategory = document.createElement("div");
					divNewSubcategory.classList.add("d-flex", "flex-column");

					const titleNode = document.createElement("span");
					titleNode.innerText = variable.name;
					titleNode.classList.add("text-start", "small","text-light");
					$(divNewSubcategory).append(titleNode);

					const btnGroupNode = document.createElement("div");
					btnGroupNode.classList.add("btn-group");
					btnGroupNode.role = "group";
					// commented, because now we're working with a <select> for subcategories. btnGroupNode is conserved because of legacy
					// $(divNewSubcategory).append(btnGroupNode);

					// Crear el select dinámicamente
					const selectGroupNode = document.createElement("select");
					selectGroupNode.classList.add("cursor-pointer", "form-select", "bg-secondary", "text-light", "border-0");
					$(divNewSubcategory).append(selectGroupNode);
					$(divNewSubcategory).change((e) => {
						redirectTo(url, getSubcategories({"name":variable.name.replace(/ /g, "_").replace(/[%+]/g, ""), "label":e.target.value.replace(/ /g, "_").replace(/[%+]/g, "")}));
					});

					for(let iSubcategoryKey in variable.values.values) {
						let iSubcategoryLabel = variable.values.values[iSubcategoryKey].label;
						const iSubcategoryName = variable.name.toLowerCase().replace(/ /g, "_").replace(/[%+]/g, "");
						const subcategoryNode = document.createElement("button");
						subcategoryNode.type = "button";
						subcategoryNode.innerText = iSubcategoryLabel;
						subcategoryNode.classList.add("btn", "btn-secondary");
						subcategoryNode.id = `btnSubCa_${numberOfSubcategories}_${i}`;
						iSubcategoryLabel = iSubcategoryLabel.replace(/ /g, "_").replace(/[%+]/g, "");
						if(urlParams.has('subcategorias')) {
							const subcategories = urlParams.get('subcategorias').toLowerCase().split(",");
							subcategories.forEach( subcategory => {
								subcategory = subcategory.split("@");
								if(subcategory[0] == iSubcategoryName && subcategory[1] == iSubcategoryLabel.toLowerCase()) {
									// log(log(subcategory);
									subcategoryKey = iSubcategoryKey;
									subcategoryNode.classList.add("active");
									subcategoryLabel = iSubcategoryLabel;
								}
							});
						}
		
						$(subcategoryNode).click((e) => {
							redirectTo(url, getSubcategories({"name":variable.name.replace(/ /g, "_").replace(/[%+]/g, ""), "label":iSubcategoryLabel.replace(/ /g, "_").replace(/[%+]/g, "")}));
						});
						btnGroupNode.append(subcategoryNode);

						const option = document.createElement("option");
						option.textContent = iSubcategoryLabel;
						option.value = iSubcategoryLabel;
						// option.classList.add("");
						selectGroupNode.appendChild(option);
						if(subcategoryKey === iSubcategoryKey)
							option.selected = true;

						i++;
					}

					if(btnGroupNode.offsetWidth > 200) {
						selectGroupNode.hidden = false;
						btnGroupNode.hidden = true;
					}
					$("#subcategories").append(divNewSubcategory);

					if(subcategoryKey == Object.keys(variable.values.values)[0]) {
						// $(`#btnSubCa_${numberOfSubcategories}_0`)[0].classList.add("active");
						subcategoryLabel = variable.values.values[Object.keys(variable.values.values)[0]].label;
					}

					if(subcategoriesString.length > 0)
						subcategoriesString+= ",";
					subcategoriesString+= variable.name.replace(/ /g, "_").replace(/[%+]/g, "") + "@" + subcategoryLabel;

					newSubcategory.ID = subcategoryKey;
					newSubcategory.label = variable.values.values[subcategoryKey].label;
					leaderboard.subcategories.push(newSubcategory);
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

			$("#loadingSubcategories").remove();

			if(!hasSubcategories) {
				let subcategoryTextNode = document.createElement('p');
				subcategoryTextNode.innerHTML = `<strong>${leaderboard.category.name}</strong> no tiene subcategorías.`
				subcategoryTextNode.hidden = true;
				$("#subcategories").append(subcategoryTextNode);
			}
		})
		.fail(err => {
			finished = true;
			errorLoadingRuns('Ocurrió un error al intentar cargar las subcategorías del juego.');
			$("#subcategories").remove();
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
	
	log(leaderboard.variables);
	let variables = "";
	for(let iVariable in leaderboard.variables) {
		variables+= `${leaderboard.variables[iVariable].name}, `;
	}
	if(variables)
		variables = variables.substring(0, variables.length - 2); // quita el ", " del final

	new RunBar({
		subcategory : variables || "",
		parentNode: $("#runBarHeader")[0],
		class_ : `odd run-bar-header`,
	});
}

// API v1, carga demasiado lento
async function createRunBars(json) {
	let apiURL = `${SPEEDRUN_API}/leaderboards/${json.game}/category/${json.category}`;
	if (json.level) {
		apiURL = `${SPEEDRUN_API}/leaderboards/${json.game}/level/${json.level}/${json.category}`;
	}
	apiURL+= "?embed=players";
	if(leaderboard.subcategories.length > 0) { // subcategorias
		leaderboard.subcategories.forEach( (subcategory) => {
			apiURL+= `&var-${subcategory.key}=${subcategory.ID}`;
		});
	}
	log(leaderboard.subcategories);
	log(apiURL);

	if(urlParams.has("top")) {
		await insertRunBarsV1(apiURL, urlParams.get("top")); // limite definido por jugador
	}
	else {
		await insertRunBarsV1(apiURL, DEFAULT_LIMIT); // limite por defecto
		await insertRunBarsV1(apiURL); // carga todo lo que falta
	}
}

async function insertRunBarsV1(apiURL, top = false) {
	if(top)
		apiURL+= "&top=" + top;
	await $.get(apiURL)
		.done( async apiAnswer => {
			log(apiAnswer);
			let runs = apiAnswer.data.runs;
			let players = apiAnswer.data.players;
			let basicInfoPlayers = [];
			let hispanicPlayers = [];
			runnersArray = [];
			await players.data.forEach(async (player, i) => { // antes de recorrer las runs, hay que encontrar los runners hispanos
				if(!top)
					if(i < DEFAULT_LIMIT) // que no se inserten runners que ya se insertaron anteriormente
						return false;
				if(player.rel.toLowerCase() == "guest") { // a veces el invitado no tiene cuenta en speedrun.com
					return false;
				}
				basicInfoPlayers[player.id] = {
					name: player.names.international,
				};
				let runnerCountry = "", countryCode = "";
				if(player.location != null) // hay runners que no tienen su pais puesto
				{
					runnerCountry = player.location.country.names.international;
					countryCode = player.location.country.code;
				}
				basicInfoPlayers[player.id]['country'] = HISPANIC_COUNTRYS[runnerCountry.toLowerCase()] || runnerCountry;
				basicInfoPlayers[player.id]['countryCode'] = countryCode;
				if(Object.keys(HISPANIC_COUNTRYS).includes(runnerCountry.toLowerCase()))
					hispanicPlayers.push(player.id);
			});
			runs.forEach(async (run, i) => { // ahora se recorren las runs tal como vienen
				let includeThisRun = false;
				let runners = [];
				run.run.players.forEach( multiplayerPlayer => {
					if(!multiplayerPlayer.id) {
						runners.push({
							name: multiplayerPlayer.name,
							rel: "guest",
						});
						return true;
					}
					runners.push(basicInfoPlayers[multiplayerPlayer.id]);
					if(hispanicPlayers.includes(multiplayerPlayer.id)) {
						includeThisRun = true;
					}
				});
				if(!includeThisRun)
					return false;

				let variables = "";
				for(let iVariable in run.run.values)
					if(leaderboard.variables[iVariable])
						variables+= `${leaderboard.variables[iVariable][run.run.values[iVariable]]}, `;
				if(variables)
					variables = variables.substring(0, variables.length - 2); // quita el ", " del final

				if(leaderboard.variables && variables.length == 0)
					variables=" ";
				log(leaderboard.variables)

				let newRunBar = new RunBar({
					hPosition : hPosition++,
					globalPosition : run.place,
					playersList: runners,
					url : run.run.weblink,
					comment : run.run.comment,
					time : formatTime(run.run.times.primary_t),
					date : run.run.date,
					parentNode: runsDiv,
					subcategory : variables || '',
					class_ : `row-${hPosition % 2 > 0 ? 'odd' : 'even'}`,
				});
				runnersArray.push(newRunBar);
				if(run.run.comment)
					activateTooltip($(`#${newRunBar.id} > .run-bar-runner > .row > button`)[0]);
			});
			if(runnersArray.length > 0 && (!top || urlParams.has("top")) || (!top && runnersArray.length <= DEFAULT_LIMIT))
				runsDiv.removeChild(runsDivLoading);
			else if(!top || urlParams.has("top")) {
				errorLoadingRuns(`Por ahora no hay ninguna run hispana en esta sección.`);
			}
			else {
				$("#loadingLeaderboard").html("<h5>Cargando el resto de runs, por favor espere...</h5>"+ $("#loadingLeaderboardText").html());
			}

			let title = `${$("#divGameTitle").html()}`;
			if(leaderboard.subcategories.length > 0) {
				title+= " - ";
				leaderboard.subcategories.forEach( (subcategory) => {
					title+= `${subcategory.label}, `;
				});
				title = title.substring(0, title.length - 2);
			}
			document.title = title;
			finished = true;
		})
		.fail(err => {
			finished = true;
			console.log('error al cargar la leaderboard');
			errorLoadingRuns('Error al cargar la leaderboard, culpa de Luizón.');
			console.log(err);
			log(leaderboard.category.ID);
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
				loadLessInformationMessage();
			}
	});
};

function loadLessInformationMessage() {
	let game = urlParams.get("juego");
	let category = leaderboard.category.name.replace(" ", "_").replace(/[%+]/g, "");
	let subcategory = "";
	if(leaderboard.subcategories.length > 0) {
		leaderboard.subcategories.forEach( (isubcategory) => {
			subcategory+= `${isubcategory.key}=${isubcategory.ID},`;
		});
		subcategory = subcategory.substring(0, subcategory.length - 1);
	}
	let newParams = `?juego=${game}&categoria=${category}`;
	if(subcategory)
		newParams+= `&subcategorias=${getSubcategories()}`;
	if(urlParams.has("top"))
		newParams+= `&top=${urlParams.get("top") / 2}`;
	else
		newParams+= `&top=2000`;
		
	$("#loadingLeaderboardText").html($("#loadingLeaderboardText").html()
		+ "<br><br><h6 style='text-align: left;font-weight: normal;'>Prueba recargando la página."
		+ "<br>En ocasiones speedrun.com tarda demasiado en cargar y aparece este error.</h6>"
		+ `<br><br>Si el problema persiste <a href="../leaderboard/${newParams}" class="hyperlink dark">intenta cargar menos información con este enlace.</a>`
	);
}

window.onload = async function() {
	if(!urlParams.has('juego'))
		window.location.href = "../";
	startedAt = new Date();
	luizonShouldOptimizeThisWebPage();

	if(urlParams.get("juego").toLowerCase() == 'sm64') {
		$("#divDiscord")[0].href = "https://discord.gg/2Vx5DeJvQP";
		$("#divDiscord")[0].title = "Comunidad Ñ de Super Mario 64";
		activateTooltip($("#divDiscord")[0]);
	}
	else if(urlParams.get("juego").toLowerCase() == 'smo') {
		$("#divDiscord")[0].href = "https://discord.gg/HkRAgg7cNy";
		$("#divDiscord")[0].title = "Gruta del runner";
		activateTooltip($("#divDiscord")[0]);
	}

	let salir = false;

	document.title = `${urlParams.get('juego')} | Cargando informacion`;
	runsDiv = document.getElementById("divRunBars");
	runsDivLoading = document.getElementById("divRunBarsLoading");
	await loadCategories({ game : urlParams.get('juego') }) // carga categorias y titulo del juego
		.catch( err=> {
			console.log(err);
			salir = true;
		});
	if(salir)
		return false;
	await loadLevels(leaderboard.game.ID)
		.catch( err=> {
			console.log(err);
			salir = true;
		});
	if(salir)
		return false;
	await loadSubcategories( leaderboard.category.ID ) // carga subcategorias
		.catch( err=> {
			console.log(err);
			salir = true;
		});
	if(salir)
		return false;

	await createRunBars({ // carga la leaderboard como tal
		game : leaderboard.game.ID,
		category : leaderboard.category.ID,
		level : leaderboard.levelId,
	}).catch( err=> {
		console.log(err);
		salir = true;
	});
	activateTooltips();
}