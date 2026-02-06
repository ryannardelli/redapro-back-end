class ReferenceEssayAlreadyExistsError extends Error {
    constructor(essayName) {
        super(`Redação "${essayName}" já existe.`);
        this.name = 'ReferenceEssayAlreadyExistsError';
        this.statusCode = 409;
    }
}

module.exports = ReferenceEssayAlreadyExistsError;