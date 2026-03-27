const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  img: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  price: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  desc: {
    type: DataTypes.TEXT, // Đổi sang TEXT (sẽ map với NVARCHAR(MAX) trong SQL Server)
    allowNull: true
  },
  status: {
    type: DataTypes.TINYINT,         // 0: ẩn, 1: hiện
    defaultValue: 1
  }
}, {
  tableName: 'Products',
  timestamps: false                  // Tắt created_at, updated_at
});

module.exports = Product;
