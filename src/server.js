const crypto = require("crypto");
const seedProfiles = require("./seeds/profile.seed");
const seedProfileMenus = require("./seeds/seedProfileMenus");
const seedMenus = require("./seeds/seedMenus");

if (!global.crypto) {
  global.crypto = crypto.webcrypto;
}

global.crypto.randomUUID ??= crypto.randomUUID;

require("dotenv").config();

const app = require("./app");
const PORT = process.env.PORT || 8080;
const setupSocket = require("./config/socket");
const http = require("http");

const sequelize = require("./config/database");

async function connectDB() {
    try {
        await sequelize.authenticate();
        console.log("Conectado ao banco PostgreSQL com sucesso!");

        const User = require("./models/User");
        const Profile = require("./models/Profile");
        const Menu = require("./models/Menu");
        const ProfileMenu = require("./models/ProfileMenu");
        const Essay = require("./models/Essay");
        const Category = require("./models/Category");
        const ReferenceEssay = require("./models/ReferenceEssay");

        // Definir relacionamento antes de sincronizar
        Profile.hasMany(User, { foreignKey: 'profileId' });
        User.belongsTo(Profile, { foreignKey: 'profileId' });

        User.hasMany(Essay, { foreignKey: "userId", as: "essay" });
        Essay.belongsTo(User, { foreignKey: "userId", as: "user" });

        Category.hasMany(Essay, { foreignKey: "categoryId", as: "essay" });
        Essay.belongsTo(Category, { foreignKey: "categoryId", as: "category" })

        Category.hasMany(ReferenceEssay, { foreignKey: "categoryId", as: "referenceEssay" });
        ReferenceEssay.belongsTo(Category, { foreignKey: "categoryId", as: "category" })

        Profile.belongsToMany(Menu, {
            through: ProfileMenu,
            foreignKey: 'profileId'
        });

        Menu.belongsToMany(Profile, {
            through: ProfileMenu,
            foreignKey: 'menuId'
        });

        await sequelize.sync();

        // Executar seeds do sistema
        await seedProfiles();
        await seedMenus();
        await seedProfileMenus();

        console.log("Tabelas sincronizadas com sucesso!");
    } catch(e) {
        console.log("Erro ao conectar com o banco de dados.", e);
        throw e;
    }
}

async function startServer() {
    const server = http.createServer(app);

    setupSocket(server, app);

    server.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
    });

    connectDB();
}

startServer();