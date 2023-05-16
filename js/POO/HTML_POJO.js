export class HTML_POJO {
    constructor(json) {
		this.id = `obj${++objCounter}`;
    }

    sleep(ms) {
	    return new Promise(resolve => setTimeout(resolve, ms));
	}

    async actualizaHTML() {

    }

    generarHTML() {
        return this.div("", 
            this.p("Este método debe ser sobreescrito en la clase que lo herede."
                    + "<br>No se supone que seas capaz de ver esto en la página."
            )
        );
    }

    div(clase, innerHTML) {
        let div = "<div class=\"" + clase + '"';
        if(clase == 'card')
            div+= ` id="${this.id}"`
        return div + "\">" + innerHTML + "</div>";
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