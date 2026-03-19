class ReferenceEssayValidationAuthorName extends Error {
    constructor(message = "O nome do autor deve ter entre 5 e 100 caracteres.") {
        super(message);
        this.name = "ReferenceEssayValidationAuthorName";
        this.statusCode = 400;
    }
}

module.exports = ReferenceEssayValidationAuthorName;