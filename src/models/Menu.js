const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Menu = sequelize.define("Menu", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    name: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },

    route: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },

    icon: {
        type: DataTypes.STRING(100),
        allowNull: false,
    }
});

module.exports = Menu;