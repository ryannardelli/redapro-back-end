const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Profile = require("./Profile");
const Menu = require("./Menu");

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
            model: Profile,
            key: "id",
        }
    },

    menuId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Menu,
            key: "id"
        }
    }

    }, {
    tableName: "profile_menu",
    timestamps: false
});

module.exports = ProfileMenu;