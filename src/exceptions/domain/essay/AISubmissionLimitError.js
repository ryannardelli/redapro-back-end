class AISubmissionLimitError extends Error {
    constructor(message = "Você atingiu o limite de duas correções de IA por semana.") {
        super(message);
        this.name = "AISubmissionLimitError";
        this.statusCode = 403;
    }
}

module.exports = AISubmissionLimitError;