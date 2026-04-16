class MenuNotFoundError extends Error {
    constructor(message = "Menu não encontrado.") {
        super(message);
        this.name = "MenuNotFoundError";
        this.statusCode = 404;
    }
}

module.exports = MenuNotFoundError;