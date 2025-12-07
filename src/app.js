const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const handleError = require("./middleware/handleError");

const app = express();

app.use(cors());
app.use(express.json());

// Routes

// user
app.use("/users", userRoutes);

// auth
app.use("/register", authRoutes);

// Swagger
const { swaggerUi, swaggerSpec } = require("./config/swagger");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// middleware
app.use(handleError);

module.exports = app;