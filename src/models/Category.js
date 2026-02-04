const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Category = sequelize.define("Category", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
            len: {
                args: [3, 50],
                msg: "O nome da categoria deve ter entre 3 e 50 caracteres."
            },

            is: {
                args: /^[A-Za-zÀ-ÿ0-9\s-]+$/,
                msg: "O nome da categoria contém caracteres inválidos."
            }
        }
    },

    description: {
        type: DataTypes.STRING(255),
        allowNull: true,
        validate: {
            len: {
                args: [10, 255],
                msg: "A descrição deve ter entre 10 e 255 caracteres."
            }
        }
    }
});

module.exports = Category;