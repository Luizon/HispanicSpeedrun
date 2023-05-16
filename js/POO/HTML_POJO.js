export class HTML_POJO {
    constructor(json) {
        this.id = `obj${++objCounter}`;
        this.innerHTML = json.innerHTML || "";
        this.parentNode = json.parentNode || null; // sin padre por defecto
    }

    sleep(ms) {
	    return new Promise(resolve => setTimeout(resolve, ms));
	}

    async actualizaHTML() {

    }

    insertaNodo(json = {nodoPadre : this.parentNode}) {
        let nuevoNodo = document.createElement("div");
        nuevoNodo.id = this.id;
        nuevoNodo.innerHTML = this.innerHTML;
		json.nodoPadre.appendChild(nuevoNodo);
    }

    generarInnerHTML() {
        this.innerHTML = this.p("Este método debe ser sobreescrito en la clase que lo herede."
                + "<br>No se supone que seas capaz de ver esto en la página.");
    }

    div(json = {clase:'', innerHTML:''}) {
        let div = "<div class=\"" + json.clase + '"';
        if(json.id != undefined)
            div+= ` id="${json.id}"`
        else
            console.log(json)
        return div + "\">" + json.innerHTML + "</div>";
    }
    
    a(url, innerHTML) {
        return "<a href=\"" + url + "\">" + innerHTML + "</a>";
    }
    
    img(src, alt = "Sin imagen") {
        return "<img src=\"" + src + "\" alt=\"" + alt + "\"/>";
    }
    
    p(innerHTML) {
        return "<p>" + innerHTML + "</p>";
    }
}