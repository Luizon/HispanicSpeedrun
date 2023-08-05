// import { searcherNavListener } from "https://espeedruñ.com/js/SearchBox.js";
import { callSearcherNavListener } from "./SearchBox.js";

$("#searcherNavContainer").remove();

function insertaBuscador(nodo) {
    let newNode = document.createElement("div");
    newNode.classList.add("row", "ps-1", "pe-1", "m-0", "me-lg-4", "me-xl-4", "pe-lg-2", "pe-xl-2", "justify-content-center", "justify-content-lg-end", "justify-content-xl-end", "position-relative")
    newNode.style = "width: 100%;";
    newNode.id = "searcherNavContainer";
    newNode.innerHTML = 
`<div class="col p-0">
    <input id="searcherNav" class="form-control" type="search" placeholder="Buscar juego" aria-label="Search" style="width: 100%;">
</div>
<button id="btnSearcherNav" class="btn btn-outline-secondary col-auto btn-search">
    <img src="https://espeedruñ.com/img/search.svg">
</button>
<div class="search-games-container d-none">
    <span class='search-title-label'>Presiona el botón para buscar</span>
</div>`;
    $(nodo).append(newNode);
}

insertaBuscador($("#SearchBoxNewContainer"));
callSearcherNavListener();

$("#btnSearcherNav").on("click", evt => {
    $("#searcherNav").focus();
});