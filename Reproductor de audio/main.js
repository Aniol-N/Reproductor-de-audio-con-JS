import { Music } from './music.js';
import { MusicList } from './musicList.js';

const availableSongs = new MusicList('Available', ['all']);

const userPlaylists = [];

const song1 = new Music("Blinding Lights", "Blinding Lights.mp3", ["pop"]);
const song2 = new Music("Despacito", "Despacito.mp3", ["latin", "pop"]);
const song3 = new Music("White Christmas", "White Christmas.mp3", ["classical"]);

availableSongs.addMusic(song1);
availableSongs.addMusic(song2);
availableSongs.addMusic(song3);

const audioPlayer = document.getElementById('main-audio');
const songsContainer = document.getElementById('songs-container');
const playlistsContainer = document.getElementById('playlists-container');
const infoDisplay = document.getElementById('playback-display');

function renderSongs(musicList) {
    songsContainer.innerHTML = `<h3>List: ${musicList.title}</h3>`;

    musicList.list.forEach(song => {
        const songDiv = document.createElement('div');
        songDiv.className = 'song-item';
        songDiv.innerHTML = `
            <span><strong>${song.title}</strong></span>
            <button onclick="window.playSong('${song.fileName}', '${song.title}')">Play ▶️</button>
            <button onclick="window.addSongToAnotherList('${song.title}')">➕ Add to List</button>
            <button onclick="window.deleteSongFromSelectedList('${song.title}')">🗑️ Delete from List</button>
        `;
        songsContainer.appendChild(songDiv);
    });
}

function renderPlaylists() {
    playlistsContainer.innerHTML = '';
    userPlaylists.forEach(list => {
        const btn = document.createElement('button');
        btn.innerText = `📁 ${list.title} (${list.list.length} songs)`;
        btn.onclick = () => renderSongs(list);
        playlistsContainer.appendChild(btn);
    });
}

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

window.filterByLabel = function (label) {
    if (label === 'all') {
        renderSongs(availableSongs);
    } else {
        const filteredArray = availableSongs.list.filter(song => song.labels.includes(label));
        const tempContainer = new MusicList(`Filtered: ${label}`, [], filteredArray);
        renderSongs(tempContainer);
    }
};

window.addNewList = function () {
    const listName = prompt("Enter the name of the new music list:");
    if (listName) {
        const newList = new MusicList(listName);
        userPlaylists.push(newList);
        renderPlaylists();
        alert(`Playlist "${listName}" created!`);
    }
};

window.addSongToAnotherList = function (songTitle) {
    if (userPlaylists.length === 0) {
        alert("Create a playlist first!");
        return;
    }

    const songToAdd = availableSongs.list.find(s => s.title === songTitle);

    const listNames = userPlaylists.map((l, index) => `${index}: ${l.title}`).join("\n");
    const choice = prompt(`Select list index to add "${songTitle}":\n${listNames}`);

    if (userPlaylists[choice]) {
        userPlaylists[choice].addMusic(songToAdd);
        renderPlaylists();
        alert("Song added!");
    }
};

window.deleteSongFromSelectedList = function (songTitle) {
    if (userPlaylists.length === 0) {
        alert("No music available to delete!");
        return;
    }

    const songToRemove = availableSongs.list.find(s => s.title === songTitle);
    const listNames = userPlaylists.map((l, index) => `${index}: ${l.title}`).join("\n");
    const choice = prompt(`Select the PLAYLIST index to remove "${songTitle}" from:\n${listNames}`);
    const selectedList = userPlaylists[choice];
    if (selectedList) {
        selectedList.deleteMusic(songToRemove);
        renderPlaylists();
        renderSongs(selectedList);
        alert(`Song "${songTitle}" removed from ${selectedList.title}`);
    } else {
        alert("Invalid selection");
    }
};

renderSongs(availableSongs);
renderPlaylists();