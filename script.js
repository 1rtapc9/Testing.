let currentlyPlaying = null;

async function searchSongs() {
    const query = document.getElementById("searchInput").value.trim();
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";

    if (!query) return;

    const response = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=15`
    );

    const data = await response.json();

    data.results.forEach(song => {
        if (!song.previewUrl) return;

        const songDiv = document.createElement("div");
        songDiv.className = "song";

        songDiv.innerHTML = `
            <img src="${song.artworkUrl100}" alt="Album Art">
            <div class="song-details">
                <h3>${song.trackName}</h3>
                <p>${song.artistName}</p>
                <audio controls src="${song.previewUrl}"></audio>
            </div>
        `;

        const audio = songDiv.querySelector("audio");

        audio.addEventListener("play", () => {
            if (currentlyPlaying && currentlyPlaying !== audio) {
                currentlyPlaying.pause();
            }
            currentlyPlaying = audio;
        });

        resultsDiv.appendChild(songDiv);
    });
}
