// config/openai.js
const { Configuration, OpenAIApi } = require("openai");
const OpenAIConfigError = require("../exceptions/OpenAIConfigError");

if (!process.env.OPENAI_API_KEY) {
    throw new OpenAIConfigError();
}

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

module.exports = openai;