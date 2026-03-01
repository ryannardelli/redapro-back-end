class AISubmissionLimitError extends Error {
    constructor(message = "Você atingiu a sua cota semanal de correções com IA.") {
        super(message);
        this.name = "AISubmissionLimitError";
        this.statusCode = 403;
    }
}

module.exports = AISubmissionLimitError;