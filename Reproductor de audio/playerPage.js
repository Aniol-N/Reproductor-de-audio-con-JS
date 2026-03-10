import { Music } from './music.js';
import { MusicList } from './musicList.js';

const LABEL_OPTIONS = ['pop', 'rock', 'hiphop', 'electronic', 'latin', 'jazz', 'classical', 'reggae', 'rnb'];
const VALID_EXTENSIONS = ['mp3', 'ogg', 'wav'];

const availableSongs = new MusicList('Available', ['all']);
const playlistMap = new Map();
let currentSongsView = availableSongs;

availableSongs.addMusic(new Music('Blinding Lights', 'Blinding Lights.mp3', ['pop']));
availableSongs.addMusic(new Music('Despacito', 'Despacito.mp3', ['latin', 'pop']));
availableSongs.addMusic(new Music('White Christmas', 'White Christmas.mp3', ['classical']));

const songsContainer = document.getElementById('songs-container');
const playlistsContainer = document.getElementById('playlists-container');
const infoDisplay = document.getElementById('playback-display');
const audioPlayer = document.getElementById('main-audio');
const labelFilter = document.getElementById('labelFilter');
const volumeSlider = document.getElementById('volume-slider');
const controlPlay = document.getElementById('control-play');
const controlPause = document.getElementById('control-pause');
const controlStop = document.getElementById('control-stop');

const musicForm = document.getElementById('music-form');
const musicTitleInput = document.getElementById('music-title');
const musicFileSelect = document.getElementById('music-file');
const musicLabelsContainer = document.getElementById('music-labels');
const musicSubmitButton = document.getElementById('music-submit');
const musicTitleFeedback = document.getElementById('music-title-feedback');
const musicFileFeedback = document.getElementById('music-file-feedback');
const musicLabelsFeedback = document.getElementById('music-labels-feedback');

const playlistForm = document.getElementById('playlist-form');
const playlistTitleInput = document.getElementById('playlist-title');
const playlistLabelsContainer = document.getElementById('playlist-labels');
const playlistSongsSelect = document.getElementById('playlist-songs');
const playlistTitleFeedback = document.getElementById('playlist-title-feedback');
const playlistLabelsFeedback = document.getElementById('playlist-labels-feedback');
const playlistSongsFeedback = document.getElementById('playlist-songs-feedback');
const playlistFormFeedback = document.getElementById('playlist-form-feedback');

function setFeedback(element, message, type) {
    element.innerText = message;
    element.classList.remove('ok', 'error');
    if (type) {
        element.classList.add(type);
    }
}

function getCheckedValues(containerElement) {
    return Array.from(containerElement.querySelectorAll('input[type="checkbox"]:checked')).map(input => input.value);
}

function renderLabelCheckboxes(containerElement, namePrefix) {
    containerElement.innerHTML = LABEL_OPTIONS.map(label => `
        <label>
            <input type="checkbox" name="${namePrefix}" value="${label}">
            ${label}
        </label>
    `).join('');
}

function findSongByTitle(songTitle) {
    return availableSongs.list.find(song => song.title === songTitle);
}

function renderFilterOptions() {
    const labels = new Set(['all']);
    availableSongs.list.forEach(song => song.labels.forEach(label => labels.add(label)));

    const currentValue = labelFilter.value || 'all';
    labelFilter.innerHTML = Array.from(labels)
        .map(label => `<option value="${label}">${label === 'all' ? 'All labels' : label}</option>`)
        .join('');

    if (Array.from(labels).includes(currentValue)) {
        labelFilter.value = currentValue;
    } else {
        labelFilter.value = 'all';
    }
}

function refreshSongsSelects() {
    const uniqueFiles = [...new Set(availableSongs.list.map(song => song.fileName))];
    musicFileSelect.innerHTML = uniqueFiles.map(fileName => `<option value="${fileName}">${fileName}</option>`).join('');
    playlistSongsSelect.innerHTML = availableSongs.list.map(song => `<option value="${song.title}">${song.title}</option>`).join('');
}

function renderSongs(musicList) {
    currentSongsView = musicList;
    songsContainer.innerHTML = `<h3>List: ${musicList.title}</h3>`;

    musicList.list.forEach(song => {
        const labelsText = song.labels.length > 0 ? song.labels.join(', ') : 'none';
        const row = document.createElement('div');
        row.className = 'song-item';
        row.innerHTML = `
            <span><strong>${song.title}</strong> (${song.fileName}) - Labels: ${labelsText}</span>
            <div class="song-actions">
                <button type="button" class="song-play-btn" data-song-title="${song.title}">Play ▶️</button>
                <button type="button" class="song-add-to-list-btn" data-song-title="${song.title}">➕ Add to List</button>
                <button type="button" class="song-remove-from-list-btn" data-song-title="${song.title}">🗑️ Remove from List</button>
                <button type="button" class="song-add-label-btn" data-song-title="${song.title}">🏷️ Add Label</button>
                <button type="button" class="song-remove-label-btn" data-song-title="${song.title}">🧹 Remove Label</button>
            </div>
        `;
        songsContainer.appendChild(row);
    });
}

