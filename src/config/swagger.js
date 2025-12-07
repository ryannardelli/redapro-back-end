const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Redapro",
      version: "1.0.0",
      description: "Documentação da API desenvolvida em Node.js",
    },
  },
  apis: ["./src/routes/*.js"], // Arquivos que contém as rotas com documentação
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerUi, swaggerSpec };