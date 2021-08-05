const Sequelize = require("sequelize");

const db = new Sequelize(
  process.env.DATABASE_URL ||
    `postgres://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:5432/${process.env.DB_NAME}`,
  {
    logging: false,
  }
);

module.exports = db;
