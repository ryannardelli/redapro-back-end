class EmailAlreadyExistsError extends Error {
    constructor(message = "O email informado já existe no sistema.") {
        super(message);
        this.name = "EmailAlreadyExistsError";
        this.statusCode = 400;
    }
}

module.exports = EmailAlreadyExistsError;