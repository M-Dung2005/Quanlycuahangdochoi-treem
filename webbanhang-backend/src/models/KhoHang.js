const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const KhoHang = sequelize.define('KhoHang', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  idSanPham: { type: DataTypes.INTEGER, allowNull: false, unique: true },
  soLuongTon: { type: DataTypes.INTEGER, defaultValue: 0 },
  soLuongNhap: { type: DataTypes.INTEGER, defaultValue: 0 }, // Tổng đã nhập
  soLuongXuat: { type: DataTypes.INTEGER, defaultValue: 0 }  // Tổng đã bán
}, {
  tableName: 'KhoHang',
  timestamps: true,
  createdAt: false,
  updatedAt: 'ngayCapNhat'
});

module.exports = KhoHang;
