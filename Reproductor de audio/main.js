import { Music } from './music.js';
import { MusicList } from './musicList.js';

// --- 1. INITIAL STATE ---
// The master list (Point 2.c)
const availableSongs = new MusicList('Available', ['all']);

// Point 2.f: Array to store all created lists
const userPlaylists = []; 

// Demo data
const song1 = new Music("Blinding Lights", "Blinding Lights.mp3", ["pop"]);
const song2 = new Music("Despacito", "Despacito.mp3", ["latin", "pop"]);
const song3 = new Music("White Christmas", "White Christmas.mp3", ["classical"]);

availableSongs.addMusic(song1);
availableSongs.addMusic(song2);
availableSongs.addMusic(song3);

// --- 2. DOM ELEMENTS ---
const audioPlayer = document.getElementById('main-audio');
const songsContainer = document.getElementById('songs-container');
const playlistsContainer = document.getElementById('playlists-container');
const infoDisplay = document.getElementById('playback-display');

// --- 3. RENDER FUNCTIONS ---

// Renders songs of a specific list
function renderSongs(musicList) {
    songsContainer.innerHTML = `<h3>List: ${musicList.title}</h3>`;

    musicList.list.forEach(song => {
        const songDiv = document.createElement('div');
        songDiv.className = 'song-item';
        songDiv.innerHTML = `
            <span><strong>${song.title}</strong></span>
            <button onclick="window.playSong('${song.fileName}', '${song.title}')">Play ▶️</button>
            <button onclick="window.addSongToAnotherList('${song.title}')">➕ Add to List</button>
        `;
        songsContainer.appendChild(songDiv);
    });
}

// Point 2.f: Renders the names of all created playlists
function renderPlaylists() {
    playlistsContainer.innerHTML = '';
    userPlaylists.forEach(list => {
        const btn = document.createElement('button');
        btn.innerText = `📁 ${list.title} (${list.list.length} songs)`;
        btn.onclick = () => renderSongs(list); // Click to view this list
        playlistsContainer.appendChild(btn);
    });
}

// --- 4. GLOBAL FUNCTIONS (window.xxx) ---

window.playSong = function (fileName, title) {
    audioPlayer.src = `./music_src/${fileName}`;
    audioPlayer.play();
    infoDisplay.innerText = `Now playing: ${title}`;
};

window.controlAudio = function (action) {
    if (action === 'play') audioPlayer.play();
    if (action === 'pause') audioPlayer.pause();
    if (action === 'stop') {
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
    }
};

window.changeVolume = function (value) {
    audioPlayer.volume = value;
};

// Point 2.h: Filter Master List
window.filterByLabel = function (label) {
    if (label === 'all') {
        renderSongs(availableSongs);
    } else {
        const filteredArray = availableSongs.list.filter(song => song.labels.includes(label));
        const tempContainer = new MusicList(`Filtered: ${label}`, [], filteredArray);
        renderSongs(tempContainer);
    }
};

// Point 2.i: Create new lists
window.addNewList = function () {
    const listName = prompt("Enter the name of the new music list:");
    if (listName) {
        const newList = new MusicList(listName);
        userPlaylists.push(newList);
        renderPlaylists();
        alert(`Playlist "${listName}" created!`);
    }
};

// Point 2.j: Add a song from 'Available' to a user list
window.addSongToAnotherList = function (songTitle) {
    if (userPlaylists.length === 0) {
        alert("Create a playlist first!");
        return;
    }

    // Find the song object in Available
    const songToAdd = availableSongs.list.find(s => s.title === songTitle);
    
    // Show user names of lists to pick one
    const listNames = userPlaylists.map((l, index) => `${index}: ${l.title}`).join("\n");
    const choice = prompt(`Select list index to add "${songTitle}":\n${listNames}`);

    if (userPlaylists[choice]) {
        userPlaylists[choice].addMusic(songToAdd);
        renderPlaylists();
        alert("Song added!");
    }
};

// --- 5. INITIAL RUN ---
renderSongs(availableSongs);
renderPlaylists();