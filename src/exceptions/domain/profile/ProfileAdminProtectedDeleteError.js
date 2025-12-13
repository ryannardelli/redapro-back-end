class ProfileAdminProtectedDeleteError extends Error {
    constructor(message = "O perfil de administrador não pode ser excluído.") {
        super(message);
        this.name = "ProfileAdminProtectedDeleteError";
        this.statusCode = 403;
    }
}

module.exports = ProfileAdminProtectedDeleteError;