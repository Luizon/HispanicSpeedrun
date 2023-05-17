export function formatTime(seconds) {
    let output = 
            Math.floor(seconds / 3600) + "h "
            + Math.floor(seconds / 60 % 60) + "m "
            + seconds % 60 + "s";
    return output;
}