export const htmlspecialchars = (str) => {
    if (!str) return ""

    return str.replace(/[&<>"']/g, (s) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    })[s]);
};
export const timeAgo = (date) => {
    const now = new Date()
    const created = new Date(date);

    const diff = Math.floor((now - created) / 1000)

    if (diff < 60) return 'now';

    const minutes = Math.floor(diff / 60)
    if (minutes < 60) return `${minutes} min. ago`

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} h. ago`

    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} d. ago`

    const weeks = Math.floor(days / 7);
    if (days < 30) return `${weeks} w. ago`

    const months = Math.floor(days / 30.44);
    if (months < 12) return `${months} mo. ago`

    const years = Math.floor(months / 12);
    return `${years} y. ago`
}
export function formatTime(timeInSeconds) {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    
    const paddedMinutes = String(minutes).padStart(2, '0');
    const paddedSeconds = String(seconds).padStart(2, '0');
    
    if (hours > 0) {
    return `${hours}:${paddedMinutes}:${paddedSeconds}`;
    }
    return `${minutes}:${paddedSeconds}`;
}
export const ops = {
    '+': (a, b) => a + b, 
    '-': (a, b) => a - b 
}