function renderPlaylists() {
    playlistsContainer.innerHTML = '';
    playlistMap.forEach(list => {
        const button = document.createElement('button');
        button.type = 'button';
        button.dataset.playlistTitle = list.title;
        button.innerText = `📁 ${list.title} (${list.list.length} songs)`;
        playlistsContainer.appendChild(button);
    });
}

function validateMusicForm() {
    const title = musicTitleInput.value.trim();
    const fileName = musicFileSelect.value;
    const labels = getCheckedValues(musicLabelsContainer);

    const titleValid = title.length >= 2 && title.length <= 20;
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    const fileValid = VALID_EXTENSIONS.includes(extension);
    const labelsValid = labels.length > 0;

    setFeedback(musicTitleFeedback, titleValid ? 'OK' : 'Title must contain between 2 and 20 characters.', titleValid ? 'ok' : 'error');
    setFeedback(musicFileFeedback, fileValid ? 'OK' : 'File extension must be mp3, ogg or wav.', fileValid ? 'ok' : 'error');
    setFeedback(musicLabelsFeedback, labelsValid ? 'OK' : 'Select at least one label.', labelsValid ? 'ok' : 'error');

    const valid = titleValid && fileValid && labelsValid;
    musicSubmitButton.disabled = !valid;
    return valid;
}

function validatePlaylistTitleOnly() {
    const title = playlistTitleInput.value.trim();
    const valid = title.length >= 2 && title.length <= 10;
    setFeedback(playlistTitleFeedback, valid ? 'Valid title format (2-10 characters).' : 'Invalid title. Use 2 to 10 characters.', valid ? 'ok' : 'error');
    return valid;
}

function validatePlaylistForm() {
    const titleValid = validatePlaylistTitleOnly();
    const labels = getCheckedValues(playlistLabelsContainer);
    const selectedSongTitles = Array.from(playlistSongsSelect.selectedOptions).map(option => option.value);

    const labelsValid = labels.length > 0;
    const songsValid = selectedSongTitles.length >= 2;

    setFeedback(playlistLabelsFeedback, labelsValid ? 'OK' : 'Select at least one label.', labelsValid ? 'ok' : 'error');
    setFeedback(playlistSongsFeedback, songsValid ? 'OK' : 'Select at least two songs.', songsValid ? 'ok' : 'error');

    const valid = titleValid && labelsValid && songsValid;
    if (!valid) {
        setFeedback(playlistFormFeedback, 'The list was not created because there are validation errors.', 'error');
    } else {
        setFeedback(playlistFormFeedback, '', null);
    }

    return valid;
}

function playSong(song) {
    audioPlayer.src = `./music_src/${song.fileName}`;
    audioPlayer.play();
    infoDisplay.innerText = `Now playing: ${song.title} | Type: ${song.mediaType} | Labels: ${song.labels.join(', ')}`;
}

function pickPlaylistByPrompt(promptText) {
    if (playlistMap.size === 0) {
        alert('Create a playlist first.');
        return null;
    }

    const playlists = Array.from(playlistMap.values());
    const listNames = playlists.map((list, index) => `${index}: ${list.title}`).join('\n');
    const choice = Number(prompt(`${promptText}\n${listNames}`));

    if (!Number.isInteger(choice) || !playlists[choice]) {
        alert('Invalid selection.');
        return null;
    }

    return playlists[choice];
}

function addLabelToSong(song) {
    const label = prompt('Enter label to add:');
    if (!label || !label.trim()) {
        return;
    }

    const normalized = label.trim().toLowerCase();
    if (!song.labels.includes(normalized)) {
        song.labels.push(normalized);
    }

    renderFilterOptions();
    refreshSongsSelects();
    renderSongs(currentSongsView);
    if (audioPlayer.src.includes(song.fileName)) {
        playSong(song);
    }
}

