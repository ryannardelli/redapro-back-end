class InternalServerError extends Error {
  constructor(message = "Erro interno do servidor.") {
    super(message);
    this.name = "InternalServerError";
    this.statusCode = 500;
  }
}

module.exports = InternalServerError;
