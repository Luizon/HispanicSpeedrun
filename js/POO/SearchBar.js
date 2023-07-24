import { HTML_POJO } from "./HTML_POJO.js";

export class SearchBar extends HTML_POJO {
	constructor(json) {
		super(json);
		this.url = json.url || "";
		this.name = json.name || "error"; // game
        this.gameId = json.gameId || null;
        this.year = json.year || null;
		this.gameCover = json.gameCover || null;
        // if(this.gameId && this.gameCover)
        //     this.gameCover = this.img({
        //         src : `https://www.speedrun.com/static/game/${this.gameId}/cover?v=${this.gameCover}`,
        //         alt : "name",
        //         class_ : "search-game-cover",
        //         title : this.name,
        //     });

        this.generateInnerHTML();
		this.insertNode();
	}
	
	generateInnerHTML() {
		this.node.classList.add("search-bar");
		this.innerHTML = 
			this.a({class_ : '', url : this.url, innerHTML :
				this.div({class_ : "row m-0 p-0 search-bar", innerHTML : 
					this.div({class_ : 'col-auto search-bar-cover', innerHTML : 
						this.img({
							src : this.gameCover,
							alt : "cover",
							class_ : "runner-flag",
							title : this.name,
						})
					})
					+ this.div({class_ : 'col-auto search-bar-text ps-0 pe-0', innerHTML : 
						this.div({class_ : 'row p-0 m-0 search-bar-game', innerHTML : 
							this.div({class_ : 'col-auto ps-0 pe-0', innerHTML : this.name })
							+ this.div({class_ : 'col-auto text-secondary', innerHTML : `- ${this.year}` })
						})
					})
					+ this.div({class_ : 'col search-bar-text text-end', innerHTML : "ver" })
				})
			})
	}
}