const Essay = require("../models/Essay");
const User = require("../models/User");

module.exports = {
    findAll: (filters = {}) => {
    const where = {};

    if (filters.status) {
        where.status = filters.status;
    }

    if (filters.userId) {
        where.userId = filters.userId;
    }

    return Essay.findAll({
        where,
        order: [["id", "ASC"]],
        include: ["category"]
    });
},

    findById: (id) => Essay.findByPk(id),
    findByTitle(title, userId, categoryId) {
        const where = { title };

        if (userId) where.userId = userId;
        if (categoryId) where.categoryId = categoryId;

        return Essay.findOne({ where });
    },

    findByWithUsers: (id) => {
    return User.findByPk(id, {
        include: [{
            model: Essay,
            as: "essay",
            include: ["category"]
        }]
    });
},
    create: (data) => Essay.create(data),
    update: (essay, data) => essay.update(data),
    delete: (essay) => essay.destroy(),
    save: (essay) => essay.save()
}