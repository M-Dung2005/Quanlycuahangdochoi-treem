const { Sequelize } = require('sequelize');
require('dotenv').config();

// Khởi tạo kết nối Sequelize với SQL Server (tedious)
const sequelize = new Sequelize(
  process.env.DB_NAME, 
  process.env.DB_USER, 
  process.env.DB_PASS, 
  {
    host: process.env.DB_SERVER,
    port: parseInt(process.env.DB_PORT || '1433'),
    dialect: 'mssql',
    dialectOptions: {
      options: {
        encrypt: false,       // false nếu không dùng SSL
        trustServerCertificate: true // bắt buộc khi dùng local dev
      }
    },
    logging: false            // tắt log câu query SQL để console đỡ rối
  }
);

// Test connection
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Kết nối SQL Server thành công.');
  } catch (error) {
    console.error('❌ Không thể kết nối SQL Server:', error);
  }
};

module.exports = { sequelize, connectDB };
