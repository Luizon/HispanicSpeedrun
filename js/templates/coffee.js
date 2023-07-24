let coffeeNode = document.createElement('button');
coffeeNode.classList = "btn coffee-btn";
coffeeNode.innerHTML = 
`<div class="p-0 run-bar-runner coffee-container" style="color: inherit;">
    <img src="https://speedruñ.com/img/coffee.svg" style="color: inherit;" class="coffee-img me-2" alt=":)" title="Anda, hago esto gratis, pero igual aceptaré un café si me lo patrocinas ;)">
    <span id="coffeeBtnTxt">Cómprame un café :)</span>
</div>`;

coffeeNode.addEventListener("click", evt => {
    bootbox.dialog({
        title: "¡Muchas gracias por apoyar!",
        message: "Yo me encargaré de pagar el hosting y el dominio de la página, así como darle soporte. Mientras speedrun.com no me solicite que se elimine, speedruñ.com existirá ;)"
        + "<br>Eso no significa que no puedas <b style='color: inherit;'>motivarme a continuar</b> comprándome un cafécito 👀"
        + "<br><br><a href='https://paypal.me/pluizon'>Este es mi Paypal para realizar transferencias directas ;)</a>",
        onEscape: true
    });
});

document.querySelector("body").appendChild(coffeeNode);