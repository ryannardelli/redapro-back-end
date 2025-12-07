class InvalidEmailError extends Error {
    constructor(message = "O e-mail deve ser válido") {
        super(message);
        this.name = "InvalidEmailError";
        this.statusCode = 400;
    }
}

module.exports = InvalidEmailError;