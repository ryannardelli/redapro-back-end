require("dotenv").config();

const app = require("./app");
const PORT = process.env.PORT || 3000;

const sequelize = require("./config/database");

// test connecation with database
async function connectDB() {
    try {
        await sequelize.authenticate();
        console.log("Conectado ao banco PostgreSQL com sucesso!");

        await sequelize.sync({ alter: true })
    } catch(e) {
        console.log("Erro ao conectar com o banco de dados.", e);
    }
}

connectDB();

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
})