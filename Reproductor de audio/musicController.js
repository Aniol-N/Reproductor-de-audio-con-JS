import { Music } from "./Class requirements/music.js";

export class MusicController {
    constructor() {
        this.playlist = [];
        this.musicListElement = document.getElementById('musicList');
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
            li.innerHTML = `
                <div class="song-item">
                    <span class="title"><strong>Title:</strong> ${song.getTitle()}</span>
                    <div class="hover-info">
                        <span><strong>File name:</strong> ${song.getFileName()}</span><br>
                        <span><strong>Media type:</strong> ${song.getMediaType()}</span><br>
                        <span><strong>Labels:</strong> ${song.getLabels().join(', ')}</span>
                    </div>
                    <br>
                    ${song.makeHTMLMusic()}
                </div>
            `;
            this.musicListElement.appendChild(li);
        });
    }
}

// --- INICIALIZACIÓN ---
const controller = new MusicController();

// Como JS no puede "leer" la carpeta automáticamente, 
// listamos los nombres que tienes físicamente en ./music_src
const myFiles = [
    { file: "Blinding Lights.mp3", labels: ["pop", "electronic"] },
    { file: "Despacito.mp3", labels: ["reggae", "latin"] },
    { file: "White Christmas.mp3", labels: ["classical", "holiday"] },
];

// Ejecutamos el reconocimiento
controller.processSongs(myFiles);