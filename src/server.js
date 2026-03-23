require("dotenv").config();
const app = require("./app");
const http = require("http");
const setupSocket = require("./config/socket");
const sequelize = require("./config/database");

// Mova os requires para o topo (ajuda na performance e evita loops)
const User = require("./models/User");
const Profile = require("./models/Profile");
const Menu = require("./models/Menu");
const ProfileMenu = require("./models/ProfileMenu");
const Essay = require("./models/Essay");
const Category = require("./models/Category");
const ReferenceEssay = require("./models/ReferenceEssay");

const seedProfiles = require("./seeds/profile.seed");
const seedProfileMenus = require("./seeds/seedProfileMenus");
const seedMenus = require("./seeds/seedMenus");

const PORT = process.env.PORT || 8080;
const server = http.createServer(app);

// Configurações de Relacionamentos (deixe fora da função async)
const setupModels = () => {
    Profile.hasMany(User, { foreignKey: "profileId" });
    User.belongsTo(Profile, { foreignKey: "profileId" });
    User.hasMany(Essay, { foreignKey: "userId", as: "essay" });
    Essay.belongsTo(User, { foreignKey: "userId", as: "user" });
    Category.hasMany(Essay, { foreignKey: "categoryId", as: "essay" });
    Essay.belongsTo(Category, { foreignKey: "categoryId", as: "category" });
    Category.hasMany(ReferenceEssay, { foreignKey: "categoryId", as: "referenceEssay" });
    ReferenceEssay.belongsTo(Category, { foreignKey: "categoryId", as: "category" });
    Profile.belongsToMany(Menu, { through: ProfileMenu, foreignKey: "profileId" });
    Menu.belongsToMany(Profile, { through: ProfileMenu, foreignKey: "menuId" });
};

async function startServer() {
    try {
        setupModels();
        
        // 1. Conecta ao Banco Primeiro
        await sequelize.authenticate();
        console.log("✅ Conectado ao PostgreSQL.");

        // 2. Sincroniza (Cuidado: em produção, use Migrations em vez de .sync)
        await sequelize.sync();
        
        // 3. Roda Seeds se necessário
        const profilesCount = await Profile.count();
        if (profilesCount === 0) {
            console.log("🌱 Executando seeds...");
            await seedProfiles();
            await seedMenus();
            await seedProfileMenus();
        }

        // 4. SÓ AGORA sobe o servidor
        setupSocket(server);
        server.listen(PORT, "0.0.0.0", () => {
            console.log(`🚀 Servidor pronto na porta ${PORT}`);
        });

    } catch (error) {
        console.error("❌ Erro fatal na inicialização:", error);
        // Se não conectar ao banco, o container deve "morrer" para o Cloud Run tentar de novo
        process.exit(1); 
    }
}

startServer();
// async function startServer() {
//     try {
//         const server = http.createServer(app);

//         setupSocket(server, app);

//         server.listen(PORT, '0.0.0.0', () => {
//             console.log(`Servidor rodando na porta ${PORT}`);
//         });

//         connectDB().catch(err => {
//             console.error("Erro geral no DB:", err);
//         });

//     } catch (error) {
//         console.error("Erro ao iniciar servidor:", error);
//     }
// }

// startServer();