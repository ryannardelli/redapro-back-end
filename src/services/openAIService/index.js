const client = require("../../config/githubModels");
const { isUnexpected } = require("@azure-rest/ai-inference");

/**
 * Gera texto usando OpenAI via GitHub Models
 * @param {string} prompt
 * @returns {Promise<string>}
 */
async function generateWithOpenAI(prompt) {
  const response = await client.path("/chat/completions").post({
    body: {
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Você é um corretor de redações do ENEM. Responda APENAS com JSON válido."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.2,
      max_tokens: 800
    }
  });

  if (isUnexpected(response)) {
    throw new Error(
      response.body?.error?.message || "Erro ao chamar o modelo OpenAI"
    );
  }

  return response.body.choices[0].message.content;
}

module.exports = {
  generateWithOpenAI
};