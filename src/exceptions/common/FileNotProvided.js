class FileNotProvided extends Error {
  constructor(message = "Arquivo não enviado") {
    super(message);
    this.name = "FileNotProvided";
    this.statusCode = 400;
  }
}

module.exports = FileNotProvided;