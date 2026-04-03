import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { vnd } from '../utils/helpers';
import axiosClient from '../api/axios';

function CheckoutPage() {
    const { cart, user, clearCart, showToast } = useApp();
    const navigate = useNavigate();

    // user đã normalize trong AppContext → user.fullname, user.phone, user.address
    const [checkoutForm, setCheckoutForm] = useState({
        tenNguoiNhan:         user?.fullname || '',
        soDienThoaiNguoiNhan: user?.phone    || '',
        diaChi:               user?.address  || '',
        ghiChu:               '',
        loaiGiaoHang:         'Giao tận nơi',
        thoiGianGiaoHang:     'Giao giờ hành chính',
        phuongThucThanhToan:  'Thanh toán tiền mặt khi nhận hàng'
    });

    const totalItemsPrice = cart.reduce((total, item) => total + (item.price * item.soluong), 0);
    const shipFee = checkoutForm.loaiGiaoHang === 'Giao tận nơi' ? 30000 : 0;
    const totalOrderAmount = totalItemsPrice + shipFee;

    const handleChange = (e) => setCheckoutForm({ ...checkoutForm, [e.target.name]: e.target.value });

    const submitOrder = async (e) => {
        e.preventDefault();
        if (!user) {
            showToast('Bạn cần đăng nhập để đặt hàng', 'warning');
            return;
        }

        try {
            // cartItems map sang format backend mới
            const cartItems = cart.map(item => ({
                idSanPham: item.id,
                soLuong:   item.soluong,
                donGia:    item.price,
            }));

            await axiosClient.post('/orders', { ...checkoutForm, cartItems });
            clearCart();
            showToast('Đặt hàng thành công!', 'success');
            navigate('/orders');
        } catch (error) {
            showToast(error.message || 'Lỗi khi đặt hàng', 'error');
        }
    };

    if (cart.length === 0) {
        return (
            <div className="container" style={{ margin: '100px auto', textAlign: 'center' }}>
                <h2>Giỏ hàng của bạn đang trống!</h2>
                <button onClick={() => navigate('/')} className="cart-btn" style={{ marginTop: '20px' }}>
                    Tiếp tục mua hàng
                </button>
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
                    <div className="checkout-col-left">
                        <div className="checkout-row">
                            <div className="checkout-col-title">Thông tin đơn hàng</div>
                            <div className="checkout-col-content">
                                <div className="content-group">
                                    <p className="checkout-content-label">Hình thức giao hàng</p>
                                    <div className="checkout-type-delivery">
                                        <div className="line-radio">
                                            <input type="radio" name="loaiGiaoHang" id="radio1" value="Giao tận nơi"
                                                checked={checkoutForm.loaiGiaoHang === 'Giao tận nơi'} onChange={handleChange} />
                                            <label htmlFor="radio1">Giao tận nơi</label>
                                        </div>
                                        <div className="line-radio">
                                            <input type="radio" name="loaiGiaoHang" id="radio2" value="Tự nhận tại cửa hàng"
                                                checked={checkoutForm.loaiGiaoHang === 'Tự nhận tại cửa hàng'} onChange={handleChange} />
                                            <label htmlFor="radio2">Tự nhận tại cửa hàng</label>
                                        </div>
                                    </div>
                                </div>
                                {checkoutForm.loaiGiaoHang === 'Giao tận nơi' && (
                                    <div className="content-group">
                                        <p className="checkout-content-label">Thời gian giao hàng</p>
                                        <div className="checkout-type-delivery">
                                            <div className="line-radio">
                                                <input type="radio" name="thoiGianGiaoHang" id="time1" value="Giao giờ hành chính"
                                                    checked={checkoutForm.thoiGianGiaoHang === 'Giao giờ hành chính'} onChange={handleChange} />
                                                <label htmlFor="time1">Giờ hành chính</label>
                                            </div>
                                            <div className="line-radio">
                                                <input type="radio" name="thoiGianGiaoHang" id="time2" value="Giao các ngày trong tuần"
                                                    checked={checkoutForm.thoiGianGiaoHang === 'Giao các ngày trong tuần'} onChange={handleChange} />
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
                                        <input type="text" placeholder="Họ và tên" name="tenNguoiNhan"
                                            value={checkoutForm.tenNguoiNhan} onChange={handleChange}
                                            className="form-control" required />
                                    </div>
                                    <div className="form-group">
                                        <input type="text" placeholder="Số điện thoại" name="soDienThoaiNguoiNhan"
                                            value={checkoutForm.soDienThoaiNguoiNhan} onChange={handleChange}
                                            className="form-control" required />
                                    </div>
                                    <div className="form-group">
                                        <input type="text" placeholder="Địa chỉ giao hàng" name="diaChi"
                                            value={checkoutForm.diaChi} onChange={handleChange}
                                            className="form-control"
                                            required={checkoutForm.loaiGiaoHang === 'Giao tận nơi'}
                                            disabled={checkoutForm.loaiGiaoHang !== 'Giao tận nơi'} />
                                    </div>
                                    <div className="form-group">
                                        <textarea placeholder="Ghi chú thêm" name="ghiChu"
                                            value={checkoutForm.ghiChu} onChange={handleChange}
                                            className="form-control" rows="3" />
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
                                {checkoutForm.loaiGiaoHang === 'Giao tận nơi' && (
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
                                        <input type="radio" id="pay1" defaultChecked />
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
