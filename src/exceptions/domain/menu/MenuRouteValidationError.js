class MenuRouteValidationError extends Error {
    constructor(message = "A rota deve conter apenas letras minúsculas, números, hífen (-) e barra (/).") {
        super(message);
        this.name = "MenuRouteValidationError";
        this.statusCode = 400;
    }
}

module.exports = MenuRouteValidationError;