import { HTML_POJO } from "./HTML_POJO.js";

export class RunBar extends HTML_POJO {
	constructor(json) {
		super(json);
		this.url = json.url || "";
		this.name = json.name || "error";
        this.gameId = json.gameId || null;
		this.gameCover = json.gameCover || null;
        if(this.gameId && this.gameCover)
            this.gameCover = this.img({
                src : `https://www.speedrun.com/static/game/${this.gameId}/cover?v=${this.gameCover}`,
                alt : "name",
                class_ : "search-game-cover",
                title : this.name,
            });

        this.generateInnerHTML();
		this.insertNode();
	}
	
	generateInnerHTML() {
		this.node.classList.add("search-bar");
		this.innerHTML = 
			this.a({class_ : 'row m-0 p-0', url : this.url, innerHTML :
				this.div({class_ : "row m-0 p-0", innerHTML : 
					this.div({class_ : 'col run-bar-position', innerHTML : this.hPosition })
					+ this.div({class_ : 'col run-bar-position', innerHTML : this.globalPosition })
				})
			})
	}
}