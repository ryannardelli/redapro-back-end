const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ProfileMenu = sequelize.define("ProfileMenu", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    profileId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "profile",
            key: "id",
        }
    },

    menuId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "menu",
            key: "id"
        }
    }

    }, {
    tableName: "profile_menu",
    timestamps: false
});

module.exports = ProfileMenu;