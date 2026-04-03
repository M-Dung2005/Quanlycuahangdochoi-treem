const express = require('express');
const router = express.Router();
const { DanhMuc } = require('../models');
const { verifyToken } = require('../middleware/auth');
const { isAdmin } = require('../middleware/isAdmin');

// [GET] /api/categories - Danh sách danh mục đang hiện
router.get('/', async (req, res) => {
  try {
    const categories = await DanhMuc.findAll({ where: { trangThai: 1 } });
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// [GET] /api/categories/all - Admin: tất cả danh mục
router.get('/all', verifyToken, isAdmin, async (req, res) => {
  try {
    const categories = await DanhMuc.findAll();
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// [POST] /api/categories (Admin)
router.post('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const { tenDanhMuc, moTa } = req.body;
    if (!tenDanhMuc) return res.status(400).json({ message: 'Vui lòng nhập tên danh mục' });
    const dm = await DanhMuc.create({ tenDanhMuc, moTa });
    res.status(201).json(dm);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// [PUT] /api/categories/:id (Admin)
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const dm = await DanhMuc.findByPk(req.params.id);
    if (!dm) return res.status(404).json({ message: 'Không tìm thấy danh mục' });
    await dm.update(req.body);
    res.json(dm);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// [DELETE] /api/categories/:id (Admin) - Ẩn danh mục
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const dm = await DanhMuc.findByPk(req.params.id);
    if (!dm) return res.status(404).json({ message: 'Không tìm thấy danh mục' });
    await dm.update({ trangThai: 0 });
    res.json({ message: 'Đã ẩn danh mục' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

module.exports = router;
