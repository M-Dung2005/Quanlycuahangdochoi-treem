const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User'); // Import để thiết lập quan hệ

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.STRING(20),      // Ví dụ: DH1, DH2
    primaryKey: true,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
        model: User,
        key: 'id'
    }
  },
  receiverName: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  receiverPhone: {
    type: DataTypes.STRING(15),
    allowNull: false
  },
  address: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  deliveryType: {
    type: DataTypes.STRING(50),    // Giao tận nơi / Tự đến lấy
    allowNull: true
  },
  deliveryTime: {
    type: DataTypes.STRING(50),    // Ví dụ: Giao vào 14:00
    allowNull: true
  },
  paymentMethod: {
    type: DataTypes.STRING(50),    // Tiền mặt / Ví điện tử...
    allowNull: true
  },
  note: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  totalPrice: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  status: {
    type: DataTypes.TINYINT,         // 0: đang xử lý, 1: đã xử lý
    defaultValue: 0
  }
}, {
  tableName: 'Orders',
  timestamps: true                   // Cho phép createdAt làm thời gian đặt
});

module.exports = Order;
