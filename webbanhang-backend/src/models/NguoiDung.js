const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const NguoiDung = sequelize.define('NguoiDung', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  hoVaTen: { type: DataTypes.STRING(100), allowNull: false },
  soDienThoai: { type: DataTypes.STRING(15), allowNull: false, unique: true },
  matKhau: { type: DataTypes.STRING(255), allowNull: false },
  email: { type: DataTypes.STRING(100), allowNull: true },
  diaChi: { type: DataTypes.STRING(255), allowNull: true },
  loaiNguoiDung: { type: DataTypes.TINYINT, defaultValue: 0 }, // 0: KH, 1: NV, 2: admin
  trangThai: { type: DataTypes.TINYINT, defaultValue: 1 }       // 0: khóa, 1: hoạt động
}, {
  tableName: 'NguoiDung',
  timestamps: true,
  createdAt: 'ngayTao',
  updatedAt: 'ngayCapNhat'
});

module.exports = NguoiDung;
