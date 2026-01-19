const clientId = "YOUR_SPOTIFY_CLIENT_ID";
const clientSecret = "YOUR_SPOTIFY_CLIENT_SECRET";

let accessToken = "";

// Get access token
async function getAccessToken() {
    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": "Basic " + btoa(clientId + ":" + clientSecret)
        },
        body: "grant_type=client_credentials"
    });

    const data = await response.json();
    accessToken = data.access_token;
}

// Search songs by name
async function searchSongs() {
    const query = document.getElementById("searchInput").value.trim();
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";

    if (!query) return;

    if (!accessToken) {
        await getAccessToken();
    }

    const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`,
        {
            headers: {
                "Authorization": "Bearer " + accessToken
            }
        }
    );

    const data = await response.json();

    data.tracks.items.forEach(track => {
        const songDiv = document.createElement("div");
        songDiv.className = "song";

        const artists = track.artists.map(a => a.name).join(", ");

        songDiv.innerHTML = `
            <h3>${track.name}</h3>
            <p>${artists}</p>
            ${
                track.preview_url
                    ? `<audio controls src="${track.preview_url}"></audio>`
                    : `<p>No preview available</p>`
            }
        `;

        resultsDiv.appendChild(songDiv);
    });
}

