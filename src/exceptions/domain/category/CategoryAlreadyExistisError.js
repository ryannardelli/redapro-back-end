class CategoryAlreadyExistsError extends Error {
    constructor(profileName) {
        super(`Categoria "${profileName}" já existe.`);
        this.name = 'CategoryAlreadyExistsError';
        this.statusCode = 409;
    }
}

module.exports = CategoryAlreadyExistsError;