const Menu = require("../models/Menu");

async function seedMenus() {
  const menus = [
    // MENUS COMUNS
    { key: "home", name: "Início", route: "/", icon: "Home" },

    // MENUS CORRETOR
    {
      key: "essays-corrector",
      name: "Correções de Redação",
      route: "/essays-corrector",
      icon: "FileText",
    },
    {
      key: "schedules-corrector",
      name: "Agenda de Correções",
      route: "/schedules-corrector",
      icon: "Calendar",
    },

    // MENUS ESTUDANTE
    {
      key: "my-essays",
      name: "Minhas Redações",
      route: "/my-essays",
      icon: "FileText",
    },
    {
      key: "essay-upload",
      name: "Enviar Redação",
      route: "/essay-upload",
      icon: "PenLine",
    },
    {
      key: "models",
      name: "Modelos Nota 1000",
      route: "/models",
      icon: "BookOpen",
    },
    {
      key: "calendar",
      name: "Agendamentos",
      route: "/calendar",
      icon: "Calendar",
    },

    // MENUS ADMIN
    {
      key: "admin-home",
      name: "Home",
      route: "/admin/setup",
      icon: "Home",
    },
    {
      key: "admin-menus",
      name: "Menus",
      route: "/admin/setup/menus",
      icon: "Layers",
    },
    {
      key: "admin-profiles",
      name: "Perfis",
      route: "/admin/setup/profiles",
      icon: "Users",
    },
    {
      key: "admin-users",
      name: "Usuários",
      route: "/admin/setup/users",
      icon: "UserCog",
    },
    {
      key: "admin-categories",
      name: "Categorias",
      route: "/admin/setup/categories",
      icon: "Tags",
    },
    {
      key: "admin-reference-essay",
      name: "Modelos Nota 1000",
      route: "/admin/setup/reference-essay",
      icon: "BookOpen",
    },

    { key: "my-profile", name: "Meu Perfil", route: "/my-profile", icon: "User" },
    { key: "support", name: "Ajuda e Suporte", route: "/support", icon: "HelpCircle" },
  ];

  for (const menu of menus) {
    await Menu.findOrCreate({
      where: { key: menu.key },
      defaults: menu,
    });
  }
}

module.exports = seedMenus;