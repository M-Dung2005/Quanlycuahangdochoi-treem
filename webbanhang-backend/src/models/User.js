const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  fullname: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING(15),      // Dùng làm username đăng nhập
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING(255),     // Hash
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  address: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  userType: {
    type: DataTypes.TINYINT,         // 0: user thường, 1: admin
    defaultValue: 0
  },
  status: {
    type: DataTypes.TINYINT,         // 0: bị khóa, 1: hoạt động
    defaultValue: 1
  }
}, {
  tableName: 'Users',
  timestamps: true                   // Tự sinh createdAt, updatedAt
});

module.exports = User;
