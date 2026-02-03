class EssayUpdateNotAllowedError extends Error {
    constructor() {
        super("Esta redação não pode ser alterada pois não está mais pendente.");
        this.name = "EssayUpdateNotAllowedError";
        this.statusCode = 400;
    }
}

module.exports = EssayUpdateNotAllowedError;