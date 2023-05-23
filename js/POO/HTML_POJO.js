export class HTML_POJO {
    constructor(json) {
        this.id = `obj${++objCounter}`;
        this.innerHTML = json.innerHTML || "";
        this.class_ = json.class_ || '';
        this.parentNode = json.parentNode || null; // sin padre por defecto
        this.node = document.createElement("div");
    }

    sleep(ms) {
	    return new Promise(resolve => setTimeout(resolve, ms));
	}

    async updateHTML() { }

    insertNode() {
        this.node.id = this.id;
        this.node.innerHTML = this.innerHTML;
        this.class_.split(" ").forEach(addedClass => {
		    this.node.classList.add(addedClass);
        });
		this.parentNode.appendChild(this.node);
    }

    generarInnerHTML() {
        this.innerHTML = this.p("Este método debe ser sobreescrito en la class_ que lo herede."
                + "<br>No se supone que seas capaz de ver esto en la página.");
    }

    div(json = {class_:'', innerHTML:''}) {
        let div = `<div class="${json.class_}"`;
        if(json.id != undefined)
            div+= ` id="${json.id}"`
        return div + `>${json.innerHTML}</div>`;
    }
    
    a(json) {
        let class_ = json.class_ || '';
        let title = json.title || '';
        return `<a title="${title}" class="${class_}" href="${json.url}">${json.innerHTML}</a>`;
    }
    
    img(json = {src : '#', alt : "Sin imagen"}) {
        return `<img src="${json.src}" alt="${json.alt}"/>`;
    }
    
    p(json) {
        return `<p>${json.innerHTML}</p>`;
    }
}