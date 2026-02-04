class InvalidCompetenceError extends Error {
    constructor(message = "Nota da competência inválida.") {
        super(message);
        this.name = "InvalidCompetenceError";
        this.statusCode = 400;
    }
}

module.exports = InvalidCompetenceError;