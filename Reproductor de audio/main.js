import { Music } from './music.js';
import { MusicList } from './musicList.js';

const availableSongs = new MusicList('Available', ['all']);

const userPlaylists = [];

// Sistema de selección de canciones
const selectedSongs = new Set();

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
const bulkActionsContainer = document.getElementById('bulk-actions');
const selectionCountDisplay = document.getElementById('selection-count');

// Utilidades para la selección de canciones
function getSelectedSongs() {
    return Array.from(selectedSongs).map(title => availableSongs.list.find(s => s.title === title)).filter(s => s);
}

function updateSelectionUI() {
    const count = selectedSongs.size;
    if (selectionCountDisplay) {
        selectionCountDisplay.innerText = `Selected songs: ${count}`;
    }

    if (!bulkActionsContainer) {
        return;
    }

    const hasSelection = count > 0;
    bulkActionsContainer.querySelectorAll('button[data-bulk-action]').forEach(button => {
        const action = button.getAttribute('data-bulk-action');
        if (action === 'clearSelection') {
            button.disabled = !hasSelection;
            return;
        }
        button.disabled = !hasSelection;
    });
}

function clearSelectedSongs() {
    selectedSongs.clear();
    document.querySelectorAll('.song-checkbox').forEach(cb => cb.checked = false);
    updateSelectionUI();
}

// Objeto con los handlers para cada acción de canciones
const songHandlers = {
    play: (songTitle) => {
        const song = availableSongs.list.find(s => s.title === songTitle);
        if (song) {
            audioPlayer.src = `./music_src/${song.fileName}`;
            audioPlayer.play();
            infoDisplay.innerText = `
        Now playing: ${song.title}   
        File extension: ${song.mediaType}
        Labels: ${song.labels}
        `;
        }
    },
    addToList: (songTitle) => {
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
    },
    deleteFromList: (songTitle) => {
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
    },
    newLabel: (songTitle) => {
        const selectedSong = availableSongs.list.find(s => s.title === songTitle);
        if (!selectedSong) {
            alert("Song not found!");
            return;
        }
        const newLabel = prompt("Choose a label for this song.");
        if (newLabel && newLabel.trim()) {
            selectedSong.labels.push(newLabel.trim());
            alert(`Label "${newLabel}" added to "${songTitle}"`);
        }
    },
    removeLabel: (songTitle) => {
        const selectedSong = availableSongs.list.find(s => s.title === songTitle);
        if (!selectedSong) {
            alert("Song not found!");
            return;
        }
        if (selectedSong.labels.length === 0) {
            alert("This song has no labels!");
            return;
        }
        const labelsList = selectedSong.labels.join("\n");
        const labelToRemove = prompt(`Select a label to remove:\n${labelsList}`);
        if (labelToRemove && selectedSong.labels.includes(labelToRemove)) {
            selectedSong.labels = selectedSong.labels.filter(l => l !== labelToRemove);
            alert(`Label "${labelToRemove}" removed from "${songTitle}"`);
        }
    }
};

