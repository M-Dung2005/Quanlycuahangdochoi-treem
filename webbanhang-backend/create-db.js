const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize('master', process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_SERVER,
  port: 2222,
  dialect: 'mssql',
  dialectOptions: {
    options: { encrypt: false, trustServerCertificate: true }
  },
  logging: false
});

async function createDb() {
  try {
    await sequelize.authenticate();
    console.log('Connected to master DB.');
    const dbName = process.env.DB_NAME;
    const [results] = await sequelize.query(`SELECT name FROM master.dbo.sysdatabases WHERE name = N'${dbName}'`);
    if (results.length === 0) {
      await sequelize.query(`CREATE DATABASE [${dbName}]`);
      console.log(`Database ${dbName} created successfully.`);
    } else {
      console.log(`Database ${dbName} already exists.`);
    }
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await sequelize.close();
  }
}

createDb();
