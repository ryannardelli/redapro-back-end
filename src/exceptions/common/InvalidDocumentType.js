class InvalidDocumentType extends Error {
  constructor(message = "Formato de arquivo não suportado") {
    super(message);
    this.name = "InvalidDocumentType";
    this.statusCode = 415;
  }
}

module.exports = InvalidDocumentType;