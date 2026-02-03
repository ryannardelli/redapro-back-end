const Essay = require("../models/Essay");

module.exports = {
    findAll: () => Essay.findAll({ order: [["id", "ASC"]], include: ["category"], }),
    findById: (id) => Essay.findByPk(id),
    findByTitle(title, userId, categoryId) {
        const where = { title };

        if (userId) where.userId = userId;
        if (categoryId) where.categoryId = categoryId;

        return Essay.findOne({ where });
    },
    create: (data) => Essay.create(data),
    update: (essay, data) => essay.update(data),
    delete: (essay) => essay.destroy(),
    save: (essay) => essay.save()
}