export class Audio {
    // constructor
    constructor(title, fileName, mediaType, labels) {
        this.setTitle(title);
        this.setFileName(fileName);
        this.setMediaType(mediaType);
        this.setLabels(labels);
    }

    // setters
    setTitle(title) {
        this.title = title;
    }
    setFileName(fileName) {
        this.fileName = fileName;
    }
    setMediaType(mediaType) {
        this.mediaType = this.classifyFileExtension(mediaType);
    }
    setLabels(labels) {
        this.labels = labels;
    }

    // getters
    getTitle() {
        return this.title;
    }
    getFileName() {
        return this.fileName;
    }
    getMediaType() {
        return this.mediaType;
    }
    getLabels() {
        return this.labels;
    }

    // method to generate HTML audio element
    makeHTMLAudio() {
        return `<audio controls><source src="${this.getFileName()}" type="${this.getMediaType()}"></audio>`;
    }

    // client requirement method to assign media type based on file extension
    classifyFileExtension(fileName) {
        if (fileName.endsWith('.mp3')) {
            return 'audio/mpeg';
        }
        if (fileName.endsWith('.ogg')) {
            return 'audio/ogg';
        }
        if (fileName.endsWith('.wav')) {
            return 'audio/wav';
        }
    }

    labels = ["jazz", "pop", "rock", "classical", "hiphop", "country", "blues", "reggae", "electronic", "folk"];
}