const bulkSongHandlers = {
    play: () => {
        const selected = getSelectedSongs();
        if (selected.length === 0) {
            alert('Select at least one song first.');
            return;
        }
        songHandlers.play(selected[0].title);
    },
    addToList: () => {
        const selected = getSelectedSongs();
        if (selected.length === 0) {
            alert('Select at least one song first.');
            return;
        }
        if (userPlaylists.length === 0) {
            alert('Create a playlist first!');
            return;
        }

        const listNames = userPlaylists.map((l, index) => `${index}: ${l.title}`).join('\n');
        const choice = prompt(`Select list index to add ${selected.length} song(s):\n${listNames}`);
        const targetList = userPlaylists[choice];

        if (!targetList) {
            alert('Invalid selection');
            return;
        }

        selected.forEach(song => targetList.addMusic(song));
        renderPlaylists();
        alert(`${selected.length} song(s) added to ${targetList.title}`);
    },
    removeFromList: () => {
        const selected = getSelectedSongs();
        if (selected.length === 0) {
            alert('Select at least one song first.');
            return;
        }
        if (userPlaylists.length === 0) {
            alert('No playlists available!');
            return;
        }

        const listNames = userPlaylists.map((l, index) => `${index}: ${l.title}`).join('\n');
        const choice = prompt(`Select list index to remove ${selected.length} song(s) from:\n${listNames}`);
        const targetList = userPlaylists[choice];

        if (!targetList) {
            alert('Invalid selection');
            return;
        }

        selected.forEach(song => targetList.deleteMusic(song));
        renderPlaylists();
        renderSongs(targetList);
        alert(`${selected.length} song(s) removed from ${targetList.title}`);
    },
    addLabel: () => {
        const selected = getSelectedSongs();
        if (selected.length === 0) {
            alert('Select at least one song first.');
            return;
        }

        const label = prompt('Enter label to add to selected songs:');
        if (!label || !label.trim()) {
            return;
        }

        const normalized = label.trim();
        selected.forEach(song => {
            if (!song.labels.includes(normalized)) {
                song.labels.push(normalized);
            }
        });

        alert(`Label "${normalized}" added to ${selected.length} song(s)`);
    },
    removeLabel: () => {
        const selected = getSelectedSongs();
        if (selected.length === 0) {
            alert('Select at least one song first.');
            return;
        }

        const label = prompt('Enter label to remove from selected songs:');
        if (!label || !label.trim()) {
            return;
        }

        const normalized = label.trim();
        selected.forEach(song => {
            song.labels = song.labels.filter(existing => existing !== normalized);
        });

        alert(`Label "${normalized}" removed from selected songs`);
    },
    clearSelection: () => {
        clearSelectedSongs();
    }
};

function renderSongs(musicList) {
    songsContainer.innerHTML = `<h3>List: ${musicList.title}</h3>`;

    musicList.list.forEach(song => {
        const songDiv = document.createElement('div');
        songDiv.className = 'song-item';
        const isSelected = selectedSongs.has(song.title);
        songDiv.innerHTML = `
            <input type="checkbox" class="song-checkbox" data-song-title="${song.title}" ${isSelected ? 'checked' : ''}>
            <span><strong>${song.title}</strong></span>
            <button class="song-play-btn" data-song-title="${song.title}">Play ▶️</button>
            <br>
            <button class="song-add-to-list-btn" data-song-title="${song.title}">➕ Add to List</button>
            <button class="song-delete-from-list-btn" data-song-title="${song.title}">🗑️ Delete from List</button>
            <br>
            <button class="song-new-label-btn" data-song-title="${song.title}">➕🏷️ New labels</button>
            <button class="song-remove-label-btn" data-song-title="${song.title}">🗑️🏷️ Remove labels</button>
        `;
        songsContainer.appendChild(songDiv);
    });

    // Agregar event listeners a los checkboxes
    document.querySelectorAll('.song-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const songTitle = e.target.getAttribute('data-song-title');
            if (e.target.checked) {
                selectedSongs.add(songTitle);
            } else {
                selectedSongs.delete(songTitle);
            }
            updateSelectionUI();
        });
    });

    updateSelectionUI();
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

// ============ EVENT DELEGATION ============
// Un único listener para todos los botones de canciones
songsContainer.addEventListener('click', (e) => {
    const songTitle = e.target.getAttribute('data-song-title');
    
    if (e.target.classList.contains('song-play-btn')) {
        songHandlers.play(songTitle);
    } else if (e.target.classList.contains('song-add-to-list-btn')) {
        songHandlers.addToList(songTitle);
    } else if (e.target.classList.contains('song-delete-from-list-btn')) {
        songHandlers.deleteFromList(songTitle);
    } else if (e.target.classList.contains('song-new-label-btn')) {
        songHandlers.newLabel(songTitle);
    } else if (e.target.classList.contains('song-remove-label-btn')) {
        songHandlers.removeLabel(songTitle);
    }
});

if (bulkActionsContainer) {
    bulkActionsContainer.addEventListener('click', (e) => {
        const action = e.target.getAttribute('data-bulk-action');
        if (!action || !bulkSongHandlers[action]) {
            return;
        }
        bulkSongHandlers[action]();
    });
}

renderSongs(availableSongs);
renderPlaylists();
updateSelectionUI();