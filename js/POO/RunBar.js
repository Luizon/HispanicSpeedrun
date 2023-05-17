import { HTML_POJO } from "./HTML_POJO.js";

export class RunBar extends HTML_POJO {
	constructor(json) {
		super(json);
		this.name = json.name || "Sin nombre";
		this.image = json.image || "";
		this.url = json.url || "#";
		this.time = json.time || "Sin tiempo";
		this.fecha = json.fecha || "sinFecha";
		this.message = json.message || "Sin mensaje.";
		
		this.generateInnerHTML();
		this.insertNode();
		// this.actualizaHTML();
	}

	async upadateHTML() {
		// while(this.fechaActualizacion == 'Cargando') {
			// console.log(`RunBar ${this.id}: ${this.fechaActualizacion}`);
			// await this.sleep(1000);
		// }
		this.innerHTML = this.generateInnerHTML();
		let thisRunBar = $(`#${this.id}`);
		thisRunBar.html(this.innerHTML);
		// console.log(thisRunBar[0]);
		// console.log(this.innerHTML);
	}
	
	generateInnerHTML() {
		this.innerHTML = this.p({innerHTML: `${this.name}`});
	}
}