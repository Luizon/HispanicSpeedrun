import { HTML_POJO } from "./HTML_POJO.js";

export class SearchBar extends HTML_POJO {
	constructor(json) {
		super(json);
		this.url = json.url || "";
		this.name = json.name || "error"; // game
        this.subText = json.subText || null;
		this.cover = json.cover || null;

        this.generateInnerHTML();
		this.insertNode();
	}
	
	generateInnerHTML() {
		this.node.classList.add("search-bar");
		this.innerHTML = 
			this.a({class_ : '', url : this.url, innerHTML :
				this.div({class_ : "row m-0 p-0", innerHTML : 
					this.div({class_ : 'col-auto search-bar-cover', innerHTML : 
						this.img({
							src : this.cover,
							alt : "portada",
							class_ : "runner-flag",
							title : this.name,
						})
					})
					+ this.div({id : "searchGameText", class_ : 'col search-bar-text ps-0 pe-0 d-flex', innerHTML : 
						this.span({class_ : 'search-bar-game', innerHTML :
							this.name
							+ (this.subText == null ? "" : this.span({class_ : 'text-secondary', innerHTML : ` - ${this.subText}` }))
						})
					})
					+ this.div({class_ : 'col-auto search-bar-text text-end', innerHTML : "ver" })
				})
			})
	}
}