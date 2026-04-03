const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const KhuyenMai = sequelize.define('KhuyenMai', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  maKhuyenMai: { type: DataTypes.STRING(50), allowNull: false, unique: true },
  tenKhuyenMai: { type: DataTypes.STRING(255), allowNull: false },
  moTa: { type: DataTypes.TEXT, allowNull: true },
  loaiGiamGia: { type: DataTypes.STRING(20), allowNull: true }, // 'phantram' | 'tienmat'
  giaTriGiam: { type: DataTypes.BIGINT, allowNull: false },
  giaTriToiThieu: { type: DataTypes.BIGINT, defaultValue: 0 },
  soLuongSuDung: { type: DataTypes.INTEGER, defaultValue: -1 }, // -1: không giới hạn
  soLuongDaDung: { type: DataTypes.INTEGER, defaultValue: 0 },
  ngayBatDau: { type: DataTypes.DATE, allowNull: true },
  ngayKetThuc: { type: DataTypes.DATE, allowNull: true },
  trangThai: { type: DataTypes.TINYINT, defaultValue: 1 } // 0: tắt, 1: bật
}, {
  tableName: 'KhuyenMai',
  timestamps: true,
  createdAt: 'ngayTao',
  updatedAt: 'ngayCapNhat'
});

module.exports = KhuyenMai;
