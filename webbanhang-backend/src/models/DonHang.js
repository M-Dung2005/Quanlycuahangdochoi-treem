const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const DonHang = sequelize.define('DonHang', {
  id: { type: DataTypes.STRING(20), primaryKey: true, allowNull: false },
  idNguoiDung: { type: DataTypes.INTEGER, allowNull: false },
  tenNguoiNhan: { type: DataTypes.STRING(100), allowNull: false },
  soDienThoaiNguoiNhan: { type: DataTypes.STRING(15), allowNull: false },
  diaChi: { type: DataTypes.STRING(255), allowNull: false },
  loaiGiaoHang: { type: DataTypes.STRING(50), allowNull: true },
  thoiGianGiaoHang: { type: DataTypes.STRING(50), allowNull: true },
  phuongThucThanhToan: { type: DataTypes.STRING(50), allowNull: true },
  maKhuyenMai: { type: DataTypes.STRING(50), allowNull: true },
  tongGia: { type: DataTypes.BIGINT, allowNull: false },
  phiGiaoHang: { type: DataTypes.BIGINT, defaultValue: 0 },
  giamGia: { type: DataTypes.BIGINT, defaultValue: 0 },
  // thanhToanCuoiCung là computed column trong SQL Server
  ghiChu: { type: DataTypes.STRING(500), allowNull: true },
  trangThai: {
    type: DataTypes.TINYINT,
    defaultValue: 0
    // 0: chờ xử lý, 1: đã xác nhận, 2: đang giao, 3: hoàn thành, 4: hủy
  }
}, {
  tableName: 'DonHang',
  timestamps: true,
  createdAt: 'ngayTao',
  updatedAt: 'ngayCapNhat'
});

module.exports = DonHang;
