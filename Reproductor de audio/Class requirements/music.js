export class Music {
    constructor(title = '', fileName = '', mediaType = '', labels = []) {
        this.title = '';
        this.fileName = '';
        this.mediaType = '';
        this.labels = labels && labels.length ? labels : ["jazz", "pop", "rock", "classical", "hiphop", "country", "blues", "reggae", "electronic", "folk"];

        if (title) this.setTitle(title);
        if (fileName) this.setFileName(fileName);
        if (mediaType) this.setMediaType(mediaType);
    }

    // Setters (method-based, simple and close to original style)
    setTitle(title) {
        if (this.isTitleValid(title)) this.title = title;
        else throw new Error('El título debe tener al menos 2 caracteres.');
    }

    setFileName(fileName) {
        if (this.isFileNameValid(fileName)) {
            this.fileName = fileName;
            this.mediaType = this.classifyFileExtension(fileName);
        } else {
            throw new Error('El nombre del archivo debe tener al menos 1 carácter y terminar con una extensión válida.');
        }
    }

    setMediaType(mediaType) { this.mediaType = mediaType; }
    setLabels(labels) { this.labels = labels; }

    // Getters (method-based)
    getTitle() { return this.title; }
    getFileName() { return this.fileName; }
    getMediaType() { return this.mediaType; }
    getLabels() { return this.labels; }

    // Validation methods (accept explicit values)
    isTitleValid(title) {
        return typeof title === 'string' && title.length >= 2;
    }

    isFileNameValid(fileName) {
        if (typeof fileName !== 'string') return false;
        const validExtensions = ['.mp3', '.ogg', '.wav'];
        return fileName.length >= 1 && validExtensions.some(ext => fileName.endsWith(ext));
    }

    // Classify file extension 
    classifyFileExtension(fileName) {
        if (typeof fileName !== 'string') return '';
        if (fileName.endsWith('.mp3')) return 'audio/mpeg';
        if (fileName.endsWith('.ogg')) return 'audio/ogg';
        if (fileName.endsWith('.wav')) return 'audio/wav';
        return '';
    }

    // Generate HTML music (uses method getters)
    makeHTMLMusic() {
        const src = this.getFileName() || '';
        const type = this.getMediaType() || this.classifyFileExtension(src);
        return `<audio controls><source src="${src}" type="${type}"></audio>`;
    }
}