let footerNode = document.createElement('footer');
footerNode.classList = "text-center";
footerNode.innerHTML = 
`<div class="pt-3">
    <span>ESpeedruÑ.com - 2023</span>
    <div style="height: 40px;">
        <p class="text-white-50 lh-1">
            Toda la información mostrada en esta página es propiedad de <a class="hyperlink" href="https://speedrun.com">speedrun.com</a>.
        </p>
    </div>
    <p class="text-white-50 lh-1">
        Ñ
    </p>
</div>`;
document.querySelector("body").appendChild(footerNode);

activateTooltips();