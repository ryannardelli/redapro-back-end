const Essay = require("../models/Essay");
const User = require("../models/User");

module.exports = {
    findAll: () => Essay.findAll({ order: [["id", "ASC"]], include: ["category"], }),
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

    // findByWithUsers: (id) => {
    //     User.findByPk(id, {
    //         include: [{
    //             model: Essay,
    //             as: "essay",
    //             include: ["category"]
    //         }]
    //     });
    // },
    create: (data) => Essay.create(data),
    update: (essay, data) => essay.update(data),
    delete: (essay) => essay.destroy(),
    save: (essay) => essay.save()
}