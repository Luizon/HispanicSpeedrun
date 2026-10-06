let navbarNode = document.createElement('nav');
let lastFocusedElement = null;
navbarNode.classList = "navbar navbar-expand-lg navbar-dark bg-dark fixed-top";
navbarNode.innerHTML = 
`<span class="user-select-none text-white-50 fw-bolder fs-3 font-monospace pt-0 pb-0 d-md-flex justify-content-center d-lg-none" style="top: 0.43em; width: 100%; left: 0px; position: absolute; z-index: -1;">
  Ñ
</span>
<div class="container-fluid">
  <a class="" href="${LINKS.ñ_index}" style="width: 200px;">
    <img src="https://espeedruñ.com/assets/img/banner.png" style="height: 45px; position: absolute; top: 5px; left: 8px;" />
  </a>
  <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse" id="navbarNav">
  <ul class="navbar-nav">
    <li class="nav-item">
      <a class="nav-link" href="${LINKS.ñ_index}/acercaDe/">Acerca de</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="javascript:contactUs()">Contacto</a>
    </li>
  </ul>
  <div id="searcherNavContainer" class="row ps-1 pe-1 m-0 me-lg-4 me-xl-4 pe-lg-2 pe-xl-2 justify-content-center justify-content-lg-end justify-content-xl-end position-relative" style="width: 100%;">
    <div class="col p-0">
      <input id="searcherNav" class="form-control" type="search" placeholder="Buscar juego" aria-label="Search">
    </div>
    <button id="btnSearcherNav" class="btn btn-outline-secondary col-auto">
      <img src="https://espeedruñ.com/img/search.svg">
    </button>
    <div class="search-games-container d-none">
      <span class='search-title-label'>Presiona el botón para buscar</span>
    </div>
  </div>
  <span class="user-select-none d-none d-lg-flex" style="position: absolute; right: 16px;">
    <span class="navbar-text fw-bolder fs-2 font-monospace">Ñ</span>
  </span>
  </div>
</div>`;
navbarNode.classList.add("mb-4");
document.querySelector("body").appendChild(navbarNode);

let divUpperSpace = document.createElement('div');
divUpperSpace.style = "padding-top: 5em;";
document.querySelector("body").appendChild(divUpperSpace);

$("#btnSearcherNav").on("click", evt => {
  $("#searcherNav").focus();
});

function contactUs() {
  bootbox.dialog({
    title: "Contacto",
    onEscape : true,
    backdrop: true,
    message: "¡Hola! Soy Luizón, el creador de esta página Ñ 🤠"
        + "<br>Si deseas colaborar o quieres reportar un problema puedes contactarme en <a class='hyperlink dark' href='https://discord.gg/jjgDVGbySx'>mi server de discord.</a>",
  });
}
