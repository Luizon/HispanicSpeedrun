import { GameCard } from "./POO/GameCard.js";
import { formatTime, getEnviroment } from "./functions.js"

async function loadGameCards() {
	let apiURL = `${SPEEDRUN_API_V2}/GetLatestLeaderboard`;
	await $.get(apiURL)
		.done(apiAnswer => {
            $($("#gamesContainer").children()[0]).remove();
            apiAnswer.games.forEach(game => {
                new GameCard({
                    coverPath : game.coverPath,
                    name : game.name,
                    url : game.url,
                    releaseDate : new Date(parseInt(`${game.releaseDate + 36000}000`)),
                    parentNode: $("#gamesContainer")[0],
                });
                console.log(game);
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