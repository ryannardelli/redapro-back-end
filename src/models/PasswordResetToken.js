const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");

const PasswordResetToken = sequelize.define("PasswordResetToken", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  token: {
    type: DataTypes.STRING,
    allowNull: false
  },

  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "users",
      key: "id"
    },
    onDelete: "CASCADE"
  },

  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false
  },

  used: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

module.exports = PasswordResetToken;