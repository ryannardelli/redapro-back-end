class UserNotFoundError extends Error {
    constructor(message = "Usuário não encontrado") {
        super(message);
        this.name = "UserNotFoundError";
        this.statusCode = 404;
    }
}

module.exports = UserNotFoundError;