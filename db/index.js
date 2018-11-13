const Sequelize = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'mssql',
  server: process.env.DB_SERVER_NAME,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PWD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  logging: function (log) {
    console.log(log);
  },
  dialectOptions: { 
    requestTimeout: 30000,
    instanceName: process.env.DB_SERVER_INSTANCE_NAME
  }
});


module.exports = sequelize;