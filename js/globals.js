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
const LINKS = {
    'ñ_smo' : `${hostname}/leaderboard?juego=smo`,
    'ñ_sm64' : `${hostname}/leaderboard?juego=sm64`,
    'ñ_index' : `${hostname}`,
}
