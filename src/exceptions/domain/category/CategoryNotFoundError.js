class CategoryNotFoundError extends Error {
    constructor(message = "Categoria não encontrada.") {
        super(message);
        this.name = "CategoryNotFoundError";
        this.statusCode = 404;
    }
}

module.exports = CategoryNotFoundError;