import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

function Header({ onOpenAuth }) {
    const { user, cart, logout, toggleCart } = useApp();
    const [searchKeyword, setSearchKeyword] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        const q = searchKeyword.trim();
        if (q) navigate(`/?search=${encodeURIComponent(q)}`);
        else navigate('/');
    };

    const cartCount = cart.reduce((total, item) => total + item.soluong, 0);

    return (
        <header>
            <div className="header-top">
                <div className="container">
                    <div className="header-top-left">
                        <ul className="header-top-list">
                            <li><a href="#"><i className="fa-regular fa-phone"></i> 0123 456 789 (miễn phí)</a></li>
                            <li><a href="#"><i className="fa-light fa-location-dot"></i> Xem vị trí cửa hàng</a></li>
                        </ul>
                    </div>
                    <div className="header-top-right">
                        <ul className="header-top-list">
                            <li><a href="#">Giới thiệu</a></li>
                            <li><a href="#">Cửa hàng</a></li>
                            <li><a href="#">Chính sách</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="header-middle">
                <div className="container">
                    <div className="header-middle-left">
                        <div className="header-logo">
                            <Link to="/">
                                <img src="/assets/img/MDtoystore.png" alt="MD ToyStore" className="header-logo-img" />
                            </Link>
                        </div>
                    </div>
                    <div className="header-middle-center">
                        <form className="form-search" onSubmit={handleSearch}>
                            <span className="search-btn"><i className="fa-light fa-magnifying-glass"></i></span>
                            <input
                                type="text"
                                className="form-search-input"
                                placeholder="Tìm kiếm sản phẩm..."
                                value={searchKeyword}
                                onChange={(e) => setSearchKeyword(e.target.value)}
                            />
                            <button type="button" className="filter-btn" onClick={() => navigate('/?advanceSearch=1')}>
                                <i className="fa-light fa-filter-list"></i><span>Lọc</span>
                            </button>
                        </form>
                    </div>
                    <div className="header-middle-right">
                        <ul className="header-middle-right-list">
                            <li className="header-middle-right-item dropdown open">
                                <i className="fa-light fa-user"></i>
                                {user ? (
                                    <div className="auth-container">
                                        <span className="text-dndk">{user.fullname}</span>
                                        <span className="text-tk">
                                            Tài khoản <i className="fa-sharp fa-solid fa-caret-down"></i>
                                        </span>
                                        <ul className="header-middle-right-menu">
                                            {user.userType === 1 && (
                                                <li>
                                                    <Link to="/admin"><i className="fa-light fa-gear"></i> Quản trị</Link>
                                                </li>
                                            )}
                                            <li>
                                                <Link to="/account"><i className="fa-light fa-circle-user"></i> Tài khoản</Link>
                                            </li>
                                            <li>
                                                <Link to="/orders"><i className="fa-light fa-clipboard-list"></i> Đơn hàng</Link>
                                            </li>
                                            <li>
                                                <a href="#" onClick={(e) => { e.preventDefault(); logout(); }}>
                                                    <i className="fa-light fa-arrow-right-from-bracket"></i> Đăng xuất
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                ) : (
                                    <div className="auth-container" onClick={onOpenAuth} style={{ cursor: 'pointer' }}>
                                        <span className="text-dndk">Đăng nhập / Đăng ký</span>
                                        <span className="text-tk">
                                            Tài khoản <i className="fa-sharp fa-solid fa-caret-down"></i>
                                        </span>
                                        <ul className="header-middle-right-menu">
                                            <li>
                                                <a href="#" onClick={(e) => { e.preventDefault(); onOpenAuth(); }}>
                                                    <i className="fa-light fa-right-to-bracket"></i> Đăng nhập
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#" onClick={(e) => { e.preventDefault(); onOpenAuth(); }}>
                                                    <i className="fa-light fa-user-plus"></i> Đăng ký
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </li>
                            <li className="header-middle-right-item open" onClick={toggleCart}>
                                <div className="cart-icon-menu">
                                    <i className="fa-light fa-basket-shopping"></i>
                                    <span className="count-product-cart">{cartCount}</span>
                                </div>
                                <span>Giỏ hàng</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
