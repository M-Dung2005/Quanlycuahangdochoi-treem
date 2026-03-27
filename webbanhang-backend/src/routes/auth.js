const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { verifyToken } = require('../middleware/auth');

// [POST] /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { fullname, phone, password } = req.body;

        // validate
        if (!fullname || !phone || !password) {
            return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin' });
        }

        // check exist
        const userExists = await User.findOne({ where: { phone } });
        if (userExists) {
            return res.status(400).json({ message: 'Số điện thoại này đã được đăng ký' });
        }

        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // create user
        const newUser = await User.create({
            fullname,
            phone,
            password: hashedPassword
        });

        res.status(201).json({ message: 'Đăng ký thành công!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }
});

// [POST] /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { phone, password } = req.body;

        const user = await User.findOne({ where: { phone } });
        if (!user) {
            return res.status(400).json({ message: 'Tài khoản không tồn tại' });
        }

        if (user.status === 0) {
            return res.status(403).json({ message: 'Tài khoản của bạn đã bị khóa' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Sai mật khẩu' });
        }

        // Sign JWT
        const token = jwt.sign(
            { id: user.id, phone: user.phone, userType: user.userType },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Đăng nhập thành công',
            token,
            user: {
                id: user.id,
                fullname: user.fullname,
                phone: user.phone,
                email: user.email,
                address: user.address,
                userType: user.userType
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }
});

// [GET] /api/auth/me - Lấy thông tin user hiện tại
router.get('/me', verifyToken, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] }
        });
        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }
});

module.exports = router;
