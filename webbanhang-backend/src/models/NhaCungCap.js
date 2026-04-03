const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const NhaCungCap = sequelize.define('NhaCungCap', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  maNhaCungCap: { type: DataTypes.STRING(20), allowNull: false, unique: true },
  tenNhaCungCap: { type: DataTypes.STRING(255), allowNull: false },
  nguoiDaiDien: { type: DataTypes.STRING(100), allowNull: true },
  soDienThoai: { type: DataTypes.STRING(15), allowNull: true },
  email: { type: DataTypes.STRING(100), allowNull: true },
  diaChi: { type: DataTypes.STRING(255), allowNull: true },
  ghiChu: { type: DataTypes.STRING(500), allowNull: true },
  trangThai: { type: DataTypes.TINYINT, defaultValue: 1 } // 0: ngừng, 1: hoạt động
}, {
  tableName: 'NhaCungCap',
  timestamps: true,
  createdAt: 'ngayTao',
  updatedAt: 'ngayCapNhat'
});

module.exports = NhaCungCap;
