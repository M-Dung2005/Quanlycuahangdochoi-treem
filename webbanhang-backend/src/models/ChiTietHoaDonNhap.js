const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ChiTietHoaDonNhap = sequelize.define('ChiTietHoaDonNhap', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  idHoaDonNhap: { type: DataTypes.INTEGER, allowNull: false },
  idSanPham: { type: DataTypes.INTEGER, allowNull: false },
  soLuong: { type: DataTypes.INTEGER, allowNull: false },
  giaNhap: { type: DataTypes.BIGINT, allowNull: false },
  // thanhTien là computed column trong SQL Server, không khai báo trong Sequelize
  ghiChu: { type: DataTypes.STRING(500), allowNull: true }
}, {
  tableName: 'ChiTietHoaDonNhap',
  timestamps: false
});

module.exports = ChiTietHoaDonNhap;
