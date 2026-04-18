const User = require('../models/User');
const Profile = require('../models/Profile');

module.exports = {
     findAll: () => User.findAll({
        include: [
            {
                model: Profile,
                as: 'Profile',
                attributes: ['id', 'name', 'description', 'system', 'active']
            }
        ]
    }),
     findById: (id) => User.findByPk(id, {
        include: [
            {
                model: Profile,
                as: 'Profile',
                attributes: ['id', 'name', 'description', 'system', 'active']
            }
        ]
    }),

     updatePassword: (userId, hashedPassword) => {
        return User.update(
        { password: hashedPassword },
        {
            where: { id: userId },
        }
        );
    },

    findByEmail: (email) => User.findOne({ where: { email } }),
    countUsers: () => User.count(),
    create: (data) => User.create(data),
    update: (user, data) => user.update(data),
    delete: (user) => user.destroy(),
    save: (user) => user.save(),
}