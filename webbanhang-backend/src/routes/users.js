const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { NguoiDung } = require('../models');
const { verifyToken } = require('../middleware/auth');
const { isAdmin } = require('../middleware/isAdmin');

// [PUT] /api/users/profile - User cập nhật thông tin cá nhân
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const { hoVaTen, email, diaChi } = req.body;
    const nguoiDung = await NguoiDung.findByPk(req.user.id);
    if (!nguoiDung) return res.status(404).json({ message: 'Không tìm thấy tài khoản' });

    if (hoVaTen)       nguoiDung.hoVaTen = hoVaTen;
    if (email !== undefined) nguoiDung.email = email;
    if (diaChi !== undefined) nguoiDung.diaChi = diaChi;
    await nguoiDung.save();

    const data = nguoiDung.toJSON();
    delete data.matKhau;
    res.json({ message: 'Cập nhật thành công', user: data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// [PUT] /api/users/password - User đổi mật khẩu
router.put('/password', verifyToken, async (req, res) => {
  try {
    const { matKhauCu, matKhauMoi } = req.body;
    const nguoiDung = await NguoiDung.findByPk(req.user.id);
    if (!nguoiDung) return res.status(404).json({ message: 'Không tìm thấy tài khoản' });

    const khop = await bcrypt.compare(matKhauCu, nguoiDung.matKhau);
    if (!khop) return res.status(400).json({ message: 'Mật khẩu hiện tại không đúng' });

    const salt = await bcrypt.genSalt(10);
    nguoiDung.matKhau = await bcrypt.hash(matKhauMoi, salt);
    await nguoiDung.save();
    res.json({ message: 'Đổi mật khẩu thành công' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// [GET] /api/users - Admin: danh sách người dùng
router.get('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await NguoiDung.findAll({ attributes: { exclude: ['matKhau'] } });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// [PUT] /api/users/:id/status - Admin: Khóa / Mở khóa tài khoản
router.put('/:id/status', verifyToken, isAdmin, async (req, res) => {
  try {
    const { trangThai } = req.body;
    const nguoiDung = await NguoiDung.findByPk(req.params.id);
    if (!nguoiDung) return res.status(404).json({ message: 'Không tìm thấy tài khoản' });
    if (nguoiDung.loaiNguoiDung === 2) return res.status(400).json({ message: 'Không thể khóa admin' });

    nguoiDung.trangThai = trangThai;
    await nguoiDung.save();
    res.json({ message: `Tài khoản đã được ${trangThai === 1 ? 'mở khóa' : 'khóa'}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

module.exports = router;
