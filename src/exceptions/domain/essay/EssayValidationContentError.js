class EssayValidationContent extends Error {
    constructor(message = "O conteúdo da redação deve ter entre 1000 e 5000 caracteres.") {
        super(message);
        this.name = "EssayValidationContent";
        this.statusCode = 400;
    }
}

module.exports = EssayValidationContent;