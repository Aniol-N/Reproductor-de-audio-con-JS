export class musicList {
    // constructor
    constructor(title, labels, musicList) {
        this.setTitle(title);
        this.setLabels(labels);
        this.setMsicList(musicList);
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