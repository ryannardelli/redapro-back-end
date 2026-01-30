class ProfileNameValidationError extends Error {
    constructor(message = "Nome do perfil muito longo") {
        super(message);
        this.name = "ProfileNameValidationError";
        this.statusCode = 400;
    }
}

module.exports = ProfileNameValidationError;