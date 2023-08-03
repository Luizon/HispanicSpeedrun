import { HTML_POJO } from "./HTML_POJO.js";

export class GameCard extends HTML_POJO {
	constructor(json) {
		super(json);
		this.coverPath = `https://speedrun.com${json.coverPath}`;
		this.coverPath = this.coverPath.replace("asset", "").replace("speedrun.com/", "speedrun.com/static/");
		this.name = json.name;
		this.url = `./leaderboard/?juego=${json.url}`;
		this.releaseDate = json.releaseDate;
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
		this.node.classList.add("m-0", "p-2", "col-3");
		this.innerHTML =
			this.a({class_ : 'no-text-decoration', url : this.url, innerHTML :
				this.div({class_ : "game-card expand", innerHTML : 
					this.div({class_ : "row m-0", innerHTML : this.cover })
					+ this.div({class_ : "row m-0 p-0", innerHTML : this.name })
					+ this.div({class_ : "row m-0 p-0", innerHTML : this.formatDate(this.releaseDate) })
				})
			});
	}

	formatDate(date) {
		return `${date.getFullYear()}/${date.getMonth()}/${date.getDay()}`;
	}
}