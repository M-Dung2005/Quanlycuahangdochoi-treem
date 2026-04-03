const express = require('express');
const router = express.Router();
const { NhaCungCap } = require('../models');
const { verifyToken } = require('../middleware/auth');
const { isAdmin } = require('../middleware/isAdmin');

// [GET] /api/suppliers - Admin: danh sách nhà cung cấp
router.get('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const suppliers = await NhaCungCap.findAll({ where: { trangThai: 1 } });
    res.json(suppliers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// [GET] /api/suppliers/all - Admin: tất cả (kể cả ngừng HT)
router.get('/all', verifyToken, isAdmin, async (req, res) => {
  try {
    const suppliers = await NhaCungCap.findAll();
    res.json(suppliers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// [GET] /api/suppliers/:id (Admin)
router.get('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const ncc = await NhaCungCap.findByPk(req.params.id);
    if (!ncc) return res.status(404).json({ message: 'Không tìm thấy nhà cung cấp' });
    res.json(ncc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// [POST] /api/suppliers (Admin)
router.post('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const { maNhaCungCap, tenNhaCungCap, nguoiDaiDien, soDienThoai, email, diaChi, ghiChu } = req.body;
    if (!tenNhaCungCap || !maNhaCungCap)
      return res.status(400).json({ message: 'Vui lòng nhập mã và tên nhà cung cấp' });
    const ncc = await NhaCungCap.create({ maNhaCungCap, tenNhaCungCap, nguoiDaiDien, soDienThoai, email, diaChi, ghiChu });
    res.status(201).json(ncc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// [PUT] /api/suppliers/:id (Admin)
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const ncc = await NhaCungCap.findByPk(req.params.id);
    if (!ncc) return res.status(404).json({ message: 'Không tìm thấy nhà cung cấp' });
    await ncc.update(req.body);
    res.json(ncc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// [DELETE] /api/suppliers/:id (Admin) - Ngừng hợp tác
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const ncc = await NhaCungCap.findByPk(req.params.id);
    if (!ncc) return res.status(404).json({ message: 'Không tìm thấy nhà cung cấp' });
    await ncc.update({ trangThai: 0 });
    res.json({ message: 'Đã ngừng hợp tác với nhà cung cấp' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

module.exports = router;
