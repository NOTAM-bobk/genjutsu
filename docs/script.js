const REPO = 'iamovi/genjutsu';
const TAG = 'v.1.0.0.0';
const ASSET_NAME = 'genjutsu.apk';

async function fetchDownloadCount() {
    try {
        const response = await fetch(`https://api.github.com/repos/${REPO}/releases/tags/${TAG}`);
        const data = await response.json();
        const asset = data.assets.find(a => a.name === ASSET_NAME);
        if (asset) {
            const countElement = document.getElementById('download-count');
            if (countElement) {
                countElement.innerText = asset.download_count.toLocaleString();
            }
        } else {
            const countElement = document.getElementById('download-count');
            if (countElement) {
                countElement.innerText = '0';
            }
        }
    } catch (error) {
        console.error('Error fetching download count:', error);
        const countElement = document.getElementById('download-count');
        if (countElement) {
            countElement.innerText = '100+';
        }
    }
}

document.addEventListener('DOMContentLoaded', fetchDownloadCount);
