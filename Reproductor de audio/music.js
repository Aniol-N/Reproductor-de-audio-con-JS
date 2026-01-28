export class Music {
    constructor(title, fileName, labels = []) {
        // Assigning to triggers the setters
        this.title = title;
        this.fileName = fileName;
        this.labels = labels;
    }

    set title(value) {
        if (value.length >= 2) this._title = value;
    }
    get title() { return this._title; }

    set fileName(value) {
        this._fileName = value;
        const ext = value.split('.').pop().toLowerCase();
        const types = { 'mp3': 'audio/mpeg', 'ogg': 'audio/ogg', 'wav': 'audio/wav' };
        this._mediaType = types[ext] || 'unknown';
    }
    get fileName() { return this._fileName; }
    get mediaType() { return this._mediaType; }

    set labels(value) { this._labels = value; }
    get labels() { return this._labels; }
}