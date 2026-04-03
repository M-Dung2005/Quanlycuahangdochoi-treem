const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const SanPham = sequelize.define('SanPham', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  tieuDe: { type: DataTypes.STRING(255), allowNull: false },
  hinhAnh: { type: DataTypes.STRING(500), allowNull: true },
  idDanhMuc: { type: DataTypes.INTEGER, allowNull: false },
  gia: { type: DataTypes.BIGINT, allowNull: false },
  moTa: { type: DataTypes.TEXT, allowNull: true },
  thuongHieu: { type: DataTypes.STRING(100), allowNull: true },
  tuoiPhuHop: { type: DataTypes.STRING(50), allowNull: true },
  chatLieu: { type: DataTypes.STRING(100), allowNull: true },
  kichThuoc: { type: DataTypes.STRING(100), allowNull: true },
  trongLuong: { type: DataTypes.STRING(50), allowNull: true },
  trangThai: { type: DataTypes.TINYINT, defaultValue: 1 } // 0: ẩn, 1: hiện
}, {
  tableName: 'SanPham',
  timestamps: true,
  createdAt: 'ngayTao',
  updatedAt: 'ngayCapNhat'
});

module.exports = SanPham;
