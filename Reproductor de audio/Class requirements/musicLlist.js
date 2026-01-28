export class musicList {
    // constructor
    constructor(title, labels = [], songs = []) {
        this.setTitle(title);
        this.setLabels(labels);
        this.setMusicList(songs);
    }

    // setters
    setTitle(title) {
        this.title = title;
    }
    setLabels(labels) {
        this.labels = labels;
    }
    setMusicList(musicList) {
        this.musicList = musicList;
    }

    // getters
    getTitle() {
        return this.title;
    }
    getLabels() {
        return this.labels;
    }
    getMusicList() {
        return this.musicList;
    }

    // add and remove music form list
    addSong(song){
        this.songs.push(song);
    }

    removeSong(song){
        this.songs = this.songs.filter(s => s !== song);
    }

    
}