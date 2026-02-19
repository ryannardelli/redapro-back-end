const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Menu = sequelize.define("Menu", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    key: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },


    name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "O nome do menu é obrigatório."
            },

            len: {
                args: [1, 50],
                msg: "O nome do menu deve ter entre 1 e 50 caracteres."
            }
        }
    },

    route: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "A rota é obrigatória."
            },

            len: {
                args: [1, 100],
                msg: "A rota deve ter entre 1 e 100 caracteres."
            },

            is: {
                args: /^[a-z0-9\-\/]+$/,
                msg: "A rota deve conter apenas letras minúsculas, números, hífen (-) e barra (/)."
            }
        }
    },

    icon: {
        type: DataTypes.STRING(100),
        allowNull: false,
          validate: {
            notEmpty: {
                msg: "O ícone é obrigatório."
            },
        }
    }
});

module.exports = Menu;