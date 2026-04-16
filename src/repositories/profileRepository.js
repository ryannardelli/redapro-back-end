const Menu = require('../models/Menu');
const Profile = require('../models/Profile');

module.exports = {
    findAll: () => Profile.findAll({ raw: true }),
    findById: (id) => Profile.findByPk(id),
    findByName: (name) => Profile.findOne({ where: { name } }),
    findByWithMenus: (id) =>
        Profile.findByPk(id, {
            include: [{
                model: Menu,
                as: "Menus",
                through: { attributes: [] }
            }]
        }),
    create: (data) => Profile.create(data),
    update: (user, data) => user.update(data),
    delete: (user) => user.destroy(),
    save: (user) => user.save(),
}