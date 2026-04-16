class EssayValidationTitle extends Error {
    constructor(message = "O título deve ter entre 5 e 100 caracteres.") {
        super(message);
        this.name = "EssayValidationTitle";
        this.statusCode = 400;
    }
}

module.exports = EssayValidationTitle;