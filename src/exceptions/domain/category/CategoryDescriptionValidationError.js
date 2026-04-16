class CategoryDescriptionValidationError extends Error {
    constructor(message = "Descrição longa demais. A descrição da categoria deve ter no máximo 255 caracteres.") {
        this.name = "CategoryDescriptionValidationError";
        this.statusCode = 400;
    }
}

module.exports = CategoryDescriptionValidationError;