export class musicList {
    // constructor
    constructor(title, labels, musicList) {
        this.setTitle(title);
        this.setLabels(labels);
        this.setMusicList(musicList);
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
}