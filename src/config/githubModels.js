require("dotenv").config();

const ModelClient = require("@azure-rest/ai-inference").default;
const { AzureKeyCredential } = require("@azure/core-auth");;

const githubModels = ModelClient(
  "https://models.github.ai/inference",
  new AzureKeyCredential(process.env.TOKEN_GITHUB)
);

module.exports = githubModels;
