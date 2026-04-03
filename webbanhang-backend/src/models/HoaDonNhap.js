const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const HoaDonNhap = sequelize.define('HoaDonNhap', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  maHoaDonNhap: { type: DataTypes.STRING(20), allowNull: false, unique: true },
  idNhaCungCap: { type: DataTypes.INTEGER, allowNull: false },
  idNguoiNhap: { type: DataTypes.INTEGER, allowNull: false },
  ngayNhap: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  tongTienNhap: { type: DataTypes.BIGINT, allowNull: false, defaultValue: 0 },
  trangThai: {
    type: DataTypes.TINYINT,
    defaultValue: 0
    // 0: chờ duyệt, 1: đã duyệt, 2: đã nhận hàng, 3: hủy
  },
  ghiChu: { type: DataTypes.STRING(500), allowNull: true }
}, {
  tableName: 'HoaDonNhap',
  timestamps: true,
  createdAt: 'ngayTao',
  updatedAt: 'ngayCapNhat'
});

module.exports = HoaDonNhap;
