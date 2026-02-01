class RouteAlreadyExistsError extends Error {
    constructor(message = "A rota informada já existe no sistema.") {
        super(message);
        this.name = "RouteAlreadyExistsError";
        this.statusCode = 400;
    }
}

module.exports = RouteAlreadyExistsError;