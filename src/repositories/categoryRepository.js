const Category = require("../models/Category");

module.exports = {
    findAll: () => Category.findAll({ raw: true }),
    findById: (id) => Category.findByPk(id),
    findByName: (name) => Category.findOne({ where: { name } }),
    create: (data) => Category.create(data),
    update: (category, data) => category.update(data),
    delete: (category) => category.destroy(),
    save: (category) => category.save(),
}