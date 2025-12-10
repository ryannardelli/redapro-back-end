class TokenInvalid extends Error {
    constructor(message = "Token inválido ou expirado.") {
        super(message);
        this.name = "TokenInvalid";
        this.statusCode = 400;
    }
}

module.exports = TokenInvalid;