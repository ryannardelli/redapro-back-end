require("dotenv").config();

const app = require("./app");
const PORT = process.env.PORT || 3000;

const sequelize = require("./config/database");

async function connectDB() {
    try {
        await sequelize.authenticate();
        console.log("Conectado ao banco PostgreSQL com sucesso!");

        const User = require("./models/User");
        const Profile = require("./models/Profile");
        const Menu = require("./models/Menu");
        const ProfileMenu = require("./models/ProfileMenu");

        // Definir relacionamento antes de sincronizar
        Profile.hasMany(User, { foreignKey: 'profileId' });
        User.belongsTo(Profile, { foreignKey: 'profileId' });

        Profile.belongsToMany(Menu, {
            through: ProfileMenu,
            foreignKey: 'profileId'
        });

        Menu.belongsToMany(Profile, {
            through: ProfileMenu,
            foreignKey: 'menuId'
        });

        // Sincronizar todas as tabelas
        await sequelize.sync({ alter: true });

        console.log("Tabelas sincronizadas com sucesso!");
    } catch(e) {
        console.log("Erro ao conectar com o banco de dados.", e);
    }
}

async function startServer() {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
    });
}

startServer();