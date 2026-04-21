const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Essay = sequelize.define("Essay", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  title: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      len: {
        args: [5, 100],
        msg: "O título deve ter entre 5 e 100 caracteres."
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

  c1: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0,
      max: 200,
    }
  },

  c2: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0,
      max: 200,
    }
  },

  c3: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0,
      max: 200,
    }
  },

  c4: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0,
      max: 200,
    }
  },

  c5: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0,
      max: 200,
    }
  },

  note: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0,
      max: 1000
    }
  },

  generalFeedback: { 
    type: DataTypes.TEXT,  
    allowNull: true
  },

  status: {
    type: DataTypes.ENUM("PENDENTE", "CORRIGIDA", "EM_CORRECAO", "ERRO"),
    allowNull: false,
    defaultValue: "PENDENTE"
  },

  attachmentUrl: {
      type: DataTypes.STRING,
      allowNull: true
  },

  attachmentPublicId: {
    type: DataTypes.STRING,
    allowNull: true
  },

  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "users",
      key: "id"
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

  reviewerId: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
});

module.exports = Essay;