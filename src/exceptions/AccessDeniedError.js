class AccessDeniedError extends Error {
    constructor(message = "Acesso negado. Você não tem permissão suficiente para acessar esse recurso.") {
        super(message);
        this.name = "AccessDeniedError";
        this.statusCode = 403;
    }
}

module.exports = AccessDeniedError;