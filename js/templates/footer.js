let footerNode = document.createElement('footer');
footerNode.classList = "text-center";
footerNode.innerHTML = 
`<div class="pt-3">
    <span>ESpeedruÑ.com - ${(new Date()).getFullYear()}</span>
    <div style="height: 40px;">
        <p class="text-white-50 lh-1">
            Toda la información mostrada en esta página es propiedad de <a class="hyperlink" href="https://speedrun.com">speedrun.com</a>.
        </p>
    </div>
    <p class="lh-1 user-select-none">
        <span class="fw-bolder text-white-50">&nbspÑ&nbsp</span>
    </p>
</div>`;
document.querySelector("body").appendChild(footerNode);

activateTooltips();