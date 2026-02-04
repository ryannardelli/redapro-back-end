class OpenAIConfigError extends Error {
    constructor(message = "Chave da OpenAI não definida no .env") {
        super(message);
        this.name = "OpenAIConfigError";
        this.statusCode = 500;
    }
}

module.exports = OpenAIConfigError;