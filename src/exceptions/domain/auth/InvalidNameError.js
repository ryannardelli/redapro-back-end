class InvalidNameError extends Error {
    constructor(message = "O nome precisa ter pelo menos 2 letras e no máximo 100.") {
        super(message);
        this.name = "InvalidNameError";
        this.statusCode = 400;
    }
}

module.exports = InvalidNameError;