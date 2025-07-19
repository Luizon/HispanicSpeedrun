import { GameCard } from "./POO/GameCard.js";

async function loadGameCards() {
	let apiURL = `${SPEEDRUN_API_V2}/GetLatestLeaderboard`;
	await $.get(apiURL)
		.done(apiAnswer => {
            $($("#gamesContainer")).html("<h6>Últimos juegos runneados.</h6>");
            apiAnswer.games.forEach(game => {
                new GameCard({
                    coverPath : game.coverPath,
                    name : game.name,
                    activePlayerCount : game.activePlayerCount,
                    url : game.url,
                    releaseDate : game.releaseDate,
                    parentNode: $("#gamesContainer")[0],
                });
                // console.log(game);
            })
		})
		.fail(err => {
			console.log(err);
	    });
}

window.onload = async function() {
    await loadGameCards()
        .catch( err=> {
            console.log(err);
        });
	activateTooltips();
}