export function getEnviroment() {
    // return "dev";
    return "prod";
}

export function formatTime(totalSeconds) {
    let hours = Math.floor(totalSeconds / 3600);
    let minutes = Math.floor(totalSeconds / 60 % 60);
    let seconds = Math.floor(totalSeconds % 60);
    let milliseconds = totalSeconds % 1;

    if(hours >= 1) {
        hours+= "h ";
        minutes = formatMinutes(minutes);
        seconds = formatSeconds(seconds);
        milliseconds = formatMilliseconds(milliseconds);
    }
    else {
        hours = "";
        seconds = formatSeconds(seconds);
        minutes = formatMinutes(minutes);
        milliseconds = formatMilliseconds(milliseconds);
    }
    
    return hours + minutes + seconds + milliseconds;;
}

function formatMinutes(minutes) {
    return (minutes >= 10 ? minutes : '0' + minutes) + "m ";
}

function formatSeconds(seconds) {
    return (seconds >= 10 ? seconds : '0' + seconds) + "s";
}

function formatMilliseconds(milliseconds) {
    if(milliseconds == 0)
        return "";
    return ` ${Math.round(milliseconds*1000)}ms`;
}
