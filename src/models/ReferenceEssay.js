const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ReferenceEssay = sequelize.define("ReferenceEssay", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    title: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      len: {
        args: [5, 50],
        msg: "O título deve ter entre 5 e 50 caracteres."
      }
    }
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
    }
  },

  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: {
        args: [1998], // Ano do primeiro ENEM
        msg: "O ano deve ser igual ou posterior a 1998."
      },
      max: {
        args: [new Date().getFullYear()],
        msg: "O ano não pode ser maior que o ano atual."
      }
    }
  },

  pdf_url: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isUrl: {
        msg: "O campo pdf_url deve ser uma URL válida."
      }
    }
  },

  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "categories",
      key: "id"
    }
  },
});

module.exports = ReferenceEssay;