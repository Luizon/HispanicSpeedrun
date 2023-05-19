export function formatTime(totalSeconds) {
    let hours = Math.floor(totalSeconds / 3600);
    let minutes = Math.floor(totalSeconds / 60 % 60);
    let seconds = Math.floor(totalSeconds % 60);
    let milliseconds = totalSeconds % 1;

    if(hours >= 1) {
        hours+= "h ";
        minutes = setMinutes(minutes);
        seconds = setSeconds(seconds);
        milliseconds = setMilliseconds(milliseconds);
    }
    else {
        hours = "";
        if(minutes >= 1)
            minutes+= "m ";
        else
            minutes = "";
        seconds = setSeconds(seconds);
        milliseconds = setMilliseconds(milliseconds);
    }
    
    return hours + minutes + seconds + milliseconds;;
}

function setMinutes(minutes) {
    if(minutes == 0)
        return "";
    return minutes + "m ";
}

function setSeconds(seconds) {
    if(seconds == 0)
        return "";
    return seconds + "s";
}

function setMilliseconds(milliseconds) {
    if(milliseconds == 0)
        return "";
    return ` ${Math.round(milliseconds*1000)}ms`;
}
