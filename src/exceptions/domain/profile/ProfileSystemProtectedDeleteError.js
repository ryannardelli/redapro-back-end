class ProfileSystemProtectedDeleteError extends Error {
  constructor(message = "Perfis do sistema não podem ser excluídos.") {
    super(message);
    this.name = "ProfileSystemProtectedDeleteError";
    this.statusCode = 403;
  }
}

module.exports = ProfileSystemProtectedDeleteError;