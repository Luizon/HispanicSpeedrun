function getSubcategories(json = {}) {
	if(subcategoriesString.length == 0) // no hay subcategorias
		return "";
	let output = "";
	let subcategoryName = json.name || false;
	let subcategoryValue = json.label || false;

    subcategories = subcategoriesString.split(",");
    subcategories.forEach( subcategory => {
        subcategory = subcategory.split("@");
        output+= subcategory[0] + "@";
        if(subcategoryName && subcategory[0].toLowerCase() == subcategoryName.toLowerCase())
            output+= subcategoryValue + ",";
        else
            output+= subcategory[1] + ",";
    });
    output = output.substring(0, output.length - 1);

    return output;
}

function redirectTo(url, variable) { // BUENA PO
	if(variable)
		window.location.href = `${url}&subcategorias=${variable}`;
	else
		window.location.href = `${url}`;
}

// top 4 img
var topImg = {
    1 : null,
    2 : null,
    3 : null,
    4 : null,
}

// counters
var objCounter = 0;

// constants
const SPEEDRUN_API = "https://www.speedrun.com/api/v1";
const SPEEDRUN_API_V2 = "https://www.speedrun.com/api/v2";
const DEFAULT_LIMIT = 300;
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

// arrays
const HISPANIC_COUNTRYS = {
    'argentina' : 'Argentina',
    'bolivia' : 'Bolivia',
    'catalonia' : 'Cataluña',
    'chile' : 'Chile',
    'colombia' : 'Colombia',
    'costa rica' : 'Costa Rica',
    'cuba' : 'Cuba',
    'dominican republic' : 'Republica dominicana',
    'el salvador' : 'El Salvador',
    'ecuador' : 'Ecuador',
    'equatorial guinea' : 'Guinea Ecuatorial', // (país de habla hispana en África)
    'guatemala' : 'Guatemala',
    'honduras' : 'Honduras',
    'mexico' : 'México',
    'nicaragua' : 'Nicaragua',
    'panama' : 'Panamá',
    'paraguay' : 'Paraguay',
    'peru' : 'Perú',
    'puerto rico' : 'Puerto Rico',
    'spain' : 'España',
    'uruguay' : 'Uruguay',
    'venezuela' : 'Venezuela',
}
const HISPANIC_AREA_ID = {
    'ar' : 'Argentina',
    'bo' : 'Bolivia',
    'ct' : 'Cataluña',
    'cl' : 'Chile',
    'co' : 'Colombia',
    'cr' : 'Costa Rica',
    'cu' : 'Cuba',
    'do' : 'Republica dominicana',
    'sv' : 'El Salvador',
    'ec' : 'Ecuador',
    '____' : 'Guinea Ecuatorial', // (país de habla hispana en África) // no tengo idea si speedrun.com tiene este pais tbh
    'gt' : 'Guatemala',
    'hn' : 'Honduras',
    'mx' : 'México',
    'ni' : 'Nicaragua',
    'pa' : 'Panamá',
    'py' : 'Paraguay',
    'pe' : 'Perú',
    'pr' : 'Puerto Rico',
    'es' : 'España',
    'uy' : 'Uruguay',
    've' : 'Venezuela',
}
const LINKS = {
    'ñ_smo' : `${hostname}/leaderboard?juego=smo`,
    'ñ_sm64' : `${hostname}/leaderboard?juego=sm64`,
    'ñ_index' : `${hostname}`,
}

// GLOBALS
var subcategoriesString = "";
