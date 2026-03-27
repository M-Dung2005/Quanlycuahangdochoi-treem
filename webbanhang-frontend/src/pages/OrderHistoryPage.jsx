import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axios';
import { vnd, formatDate } from '../utils/helpers';

function OrderHistoryPage() {
    const { user } = useApp();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        if (!user) {
            navigate('/');
            return;
        }

        const fetchOrders = async () => {
            try {
                const data = await axiosClient.get('/orders/me');
                setOrders(data);
            } catch (error) {
                console.error('Lỗi lấy đơn hàng:', error);
            }
        };

        fetchOrders();
    }, [user, navigate]);

    if (!user) return null;

    return (
        <main className="main-wrapper">
            <div className="container" id="order-history">
                <div className="main-account">
                    <div className="main-account-header">
                        <h3>Quản lý đơn hàng của bạn</h3>
                        <p>Xem chi tiết, trạng thái của những đơn hàng đã đặt.</p>
                    </div>
                    <div className="main-account-body">
                        <div className="order-history-section" style={{ width: '100%' }}>
                            {orders.length === 0 ? (
                                <p style={{ textAlign: 'center', padding: '24px', color: '#888' }}>
                                    Bạn chưa có đơn hàng nào.
                                </p>
                            ) : (
                                orders.map((order) => (
                                    <div
                                        key={order.id}
                                        className="list"
                                        style={{ marginBottom: '16px', flexDirection: 'column', alignItems: 'stretch' }}
                                    >
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                flexWrap: 'wrap',
                                                gap: '12px',
                                                borderBottom: '1px solid #eee',
                                                paddingBottom: '12px',
                                                marginBottom: '12px',
                                            }}
                                        >
                                            <div>
                                                <strong>Mã đơn #{order.id}</strong>
                                                <p style={{ margin: '8px 0 0', fontSize: '14px', color: '#666' }}>
                                                    Ngày đặt: {formatDate(order.createdAt)}
                                                </p>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <p style={{ margin: 0 }}>
                                                    <strong>Trạng thái:</strong>{' '}
                                                    {order.status === 1 ? (
                                                        <span style={{ color: 'green' }}>Đã xử lý</span>
                                                    ) : (
                                                        <span style={{ color: '#e67e22' }}>Đang chờ xử lý</span>
                                                    )}
                                                </p>
                                                <p style={{ margin: '8px 0 0', color: '#b5292f', fontWeight: 600 }}>
                                                    {vnd(order.totalPrice)}
                                                </p>
                                            </div>
                                        </div>
                                        <p style={{ margin: '0 0 8px' }}>
                                            <strong>Người nhận:</strong> {order.receiverName} — {order.receiverPhone}
                                        </p>
                                        <p style={{ margin: '0 0 8px' }}>
                                            <strong>Địa chỉ:</strong> {order.address}
                                        </p>
                                        <p style={{ margin: '0 0 12px' }}>
                                            <strong>Giao hàng:</strong> {order.deliveryType} ({order.deliveryTime})
                                        </p>
                                        <h4 style={{ fontSize: '15px', marginBottom: '8px' }}>Sản phẩm</h4>
                                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                            {order.items?.map((item) => (
                                                <li
                                                    key={item.id}
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '12px',
                                                        padding: '8px 0',
                                                        borderTop: '1px solid #f0f0f0',
                                                    }}
                                                >
                                                    <img
                                                        src={item.product?.img || '/assets/img/blank-image.png'}
                                                        alt=""
                                                        style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 6 }}
                                                    />
                                                    <div style={{ flex: 1 }}>
                                                        <p style={{ margin: 0, fontWeight: 500 }}>
                                                            {item.product?.title || 'Sản phẩm'}
                                                        </p>
                                                        <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#666' }}>
                                                            {vnd(item.price)} × {item.qty}
                                                        </p>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default OrderHistoryPage;
