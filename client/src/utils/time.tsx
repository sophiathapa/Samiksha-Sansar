

 export const timeDisplay = (pastTime: string) => {
    const now = new Date();
    const past = new Date(pastTime);
    const diffMs = now.getTime() - past.getTime();

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (seconds < 60) return `${seconds} sec`;
    if (minutes < 60) return `${minutes} min`;
    if (hours < 24) return `${hours} h`;
    if (days < 7) return `${days} d`;
    if (days < 30) return `${weeks} w`;
    if (months < 12) return `${months} mon`;
    return `${years} y`;
  };