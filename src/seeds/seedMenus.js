const Menu = require("../models/Menu");

async function seedMenus() {
  const menus = [
    // COMUNS
    { key: "home", name: "Início", route: "/", icon: "Home", order: 1 },

    // ESTUDANTE
    { key: "my-essays", name: "Minhas Redações", route: "/my-essays", icon: "FileText", order: 2 },
    { key: "essay-upload", name: "Enviar Redação", route: "/essay-upload", icon: "PenLine", order: 3 },
    { key: "models", name: "Modelos Nota 1000", route: "/models", icon: "BookOpen", order: 4 },

    // CORRETOR
    { key: "essays-corrector", name: "Correções de Redação", route: "/essays-corrector", icon: "FileText", order: 5 },

    // ADMIN
    { key: "admin-home", name: "Home", route: "/admin/setup", icon: "Home", order: 6 },
    { key: "admin-menus", name: "Menus", route: "/admin/setup/menus", icon: "Layers", order: 7 },
    { key: "admin-profiles", name: "Perfis", route: "/admin/setup/profiles", icon: "Users", order: 8 },
    { key: "admin-users", name: "Usuários", route: "/admin/setup/users", icon: "UserCog", order: 9 },
    { key: "admin-categories", name: "Categorias", route: "/admin/setup/categories", icon: "Tags", order: 10 },
    { key: "admin-reference-essay", name: "Modelos Nota 1000", route: "/admin/setup/reference-essay", icon: "BookOpen", order: 11 },

    // EXTRAS
    { key: "my-profile", name: "Meu Perfil", route: "/my-profile", icon: "User", order: 12 },
    { key: "support", name: "Ajuda e Suporte", route: "/support", icon: "HelpCircle", order: 13 },
  ];

  for (const menu of menus) {
    await Menu.findOrCreate({
      where: { key: menu.key },
      defaults: {
        ...menu,
        order: menu.order ?? 999
      },
    });
  }
}

module.exports = seedMenus;