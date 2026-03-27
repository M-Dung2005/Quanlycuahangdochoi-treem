import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { vnd } from '../utils/helpers';
import axiosClient from '../api/axios';

function CheckoutPage() {
    const { cart, user, clearCart, showToast } = useApp();
    const navigate = useNavigate();

    const [checkoutForm, setCheckoutForm] = useState({
        receiverName: user?.fullname || '',
        receiverPhone: user?.phone || '',
        address: user?.address || '',
        note: '',
        deliveryType: 'Giao tận nơi',
        deliveryTime: 'Giao giờ hành chính',
        paymentMethod: 'Thanh toán tiền mặt khi nhận hàng'
    });

    const totalItemsPrice = cart.reduce((total, item) => total + (item.price * item.soluong), 0);
    const shipFee = checkoutForm.deliveryType === 'Giao tận nơi' ? 30000 : 0;
    const totalOrderAmount = totalItemsPrice + shipFee;

    const handleChange = (e) => setCheckoutForm({...checkoutForm, [e.target.name]: e.target.value});

    const submitOrder = async (e) => {
        e.preventDefault();
        if (!user) {
            showToast('Bạn cần đăng nhập để đặt hàng', 'warning');
            return;
        }

        try {
            const orderPayload = {
                ...checkoutForm,
                cartItems: cart
            };

            await axiosClient.post('/orders', orderPayload);
            clearCart();
            showToast('Đặt hàng thành công!', 'success');
            navigate('/orders'); // Sang form lịch sử đơn hàng
        } catch (error) {
            showToast(error.message || 'Lỗi khi đặt hàng', 'error');
        }
    };

    if (cart.length === 0) {
        return (
            <div className="container" style={{ margin: '100px auto', textAlign: 'center' }}>
                <h2>Giỏ hàng của bạn đang trống!</h2>
                <button onClick={() => navigate('/')} className="cart-btn" style={{marginTop: '20px'}}>Tiếp tục mua hàng</button>
            </div>
        );
    }

    return (
        <main className="main-wrapper">
            <div className="checkout-page">
                <div className="checkout-header">
                    <div className="checkout-return" onClick={() => navigate(-1)}>
                        <i className="fa-regular fa-chevron-left"></i>
                    </div>
                    <h2 className="checkout-title">Thanh toán</h2>
                </div>
                <main className="checkout-section container">
                    {/* Giống giao diện form thanh toán cũ từ CSS */}
                    <div className="checkout-col-left">
                        <div className="checkout-row">
                            <div className="checkout-col-title">Thông tin đơn hàng</div>
                            <div className="checkout-col-content">
                                <div className="content-group">
                                    <p className="checkout-content-label">Hình thức giao hàng</p>
                                    <div className="checkout-type-delivery">
                                        <div className="line-radio">
                                            <input type="radio" name="deliveryType" id="radio1" value="Giao tận nơi" checked={checkoutForm.deliveryType === 'Giao tận nơi'} onChange={handleChange} />
                                            <label htmlFor="radio1">Giao tận nơi</label>
                                        </div>
                                        <div className="line-radio">
                                            <input type="radio" name="deliveryType" id="radio2" value="Tự nhận tại cửa hàng" checked={checkoutForm.deliveryType === 'Tự nhận tại cửa hàng'} onChange={handleChange} />
                                            <label htmlFor="radio2">Tự nhận tại cửa hàng</label>
                                        </div>
                                    </div>
                                </div>
                                {checkoutForm.deliveryType === 'Giao tận nơi' && (
                                    <div className="content-group">
                                        <p className="checkout-content-label">Thời gian giao hàng</p>
                                        <div className="checkout-type-delivery">
                                            <div className="line-radio">
                                                <input type="radio" name="deliveryTime" id="time1" value="Giao giờ hành chính" checked={checkoutForm.deliveryTime === 'Giao giờ hành chính'} onChange={handleChange} />
                                                <label htmlFor="time1">Giờ hành chính</label>
                                            </div>
                                            <div className="line-radio">
                                                <input type="radio" name="deliveryTime" id="time2" value="Giao các ngày trong tuần" checked={checkoutForm.deliveryTime === 'Giao các ngày trong tuần'} onChange={handleChange} />
                                                <label htmlFor="time2">Các ngày trong tuần</label>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="checkout-row">
                            <div className="checkout-col-title">Thông tin người nhận</div>
                            <div className="checkout-col-content">
                                <form className="checkout-form" onSubmit={submitOrder} id="submit-order-form">
                                    <div className="form-group">
                                        <input type="text" placeholder="Họ và tên" name="receiverName" value={checkoutForm.receiverName} onChange={handleChange} className="form-control" required />
                                    </div>
                                    <div className="form-group">
                                        <input type="text" placeholder="Số điện thoại" name="receiverPhone" value={checkoutForm.receiverPhone} onChange={handleChange} className="form-control" required />
                                    </div>
                                    <div className="form-group">
                                        <input type="text" placeholder="Địa chỉ giao hàng" name="address" value={checkoutForm.address} onChange={handleChange} className="form-control" required={checkoutForm.deliveryType === 'Giao tận nơi'} disabled={checkoutForm.deliveryType !== 'Giao tận nơi'} />
                                    </div>
                                    <div className="form-group">
                                        <textarea placeholder="Ghi chú thêm" name="note" value={checkoutForm.note} onChange={handleChange} className="form-control" rows="3"></textarea>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    <div className="checkout-col-right">
                        <p className="checkout-content-label">Đơn hàng</p>
                        <div className="bill-total" id="list-order-checkout">
                            {cart.map(item => (
                                <div className="food-item" key={item.id}>
                                    <div className="pe-3"><img src={item.img} alt={item.title} /></div>
                                    <div className="food-info flex-1">
                                        <h3>{item.title}</h3>
                                        <div className="ext"></div>
                                        <div className="price">{vnd(item.price)}</div>
                                    </div>
                                    <div className="food-sl">x {item.soluong}</div>
                                </div>
                            ))}
                        </div>
                        <div className="bill-payment">
                            <div className="total-bill-order">
                                <div className="price-fl">
                                    <div className="text">Tiền hàng</div>
                                    <div className="price-amn">{vnd(totalItemsPrice)}</div>
                                </div>
                                {checkoutForm.deliveryType === 'Giao tận nơi' && (
                                    <div className="price-fl">
                                        <div className="text">Phí giao hàng</div>
                                        <div className="price-amn">{vnd(shipFee)}</div>
                                    </div>
                                )}
                                <div className="price-fl exact">
                                    <div className="text">Tổng tiền</div>
                                    <div className="price-amn">{vnd(totalOrderAmount)}</div>
                                </div>
                            </div>
                            <div className="checkout-col-content">
                                <p className="checkout-content-label">Phương thức thanh toán</p>
                                <div className="checkout-type-payment">
                                    <div className="line-radio">
                                        <input type="radio" id="pay1" checked />
                                        <label htmlFor="pay1">Thanh toán tiền mặt khi nhận hàng</label>
                                    </div>
                                </div>
                            </div>
                            <button className="cart-btn checkout-btn" type="submit" form="submit-order-form">
                                ĐẶT HÀNG
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </main>
    );
}

export default CheckoutPage;
