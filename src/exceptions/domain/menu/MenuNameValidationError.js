class MenuNameValidationError extends Error {
    constructor(message = "A rota deve ter entre 3 e 100 caracteres.") {
        super(message);
        this.name = "MenuNameValidationError";
        this.statusCode = 400;
    }
}

module.exports = MenuNameValidationError;