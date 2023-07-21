let coffeeNode = document.createElement('button');
coffeeNode.classList = "btn coffee-btn";
coffeeNode.innerHTML = 
`<div class="p-0 text-dark run-bar-runner coffee-container">
    <img src="http://localhost:64/HispanicSpeedrun/img/coffee.svg" class="coffee-img me-2">
    Cómprame un café
</div>`;

coffeeNode.addEventListener("click", evt => {
    bootbox.dialog({
        title: "¡Muchas gracias!",
        message: "Esta página existirá siempre que speedrun.com no me solicite que se elimine. Yo me encargaré de pagar el hosting y el dominio."
                + "<br>¡Sin embargo, agradezco mucho el apoyo!"
                + "<br><br><a href='https://paypal.me/pluizon'>Este es mi Paypal para realizar transferencias directas ;)</a>",
        onEscape: true
    });
});

document.querySelector("body").appendChild(coffeeNode);