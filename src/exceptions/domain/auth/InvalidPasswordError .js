class InvalidPasswordError extends Error {
    constructor(message = "A senha deve ter entre 8 e 20 caracters.") {
        super(message);
        this.name = "InvalidPasswordError";
        this.statusCode = 400;
    }
}

module.exports = InvalidPasswordError;