
const AVATAR_STYLE = 'pixel-art'; // DiceBear style
const COUNT = 100;

export const generateAvatarUrls = () => {
    const urls = [];
    for (let i = 0; i < COUNT; i++) {
        // specialized seed for consistent randomness or just index
        const seed = `player-${i}`;
        urls.push(`https://api.dicebear.com/9.x/${AVATAR_STYLE}/svg?seed=${seed}`);
    }
    return urls;
};

export const preloadImages = (urls) => {
    const promises = urls.map((url) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = url;
            img.onload = resolve;
            img.onerror = resolve; // Continue even if one fails
        });
    });
    return Promise.all(promises);
};

// Singleton to hold the master images if needed, or just cache in browser
export const masterImages = generateAvatarUrls();
