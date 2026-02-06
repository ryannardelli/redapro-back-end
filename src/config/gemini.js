require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const AIKeyConfigError = require("../exceptions/AIKeyConfigError");

if (!process.env.GEMINI_API_KEY) {
    throw new AIKeyConfigError("Chave da Gemini não definida no .env");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Gera texto usando Gemini
 * @param {string} prompt
 * @returns {Promise<string>}
 */
async function generateWithGemini(prompt) {
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash"
        });

        const result = await model.generateContent(prompt);
        return result.response.text();

    } catch (error) {
        throw new Error(`Erro Gemini: ${error.message}`);
    }
}

module.exports = { generateWithGemini };