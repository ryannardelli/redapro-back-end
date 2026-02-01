const Menu = require("../models/Menu");
const { update } = require("./profileRepository");

module.exports = {
    findAll: () => Menu.findAll({ order: [["id", "ASC"]] }),
    findById: (id) => Menu.findByPk(id),
    findByRoute: (route) => Menu.findOne({ where: { route } }),
    create: (data) => Menu.create(data),
    update: (menu, data) => menu.update(data),
    delete: (menu) => menu.destroy(),
    save: (menu) => menu.save() 
}