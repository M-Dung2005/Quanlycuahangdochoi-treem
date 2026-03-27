const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { verifyToken } = require('../middleware/auth');
const { isAdmin } = require('../middleware/isAdmin');
const { Op } = require('sequelize');

// [GET] /api/products
// Support query: ?search=xyz&category=lego&minPrice=100&maxPrice=500
router.get('/', async (req, res) => {
    try {
        const { search, category, minPrice, maxPrice } = req.query;

        let whereClause = {
            status: 1 // Chỉ lấy sản phẩm đang hiện
        };

        if (category && category !== 'Tất cả') {
            whereClause.category = category;
        }

        if (search) {
            whereClause.title = {
                [Op.like]: `%${search}%`
            };
        }

        if (minPrice || maxPrice) {
            whereClause.price = {};
            if (minPrice) whereClause.price[Op.gte] = minPrice;
            if (maxPrice) whereClause.price[Op.lte] = maxPrice;
        }

        const products = await Product.findAll({
            where: whereClause
        });

        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }
});

// [GET] /api/products/all (Dành cho admin: lấy cả sp ẩn)
router.get('/all', verifyToken, isAdmin, async (req, res) => {
    try {
        const products = await Product.findAll();
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }
});

// [GET] /api/products/:id
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }
});

// [POST] /api/products (Admin)
router.post('/', verifyToken, isAdmin, async (req, res) => {
    try {
        const { title, img, category, price, desc, status } = req.body;
        const newProduct = await Product.create({ 
            title, img: img || './assets/img/blank-image.png', category, price, desc, status 
        });
        res.status(201).json(newProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }
});

// [PUT] /api/products/:id (Admin)
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });

        await product.update(req.body);
        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }
});

// [DELETE] /api/products/:id (Admin) - Thường thì chỉ set status = 0
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });

        await product.update({ status: 0 }); // Ẩn sản phẩm thay vì xóa cứng
        res.json({ message: 'Đã ẩn sản phẩm thành công' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }
});

module.exports = router;
