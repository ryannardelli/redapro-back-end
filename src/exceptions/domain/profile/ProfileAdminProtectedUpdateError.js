class ProfileAdminProtectedUpdateError extends Error {
    constructor(message = "O perfil de administrador não pode ser alterado.") {
        super(message);
        this.name = "ProfileAdminProtectedUpdateError";
        this.statusCode = 403;
    }
}

module.exports = ProfileAdminProtectedUpdateError;