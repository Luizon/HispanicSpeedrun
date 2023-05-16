import { HTML_POJO } from "./HTML_POJO.js";

export class RunBar extends HTML_POJO {
	constructor(json) {
		super(json);
		this.nombre = json.nombre || "Sin nombre";
		this.imagen = json.imagen || "";
		this.url = json.url || "https://luizon.github.io/";
		this.tiempo = json.tiempo || "Sin tiempo";
		this.fecha = 'Cargando';
		this.getFecha(json.nombre);
		this.descripcion = json.descripcion || "Sin descripción.";
		
		this.generarInnerHTML();
		this.insertaNodo();
		// this.actualizaHTML();
	}

	getFecha(nombre) {
		this.fechaActualizacion = 'Cargando';
		let that = this;
		// $.ajax({
		// 	url: `https://api.github.com/repos/Luizon/${nombre}/commits`,
		// 	success: (res) => {
		// 		let fecha = res[0].commit.committer.date;
		// 		that.fechaActualizacion = fecha.substring(0, 10);
		// 	},
		// 	error: () => {
		// 		that.fechaActualizacion = 'Desconocido';
		// 	}
		// });
	}

	async actualizaHTML() {
		// while(this.fechaActualizacion == 'Cargando') {
			// console.log(`RunBar ${this.id}: ${this.fechaActualizacion}`);
			// await this.sleep(1000);
		// }
		this.innerHTML = this.generarInnerHTML();
		let thisRunBar = $(`#${this.id}`);
		thisRunBar.html(this.innerHTML);
		// console.log(thisRunBar[0]);
		// console.log(this.innerHTML);
	}
	
	generarInnerHTML() {
		this.innerHTML = this.p(`Texto de pana de ${this.id}.`);
	}
}