const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ChiTietDonHang = sequelize.define('ChiTietDonHang', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  idDonHang: { type: DataTypes.STRING(20), allowNull: false },
  idSanPham: { type: DataTypes.INTEGER, allowNull: false },
  soLuong: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  donGia: { type: DataTypes.BIGINT, allowNull: false }, // Giá tại thời điểm đặt
  // thanhTien là computed column trong SQL Server
  ghiChu: { type: DataTypes.STRING(500), allowNull: true }
}, {
  tableName: 'ChiTietDonHang',
  timestamps: false
});

module.exports = ChiTietDonHang;
