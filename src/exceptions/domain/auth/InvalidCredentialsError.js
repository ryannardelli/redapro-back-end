class InvalidCredentialsError extends Error {
    constructor(message = "E-mail ou senha incorretos") {
        super(message);
        this.name = "InvalidCredentialsError";
        this.statusCode = 401;
    }
}

module.exports = InvalidCredentialsError;
