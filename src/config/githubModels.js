require("dotenv").config();

const ModelClient = require("@azure-rest/ai-inference").default;
const { AzureKeyCredential } = require("@azure/core-auth");

if (!process.env.TOKEN_GITHUB) {
  throw new Error("TOKEN_GITHUB is missing");
}

const client = ModelClient(
  "https://models.github.ai/inference",
  new AzureKeyCredential(process.env.TOKEN_GITHUB)
);

module.exports = client;