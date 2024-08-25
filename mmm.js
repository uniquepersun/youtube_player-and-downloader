const apiUrls = [
    "https://invidious.reallyaweso.me/api/v1/videos/",
    "https://invidious.jing.rocks/api/v1/videos/",
];

const videoUrlInput = document.getElementById("videoUrl");
const fetchBtn = document.getElementById("fetchBtn");
const videoInfoDiv = document.getElementById("videoInfo");

fetchBtn.addEventListener("click", async () => {
    const videoUrl = videoUrlInput.value.trim();

    if (!videoUrl) {
        alert("I can't understand this much human language.");
        return;
    }

    const videoId = extractvideoid(videoUrl);

    if (videoId) {
        try {
            const videoData = await getVideoInfo(videoId);
            displayVideoInfo(videoData);
        } catch (error) {
            console.error("error fetching info:", error);
            videoInfoDiv.innerHTML = "<p>couldn't find this video.</p>";
        }
    } else {
        alert("this doesn't look like a youtube url.");
    }
});

function extractvideoid(url) {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e|embed)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const match = url.match(regex);
    return match && match[1]; 
}

async function getVideoInfo(videoId) {
    for (const apiUrl of apiUrls) {
        try {
            const response = await fetch(`${apiUrl}${videoId}`);
            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(`Error fetching from ${apiUrl}:`, error);
        }
    }
    throw new Error('All API requests failed.'); 
}

function displayVideoInfo(videoData) {
    const invidiousInstance = "https://invidious.reallyaweso.me"; 
    const videoInfoHTML = `
        <h2>${videoData.title}</h2>
        <img src="${videoData.videoThumbnails[0].url}" alt="${videoData.title} - Thumbnail">
        <p>Duration: ${formatDuration(videoData.lengthSeconds)}</p>
        <p>${videoData.descriptionHtml.replace(/<br>/g, ' ')}</p>
        <a href="${invidiousInstance}/watch?v=${videoData.videoId}" target="_blank">Watch on Invidious</a>
        <br>
        <a href="${videoData.url}" download>Download</a> 
    `;
    videoInfoDiv.innerHTML = videoInfoHTML;
}

function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const formattedTime = [
        hours > 0 ? `${hours}h` : '',
        minutes > 0 ? `${minutes}m` : '',
        `${remainingSeconds}s`,
    ].filter(Boolean).join(' '); 

    return formattedTime;
}