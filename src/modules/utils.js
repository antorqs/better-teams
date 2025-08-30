// Utility functions
function hashCode(str) {
    let hash = 0;
    if (str.length === 0) return hash;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash;
}

function extractYouTubeVideoId(url) {
    url = url.replace("youtu.be/", "youtube.com/watch?v=");
    const match = url.match(/(?:watch\?v=|v\/)([\w-]{11})/);
    return match ? match[1] : null;
}

function extractInstagramPostId(url) {
    const match = url.match(/\/p\/([^\/?]+)/);
    return match ? match[1] : null;
}

export { hashCode, extractYouTubeVideoId, extractInstagramPostId };
