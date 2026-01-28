import { Music } from "./Class requirements/music.js";
import { musicList } from "./Class requirements/musicLlist.js";

export class MusicController {
    constructor() {
        this.lists = [];
        this.currentList = null;
        this.selectedSong = null;

        this.audio = new Audio();
        this.audio.onended = () => this.next();
        this.musicListElement = document.getElementById('musicList');

        this.initDisponibles();
        this.setupControls();
        this.handleRouting();
    }

    selectSong(song) {
        this.selectedSong = song;
        const songs = this.currentList.getMusicList();
        this.index = songs.indexOf(song);

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
        if (!this.musicListElement || !this.currentList) return;
        this.musicListElement.innerHTML = '';

        const songs = this.currentList.getMusicList();
        songs.forEach(song => {
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
        // Control de Volumen
        const volume = document.getElementById('volumeControl');
        if (volume) {
            volume.oninput = () => { this.audio.volume = volume.value / 100; };
        }

        // Botón Crear Lista
        const btnCreateList = document.getElementById('addToMusicList');
        if (btnCreateList) {
            btnCreateList.onclick = () => {
                const name = prompt("Nombre de la nueva lista:");
                if (name) {
                    this.createNewList(name);
                    window.location.hash = `list/${encodeURIComponent(name)}`;
                }
            };
        }

        // Escuchar cambios en la URL
        window.addEventListener('hashchange', () => {
            this.handleRouting();
        });
    }

    next() {
        if (this.playlist.length === 0) return;
        this.index = (this.index + 1) % this.playlist.length;
        this.selectSong(this.playlist[this.index]);
    }

    initDisponibles() {
        const s1 = new Music("Blinding Lights", "Blinding Lights.mp3", "", ["pop"]);
        const s2 = new Music("Despacito", "Despacito.mp3", "", ["latin"]);
        const s3 = new Music("White Christmas", "White Christmas.mp3", "", ["classical"]);

        const disponibles = new musicList("disponibles", ["tots"], [s1, s2, s3]);
        this.lists.push(disponibles);
        this.currentList = disponibles;

        this.renderPlaylist();
    }

    handleRouting() {
        const hash = window.location.hash; // coge el "#list/nombre"

        if (hash.startsWith('#list/')) {
            const listName = decodeURIComponent(hash.replace('#list/', ''));

            // Buscar la lista en nuestro array
            const found = this.lists.find(l => l.getTitle() === listName);

            if (found) {
                this.currentList = found;
                this.renderPlaylist();
                // Opcional: actualizar el título en el HTML
                document.querySelector('h2').innerText = `List: ${listName}`;
            }
        }
    }
    
    createNewList(name) {
        const newList = new musicList(name, ["usuario"], []);
        this.lists.push(newList);
    }

    addSongToList(song, list) {
        const lista = this.lists.find(l => l.getTitle() === list.getTitle());
        if (lista) {
            lista.addSong(song);
        }
    }
}

// ejecucion
const controller = new MusicController();
window.musicController = controller;