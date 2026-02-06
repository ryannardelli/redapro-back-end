require("dotenv").config();
const { OpenAI } = require("openai");

(async () => {
  try {
    // Cria o client da OpenAI com a chave da API
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    console.log("Conectando...");

    // Faz a requisição para gerar texto
    const result = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Você é um assistente que responde apenas com OK" },
        { role: "user", content: "Responda apenas com OK" }
      ],
      max_tokens: 50
    });

    // Extrai o texto da resposta
    const text = result.choices[0].message.content;
    console.log("Resultado:", text);

  } catch (error) {
    console.error("\n--- Diagnóstico do Erro ---");
    
    // Alguns erros da OpenAI podem ter status, outros não
    console.error("Status:", error.response?.status || "N/A");
    console.error("Mensagem:", error.message);

    if (error.response?.status === 429) {
      console.log("\n💡 O problema agora é COTA (Limite de Requisições).");
      console.log("1. Espere alguns segundos e tente de novo.");
      console.log("2. Verifique se você não está rodando o script várias vezes.");
      console.log("3. Se persistir, verifique seu saldo ou limite da API.");
    }
  }
})();