function removeLabelFromSong(song) {
    if (song.labels.length === 0) {
        alert('This song has no labels.');
        return;
    }

    const list = song.labels.join('\n');
    const label = prompt(`Select label to remove:\n${list}`);
    if (!label) {
        return;
    }

    if (!song.labels.includes(label)) {
        alert('Label not found in this song.');
        return;
    }

    song.labels = song.labels.filter(item => item !== label);
    renderFilterOptions();
    renderSongs(currentSongsView);
    if (audioPlayer.src.includes(song.fileName)) {
        playSong(song);
    }
}

songsContainer.addEventListener('click', event => {
    const songTitle = event.target.getAttribute('data-song-title');
    if (!songTitle) {
        return;
    }

    const song = findSongByTitle(songTitle);
    if (!song) {
        return;
    }

    if (event.target.classList.contains('song-play-btn')) {
        playSong(song);
    } else if (event.target.classList.contains('song-add-to-list-btn')) {
        const targetList = pickPlaylistByPrompt(`Select list index to add "${song.title}":`);
        if (!targetList) {
            return;
        }
        targetList.addMusic(song);
        renderPlaylists();
    } else if (event.target.classList.contains('song-remove-from-list-btn')) {
        const targetList = pickPlaylistByPrompt(`Select list index to remove "${song.title}" from:`);
        if (!targetList) {
            return;
        }
        targetList.deleteMusic(song);
        renderPlaylists();
        if (currentSongsView.title === targetList.title) {
            renderSongs(targetList);
        }
    } else if (event.target.classList.contains('song-add-label-btn')) {
        addLabelToSong(song);
    } else if (event.target.classList.contains('song-remove-label-btn')) {
        removeLabelFromSong(song);
    }
});

playlistsContainer.addEventListener('click', event => {
    const playlistTitle = event.target.getAttribute('data-playlist-title');
    if (!playlistTitle || !playlistMap.has(playlistTitle)) {
        return;
    }

    renderSongs(playlistMap.get(playlistTitle));
});

labelFilter.addEventListener('change', event => {
    const label = event.target.value;
    if (label === 'all') {
        renderSongs(availableSongs);
        return;
    }

    const filtered = availableSongs.list.filter(song => song.labels.includes(label));
    renderSongs(new MusicList(`Filtered: ${label}`, [], filtered));
});

controlPlay.addEventListener('click', () => {
    audioPlayer.play();
});

controlPause.addEventListener('click', () => {
    audioPlayer.pause();
});

controlStop.addEventListener('click', () => {
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
});

volumeSlider.addEventListener('input', event => {
    audioPlayer.volume = event.target.value;
});

musicForm.addEventListener('input', validateMusicForm);
musicForm.addEventListener('change', validateMusicForm);

musicForm.addEventListener('submit', event => {
    event.preventDefault();
    if (!validateMusicForm()) {
        return;
    }

    const title = musicTitleInput.value.trim();
    const fileName = musicFileSelect.value;
    const labels = getCheckedValues(musicLabelsContainer);
    const newSong = new Music(title, fileName, labels);

    availableSongs.addMusic(newSong);
    musicForm.reset();

    renderFilterOptions();
    refreshSongsSelects();
    renderSongs(availableSongs);
    validateMusicForm();
});

playlistTitleInput.addEventListener('input', validatePlaylistTitleOnly);
playlistForm.addEventListener('change', validatePlaylistForm);

playlistForm.addEventListener('submit', event => {
    event.preventDefault();
    if (!validatePlaylistForm()) {
        return;
    }

    const title = playlistTitleInput.value.trim();
    if (playlistMap.has(title)) {
        setFeedback(playlistFormFeedback, 'A list with this title already exists.', 'error');
        return;
    }

    const labels = getCheckedValues(playlistLabelsContainer);
    const selectedSongTitles = Array.from(playlistSongsSelect.selectedOptions).map(option => option.value);
    const selectedSongs = selectedSongTitles.map(songTitle => findSongByTitle(songTitle)).filter(song => song);

    const newList = new MusicList(title, labels, selectedSongs);
    playlistMap.set(title, newList);

    playlistForm.reset();
    setFeedback(playlistLabelsFeedback, '', null);
    setFeedback(playlistSongsFeedback, '', null);
    setFeedback(playlistFormFeedback, 'Music list created successfully.', 'ok');
    validatePlaylistTitleOnly();
    renderPlaylists();
});

renderLabelCheckboxes(musicLabelsContainer, 'music-label');
renderLabelCheckboxes(playlistLabelsContainer, 'playlist-label');
renderFilterOptions();
refreshSongsSelects();
renderSongs(availableSongs);
renderPlaylists();
validateMusicForm();
setFeedback(playlistTitleFeedback, 'Invalid title. Use 2 to 10 characters.', 'error');
