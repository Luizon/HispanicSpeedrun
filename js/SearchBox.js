import { SearchBar } from "https://espeedruñ.com/js/POO/SearchBar.js";
import { log, getEnviroment } from "https://espeedruñ.com/js/functions.js";

export function callSearcherNavListener() { searcherNavListener(10); }

function searcherNavListener(limit = 6) {
    $("#searcherNav").on("focus", evt => {
        $(".search-games-container").width($("#searcherNavContainer").width());
        if($(".search-games-container").hasClass("d-none"))
            $(".search-games-container").removeClass("d-none");
    });

    let hideContainer = () => {
        if($("#btnSearcherNav").is(":focus") || $("#searcherNav").is(":focus") || $(".search-games-container").is(":focus")
        || $("#btnSearcherNav").is(":hover") || $("#searcherNav").is(":hover") || $(".search-games-container").is(":hover"))
            return false;
        if(!$(".search-games-container").hasClass("d-none"))
            $(".search-games-container").addClass("d-none");
        $(".search-games-container").html(
            "<span class='search-title-label'>Presiona el botón para buscar</span>"
        );
        return true;
    }
    $("#searcherNav, #btnSearcherNav").on("blur", evt => {
        hideContainer();
    });
    $(".search-games-container").on("mouseleave", evt => {
        hideContainer();
    });
    $("#btnSearcherNav").on("click", e => { searchText(limit); } );
    $("#searcherNav, #btnSearcherNav").on("keydown", evt => {
        if(evt.keyCode == 13) { // return
            searchText(limit);
        }
    } );
}

async function searchText(limit) {
    let searchText = $("#searcherNav").val();
    if(searchText.trim().length == 0) {
        $(".search-games-container").html(
            "<span class='search-title-label'>Necesitas escribir algo para buscar 👀</span>"
        );
        return false;
    }
    $(".search-games-container").html("<span class='search-title-label'>Cargando...</span>");
    let cargoJuegos = false;
	let apiURL = `${SPEEDRUN_API}/games?name={${searchText}}`;
    log(apiURL);
	await $.get(apiURL)
		.done(apiAnswer => {
            $(".search-games-container").html("");
			log(apiAnswer);
            if((apiAnswer.data.length) == 0) {
                let gamesLabel = document.createElement("span");
                gamesLabel.innerHTML = "No se encontraron juegos que coincidan con la búsqueda";
                gamesLabel.classList.add("search-title-label");
                $(".search-games-container").append(gamesLabel);
                $(".search-games-container").append(document.createElement("br"));
                return false;
            }
            if(apiAnswer.data.length) {
                let gamesLabel = document.createElement("span")
                gamesLabel.innerHTML = "Juegos";
                gamesLabel.classList.add("search-title-label");
                $(".search-games-container").append(gamesLabel);
            }
            apiAnswer.data.forEach(game => {
                let coverAsset = game["assets"]["cover-tiny"]["uri"]; // puede no ser la ruta correcta
                new SearchBar({
                    url : `https://espeedruñ.com/leaderboard/?juego=${game.abbreviation}`,
                    // url : `https://espeedruñ.com/leaderboard/index.html?juego=${game.abbreviation}`,
                    name : game.names.international,
                    cover : coverAsset,
                    parentNode: $(".search-games-container")[0],
                    subText : game.released,
                });
            });

            if(apiAnswer.data.length) {
                let usersLabel = document.createElement("span")
                usersLabel.id = "spanUsersLabel";
                usersLabel.innerHTML = "Cargando usuarios...";
                usersLabel.classList.add("search-title-label");
                $(".search-games-container").append(usersLabel);
            }

            cargoJuegos = true;
        })
        .fail(err => {
            console.log(`error al buscar ${searchText}`);
            console.log(err);
            $(".search-title-label").html("Error temporal con speedrun.com.<br>No será posible usar el buscador por ahora.<br><br>Intenta de nuevo más tarde.");
    	});

    if($(".search-title-label").html() == "Error temporal con speedrun.com.<br>No será posible usar el buscador por ahora.<br><br>Intenta de nuevo más tarde.") {
        return false;
    }

    apiURL = `${SPEEDRUN_API}/users?name={${searchText}}`;
    log(apiURL);
    await $.get(apiURL)
        .done(apiAnswer => {
			log(apiAnswer);
            if((apiAnswer.data.length) == 0) {
                if(!cargoJuegos) {
                    $(".search-games-container").html(
                        "<span class='search-title-label'>No se encontró ninguna coincidencia</span>"
                    );
                }
                else {
                    let usersLabel = document.getElementById("spanUsersLabel") || document.createElement("span");
                    usersLabel.innerHTML = "No se encontraron usuarios con ese nombre";
                    usersLabel.classList.add("search-title-label");
                    $(".search-games-container").append(usersLabel);
                }
                return false;
            }
            if(apiAnswer.data.length) {
                let usersLabel = document.getElementById("spanUsersLabel") || document.createElement("span");
                usersLabel.innerHTML = "Usuarios";
                usersLabel.classList.add("search-title-label");
                $(".search-games-container").append(usersLabel);
            }
            apiAnswer.data.forEach(user => {
                let coverAsset = user["assets"]["image"]["uri"] || defaultPfpCover; // puede no ser la ruta correcta
                new SearchBar({
                    url : user.weblink,
                    name : user.names.international,
                    cover : coverAsset,
                    parentNode: $(".search-games-container")[0],
                    subText : user.released,
                });
            });
        })
        .fail(err => {
            console.log(`error al buscar ${searchText}`);
            console.log(err);
        });
}

