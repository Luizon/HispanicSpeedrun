import { HTML_POJO } from "./HTML_POJO.js";

export class RunBar extends HTML_POJO {
	constructor(json) {
		super(json);
		this.hPosition = json.hPosition || 0;
		this.globalPosition = json.globalPosition || 0;
		// this.country = json.country || "";
		// this.countryCode = json.countryCode || "";
		// this.player = json.player || "Sin nombre";
		this.playersList = json.playersList || [{player: json.player, country: "", countryCode: ""}];
		this.url = json.url || "";
		this.comment = json.comment || "";
		this.time = json.time || "error";
		this.date = json.date || "error";
		this.subcategory = json.subcategory || "";
		if(this.hPosition < 5) {
			if(topImg[this.hPosition])
				this.hPosition = this.img({
					src : topImg[this.hPosition],
					title : this.hPosition,
					class_ : "position-img",
				});
		}
		if(this.globalPosition < 5) {
			if(topImg[this.globalPosition])
				this.globalPosition = this.img({
					src : topImg[this.globalPosition],
					title : this.globalPosition,
					class_ : "position-img",
				});
		}

		if(this.url)
			this.generateInnerHTML();
		else
			this.generateInnerHTMLHeader();
		this.insertNode();
	}

	async upadateHTML() {
		this.innerHTML = this.generateInnerHTML();
		let thisRunBar = $(`#${this.id}`);
		console.log(this.node)
		thisRunBar.html(this.innerHTML);
	}

	commentButton() {
		if(this.comment.length == 0)
			return this.div({class_ : "col-auto p-0" , innerHTML : ""});
		return `<button class="col-auto p-0 btn btn-dark comment-btn" data-bs-toggle="tooltip" data-bs-html="true" title="${this.comment}" trigger="click focus">${this.img({
				src : `../img/dialog.svg`,
				alt : "c",
				class_ : "comment-img",
				title : "",
			})}</button>`;
	}
	
	generateInnerHTML() {
		this.node.classList.add("run-bar", "row");
		this.innerHTML = 
			this.a({class_ : 'col-auto m-0 p-0', url : this.url, innerHTML :
				this.div({class_ : "row m-0 p-0", innerHTML : 
					this.div({class_ : 'col run-bar-position', innerHTML : this.hPosition })
					+ this.div({class_ : 'col run-bar-position', innerHTML : this.globalPosition })
				})
			})
			+ this.div({class_ : 'col run-bar-runner pe-0', innerHTML : 
				this.div({class_: "row m-0", innerHTML : 
					// this.a({class_ : 'col-auto p-0', url : `https://www.speedrun.com/users/${this.player}`, innerHTML :
					// 	this.div({class_: "float-left", innerHTML : (this.countryCode ? `${this.flag} ` : "") + `${this.player}`}) // si no tiene bandera, no se pondra el espacio
					// })
					// + this.a({class_ : 'col p-0', url : this.url, innerHTML :
					// 	this.div({class_: "", innerHTML : ""})
					// })
					this.divPlayers()
					+ this.commentButton()
				})
			})
			+ this.a({class_ : 'col-auto m-0 p-0', url : this.url, innerHTML :
				this.div({class_ : "row m-0", innerHTML : 
					this.div({class_ : 'col run-bar-time', innerHTML : this.time })
					+ ( this.subcategory ? this.div({class_ : 'col run-bar-date d-none d-sm-none d-md-block d-lg-block d-xl-block', innerHTML : `${this.subcategory}`}) : "" ) // sin subcategoria no se pondra esta columna
					+ this.div({class_ : 'col run-bar-date d-none d-sm-block d-md-block d-lg-block d-xl-block', innerHTML : this.date })
			}	)
			});
		// if(this.url) // se supone que siempre habra url
		// 	this.innerHTML = this.a({class_ : 'row m-0 p-0', url : this.url, innerHTML : this.innerHTML });
	}

	divPlayers() {
		let htmlOutput = "";
		this.playersList.forEach(player => {
			let padding3 = "";
			if(htmlOutput.length > 0)
				padding3 = "ps-3";
			if(player.rel == "guest") {
				htmlOutput+= this.a({class_ : 'col-auto runner-guest p-0', url : this.url, innerHTML :
					this.div({class_: padding3, innerHTML : htmlOutput.length > 0 ? `${player.name}` : player.name})
				});
			}
			else {
				let flag = this.img({
					src : `https://speedrun.com/images/flags/${player.countryCode}.png`,
					alt : player.countryCode,
					class_ : "runner-flag",
					title : player.country,
				}) + " ";
				if(!player.countryCode)
					flag = "";
				htmlOutput+= this.a({class_ : 'col-auto p-0', url : `https://www.speedrun.com/users/${player.name}`, innerHTML :
					this.div({class_: `float-left ${padding3}`, innerHTML : (htmlOutput.length > 0 ? `${flag + player.name}` : flag + player.name)})
				});
			}
		});
		htmlOutput+= this.a({class_ : 'col p-0', url : this.url, innerHTML :
			this.div({class_: "", innerHTML : ""}) // si no tiene bandera, no se pondra el espacio
		});
		return htmlOutput;
	}

	generateInnerHTMLHeader() {
		this.node.classList.add("run-bar", "row");
		this.innerHTML = 
				this.div({class_ : 'col run-bar-position', innerHTML : "Ñ" })
			+ this.div({class_ : 'col run-bar-position', innerHTML : "#" })
			+ this.div({class_ : 'col run-bar-runner', innerHTML : "Runner" })
			+ this.div({class_ : 'col run-bar-time', innerHTML : "Tiempo" })
			+ ( this.subcategory ? this.div({class_ : 'col run-bar-date d-none d-sm-none d-md-block d-lg-block d-xl-block', innerHTML : `${this.subcategory}`}) : "" ) // sin subcategoria no se pondra esta columna
			+ this.div({class_ : 'col run-bar-date d-none d-sm-block d-md-block d-lg-block d-xl-block', innerHTML : "Fecha" });
	}
}