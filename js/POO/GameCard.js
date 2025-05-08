import { HTML_POJO } from "./HTML_POJO.js";

export class GameCard extends HTML_POJO {
	constructor(json) {
		super(json);
		this.coverPath = `https://speedrun.com${json.coverPath}`;
		if(this.coverPath.includes("asset"))
			this.coverPath = this.coverPath.replace("asset", "").replace("speedrun.com/", "speedrun.com/static/");
		this.name = json.name;
		// this.url = `./leaderboard/?juego=${json.url}`;
		this.url = `./leaderboard/index.html?juego=${json.url}`;
		this.releaseDate = new Date(parseInt(`${json.releaseDate + 36000}000`));
		this.activePlayerCount = json.activePlayerCount;
		if(this.activePlayerCount != 0)
			this.activePlayerCount = this.activePlayerCount || "error";
		this.cover = this.img({
			src : this.coverPath,
			alt : json.url,
			class_ : "game-card-img",
			title : this.name,
		});

        this.generateInnerHTML();
		this.insertNode();
	}

	generateInnerHTML() {
		this.node.classList.add("m-0", "p-2", "col-12", "col-sm-6", "col-md-3", "col-lg-2",);
		this.innerHTML =
			this.a({class_ : 'no-text-decoration', url : this.url, innerHTML :
				this.div({class_ : "game-card expand", innerHTML : 
					this.div({class_ : "row m-0 position-relative", innerHTML : 
						this.cover
						+ this.div({class_ : "game-card-year", innerHTML : this.formatDate(this.releaseDate) })
					})
					+ this.div({class_ : "row m-0 p-0 fw-bold game-card-game-name", innerHTML : this.name })
					+ this.div({class_ : "row m-0 p-0", innerHTML : `Jugadores activos: ${this.activePlayerCount}` })
				})
			});
	}

	formatDate(date) {
		// no creo que valga la pena mostrar la fecha exacta tbh
		return `${date.getFullYear()}`;
	}
}