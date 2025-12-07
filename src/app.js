const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const handleError = require("./middleware/handleError");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/users", userRoutes);

// Swagger
const { swaggerUi, swaggerSpec } = require("./config/swagger");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// middleware
app.use(handleError);

module.exports = app;