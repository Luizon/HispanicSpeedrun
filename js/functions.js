export function formatTime(seconds) {
    let output = 
            seconds / 3600 >= 0 ? Math.floor(seconds / 3600) + "h " : ""
            + Math.floor(seconds / 60 % 60) + "m "
            + seconds % 60 + "s";
    return output;
}