const clientId = "YOUR_SPOTIFY_CLIENT_ID";
const clientSecret = "YOUR_SPOTIFY_CLIENT_SECRET";

let accessToken = "";

// Get Spotify access token
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

// Search for a song
async function searchSong() {
    if (!accessToken) {
        await getAccessToken();
    }

    const query = document.getElementById("searchInput").value;
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";

    const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=5`,
        {
            headers: {
                "Authorization": "Bearer " + accessToken
            }
        }
    );

    const data = await response.json();

    data.tracks.items.forEach(track => {
        const div = document.createElement("div");
        div.className = "song";

        div.innerHTML = `
            <h3>${track.name}</h3>
            <p>${track.artists[0].name}</p>
            ${
                track.preview_url
                    ? `<audio controls src="${track.preview_url}"></audio>`
                    : "<p>No preview available</p>"
            }
        `;

        resultsDiv.appendChild(div);
    });
}
