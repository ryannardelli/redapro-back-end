const Profile = require("../models/Profile");
const Menu = require("../models/Menu");
const ProfileMenu = require("../models/ProfileMenu");

async function seedProfileMenus() {
  const admin = await Profile.findOne({ where: { name: "Administrador" } });
  const corretor = await Profile.findOne({ where: { name: "Corretor" } });
  const estudante = await Profile.findOne({ where: { name: "Estudante" } });

  // MENUS ADMIN
  const adminMenuKeys = [
    "admin-home",
    "admin-menus",
    "admin-profiles",
    "admin-users",
    "admin-categories",
    "admin-reference-essay",
  ];

  for (const key of adminMenuKeys) {
    const menu = await Menu.findOne({ where: { key } });
    if (menu) {
      await ProfileMenu.findOrCreate({
        where: { profileId: admin.id, menuId: menu.id },
        defaults: { enabled: true },
      });
    }
  }

  // CORRETOR
  const corretorMenuKeys = [
    "home",
    "essays-corrector",
    "schedules-corrector",
    "my-profile",
    "support",
  ];

  for (const key of corretorMenuKeys) {
    const menu = await Menu.findOne({ where: { key } });
    if (menu) {
      await ProfileMenu.findOrCreate({
        where: { profileId: corretor.id, menuId: menu.id },
        defaults: { enabled: true },
      });
    }
  }

  // ESTUDANTE
  const estudanteMenuKeys = [
    "home",
    "my-essays",
    "essay-upload",
    "models",
    "my-profile",
    "support",
    "calendar",
  ];

  for (const key of estudanteMenuKeys) {
    const menu = await Menu.findOne({ where: { key } });
    if (menu) {
      await ProfileMenu.findOrCreate({
        where: { profileId: estudante.id, menuId: menu.id },
        defaults: { enabled: true },
      });
    }
  }
}

module.exports = seedProfileMenus;