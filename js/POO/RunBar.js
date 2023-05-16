import { HTML_POJO } from "./HTML_POJO.js";

class RunBar extends HTML_POJO {
	constructor(json) {
		super();
		this.nombre = json.nombre || "Sin nombre";
		this.imagen = json.imagen || "";
		this.url = json.url || "https://luizon.github.io/";
		this.tiempo = json.tiempo || "Sin tiempo";
		this.fecha = 'Cargando';
		this.getFecha(json.nombre);
		this.descripcion = json.descripcion || "Sin descripción.";
		
		this.generarHTML();
		this.actualizaHTML();
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
			console.log(`Tarjeta ${this.id}: ${this.fechaActualizacion}`);
			// await this.sleep(1000);
		// }
		this.generarHTML();
		let thisRunBar = document.getElementById(this.id);
		// console.log(thisRunBar);
		thisRunBar.innerHTML = "a";
	}
	
	generarHTML() {
		return this.div("", 
            this.p(`Texto de pana de ${this.id}.`)
        );
	}
}