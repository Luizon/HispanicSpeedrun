// this doesn't even work, but it CAN do it someday if I need the API v2 from speedrun.com

// function encodeLeaderboard64(gameId, categoryId) {
// 	// se asume que si hay subcaegoria, esto generara error en leaderboards sin subcategoria
// 	let variables = "";
// 	if(leaderboard.subcategory.key) {
// 		variables = `{"variableId":"${leaderboard.subcategory.key}","valueIds":["${leaderboard.subcategory.ID}"]}`;
// 		/*
// 			para multiples variables, usar un json separado por coma por cada una en este formato:
// 			{"variableId":"varId","valueIds":["valId"]},{"variableId":"varId","valueIds":["valId","val2Id"]},{"variableId":"varId","valueIds":["valId"]}
// 		*/
// 	}
// 	// let rawJson = `{"params":{"gameId":"${gameId}","categoryId":"${categoryId}","values":[${variables}],"emulator":1},"page":1,"vary":1686768609}`; // genera error
// 	let rawJson = `{"params":{"gameId":"${gameId}","categoryId":"${categoryId}","values":[${variables}],"timer":0,"regionIds":[],"platformIds":[],"emulator":1,"video":0,"obsolete":0},"page":1,"vary":1686768609}`;
	
// 	let output = btoa(rawJson);
// 	output = output.replace(/=/g, "");
// 	return output;
// }

// // carga runs con API v1 y carga runners con API v2
// async function createRunBars(json) {
// 	let apiV1URL = `${SPEEDRUN_API}/leaderboards/${json.game}/category/${json.category}`;
// 	let apiV2URL = `${SPEEDRUN_API_V2}/GetGameLeaderboard?_r=${encodeLeaderboard64(json.game, json.category)}`;

// 	// console.log(apiV2URL);

// 	let salir = false;
	
// 	await loadPlayers(apiV2URL)
// 		.catch(err => {
// 			console.log(err);
// 			salir = true;
// 		});
// 	if(salir)
// 		return false;

// 	if(leaderboard.subcategory.key) { // subcategorias
// 		apiV1URL+= "?var-";
// 		apiV1URL+= `${leaderboard.subcategory.key}=${leaderboard.subcategory.ID}`;
// 	}
// 	if(urlParams.has("top")) {
// 		await loadRuns(apiV1URL, urlParams.get("top"))
// 			.catch(err => { // limite puesto por usuario
// 				console.log(err);
// 				salir = true;
// 			});
// 		if(salir)
// 			return false;
// 	}
// 	else {
// 		await loadRuns(apiV1URL, DEFAULT_LIMIT)
// 			.catch(err => { // limite por defecto
// 				console.log(err);
// 				salir = true;
// 			});
// 		if(salir)
// 			return false;
// 		runsArray.forEach((runner, i) => {
// 			new RunBar(runner);
// 		});
// 		if(DEFAULT_LIMIT < playersArray.length) {
// 			$("#loadingLeaderboardText").html("Se está cargando el resto de posiciones. Por favor espere.");
// 		}
// 		await loadRuns(apiV1URL)
// 			.catch(err => { // carga todas las runs
// 				console.log(err);
// 				salir = true;
// 			});
// 		if(salir)
// 			return false;
// 	}
// 	runsArray.forEach((runner, i) => {
// 		// si son menos runs que DEFAULT_LIMIT, aqui no va a entrar a menos que se haya puesto un tope desde url
// 		new RunBar(runner);
// 	});

// 	// if(runsArray.length > 0)
// 	if($("#obj2")[0] != undefined) // obj2 es el primer puesto en la leaderboard. obj1 es el encabezado de la tabla
// 		runsDiv.removeChild(runsDivLoading);
// 	else {
// 		errorLoadingRuns(`Por ahora no hay ninguna run hispana en esta sección.`);
// 	}


// 	document.title = `${$("#divGameTitle").html()} - ${leaderboard.subcategory.label}`;
// }

