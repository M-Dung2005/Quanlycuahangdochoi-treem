import React, { useState } from 'react';
import axiosClient from '../../api/axios';
import { useApp } from '../../context/AppContext';

function AuthModal({ isOpen, onClose }) {
    const { login, showToast } = useApp();
    const [isLoginTab, setIsLoginTab] = useState(true);

    // Form đăng nhập: dùng field mới của backend
    const [loginForm, setLoginForm] = useState({ soDienThoai: '', matKhau: '' });
    // Form đăng ký: dùng field mới của backend  
    const [regForm, setRegForm] = useState({ hoVaTen: '', soDienThoai: '', matKhau: '' });

    const [errors, setErrors] = useState({});

    if (!isOpen) return null;

    const handleLoginChange = (e) => setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
    const handleRegChange = (e) => setRegForm({ ...regForm, [e.target.name]: e.target.value });

    const submitLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axiosClient.post('/auth/login', loginForm);
            // res.user đã được normalize bởi AppContext.login()
            login(res.user, res.token);
            onClose();
        } catch (error) {
            setErrors({ login: error.message || 'Lỗi đăng nhập' });
        }
    };

    const submitRegister = async (e) => {
        e.preventDefault();
        try {
            await axiosClient.post('/auth/register', regForm);
            showToast('Đăng ký thành công! Vui lòng đăng nhập', 'success');
            setLoginForm({ soDienThoai: regForm.soDienThoai, matKhau: '' });
            setIsLoginTab(true);
        } catch (error) {
            setErrors({ register: error.message || 'Lỗi đăng ký' });
        }
    };

    return (
        <div className="modal signup-login open" onClick={onClose} role="presentation">
            <div
                className={`modal-container mdl-cnt ${isLoginTab ? 'active' : ''}`}
                onClick={(e) => e.stopPropagation()}
            >
                <button type="button" className="form-close" onClick={onClose} aria-label="Đóng">
                    <i className="fa-regular fa-xmark"></i>
                </button>
                <div className="forms mdl-cnt">
                    {/* Form Đăng ký */}
                    <div className="form-content sign-up">
                        <h3 className="form-title">Đăng ký tài khoản</h3>
                        <p className="form-description">
                            Đăng ký thành viên để mua hàng và nhận những ưu đãi đặc biệt từ chúng tôi
                        </p>
                        <form className="signup-form" onSubmit={submitRegister}>
                            <div className="form-group">
                                <label htmlFor="hoVaTen" className="form-label">Tên đầy đủ</label>
                                <input
                                    id="hoVaTen"
                                    name="hoVaTen"
                                    type="text"
                                    placeholder="VD: Nguyễn Văn A"
                                    className="form-control"
                                    value={regForm.hoVaTen}
                                    onChange={handleRegChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="phone-reg" className="form-label">Số điện thoại</label>
                                <input
                                    id="phone-reg"
                                    name="soDienThoai"
                                    type="text"
                                    placeholder="Nhập số điện thoại"
                                    className="form-control"
                                    value={regForm.soDienThoai}
                                    onChange={handleRegChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password-reg" className="form-label">Mật khẩu</label>
                                <input
                                    id="password-reg"
                                    name="matKhau"
                                    type="password"
                                    placeholder="Nhập mật khẩu"
                                    className="form-control"
                                    value={regForm.matKhau}
                                    onChange={handleRegChange}
                                    required
                                />
                            </div>
                            {errors.register && <p className="form-message">{errors.register}</p>}
                            <button className="form-submit" type="submit" id="signup-button">Đăng ký</button>
                        </form>
                        <p className="change-login">
                            Bạn đã có tài khoản?{' '}
                            <button type="button" className="login-link" onClick={() => setIsLoginTab(true)}>
                                Đăng nhập ngay
                            </button>
                        </p>
                    </div>

                    {/* Form Đăng nhập */}
                    <div className="form-content login">
                        <h3 className="form-title">Đăng nhập tài khoản</h3>
                        <p className="form-description">
                            Đăng nhập thành viên để mua hàng và nhận những ưu đãi đặc biệt từ chúng tôi
                        </p>
                        <form className="login-form" onSubmit={submitLogin}>
                            <div className="form-group">
                                <label htmlFor="phone-login" className="form-label">Số điện thoại</label>
                                <input
                                    id="phone-login"
                                    name="soDienThoai"
                                    type="text"
                                    placeholder="Nhập số điện thoại"
                                    className="form-control"
                                    value={loginForm.soDienThoai}
                                    onChange={handleLoginChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password-login" className="form-label">Mật khẩu</label>
                                <input
                                    id="password-login"
                                    name="matKhau"
                                    type="password"
                                    placeholder="Nhập mật khẩu"
                                    className="form-control"
                                    value={loginForm.matKhau}
                                    onChange={handleLoginChange}
                                    required
                                />
                            </div>
                            {errors.login && <p className="form-message phonelog">{errors.login}</p>}
                            <button className="form-submit" type="submit" id="login-button">Đăng nhập</button>
                        </form>
                        <p className="change-login">
                            Bạn chưa có tài khoản?{' '}
                            <button type="button" className="signup-link" onClick={() => setIsLoginTab(false)}>
                                Đăng ký ngay
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AuthModal;
