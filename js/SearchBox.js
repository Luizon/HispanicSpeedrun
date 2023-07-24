import { SearchBar } from "./POO/SearchBar.js";

export function searcherNavListener() {
    $("#searcherNav").on("focus", evt => {
        $(".search-games-container").width($("#searcherNavContainer").width());
        if($(".search-games-container").hasClass("d-none"))
            $(".search-games-container").removeClass("d-none");
        // console.log($("#searcherNavContainer").width());
    });
    $("#searcherNav").on("blur", evt => {
        if(!$(".search-games-container").hasClass("d-none"))
            $(".search-games-container").addClass("d-none");
    });
    $("#btnSearcherNav").on("click", evt => {
        console.log(evt);
        new SearchBar({
            url : `https://speedruñ.com/leaderboard/?juego=sm64`,
            name : "Super Mario 64",
            gameCover : "https://www.speedrun.com/static/game/o1y9wo6q/cover?v=82fa0a4",
            parentNode: $(".search-games-container")[0],
            year : 1996,
        });
            // $(".search-games-container").width($("#searcherNavContainer").width()-24);
        // console.log($("#searcherNavContainer").width());
    });
    // new SearchBar({
    //     url : `https://speedruñ.com/leaderboard/?juego=${json.game}`,
    //     name : apiAnswer.data.names.international,
    //     gameCover : `${apiAnswer.data.assets["cover-small"].uri.replace("gameasset", "static/game")}`,
    //     parentNode: $("#divRunBars")[0],
    //     year : apiAnswer.data.released,
    //     // class_ : `row-${hPosition % 2 > 0 ? 'odd' : 'even'}`,
    // });
}
