const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { KhuyenMai } = require('../models');
const { verifyToken } = require('../middleware/auth');
const { isAdmin } = require('../middleware/isAdmin');

// [POST] /api/coupons/check - Kiểm tra mã khuyến mãi (user)
router.post('/check', verifyToken, async (req, res) => {
  try {
    const { maKhuyenMai, tongDonHang } = req.body;
    const now = new Date();
    const km = await KhuyenMai.findOne({
      where: {
        maKhuyenMai,
        trangThai: 1,
        [Op.or]: [{ ngayBatDau: null }, { ngayBatDau: { [Op.lte]: now } }],
        [Op.or]: [{ ngayKetThuc: null }, { ngayKetThuc: { [Op.gte]: now } }]
      }
    });
    if (!km) return res.status(404).json({ message: 'Mã khuyến mãi không hợp lệ hoặc đã hết hạn' });
    if (km.soLuongSuDung !== -1 && km.soLuongDaDung >= km.soLuongSuDung)
      return res.status(400).json({ message: 'Mã khuyến mãi đã hết lượt sử dụng' });
    if (tongDonHang < km.giaTriToiThieu)
      return res.status(400).json({ message: `Đơn hàng tối thiểu ${km.giaTriToiThieu.toLocaleString()}đ để dùng mã này` });

    let soTienGiam = 0;
    if (km.loaiGiamGia === 'phantram') {
      soTienGiam = Math.round(tongDonHang * km.giaTriGiam / 100);
    } else {
      soTienGiam = km.giaTriGiam;
    }

    res.json({ valid: true, soTienGiam, khuyenMai: km });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// [GET] /api/coupons - Admin: tất cả mã
router.get('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const list = await KhuyenMai.findAll({ order: [['ngayTao', 'DESC']] });
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// [POST] /api/coupons (Admin)
router.post('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const km = await KhuyenMai.create(req.body);
    res.status(201).json(km);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// [PUT] /api/coupons/:id (Admin)
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const km = await KhuyenMai.findByPk(req.params.id);
    if (!km) return res.status(404).json({ message: 'Không tìm thấy mã khuyến mãi' });
    await km.update(req.body);
    res.json(km);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// [DELETE] /api/coupons/:id (Admin) - Tắt mã
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const km = await KhuyenMai.findByPk(req.params.id);
    if (!km) return res.status(404).json({ message: 'Không tìm thấy mã khuyến mãi' });
    await km.update({ trangThai: 0 });
    res.json({ message: 'Đã tắt mã khuyến mãi' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

module.exports = router;
