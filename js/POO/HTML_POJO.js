export class HTML_POJO {
    constructor(json) {
        this.id = `obj${++objCounter}`;
        this.innerHTML = json.innerHTML || "";
        this.parentNode = json.parentNode || null; // sin padre por defecto
    }

    sleep(ms) {
	    return new Promise(resolve => setTimeout(resolve, ms));
	}

    async updateHTML() {

    }

    insertNode(json = {parentNode : this.parentNode}) {
        let newNode = document.createElement("div");
        newNode.id = this.id;
        newNode.innerHTML = this.innerHTML;
		json.parentNode.appendChild(newNode);
    }

    generarInnerHTML() {
        this.innerHTML = this.p("Este método debe ser sobreescrito en la class_ que lo herede."
                + "<br>No se supone que seas capaz de ver esto en la página.");
    }

    div(json = {class_:'', innerHTML:''}) {
        let div = "<div class=\"" + json.class_ + '"';
        if(json.id != undefined)
            div+= ` id="${json.id}"`
        else
            console.log(json)
        return div + "\">" + json.innerHTML + "</div>";
    }
    
    a(json) {
        return "<a href=\"" + json.url + "\">" + json.innerHTML + "</a>";
    }
    
    img(json = {src : '#', alt : "Sin imagen"}) {
        return "<img src=\"" + json.src + "\" alt=\"" + json.alt + "\"/>";
    }
    
    p(json) {
        return "<p>" + json.innerHTML + "</p>";
    }
}