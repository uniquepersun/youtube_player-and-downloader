document.getElementById('loadVideo').addEventListener('click', function() {
    var videoUrl = document.getElementById('videoUrl').value;
    var videoId = extractVideoID(videoUrl);
    if (videoId) {
        var pipedUrl = 'https://piped.video/watch?v=' + videoId;
        document.getElementById('videoPlayer').src = pipedUrl;
    } else {
        alert('invalid url');
    }
});

function extractVideoID(url) {
    var regex = /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/;
    var match = url.match(regex);
    return match ? match[1] : null;
}
