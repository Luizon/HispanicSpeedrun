import { SearchBar } from "./POO/SearchBar.js";
import { getEnviroment } from "./functions.js";

export function searcherNavListener() {
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
    $("#btnSearcherNav").on("click", searchText );
    $("#searcherNav, #btnSearcherNav").on("keydown", evt => {
        if(evt.keyCode == 13) { // return
            searchText();
        }
    } );
}

async function searchText() {
    let searchText = $("#searcherNav").val();
    if(searchText.trim().length == 0) {
        $(".search-games-container").html(
            "<span class='search-title-label'>Necesitas escribir algo para buscar 👀</span>"
        );
        return false;
    }
    $(".search-games-container").html("<span class='search-title-label'>Cargando...</span>");
	let apiURL = `${SPEEDRUN_API_V2}/GetSearch?_r=${encodeSearch64(searchText)}`;
    console.log(apiURL)
	await $.get(apiURL)
		.done(apiAnswer => {
            $(".search-games-container").html("");
			if(getEnviroment() == "dev")
				console.log(apiAnswer);
            if((apiAnswer.gameList.length + apiAnswer.userList.length) == 0) {
                $(".search-games-container").html(
                    "<span class='search-title-label'>No se encontraron coincidencias</span>"
                );
                return false;
            }
            if(apiAnswer.gameList.length) {
                let gamesLabel = document.createElement("span")
                gamesLabel.innerHTML = "Juegos";
                gamesLabel.classList.add("search-title-label");
                $(".search-games-container").append(gamesLabel);
            }
            apiAnswer.gameList.forEach(game => {
                let coverAsset = `https://speedrun.com${game.coverPath}`; // puede no ser la ruta correcta
                game.staticAssets.forEach(asset => {
                    if(asset.assetType == "cover")
                        coverAsset = `https://speedrun.com${asset.path}`;
                });
                let releaseDate = new Date(parseInt(`${game.releaseDate}000`));
                new SearchBar({
                    url : `https://speedruñ.com/leaderboard/?juego=${game.url}`,
                    name : game.name,
                    cover : coverAsset,
                    parentNode: $(".search-games-container")[0],
                    subText : releaseDate.getFullYear(),
                });
            });

            if(apiAnswer.userList.length) {
                let gamesLabel = document.createElement("span")
                gamesLabel.innerHTML = "Usuarios";
                gamesLabel.classList.add("search-title-label");
                $(".search-games-container").append(gamesLabel);
            }
            apiAnswer.userList.forEach(user => {
                let coverAsset = `https://speedrun.com/images/blankcover.png`; // por si no tiene foto de perfil
                user.staticAssets.forEach(asset => {
                    if(asset.assetType == "image")
                        coverAsset = `https://speedrun.com${asset.path}`;
                });
                let pronouns = "";
                if(user.pronouns.length > 0) {
                    user.pronouns.forEach(pronoun => {
                        pronouns+= pronoun + ", ";
                    });
                    if(pronouns.includes(","))
                        pronouns = `(${pronouns.substring(0, pronouns.length - 2)})`;
                }
                new SearchBar({
                    url : `https://speedrun.com/user/${user.name}`,
                    name : user.name,
                    cover : coverAsset,
                    parentNode: $(".search-games-container")[0],
                    subText : pronouns,
                });
            });
        })
        .fail(err => {
            console.log(`error al buscar ${searchText}`);
            console.log(err);
    	});
}

function encodeSearch64(searchText) {
    let rawJson = `{"query":"${searchText}","limit":6,"includeGames":true,"includeNews":false,"includePages":false,"includeSeries":false,"includeUsers":true}`;
    let output = btoa(rawJson);
    output = output.replace(/=/g, "");
    return output;
}