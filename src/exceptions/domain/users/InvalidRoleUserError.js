class InvalidRoleUserError extends Error {
    constructor(message = "Role inválida") {
        super(message);
        this.name = "InvalidRoleUserError";
        this.statusCode = 422;
    }
}