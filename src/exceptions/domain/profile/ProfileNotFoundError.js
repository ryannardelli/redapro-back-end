class ProfileNotFoundError extends Error {
    constructor(message = "Perfil não encontrado.") {
        super(message);
        this.name = "ProfileNotFoundError";
        this.statusCode = 404;
    }
}

module.exports = ProfileNotFoundError;