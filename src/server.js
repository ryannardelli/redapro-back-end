require("dotenv").config();

const app = require("./app");
const http = require("http");
const setupSocket = require("./config/socket");
const sequelize = require("./config/database");

// Imports de Seeds
const seedProfiles = require("./seeds/profile.seed");
const seedProfileMenus = require("./seeds/seedProfileMenus");
const seedMenus = require("./seeds/seedMenus");

const PORT = process.env.PORT || 8080;

/**
 * Função para conectar ao banco, sincronizar modelos e rodar seeds.
 * Ela é executada de forma assíncrona para não travar o boot do servidor.
 */
async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log("✅ Conectado ao banco PostgreSQL com sucesso!");

    // Importação dos modelos
    const User = require("./models/User");
    const Profile = require("./models/Profile");
    const Menu = require("./models/Menu");
    const ProfileMenu = require("./models/ProfileMenu");
    const Essay = require("./models/Essay");
    const Category = require("./models/Category");
    const ReferenceEssay = require("./models/ReferenceEssay");

    // Definição das Relações
    Profile.hasMany(User, { foreignKey: "profileId" });
    User.belongsTo(Profile, { foreignKey: "profileId" });
    User.hasMany(Essay, { foreignKey: "userId", as: "essay" });
    Essay.belongsTo(User, { foreignKey: "userId", as: "user" });
    Category.hasMany(Essay, { foreignKey: "categoryId", as: "essay" });
    Essay.belongsTo(Category, { foreignKey: "categoryId", as: "category" });
    Category.hasMany(ReferenceEssay, { foreignKey: "categoryId", as: "referenceEssay" });
    ReferenceEssay.belongsTo(Category, { foreignKey: "categoryId", as: "category" });

    Profile.belongsToMany(Menu, {
      through: ProfileMenu,
      foreignKey: "profileId",
    });

    Menu.belongsToMany(Profile, {
      through: ProfileMenu,
      foreignKey: "menuId",
    });

    // Sincronização
    await sequelize.sync();
    console.log("✅ Tabelas sincronizadas com sucesso!");

    // Lógica de Seeds
    const profilesCount = await Profile.count();
    if (profilesCount === 0) {
      console.log("🌱 Executando seeds iniciais...");
      try {
        await seedProfiles();
        await seedMenus();
        await seedProfileMenus();
        console.log("✅ Seeds executados com sucesso!");
      } catch (seedError) {
        console.error("❌ Erro ao executar seeds:", seedError);
      }
    }
  } catch (error) {
    console.error("❌ Erro crítico ao conectar com o banco:", error);
    // Opcional: process.exit(1) se você quiser que o container reinicie em caso de erro de banco
  }
}

/**
 * Inicialização do Servidor
 */
function startServer() {
  const server = http.createServer(app);

  // Configura o Socket.io
  setupSocket(server);

  // 1. ESCUTA A PORTA PRIMEIRO (Evita erro de timeout no Cloud Run)
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);

    // 2. INICIA O BANCO EM SEGUNDO PLANO
    connectDB().catch((err) => {
      console.error("Erro na thread de conexão do banco:", err);
    });
  });
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