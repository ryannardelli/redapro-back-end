class EssayAlreadyExistsError extends Error {
    constructor(essayName) {
        super(`Redação "${essayName}" já existe.`);
        this.name = 'EssayAlreadyExistsError';
        this.statusCode = 409;
    }
}

module.exports = EssayAlreadyExistsError;