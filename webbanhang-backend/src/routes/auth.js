const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { NguoiDung } = require('../models');
const { verifyToken } = require('../middleware/auth');

// [POST] /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { hoVaTen, soDienThoai, matKhau } = req.body;
    if (!hoVaTen || !soDienThoai || !matKhau)
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin' });

    const existed = await NguoiDung.findOne({ where: { soDienThoai } });
    if (existed)
      return res.status(400).json({ message: 'Số điện thoại này đã được đăng ký' });

    const salt = await bcrypt.genSalt(10);
    const matKhauHash = await bcrypt.hash(matKhau, salt);

    await NguoiDung.create({ hoVaTen, soDienThoai, matKhau: matKhauHash });
    res.status(201).json({ message: 'Đăng ký thành công!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// [POST] /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { soDienThoai, matKhau } = req.body;
    const nguoiDung = await NguoiDung.findOne({ where: { soDienThoai } });
    if (!nguoiDung)
      return res.status(400).json({ message: 'Tài khoản không tồn tại' });

    if (nguoiDung.trangThai === 0)
      return res.status(403).json({ message: 'Tài khoản của bạn đã bị khóa' });

    const khop = await bcrypt.compare(matKhau, nguoiDung.matKhau);
    if (!khop)
      return res.status(400).json({ message: 'Sai mật khẩu' });

    const token = jwt.sign(
      { id: nguoiDung.id, soDienThoai: nguoiDung.soDienThoai, loaiNguoiDung: nguoiDung.loaiNguoiDung },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Đăng nhập thành công',
      token,
      user: {
        id: nguoiDung.id,
        hoVaTen: nguoiDung.hoVaTen,
        soDienThoai: nguoiDung.soDienThoai,
        email: nguoiDung.email,
        diaChi: nguoiDung.diaChi,
        loaiNguoiDung: nguoiDung.loaiNguoiDung
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// [GET] /api/auth/me
router.get('/me', verifyToken, async (req, res) => {
  try {
    const nguoiDung = await NguoiDung.findByPk(req.user.id, {
      attributes: { exclude: ['matKhau'] }
    });
    if (!nguoiDung)
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    res.json(nguoiDung);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

module.exports = router;
