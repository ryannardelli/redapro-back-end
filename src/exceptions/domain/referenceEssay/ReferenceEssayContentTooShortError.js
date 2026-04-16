class ReferenceEssayContentTooShortError extends Error {
  constructor(minLength = 1000) {
    super(`O conteúdo da redação deve ter no mínimo ${minLength} caracteres.`);
    this.name = "ReferenceEssayContentTooShortError";
    this.statusCode = 400;
  }
}

module.exports = ReferenceEssayContentTooShortError;