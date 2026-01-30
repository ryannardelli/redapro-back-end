class MenuNotFoundError extends Error {
    constructor(message = "Menu não ncontrado.") {
        super(message);
        this.name = "MenuNotFoundError";
        this.statusCode = 404;
    }
}

module.exports = MenuNotFoundError;