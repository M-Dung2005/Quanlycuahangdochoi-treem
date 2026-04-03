const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const DanhGia = sequelize.define('DanhGia', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  idSanPham: { type: DataTypes.INTEGER, allowNull: false },
  idNguoiDung: { type: DataTypes.INTEGER, allowNull: false },
  soSao: { type: DataTypes.TINYINT, allowNull: false }, // 1-5
  noiDung: { type: DataTypes.TEXT, allowNull: true },
  trangThai: { type: DataTypes.TINYINT, defaultValue: 1 } // 0: ẩn, 1: hiện
}, {
  tableName: 'DanhGia',
  timestamps: true,
  createdAt: 'ngayTao',
  updatedAt: false
});

module.exports = DanhGia;
