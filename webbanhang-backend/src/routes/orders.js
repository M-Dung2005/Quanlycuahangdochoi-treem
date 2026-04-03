const express = require('express');
const router = express.Router();
const { DonHang, ChiTietDonHang, SanPham, DanhMuc, KhoHang, NguoiDung } = require('../models');
const { verifyToken } = require('../middleware/auth');
const { isAdmin } = require('../middleware/isAdmin');
const { sequelize } = require('../config/database');

// Tạo mã đơn hàng tự động: DH + timestamp + random
const generateOrderId = async () => {
  const count = await DonHang.count();
  return `DH${String(count + 1).padStart(6, '0')}`;
};

// [POST] /api/orders - Tạo đơn hàng mới
router.post('/', verifyToken, async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const {
      tenNguoiNhan, soDienThoaiNguoiNhan, diaChi,
      loaiGiaoHang, thoiGianGiaoHang, phuongThucThanhToan,
      maKhuyenMai, ghiChu, cartItems
    } = req.body;

    if (!cartItems || cartItems.length === 0)
      return res.status(400).json({ message: 'Giỏ hàng trống!' });

    // Tính tổng tiền hàng & kiểm tra tồn kho
    let tongTienHang = 0;
    for (const item of cartItems) {
      const idSP = item.idSanPham ?? item.id;
      const sp = await SanPham.findByPk(idSP, {
        include: [{ model: KhoHang, as: 'khoHang' }]
      });
      if (!sp) throw new Error(`Sản phẩm ID ${idSP} không tồn tại`);
      const soLuong = item.soLuong ?? item.qty ?? 1;
      if (sp.khoHang && sp.khoHang.soLuongTon < soLuong)
        throw new Error(`Sản phẩm "${sp.tieuDe}" không đủ số lượng trong kho`);
      tongTienHang += sp.gia * soLuong;
    }

    const phiGiaoHang = loaiGiaoHang === 'Giao tận nơi' ? 30000 : 0;
    const orderId = await generateOrderId();

    // Tạo đơn hàng
    const donHang = await DonHang.create({
      id: orderId,
      idNguoiDung: req.user.id,
      tenNguoiNhan,
      soDienThoaiNguoiNhan,
      diaChi,
      loaiGiaoHang,
      thoiGianGiaoHang,
      phuongThucThanhToan,
      maKhuyenMai: maKhuyenMai || null,
      tongGia: tongTienHang,
      phiGiaoHang,
      ghiChu,
      trangThai: 0
    }, { transaction: t });

    // Tạo chi tiết đơn hàng & cập nhật kho
    for (const item of cartItems) {
      const idSP  = item.idSanPham ?? item.id;
      const soLuong = item.soLuong ?? item.qty ?? 1;
      const sp = await SanPham.findByPk(idSP);
      const donGia = item.donGia ?? sp.gia;
      await ChiTietDonHang.create({
        idDonHang: donHang.id,
        idSanPham: idSP,
        soLuong,
        donGia,
        ghiChu: item.ghiChu || null
      }, { transaction: t });

      // Trừ kho
      await KhoHang.increment(
        { soLuongTon: -soLuong, soLuongXuat: soLuong },
        { where: { idSanPham: idSP }, transaction: t }
      );
    }

    await t.commit();
    res.status(201).json({ message: 'Đặt hàng thành công!', orderId: donHang.id });
  } catch (err) {
    await t.rollback();
    console.error(err);
    res.status(500).json({ message: err.message || 'Lỗi server khi đặt hàng' });
  }
});

// [GET] /api/orders/me - Lịch sử đơn hàng của user
router.get('/me', verifyToken, async (req, res) => {
  try {
    const orders = await DonHang.findAll({
      where: { idNguoiDung: req.user.id },
      include: [{
        model: ChiTietDonHang,
        as: 'chiTiets',
        include: [{ model: SanPham, as: 'sanPham', attributes: ['tieuDe', 'hinhAnh'] }]
      }],
      order: [['ngayTao', 'DESC']]
    });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// [GET] /api/orders/all - Admin: tất cả đơn hàng
router.get('/all', verifyToken, isAdmin, async (req, res) => {
  try {
    const orders = await DonHang.findAll({
      include: [
        {
          model: ChiTietDonHang,
          as: 'chiTiets',
          include: [{ model: SanPham, as: 'sanPham', attributes: ['tieuDe', 'hinhAnh'] }]
        },
        { model: NguoiDung, as: 'nguoiDung', attributes: ['hoVaTen', 'soDienThoai'] }
      ],
      order: [['ngayTao', 'DESC']]
    });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// [GET] /api/orders/:id - Chi tiết đơn hàng
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const order = await DonHang.findByPk(req.params.id, {
      include: [{
        model: ChiTietDonHang,
        as: 'chiTiets',
        include: [{ model: SanPham, as: 'sanPham', attributes: ['tieuDe', 'hinhAnh', 'gia'] }]
      }]
    });
    if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    // User chỉ xem đơn của mình; admin xem tất cả
    if (req.user.loaiNguoiDung < 1 && order.idNguoiDung !== req.user.id)
      return res.status(403).json({ message: 'Không có quyền xem đơn hàng này' });
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// [PUT] /api/orders/:id/status - Admin: cập nhật trạng thái
router.put('/:id/status', verifyToken, isAdmin, async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { trangThai } = req.body;
    const order = await DonHang.findByPk(req.params.id, {
      include: [{ model: ChiTietDonHang, as: 'chiTiets' }]
    });
    if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });

    const trangThaiCu = order.trangThai;
    order.trangThai = trangThai;
    await order.save({ transaction: t });

    // Nếu hủy đơn (4) thì hoàn lại tồn kho
    if (trangThai === 4 && trangThaiCu !== 4) {
      for (const ct of order.chiTiets) {
        await KhoHang.increment(
          { soLuongTon: ct.soLuong, soLuongXuat: -ct.soLuong },
          { where: { idSanPham: ct.idSanPham }, transaction: t }
        );
      }
    }

    await t.commit();
    res.json({ message: 'Cập nhật trạng thái thành công', order });
  } catch (err) {
    await t.rollback();
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

module.exports = router;
