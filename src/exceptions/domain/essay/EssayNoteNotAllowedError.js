class EssayNoteNotAllowedError extends Error {
    constructor() {
        super("A nota só pode ser atribuída após a correção da redação.");
        this.name = "EssayNoteNotAllowedError";
        this.statusCode = 400;
    }
}

module.exports = EssayNoteNotAllowedError;