class EssayAiCorrectionNotAllowedError extends Error {
    constructor() {
        super("Esta redação não pode ser corrigida com IA, pois já está sendo corrigida por um corretor.");
        this.name = "EssayAiCorrectionNotAllowedError";
        this.statusCode = 400;
    }
}

module.exports = EssayAiCorrectionNotAllowedError;