export class audioList {
    // constructor
    constructor(title, labels, audioList) {
        this.setTitle(title);
        this.setLabels(labels);
        this.setAudioList(audioList);
    }

    // setters
    setTitle(title) {
        this.title = title;
    }
    setLabels(labels) {
        this.labels = labels;
    }
    setAudioList(audioList) {
        this.audioList = audioList;
    }

    // getters
    getTitle() {
        return this.title;
    }
    getLabels() {
        return this.labels;
    }
    getAudioList() {
        return this.audioList;
    }
}