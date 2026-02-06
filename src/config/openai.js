require("dotenv").config();
const OpenAI = require("openai");
const OpenAIConfigError = require("../exceptions/OpenAIConfigError");

if (!process.env.OPENAI_API_KEY) {
    throw new OpenAIConfigError();
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

module.exports = openai;