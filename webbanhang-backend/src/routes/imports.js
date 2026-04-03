const express = require('express');
const router = express.Router();
const { HoaDonNhap, ChiTietHoaDonNhap, NhaCungCap, SanPham, KhoHang } = require('../models');
const { verifyToken } = require('../middleware/auth');
const { isAdmin } = require('../middleware/isAdmin');
const { sequelize } = require('../config/database');

// Tạo mã phiếu nhập tự động
const generateMaHDN = async () => {
  const count = await HoaDonNhap.count();
  const now = new Date();
  const yy = now.getFullYear().toString().slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  return `HDN${yy}${mm}${String(count + 1).padStart(4, '0')}`;
};

// [GET] /api/imports - Admin: danh sách phiếu nhập
router.get('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const list = await HoaDonNhap.findAll({
      include: [
        { model: NhaCungCap, as: 'nhaCungCap', attributes: ['tenNhaCungCap', 'maNhaCungCap'] }
      ],
      order: [['ngayTao', 'DESC']]
    });
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// [GET] /api/imports/:id - Chi tiết phiếu nhập
router.get('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const hdn = await HoaDonNhap.findByPk(req.params.id, {
      include: [
        { model: NhaCungCap, as: 'nhaCungCap' },
        {
          model: ChiTietHoaDonNhap,
          as: 'chiTiets',
          include: [{ model: SanPham, as: 'sanPham', attributes: ['tieuDe', 'hinhAnh'] }]
        }
      ]
    });
    if (!hdn) return res.status(404).json({ message: 'Không tìm thấy phiếu nhập' });
    res.json(hdn);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// [POST] /api/imports - Tạo phiếu nhập + cập nhật kho (khi trangThai = 2)
// Body: { idNhaCungCap, ghiChu, chiTiets: [{idSanPham, soLuong, giaNhap, ghiChu}] }
router.post('/', verifyToken, isAdmin, async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { idNhaCungCap, ghiChu, chiTiets } = req.body;
    if (!chiTiets || chiTiets.length === 0)
      return res.status(400).json({ message: 'Vui lòng chọn ít nhất 1 sản phẩm' });

    const ma = await generateMaHDN();
    const tongTien = chiTiets.reduce((sum, ct) => sum + ct.soLuong * ct.giaNhap, 0);

    const hdn = await HoaDonNhap.create({
      maHoaDonNhap: ma,
      idNhaCungCap,
      idNguoiNhap: req.user.id,
      tongTienNhap: tongTien,
      ghiChu,
      trangThai: 0
    }, { transaction: t });

    for (const ct of chiTiets) {
      await ChiTietHoaDonNhap.create({
        idHoaDonNhap: hdn.id,
        idSanPham: ct.idSanPham,
        soLuong: ct.soLuong,
        giaNhap: ct.giaNhap,
        ghiChu: ct.ghiChu || null
      }, { transaction: t });
    }

    await t.commit();
    res.status(201).json({ message: 'Tạo phiếu nhập thành công', maHoaDonNhap: ma, id: hdn.id });
  } catch (err) {
    await t.rollback();
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// [PUT] /api/imports/:id/status - Admin: duyệt phiếu → cập nhật kho
router.put('/:id/status', verifyToken, isAdmin, async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { trangThai } = req.body;
    const hdn = await HoaDonNhap.findByPk(req.params.id, {
      include: [{ model: ChiTietHoaDonNhap, as: 'chiTiets' }]
    });
    if (!hdn) return res.status(404).json({ message: 'Không tìm thấy phiếu nhập' });

    const trangThaiCu = hdn.trangThai;
    hdn.trangThai = trangThai;
    await hdn.save({ transaction: t });

    // Khi chuyển sang "Đã nhận hàng" (2) thì cộng vào kho
    if (trangThai === 2 && trangThaiCu !== 2) {
      for (const ct of hdn.chiTiets) {
        const kho = await KhoHang.findOne({ where: { idSanPham: ct.idSanPham } });
        if (kho) {
          await kho.increment(
            { soLuongTon: ct.soLuong, soLuongNhap: ct.soLuong },
            { transaction: t }
          );
        } else {
          await KhoHang.create({
            idSanPham: ct.idSanPham,
            soLuongTon: ct.soLuong,
            soLuongNhap: ct.soLuong
          }, { transaction: t });
        }
      }
    }

    // Nếu hủy (3) và trước đó đã nhập kho (2) thì trừ lại
    if (trangThai === 3 && trangThaiCu === 2) {
      for (const ct of hdn.chiTiets) {
        await KhoHang.increment(
          { soLuongTon: -ct.soLuong, soLuongNhap: -ct.soLuong },
          { where: { idSanPham: ct.idSanPham }, transaction: t }
        );
      }
    }

    await t.commit();
    res.json({ message: 'Cập nhật trạng thái phiếu nhập thành công' });
  } catch (err) {
    await t.rollback();
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

module.exports = router;
