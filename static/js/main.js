document.getElementById('video-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const videoUrl = document.getElementById('video-url').value;
    const videoId = extractVideoId(videoUrl);
    if (videoId) {
        fetchVideoInfo(videoId);
    } else {
        alert('Invalid YouTube URL');
    }
});

function extractVideoId(url) {
    try {
        const urlObj = new URL(url);
        const videoId = urlObj.searchParams.get('v');
        console.log('Extracted Video ID:', videoId);
        return videoId;
    } catch (error) {
        console.error('Error extracting video ID:', error);
        return null;
    }
}

async function fetchVideoInfo(videoId) {
    const apiUrls = [
        `https://invidious.reallyaweso.me/api/v1/videos/${videoId}`,
        `https://invidious.jing.rocks/api/v1/videos/${videoId}`
    ];
    
    let data;
    
    for (const apiUrl of apiUrls) {
        try {
            const response = await fetch(apiUrl);
            if (response.ok) {
                data = await response.json();
                console.log('Fetched Video Info:', data);
                displayVideoInfo(data);
                return;
            } else {
                console.error(`Failed to fetch from ${apiUrl}: ${response.statusText}`);
            }
        } catch (error) {
            console.error(`Error fetching from ${apiUrl}:`, error);
        }
    }

    alert('Failed to fetch video info from all available APIs.');
}

function displayVideoInfo(data) {
    const videoInfoDiv = document.getElementById('video-info');
    const videoStreamUrl = data.adaptiveFormats ? data.adaptiveFormats[0].url : null;

    videoInfoDiv.innerHTML = `
        <h2>${data.title}</h2>
        <p>${data.description}</p>
        <p>Duration: ${data.length_seconds ? data.length_seconds : "undefined"} seconds</p>
        <a href="https://www.youtube.com/watch?v=${data.videoId}">Watch on YouTube</a>
        ${videoStreamUrl ? `<video controls src="${videoStreamUrl}" style="width:100%; max-width:720px;"></video>` : "<p>Video stream not available.</p>"}
    `;
}
