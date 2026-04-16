class ReferenceEssayNotFoundError extends Error {
    constructor(message = "Redação não encontrada.") {
        super(message);
        this.name = "referenceEssayNotFoundError";
        this.statusCode = 404;
    }
}

module.exports = ReferenceEssayNotFoundError;