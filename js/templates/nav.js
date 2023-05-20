let navbarNode = document.createElement('nav');
navbarNode.classList = "navbar navbar-expand-lg navbar-dark bg-dark fixed-top";
navbarNode.innerHTML = 
`<div class="container-fluid">
    <div class="justify-content-center text-center" style="position: absolute; width: 100%; right: 0px; z-index: -1;">
      <span class="pt-0 pb-0 navbar-text disabled d-md-block d-lg-none fw-bolder fs-3 font-monospace">
        Ñ
      </span>
    </div>
    <a class="navbar-brand" href="${LINKS.ñ_index}">SpeedruÑ.com</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav">
        <li class="nav-item">
          <a class="nav-link active" aria-current="page" href="${LINKS.ñ_sm64}">Super Mario 64</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="${LINKS.ñ_smo}">Super Mario Odyssey</a>
        </li>
      </ul>
      <span class="navbar-text disabled d-none d-lg-flex fw-bolder fs-2 font-monospace" style="position: absolute; right: 16px; z-index: -1;">
        Ñ
      </span>
    </div>
  </div>`;
document.querySelector("body").appendChild(navbarNode);

let divMargin = document.createElement('div');
divMargin.style = "margin-bottom: 4em;";
document.querySelector("body").appendChild(divMargin);