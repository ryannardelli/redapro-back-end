class InternalServerError extends Error {
  constructor(message = "Aconteceu um erro interno no servidor. Tente novamente mais tarde.") {
    super(message);
    this.name = "InternalServerError";
    this.statusCode = 500;
  }
}

module.exports = InternalServerError;
