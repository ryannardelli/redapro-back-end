const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");

const { Sequelize } = require("sequelize");

const env = process.env.NODE_ENV || "development";

if (process.env.NODE_ENV !== "production" && process.env.NODE_ENV !== "test") {
  require("dotenv").config();
}

let sequelize;

if (env === "production") {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    protocol: "postgres",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  });
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialect: "postgres",
      logging: false,
    }
  );
}

module.exports = sequelize;