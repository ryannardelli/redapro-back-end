const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Essay = sequelize.define("Essay", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    content: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
        notEmpty: {
            msg: "O conteúdo da redação não pode estar vazio."
        },
        len: {
            args: [1000, 5000],
            msg: "A redação deve conter entre 1000 e 5000 caracteres."
        }
    },

    note: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            min: {
                args: [0],
                msg: "A nota não pode ser menor que 0."
            },
            max: {
                args: [1000],
                msg: "A nota não pode ser maior que 1000."
            }
        }
    },

    status: {
        type: DataTypes.ENUM(
            "PENDENTE",
            "CORRIGIDA",
            "INVALIDA"
        ),
        allowNull: false,
        defaultValue: "PENDENTE"
    },

    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: "user",
            key: "id"
        }
    },

    categoryId: {
        type: DataTypes.INTEGER,
        references: {
            model: "category",
            key: "id"
        }
    }
}
});

module.exports = Essay;