// async function loadRuns(apiURL, limite = false) {
// 	if(limite) {
// 		if(apiURL.includes("?"))
// 			apiURL+= "&";
// 		else
// 			apiURL+= "?";
// 		apiURL+=`top=${limite}`;
// 	}
// 	await $.get(apiURL)
// 		.done(apiAnswer => {
// 			// console.log(apiAnswer)
// 			let runs = apiAnswer.data.runs;
// 			runsArray = [];
// 			runs.forEach(async (run, i) => {
// 				if(!urlParams.has("top") && !limite)
// 					if(i < DEFAULT_LIMIT)
// 						return false;
// 				if(!playersArray[i]) // ni idea porque esto pasaria, pero parece que pasa 2 veces
// 					return false;
// 				if(!playersArray[i].areaId) // se salta jugadores sin pais definido
// 					return false;
// 				if(!Object.keys(HISPANIC_AREA_ID).includes(playersArray[i].areaId)) // se salta jugadores cuyo pais no este definido
// 					return false;
				
// 				let variables = "";
// 				for(let iVariable in run.run.values)
// 					if(leaderboard.variables[iVariable])
// 						variables+= `${leaderboard.variables[iVariable][run.run.values[iVariable]]}, `;
// 				if(variables)
// 					variables = variables.substring(0, variables.length - 2); // quita el ", " del final

// 				runsArray.push({
// 					hPosition : hPosition++,
// 					globalPosition : run.place,
// 					countryCode : playersArray[i].areaId,
// 					country : HISPANIC_AREA_ID[playersArray[i].areaId],
// 					// player : run.run.players[0].id,
// 					player : playersArray[i].name,
// 					url : run.run.weblink,
// 					comment : run.run.comment,
// 					time : formatTime(run.run.times.primary_t),
// 					date : run.run.date,
// 					parentNode: runsDiv,
// 					subcategory : variables || leaderboard.subcategory.label || '',
// 					class_ : `row-${hPosition % 2 > 0 ? 'odd' : 'even'}`,
// 				});
// 			});

// 			finished = true;
// 		})
// 		.fail(err => {
// 			finished = true;
// 			console.log('error al cargar la leaderboard');
// 			errorLoadingRuns('Error al cargar la leaderboard, culpa de Luizón.');
// 			console.log(err);
// 			console.log(leaderboard.category.ID)
// 			if(err.responseJSON) {
// 				if(err.responseJSON.message) {
// 					// alert(err.responseJSON.message);
// 					$("#loadingLeaderboardText").html($("#loadingLeaderboardText").html()
// 						+ "<br><br><h6 style='text-align: left;font-weight: normal;'>Respuesta de speedrun.com:"
// 						+ `<br>${err.responseJSON.message}</h6>`
// 					);
// 				}
// 			}
//			else {
//				loadLessInformationMessage();
//			}
// 		});
// }

// async function loadPlayers(apiURLV2) {
// 	console.log(apiURLV2);
// 	await $.get(apiURLV2)
// 		.done(apiAnswer => {
// 			console.log('buena po')
// 			apiAnswer.leaderboard.players.forEach(player => {
// 				playersArray.push({
// 					areaId : player.areaId,
// 					name: player.name
// 				});
// 			});
// 		})
// 		.fail(err => {
// 			finished = true;
// 			console.log('error al cargar a los runners');
// 			console.log(err);
// 			bootbox.alert({
// 				title: 'Error',
// 				message: 'No se cargaron los runners de forma correcta.'
// 				+ '<br>Culpa de Luizón.',
// 				buttons: {
// 					ok: {
// 						label: 'Aceptar',
// 					},
// 				},
// 			});

// 			errorLoadingRuns("Error al cargar a los runners.");
// 			$("#loadingLeaderboardText").html($("#loadingLeaderboardText").html()
// 				+ "<br><br><h2 style='text-align: left;font-weight: normal;'>ggshermano.</h2>"
// 				+ `<br><br><h6>Se está trabajando en solucionar este error para que no se repita.`
// 				+ `<br>Intenta recargar la página, a veces funciona.</h6>`
// 			);
// 		});
// }
