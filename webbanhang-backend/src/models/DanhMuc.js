const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const DanhMuc = sequelize.define('DanhMuc', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  tenDanhMuc: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  moTa: { type: DataTypes.TEXT, allowNull: true },
  trangThai: { type: DataTypes.TINYINT, defaultValue: 1 } // 0: ẩn, 1: hiện
}, {
  tableName: 'DanhMuc',
  timestamps: true,
  createdAt: 'ngayTao',
  updatedAt: 'ngayCapNhat'
});

module.exports = DanhMuc;
