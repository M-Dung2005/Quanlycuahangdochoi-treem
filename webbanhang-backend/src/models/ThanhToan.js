const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ThanhToan = sequelize.define('ThanhToan', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  idDonHang: { type: DataTypes.STRING(20), allowNull: false },
  soTien: { type: DataTypes.BIGINT, allowNull: false },
  phuongThuc: { type: DataTypes.STRING(50), allowNull: true },
  maGiaoDich: { type: DataTypes.STRING(100), allowNull: true },
  trangThai: { type: DataTypes.TINYINT, defaultValue: 0 }, // 0: chờ, 1: thành công, 2: thất bại
  ngayThanhToan: { type: DataTypes.DATE, allowNull: true }
}, {
  tableName: 'ThanhToan',
  timestamps: true,
  createdAt: 'ngayTao',
  updatedAt: false
});

module.exports = ThanhToan;
