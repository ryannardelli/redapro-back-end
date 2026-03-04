class ProfileSystemProtectedUpdateError extends Error {
  constructor(message = "Perfis do sistema não podem ser alterados.") {
    super(message);
    this.name = "ProfileSystemProtectedUpdateError";
    this.statusCode = 403;
  }
}

module.exports = ProfileSystemProtectedUpdateError;