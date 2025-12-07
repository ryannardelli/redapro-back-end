const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define("User", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: {
                args: [2, 100],
                msg: "O nome precisa ter pelo menos 2 letras e no máximo 100."
            }
        }
    },

    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
            isEmail: {
                msg: "O e-mail deve ser válido."
            }
        }
    },

    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: {
                args: [8, 20], // min 8, max 20
                msg: "A senha deve ter entre 8 e 20 caracters."
            }
        }
    },

    pictureUrl: {
        type: DataTypes.STRING,
        allowNull: true,
    }
});

module.exports = User;