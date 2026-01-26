import { Music } from "./Class requirements/music.js";

export class MusicController {
    constructor(songs = []) {
        this.playlist = [];
        this.musicListElement = document.getElementById('musicList');
        this.selectedSong = null;
        this.index = 0;

        this.audio = new Audio();
        this.songs = songs;

        this.audio.onended = () => this.next();
        this.audio.onerror = () => console.error("Error al cargar audio");

        if (this.songs.length > 0) {
            this.processSongs(this.songs);

            this.setupControls();
        }
    }

    selectSong(song) {
        this.selectedSong = song;
        this.index = this.playlist.indexOf(song);

        const carpeta = './music_src/';
        this.audio.src = carpeta + song.getFileName();

        this.audio.play();
        this.renderPlaylist();
    }

    isSelected(song) {
        return this.selectedSong === song;
    }

    processSongs(fileNames) {
        fileNames.forEach(fileObj => {
            try {
                const title = fileObj.file.replace(/\.[^/.]+$/, "");
                const relativePath = `./music_src/${fileObj.file}`;
                const newSong = new Music(title, relativePath, '', fileObj.labels);
                this.playlist.push(newSong);
            } catch (error) {
                console.error(`Error al cargar la canción ${fileObj.file}:`, error.message);
            }
        });
        this.renderPlaylist();
    }

    renderPlaylist() {
        if (!this.musicListElement) return;
        this.musicListElement.innerHTML = '';

        this.playlist.forEach(song => {
            const li = document.createElement('li');
            li.classList.add('song-item');
            if (this.isSelected(song)) {
                li.classList.add('selected');
            }
            li.innerHTML = `
                <div class="song-item-content">
                    ${song.makeHTMLMusic()}
                    <div class="hover-info">
                        <span><strong>File name:</strong> ${song.getFileName()}</span><br>
                        <span><strong>Media type:</strong> ${song.getMediaType()}</span><br>
                        <span><strong>Labels:</strong> ${song.getLabels().join(', ')}</span>
                    </div>
                </div>
                <div class="add-button">
                    <button class="add-to-list-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list-plus-icon lucide-list-plus"><path d="M16 5H3"/><path d="M11 12H3"/><path d="M16 19H3"/><path d="M18 9v6"/><path d="M21 12h-6"/></svg>
                    </button>
                </div>
            `;
            li.onclick = () => this.selectSong(song);
            this.musicListElement.appendChild(li);
        });
    }

    setupControls() {
        const btnPlay = document.getElementById('btnPlay');

        if (!btnPlay) return;
        btnPlay.onclick = () => {
            if (!this.selectedSong) return;
            if (this.audio.paused) {
                this.audio.play();
                btnPlay.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pause-icon lucide-pause"><path d="M6 4h4v16H6z"/><path d="M14 4h4v16h-4z"/></svg>`;
            } else {
                this.audio.pause();
                btnPlay.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-play-icon lucide-play"><path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"/></svg>`;
            }
        };
        const volume = document.getElementById('volumeControl');
        if (volume) {
            volume.oninput = () => {
                this.audio.volume = volume.value / 100;
            };
        }
    }

    next() {
        if (this.playlist.length === 0) return;
        this.index = (this.index + 1) % this.playlist.length;
        this.selectSong(this.playlist[this.index]);
    }

    isSelected(song) {
        return this.selectedSong === song;
    }
}

// ejecucion
const myFiles = [
    { file: "Blinding Lights.mp3", labels: ["pop", "electronic"] },
    { file: "Despacito.mp3", labels: ["reggae", "latin"] },
    { file: "White Christmas.mp3", labels: ["classical", "holiday"] },
];

const controller = new MusicController(myFiles);

window.musicController = controller;

controller.processSongs(myFiles);