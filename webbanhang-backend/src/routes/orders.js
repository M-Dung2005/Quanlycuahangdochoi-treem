const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Product = require('../models/Product');
const { verifyToken } = require('../middleware/auth');
const { isAdmin } = require('../middleware/isAdmin');
const { sequelize } = require('../config/database');

// Hàm tạo mã đơn hàng tự động (VD: DH1, DH2...)
const generateOrderId = async () => {
    const count = await Order.count();
    return `DH${count + 1}`;
};

// [POST] /api/orders - Tạo đơn hàng mới
router.post('/', verifyToken, async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { receiverName, receiverPhone, address, deliveryType, deliveryTime, paymentMethod, note, cartItems } = req.body;
        
        if (!cartItems || cartItems.length === 0) {
            return res.status(400).json({ message: 'Giỏ hàng trống!' });
        }

        // Tạo order ID
        const orderId = await generateOrderId();

        // Tính tổng tiền (Tiền hàng + 30K ship nếu là giao tận nơi)
        let totalItemsPrice = 0;
        for (let item of cartItems) {
            const product = await Product.findByPk(item.id);
            if (!product) throw new Error(`Sản phẩm ID ${item.id} không tồn tại`);
            totalItemsPrice += product.price * item.soluong;
        }
        
        const shipFee = deliveryType === 'Giao tận nơi' ? 30000 : 0;
        const totalPrice = totalItemsPrice + shipFee;

        // Lưu Order chính
        const newOrder = await Order.create({
            id: orderId,
            userId: req.user.id,
            receiverName,
            receiverPhone,
            address,
            deliveryType,
            deliveryTime,
            paymentMethod,
            note,
            totalPrice,
            status: 0 // Đang xử lý
        }, { transaction });

        // Build list order items
        const orderItemsRecords = cartItems.map(item => ({
            orderId: newOrder.id,
            productId: item.id,
            qty: item.soluong,
            price: item.price, // Giá tại thời điểm đặt hàng
            note: item.note || 'Không có ghi chú'
        }));

        // Insert OrderItems
        await OrderItem.bulkCreate(orderItemsRecords, { transaction });

        await transaction.commit();
        res.status(201).json({ message: 'Đặt hàng thành công!', orderId: newOrder.id });

    } catch (error) {
        await transaction.rollback();
        console.error(error);
        res.status(500).json({ message: error.message || 'Lỗi server khi đặt hàng' });
    }
});

// [GET] /api/orders/me - Lấy lịch sử đơn hàng của user hiện tại
router.get('/me', verifyToken, async (req, res) => {
    try {
        const orders = await Order.findAll({
            where: { userId: req.user.id },
            include: [{
                model: OrderItem,
                as: 'items',
                include: [{
                    model: Product,
                    as: 'product',
                    attributes: ['title', 'img']
                }]
            }],
            order: [['createdAt', 'DESC']]
        });
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }
});

// [GET] /api/orders/all - Lấy TẤT CẢ đơn (chỉ Admin)
router.get('/all', verifyToken, isAdmin, async (req, res) => {
    try {
        const orders = await Order.findAll({
            include: [{
                model: OrderItem,
                as: 'items',
                include: [{
                    model: Product,
                    as: 'product',
                    attributes: ['title', 'img']
                }]
            }],
            order: [['createdAt', 'DESC']]
        });
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }
});

// [PUT] /api/orders/:id/status - Admin Cập nhật trạng thái
router.put('/:id/status', verifyToken, isAdmin, async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByPk(req.params.id);
        
        if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });

        order.status = status;
        await order.save();
        res.json({ message: 'Cập nhật trạng thái thành công', order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }
});

module.exports = router;
