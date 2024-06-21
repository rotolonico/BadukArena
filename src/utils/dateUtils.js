export function timeAgoFromDate(date) {
    const now = new Date();
    const past = new Date(date);
    const differenceInMilliseconds = now - past;
    const differenceInMinutes = Math.floor(differenceInMilliseconds / (1000 * 60));

    if (differenceInMinutes === 0) {
        return "just now";
    } else if (differenceInMinutes === 1) {
        return "1 minute ago";
    } else {
        return `${differenceInMinutes} minutes ago`;
    }
}
