const { Sequelize } = require("sequelize");
require("dotenv").config();

// const sequelize = new Sequelize(
//     process.env.DB_NAME,
//     process.env.DB_USER,
//     process.env.DB_PASS,
//     {
//         host: process.env.DB_HOST,
//         port: process.env.DB_PORT,
//         dialect: 'postgres',
//         logging: false,
//     }
// )

const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  dialect: "postgres",
  dialectOptions: {
    socketPath: process.env.DB_HOST,
  },
  logging: false,
});

module.exports = sequelize;