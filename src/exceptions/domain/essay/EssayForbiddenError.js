class EssayForbiddenError extends Error {
    constructor() {
        super("Você não tem permissão para modificar esta redação.");
        this.name = "EssayForbiddenError";
        this.statusCode = 403;
    }
}

module.exports = EssayForbiddenError;