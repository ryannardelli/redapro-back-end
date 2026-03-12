require("dotenv").config();

const client = require("./src/config/githubModels");
const { isUnexpected } = require("@azure-rest/ai-inference");

(async () => {
  try {
    console.log("Conectando ao GitHub Models...");

    const response = await client.path("/chat/completions").post({
      body: {
        model: "openai/gpt-4.1-mini",
        messages: [
          { role: "system", content: "Você é um assistente que responde apenas com OK" },
          { role: "user", content: "Responda apenas com OK" }
        ],
        max_tokens: 50
      }
    });

    if (isUnexpected(response)) {
      throw response.body.error;
    }

    const text = response.body.choices[0].message.content;
    console.log("Resultado:", text);

  } catch (error) {
    console.error("\n--- Diagnóstico do Erro ---");
    console.error("Mensagem:", error.message);

    if (error.statusCode === 429) {
      console.log("\n💡 Limite gratuito do GitHub Models atingido.");
      console.log("Espere ou habilite billing.");
    }

    if (error.statusCode === 401) {
      console.log("\n💡 Token inválido ou sem permissão models:read.");
    }
  }
})();
