class EssayCategoryNotFoundError extends Error {
    constructor() {
        super("Categoria inválida ou inexistente.");
        this.name = "EssayCategoryNotFoundError";
        this.statusCode = 400;
    }
}

module.exports = EssayCategoryNotFoundError;