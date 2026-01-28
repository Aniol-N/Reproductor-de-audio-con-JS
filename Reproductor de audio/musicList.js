export class MusicList {
    constructor(title, labels = [], list = []) {
        this.title = title;
        this.labels = labels;
        this.list = list; 
    }

    set title(v) { this._title = v; }
    get title() { return this._title; }

    set labels(v) { this._labels = v; }
    get labels() { return this._labels; }

    set list(v) { this._list = v; }
    get list() { return this._list; }

    addMusic(music) {
        this._list.push(music);
    }

    deleteMusic(music) {
        this._list = this._list.filter(m => m !== music);
    }
}