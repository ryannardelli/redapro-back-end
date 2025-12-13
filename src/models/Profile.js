const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Profile = sequelize.define("Profile", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            len: {
                args: [3, 50],
                msg: "O nome do perfil precisa ter pelo menos 3 letras e no máximo 50."
            }
        }
    },

    description: {
        type: DataTypes.STRING(255),
        allowNull: true,
        validate: {
            len: {
                args: [0, 255],
                msg: "A descrição do perfil deve ter no máximo 255 caracteres."
            }
        }
    }
})

module.exports = Profile;