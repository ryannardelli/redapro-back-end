class AdminUserDeleteError extends Error {
    constructor(message = "Usuários com perfils de administradores não podem ser excluídos") {
        super(message);
        this.name = "AdminUserDeleteError";
        this.statusCode = 403;
    }
}

module.exports = AdminUserDeleteError;