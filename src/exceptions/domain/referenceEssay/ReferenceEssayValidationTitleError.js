class ReferenceEssayValidationTitle extends Error {
    constructor(message = "O título deve ter entre 5 e 50 caracteres.") {
        super(message);
        this.name = "ReferenceEssayValidationTitle";
        this.statusCode = 400;
    }
}

module.exports = ReferenceEssayValidationTitle;