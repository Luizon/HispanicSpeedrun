let navbarNode = document.createElement('nav');
navbarNode.classList = "navbar navbar-expand-lg navbar-dark bg-dark fixed-top";
navbarNode.innerHTML = 
`<span class="pt-0 pb-0 navbar-text disabled d-md-block d-lg-none fw-bolder fs-3 font-monospace" style="top: 0.43em; width: 100%; left: 0px; position: absolute; z-index: -1;">
  Ñ
</span>
<div class="container-fluid">
  <a class="navbar-brand" href="${LINKS.ñ_index}">SpeedruÑ.com</a>
  <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse" id="navbarNav">
    <ul class="navbar-nav">
      <li class="nav-item">
        <a class="nav-link" href="${LINKS.ñ_sm64}">Super Mario 64</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="${LINKS.ñ_smo}">Super Mario Odyssey</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="javascript:acercaDe()">Acerca de</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="javascript:contactanos()">Contáctanos</a>
      </li>
    </ul>
    <span class="navbar-text disabled d-none d-lg-flex fw-bolder fs-2 font-monospace" style="position: absolute; right: 16px; z-index: -1;">
      Ñ
    </span>
  </div>
</div>`;
navbarNode.classList.add("mb-4");
document.querySelector("body").appendChild(navbarNode);

let divMargin = document.createElement('div');
document.querySelector("body").appendChild(divMargin);

let divDesarrollando = document.createElement('p');
divDesarrollando.id = "divMensajeTope";
divDesarrollando.style = "padding-top: 4em;";
// divDesarrollando.innerHTML = 'Esta página actualmente está en desarrollo y en fase de pruebas.';
document.querySelector("body").appendChild(divDesarrollando);


function acercaDe() {
  bootbox.dialog({
    title: "Acerca de",
    onEscape : true,
    message: "Esta página fue creada sin fines de lucro, con el único propósito de documentar acerca de las posiciones mundiales de los speedrunners hispanohablantes."
      + "<br>Es posible que encuentres jugadores que no sean hispanohablantes en las tablas o que no encuentres speedrunners que conozcas, esto es debido a que se filtra según la bandera del jugador. Si en speedrun.com no tiene colocado un país hispano entonces no se mostrará en las tablas de esta página."
      + "<br><br>Por su puesto, esta página está sujeta a cambios."
  });
}

function contactanos() {
  bootbox.dialog({
    title: "Contáctanos",
    onEscape : true,
    message: "¡Hola! Soy Luizón, el creador de esta página Ñ 🤠"
        + "<br>Si deseas colaborar o quieres reportar un problema puedes contactarme en <a class='hyperlink dark' href='https://discord.gg/jjgDVGbySx'>mi server de discord.</a>"
  });
}


alert("SpeedruÑ.com esta en mentenimiento actualmente, por lo que fácilmente puede ocurrir errores");