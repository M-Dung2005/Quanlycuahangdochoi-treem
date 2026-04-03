// index.js – Export tất cả models + khai báo associations
const NguoiDung        = require('./NguoiDung');
const DanhMuc          = require('./DanhMuc');
const SanPham          = require('./SanPham');
const KhoHang          = require('./KhoHang');
const NhaCungCap       = require('./NhaCungCap');
const HoaDonNhap       = require('./HoaDonNhap');
const ChiTietHoaDonNhap = require('./ChiTietHoaDonNhap');
const DonHang          = require('./DonHang');
const ChiTietDonHang   = require('./ChiTietDonHang');
const ThanhToan        = require('./ThanhToan');
const KhuyenMai        = require('./KhuyenMai');
const DanhGia          = require('./DanhGia');

// ── DanhMuc ──────────────────────────────────────────────
// DanhMuc 1-N SanPham
DanhMuc.hasMany(SanPham, { foreignKey: 'idDanhMuc', as: 'sanPhams' });
SanPham.belongsTo(DanhMuc, { foreignKey: 'idDanhMuc', as: 'danhMuc' });

// ── SanPham ───────────────────────────────────────────────
// SanPham 1-1 KhoHang
SanPham.hasOne(KhoHang, { foreignKey: 'idSanPham', as: 'khoHang', onDelete: 'CASCADE' });
KhoHang.belongsTo(SanPham, { foreignKey: 'idSanPham', as: 'sanPham' });

// SanPham 1-N DanhGia
SanPham.hasMany(DanhGia, { foreignKey: 'idSanPham', as: 'danhGias', onDelete: 'CASCADE' });
DanhGia.belongsTo(SanPham, { foreignKey: 'idSanPham', as: 'sanPham' });

// ── NguoiDung ─────────────────────────────────────────────
// NguoiDung 1-N DonHang
NguoiDung.hasMany(DonHang, { foreignKey: 'idNguoiDung', as: 'donHangs' });
DonHang.belongsTo(NguoiDung, { foreignKey: 'idNguoiDung', as: 'nguoiDung' });

// NguoiDung 1-N DanhGia
NguoiDung.hasMany(DanhGia, { foreignKey: 'idNguoiDung', as: 'danhGias' });
DanhGia.belongsTo(NguoiDung, { foreignKey: 'idNguoiDung', as: 'nguoiDung' });

// NguoiDung (admin) 1-N HoaDonNhap
NguoiDung.hasMany(HoaDonNhap, { foreignKey: 'idNguoiNhap', as: 'hoaDonNhaps' });
HoaDonNhap.belongsTo(NguoiDung, { foreignKey: 'idNguoiNhap', as: 'nguoiNhap' });

// ── DonHang ───────────────────────────────────────────────
// DonHang 1-N ChiTietDonHang
DonHang.hasMany(ChiTietDonHang, { foreignKey: 'idDonHang', as: 'chiTiets', onDelete: 'CASCADE' });
ChiTietDonHang.belongsTo(DonHang, { foreignKey: 'idDonHang', as: 'donHang' });

// DonHang 1-N ThanhToan
DonHang.hasMany(ThanhToan, { foreignKey: 'idDonHang', as: 'thanhToans' });
ThanhToan.belongsTo(DonHang, { foreignKey: 'idDonHang', as: 'donHang' });

// SanPham 1-N ChiTietDonHang
SanPham.hasMany(ChiTietDonHang, { foreignKey: 'idSanPham', as: 'chiTietDonHangs' });
ChiTietDonHang.belongsTo(SanPham, { foreignKey: 'idSanPham', as: 'sanPham' });

// ── Nhập hàng ─────────────────────────────────────────────
// NhaCungCap 1-N HoaDonNhap
NhaCungCap.hasMany(HoaDonNhap, { foreignKey: 'idNhaCungCap', as: 'hoaDonNhaps' });
HoaDonNhap.belongsTo(NhaCungCap, { foreignKey: 'idNhaCungCap', as: 'nhaCungCap' });

// HoaDonNhap 1-N ChiTietHoaDonNhap
HoaDonNhap.hasMany(ChiTietHoaDonNhap, { foreignKey: 'idHoaDonNhap', as: 'chiTiets', onDelete: 'CASCADE' });
ChiTietHoaDonNhap.belongsTo(HoaDonNhap, { foreignKey: 'idHoaDonNhap', as: 'hoaDonNhap' });

// SanPham 1-N ChiTietHoaDonNhap
SanPham.hasMany(ChiTietHoaDonNhap, { foreignKey: 'idSanPham', as: 'chiTietNhaps' });
ChiTietHoaDonNhap.belongsTo(SanPham, { foreignKey: 'idSanPham', as: 'sanPham' });

module.exports = {
  NguoiDung,
  DanhMuc,
  SanPham,
  KhoHang,
  NhaCungCap,
  HoaDonNhap,
  ChiTietHoaDonNhap,
  DonHang,
  ChiTietDonHang,
  ThanhToan,
  KhuyenMai,
  DanhGia
};
