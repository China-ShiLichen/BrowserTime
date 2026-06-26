export function formatTime(ms) {
    const seconds = Math.floor(ms / 1000);

    if (seconds < 60) {
        return `${seconds}s`;
    }

    if (seconds < 3600) {
        return `${Math.floor(seconds / 60)}min`;
    }

    return `${(seconds / 3600).toFixed(1)}h`;
}
