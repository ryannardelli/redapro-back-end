require("dotenv").config();

const app = require("./app");
const http = require("http");
const setupSocket = require("./config/socket");
const sequelize = require("./config/database");

// Importação dos Seeds
const seedProfiles = require("./seeds/profile.seed");
const seedProfileMenus = require("./seeds/seedProfileMenus");
const seedMenus = require("./seeds/seedMenus");

const PORT = process.env.PORT || 8080;

/**
 * Configura as associações entre os modelos do Sequelize.
 * Manter fora da função async principal ajuda na organização.
 */
function setupAssociations() {
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

  Profile.belongsToMany(Menu, { through: ProfileMenu, foreignKey: "profileId" });
  Menu.belongsToMany(Profile, { through: ProfileMenu, foreignKey: "menuId" });

  return { Profile }; // Retornamos o que precisaremos para o Count
}

/**
 * Função principal de inicialização
 */
async function startServer() {
  try {
    console.log("🔄 Iniciando processo de boot do servidor...");

    // 1. Conectar ao Banco de Dados
    await sequelize.authenticate();
    console.log("✅ Conectado ao banco PostgreSQL com sucesso!");

    // 2. Configurar Associações e Sincronizar Tabelas
    const { Profile } = setupAssociations();
    await sequelize.sync();
    console.log("✅ Tabelas sincronizadas com sucesso!");

    // 3. Executar Seeds se necessário
    const profilesCount = await Profile.count();
    if (profilesCount === 0) {
      console.log("🌱 Banco vazio. Executando seeds iniciais...");
      await seedProfiles();
      await seedMenus();
      await seedProfileMenus();
      console.log("✅ Seeds finalizados.");
    }

    // 4. Criar e configurar o Servidor HTTP/Socket
    const server = http.createServer(app);
    setupSocket(server);

    // 5. SÓ AGORA abrir a porta para o Cloud Run
    server.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Servidor rodando e pronto na porta ${PORT}`);
    });

  } catch (error) {
    // Se qualquer passo acima falhar, o erro será pego aqui
    console.error("❌ ERRO CRÍTICO NA INICIALIZAÇÃO:", error);
    
    // No Cloud Run, encerramos o processo com erro (1) 
    // para que a infraestrutura tente subir uma nova instância saudável.
    process.exit(1);
  }
}

// Executa a inicialização
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