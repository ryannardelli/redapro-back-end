class EssayNotFoundError extends Error {
    constructor(message = "Redação não encontrada.") {
        super(message);
        this.name = "EssayNotFound";
        this.statusCode = 404;
    }
}

module.exports = EssayNotFoundError;