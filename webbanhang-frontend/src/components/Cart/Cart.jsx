import React from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { vnd } from '../../utils/helpers';

function Cart() {
    const { cart, isCartOpen, toggleCart, removeFromCart, updateCartQty } = useApp();
    const navigate = useNavigate();

    const totalAmount = cart.reduce((total, item) => total + item.price * item.soluong, 0);

    const handleCheckout = () => {
        toggleCart();
        navigate('/checkout');
    };

    return (
        <div className={`modal-cart ${isCartOpen ? 'open' : ''}`} onClick={toggleCart} role="presentation">
            <div className="cart-container" onClick={(e) => e.stopPropagation()}>
                <div className="cart-header">
                    <h3 className="cart-header-title">
                        <i className="fa-regular fa-basket-shopping-simple"></i> Giỏ hàng
                    </h3>
                    <button type="button" className="cart-close" onClick={toggleCart} aria-label="Đóng">
                        <i className="fa-sharp fa-solid fa-xmark"></i>
                    </button>
                </div>
                <div className="cart-body">
                    {cart.length === 0 ? (
                        <div className="gio-hang-trong">
                            <i className="fa-thin fa-cart-xmark"></i>
                            <p>Không có sản phẩm nào trong giỏ hàng của bạn</p>
                        </div>
                    ) : (
                        <ul className="cart-list">
                            {cart.map((item) => (
                                <li className="cart-item" key={item.id} data-id={item.id}>
                                    <div className="cart-item-info">
                                        <p className="cart-item-title">{item.title}</p>
                                        <span className="cart-item-price price">{vnd(item.price)}</span>
                                    </div>
                                    <div className="cart-item-control">
                                        <button
                                            type="button"
                                            className="cart-item-delete"
                                            onClick={() => removeFromCart(item.id)}
                                        >
                                            Xóa
                                        </button>
                                        <div className="buttons_added">
                                            <input
                                                className="minus is-form"
                                                type="button"
                                                value="-"
                                                onClick={() => updateCartQty(item.id, -1)}
                                            />
                                            <input className="input-qty" readOnly type="number" value={item.soluong} />
                                            <input
                                                className="plus is-form"
                                                type="button"
                                                value="+"
                                                onClick={() => updateCartQty(item.id, 1)}
                                            />
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="cart-footer">
                    <div className="cart-total-price">
                        <p className="text-tt">Tổng tiền:</p>
                        <p className="text-price">{vnd(totalAmount)}</p>
                    </div>
                    <div className="cart-footer-payment">
                        <button
                            type="button"
                            className="them-san-pham"
                            onClick={() => {
                                toggleCart();
                                navigate('/');
                            }}
                        >
                            <i className="fa-regular fa-plus"></i> Thêm sản phẩm
                        </button>
                        <button
                            type="button"
                            className={`thanh-toan ${cart.length === 0 ? 'disabled' : ''}`}
                            onClick={handleCheckout}
                            disabled={cart.length === 0}
                        >
                            Thanh toán
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Cart;
