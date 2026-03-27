const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { verifyToken } = require('../middleware/auth');
const { isAdmin } = require('../middleware/isAdmin');

// [PUT] /api/users/profile - User tự cập nhật Tên, Email, Địa chỉ
router.put('/profile', verifyToken, async (req, res) => {
    try {
        const { fullname, email, address } = req.body;
        const user = await User.findByPk(req.user.id);
        
        if (!user) return res.status(404).json({ message: 'Không tìm thấy tài khoản' });

        if (fullname) user.fullname = fullname;
        if (email !== undefined) user.email = email;
        if (address !== undefined) user.address = address;

        await user.save();
        
        // Trả về dữ liệu public (ẩn password)
        const updatedUser = user.toJSON();
        delete updatedUser.password;
        
        res.json({ message: 'Cập nhật thành công', user: updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }
});

// [PUT] /api/users/password - User tự đổi mật khẩu
router.put('/password', verifyToken, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findByPk(req.user.id);
        
        if (!user) return res.status(404).json({ message: 'Không tìm thấy tài khoản' });

        // Kiểm tra mật khẩu cũ
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Mật khẩu hiện tại không đúng' });
        }

        // Hash pass mới
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.json({ message: 'Đổi mật khẩu thành công' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }
});

// [GET] /api/users - Admin lấy list tất cả người dùng
router.get('/', verifyToken, isAdmin, async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] }
        });
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }
});

// [PUT] /api/users/:id/status - Admin Khóa / Mở Khóa tài khoản
router.put('/:id/status', verifyToken, isAdmin, async (req, res) => {
    try {
        const { status } = req.body; // 0 hoặc 1
        const user = await User.findByPk(req.params.id);
        
        if (!user) return res.status(404).json({ message: 'Không tìm thấy tài khoản' });
        if (user.userType === 1) return res.status(400).json({ message: 'Không thể khóa admin' });

        user.status = status;
        await user.save();
        res.json({ message: `Tài khoản đã được ${status === 1 ? 'mở khóa' : 'khóa'}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }
});

module.exports = router;
