const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { SanPham, DanhMuc, KhoHang } = require('../models');
const { verifyToken } = require('../middleware/auth');
const { isAdmin } = require('../middleware/isAdmin');

// [GET] /api/products
// Query: ?search=&idDanhMuc=&minPrice=&maxPrice=&page=&limit=
router.get('/', async (req, res) => {
  try {
    const { search, idDanhMuc, minPrice, maxPrice, page = 1, limit = 60 } = req.query;
    const where = { trangThai: 1 };

    if (idDanhMuc) where.idDanhMuc = idDanhMuc;
    if (search) where.tieuDe = { [Op.like]: `%${search}%` };
    if (minPrice || maxPrice) {
      where.gia = {};
      if (minPrice) where.gia[Op.gte] = minPrice;
      if (maxPrice) where.gia[Op.lte] = maxPrice;
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const { count, rows } = await SanPham.findAndCountAll({
      where,
      include: [
        { model: DanhMuc, as: 'danhMuc', attributes: ['id', 'tenDanhMuc'] },
        { model: KhoHang, as: 'khoHang', attributes: ['soLuongTon'] }
      ],
      limit: parseInt(limit),
      offset
    });

    res.json({ total: count, page: parseInt(page), products: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// [GET] /api/products/all (Admin: lấy cả sp ẩn)
router.get('/all', verifyToken, isAdmin, async (req, res) => {
  try {
    const products = await SanPham.findAll({
      include: [
        { model: DanhMuc, as: 'danhMuc', attributes: ['id', 'tenDanhMuc'] },
        { model: KhoHang, as: 'khoHang', attributes: ['soLuongTon'] }
      ]
    });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// [GET] /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const sp = await SanPham.findByPk(req.params.id, {
      include: [
        { model: DanhMuc, as: 'danhMuc', attributes: ['id', 'tenDanhMuc'] },
        { model: KhoHang, as: 'khoHang', attributes: ['soLuongTon'] }
      ]
    });
    if (!sp) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    res.json(sp);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// [POST] /api/products (Admin)
router.post('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const { tieuDe, hinhAnh, idDanhMuc, gia, moTa, thuongHieu, tuoiPhuHop, chatLieu, kichThuoc, trongLuong, soLuongTon = 0 } = req.body;
    const sp = await SanPham.create({
      tieuDe,
      hinhAnh: hinhAnh || './assets/img/blank-image.png',
      idDanhMuc,
      gia,
      moTa,
      thuongHieu,
      tuoiPhuHop,
      chatLieu,
      kichThuoc,
      trongLuong
    });
    // Tạo kho hàng tương ứng
    await KhoHang.create({ idSanPham: sp.id, soLuongTon });
    res.status(201).json(sp);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// [PUT] /api/products/:id (Admin)
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const sp = await SanPham.findByPk(req.params.id);
    if (!sp) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    await sp.update(req.body);
    res.json(sp);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// [DELETE] /api/products/:id (Admin) - Ẩn sản phẩm
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const sp = await SanPham.findByPk(req.params.id);
    if (!sp) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    await sp.update({ trangThai: 0 });
    res.json({ message: 'Đã ẩn sản phẩm thành công' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

module.exports = router;