function encodeSearch64(searchText, limit) {
    let rawJson = `{"query":"${searchText}","limit":${limit},"includeGames":true,"includeNews":false,"includePages":false,"includeSeries":false,"includeUsers":true}`;
    let output = btoa(rawJson);
    output = output.replace(/=/g, "");
    return output;
}

searcherNavListener();

if(getEnviroment() == "prod") {
    console.log('%c ALTO AHÍ ', 'background: #FFFF00 ; color: #ff0000 ; font-size: 40px; font-weight: bold;');
    console.log('%cEsta consola es exclusiva para desarollo. No escribas ni pegues ningún código que no entiendas.', 'font-size: 20px;');
    console.log(`
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣴⡾⣻⣿⣿⣿⣿⣯⣍⠛⠻⢷⣦⣀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⣿⠟⢁⣾⠟⠋⣁⣀⣤⡉⠻⣷⡀⠀⠙⢿⣷⣄⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⢀⡀⠀⠀⠀⠀⠀⠀⣰⣿⠏⠀⠀⢸⣿⠀⠼⢋⣉⣈⡳⢀⣿⠃⠀⠀⠀⠙⣿⣦⡀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⢰⡿⠿⣷⡀⠀⠀⠀⣼⣿⠃⠀⠀⣀⣤⡿⠟⠛⠋⠉⠉⠙⢛⣻⠶⣦⣄⡀⠀⠘⣿⣷⡀⠀⠀⠀
⢠⣾⠟⠳⣦⣄⢸⡇⠀⠈⣷⡀⠀⣼⣿⡏⢀⣤⡾⢋⣵⠿⠻⢿⠋⠉⠉⢻⠟⠛⠻⣦⣝⠻⣷⣄⠸⣿⣿⠀⠀⠀
⠘⣧⠀⠀⠀⠙⢿⣿⠀⠀⢸⣷⠀⣿⣿⣧⣾⣏⡴⠛⢡⠖⢛⣲⣅⠀⠀⣴⣋⡉⠳⡄⠈⠳⢬⣿⣿⣿⡿⠀⠀⠀
⠀⠘⠷⣤⣀⣀⣀⣽⡶⠛⠛⠛⢷⣿⣿⣿⣿⣏⠀⠀⡏⢰⡿⢿⣿⠀⠀⣿⠻⣿⠀⡷⠀⣠⣾⣿⡿⠛⠷⣦⠀⠀
⠀⠀⢀⣾⠟⠉⠙⣿⣤⣄⠀⢀⣾⠉⠀⢹⣿⣿⣷⠀⠹⡘⣷⠾⠛⠋⠉⠛⠻⢿⡴⢃⣄⣻⣿⣿⣷⠀⠀⢹⡇⠀
⠀⠀⢸⡇⠈⠉⠛⢦⣿⡏⠀⢸⣧⠀⠈⠻⣿⡿⢣⣾⣦⣽⠃⠀⠀⠀⠀⠀⠀⠀⣷⣾⣿⡇⠉⢿⡇⠀⢀⣼⠇⠀
⠀⠀⠘⣷⡠⣄⣀⣼⠇⠀⠀⠀⠻⣷⣤⣀⣸⡇⠀⠹⣿⣿⣦⣀⠀⠀⠀⠀⢀⣴⣿⣿⡟⠀⠀⢸⣷⣾⡿⠃⠀⠀
⠀⠀⠀⠈⠻⢦⣍⣀⣀⣀⡄⠀⣰⣿⡿⠿⢿⣇⠀⠀⠉⠛⠻⣿⣿⡷⠾⣿⣿⡿⠉⠁⠀⠀⢀⣾⠋⠁⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠈⠉⠉⠙⠿⢿⣿⣇⠀⠀⠈⢿⣧⣄⠀⠀⠀⢹⣷⣶⣶⣾⣿⡇⠀⠀⣀⣴⡿⣧⣄⡀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⢿⣷⡀⠀⠀⠙⢿⣿⣶⣤⡀⠻⢤⣀⡤⠞⢀⣴⣿⣿⠟⢷⡀⠙⠻⣦⣄⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢻⣦⠀⢠⡟⠁⠙⢻⣿⠷⠶⣶⠶⠾⠛⠙⣿⠇⠀⠀⢻⡄⠀⠀⠙⢷⡀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣸⣿⡀⣿⠁⣤⣤⡄⢻⡶⠶⠛⠛⠛⠛⠛⣿⢠⣾⣷⣆⢻⡀⠀⠀⠈⣷
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⢸⣿⣿⣿⡈⢿⡀⠀⠀⠀⠀⠀⡿⢸⣿⣿⣿⢸⡇⠀⠀⠀⡟`);
    console.log("¡Disfruta la página!")
}