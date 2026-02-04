class CategoryNameValidationError extends Error {
    constructor(message = "Nome da categoria muito longo") {
        super(message);
        this.name = "CategoryNameValidationError";
        this.statusCode = 400;
    }
}

module.exports = CategoryNameValidationError;