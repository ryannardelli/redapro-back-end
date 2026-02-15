const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const menuRoutes = require("./routes/menuRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const essayRoutes = require("./routes/essayRoutes");
const referenceEssayRoute = require("./routes/referenceEssayRoute");
const handleError = require("./middleware/handleError");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);
app.use("/menu", menuRoutes);
app.use("/category", categoryRoutes);
app.use("/essay", essayRoutes);
app.use("/reference-essay", referenceEssayRoute);

// Swagger
const { swaggerUi, swaggerSpec } = require("./config/swagger");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// middleware
app.use(handleError);

module.exports = app;