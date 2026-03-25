require("dotenv").config();

const ModelClient = require("@azure-rest/ai-inference").default;
const { AzureKeyCredential } = require("@azure/core-auth");

function createGithubModels() {
  if (!process.env.TOKEN_GITHUB) {
    throw new Error("TOKEN_GITHUB is missing");
  }

  return ModelClient(
    "https://models.github.ai/inference",
    new AzureKeyCredential(process.env.TOKEN_GITHUB)
  );
}

module.exports = createGithubModels;
