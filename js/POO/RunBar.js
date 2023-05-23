import { HTML_POJO } from "./HTML_POJO.js";

export class RunBar extends HTML_POJO {
	constructor(json) {
		super(json);
		this.hPosition = json.hPosition || 0;
		this.globalPosition = json.globalPosition || 0;
		this.country = json.country || "";
		this.player = json.player || "Sin nombre";
		this.url = json.url || "";
		this.comment = json.comment || "";
		this.time = json.time || "error";
		this.date = json.date || "error";
		this.generateInnerHTML();
		this.insertNode();
		// this.actualizaHTML();
	}

	async upadateHTML() {
		this.innerHTML = this.generateInnerHTML();
		let thisRunBar = $(`#${this.id}`);
		console.log(this.node)
		thisRunBar.html(this.innerHTML);
		// console.log(thisRunBar[0]);
		// console.log(this.innerHTML);
	}
	
	generateInnerHTML() {
		this.node.classList.add("run-bar", "row");
		this.innerHTML = 
				this.div({class_ : 'col run-bar-position', innerHTML : this.hPosition })
			+ this.div({class_ : 'col run-bar-position', innerHTML : this.globalPosition })
			+ this.div({class_ : 'col run-bar-runner', innerHTML : this.player })
			+ this.div({class_ : 'col run-bar-country', innerHTML : this.country })
			+ this.div({class_ : 'col run-bar-date', innerHTML : this.date })
			+ this.div({class_ : 'col run-bar-time', innerHTML : this.time });
		if(this.url)
			this.innerHTML = this.a({title: this.comment, class_ : 'row m-0 p-0', url : this.url, innerHTML : this.innerHTML });
	}
}