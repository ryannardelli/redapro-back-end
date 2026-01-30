class ProfileDescriptionValidationError extends Error {
    constructor(message = "Descrição longa demais. A descrição do perfil deve ter no máximo 255 caracteres.") {
        this.name = "ProfileDescriptionValidationError";
        this.statusCode = 400;
    }
}

module.exports = ProfileDescriptionValidationError;