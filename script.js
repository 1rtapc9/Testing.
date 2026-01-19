let currentAudio = null;

// Mock song data (replace later with Spotify easily)
const songs = [
    {
        id: 1,
        title: "Blinding Lights",
        artist: "The Weeknd",
        artwork: "https://via.placeholder.com/100",
        preview: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    },
    {
        id: 2,
        title: "Levitating",
        artist: "Dua Lipa",
        artwork: "https://via.placeholder.com/100",
        preview: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
    },
    {
        id: 3,
        title: "Shape of You",
        artist: "Ed Sheeran",
        artwork: "https://via.placeholder.com/100",
        preview: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
    }
];

let playlist = JSON.parse(localStorage.getItem("playlist")) || [];

const resultsDiv = document.getElementById("results");
const playlistDiv = document.getElementById("playlist");
const searchInput = document.getElementById("searchInput");

function renderSongs(list, container, isPlaylist = false) {
    container.innerHTML = "";

    list.forEach(song => {
        const card = document.createElement("div");
        card.className = "song-card";

        card.innerHTML = `
            <img src="${song.artwork}">
            <div class="song-info">
                <h3>${song.title}</h3>
                <p>${song.artist}</p>
                <audio src="${song.preview}" controls></audio>
                <button class="${isPlaylist ? "remove-btn" : "add-btn"}">
                    ${isPlaylist ? "Remove" : "Add to Playlist"}
                </button>
            </div>
        `;

        const audio = card.querySelector("audio");
        audio.addEventListener("play", () => {
            if (currentAudio && currentAudio !== audio) {
                currentAudio.pause();
            }
            currentAudio = audio;
        });

        const button = card.querySelector("button");
        button.onclick = () => {
            if (isPlaylist) {
                removeFromPlaylist(song.id);
            } else {
                addToPlaylist(song);
            }
        };

        container.appendChild(card);
    });
}

function addToPlaylist(song) {
    if (!playlist.find(s => s.id === song.id)) {
        playlist.push(song);
        savePlaylist();
    }
}

function removeFromPlaylist(id) {
    playlist = playlist.filter(song => song.id !== id);
    savePlaylist();
}

function savePlaylist() {
    localStorage.setItem("playlist", JSON.stringify(playlist));
    renderPlaylist();
}

function renderPlaylist() {
    renderSongs(playlist, playlistDiv, true);
}

searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    const filtered = songs.filter(song =>
        song.title.toLowerCase().includes(query) ||
        song.artist.toLowerCase().includes(query)
    );
    renderSongs(filtered, resultsDiv);
});

// Initial render
renderSongs(songs, resultsDiv);
renderPlaylist();
