const express = require('express');
const router = express.Router();
const { DanhGia, NguoiDung, SanPham } = require('../models');
const { verifyToken } = require('../middleware/auth');
const { isAdmin } = require('../middleware/isAdmin');

// [GET] /api/reviews/:sanPhamId - Đánh giá công khai của sản phẩm
router.get('/:sanPhamId', async (req, res) => {
  try {
    const reviews = await DanhGia.findAll({
      where: { idSanPham: req.params.sanPhamId, trangThai: 1 },
      include: [{ model: NguoiDung, as: 'nguoiDung', attributes: ['hoVaTen'] }],
      order: [['ngayTao', 'DESC']]
    });
    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// [POST] /api/reviews - Thêm đánh giá (user đã đăng nhập)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { idSanPham, soSao, noiDung } = req.body;
    if (!idSanPham || !soSao)
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin đánh giá' });
    if (soSao < 1 || soSao > 5)
      return res.status(400).json({ message: 'Số sao phải từ 1 đến 5' });

    const danhGia = await DanhGia.create({
      idSanPham,
      idNguoiDung: req.user.id,
      soSao,
      noiDung
    });
    res.status(201).json(danhGia);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// [DELETE] /api/reviews/:id (Admin: ẩn đánh giá)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const dg = await DanhGia.findByPk(req.params.id);
    if (!dg) return res.status(404).json({ message: 'Không tìm thấy đánh giá' });
    await dg.update({ trangThai: 0 });
    res.json({ message: 'Đã ẩn đánh giá' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

module.exports = router;
