import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axios';

function AccountPage() {
    const { user, silentLogin, showToast } = useApp();
    const navigate = useNavigate();

    // user đã được normalize trong AppContext (có fullname/phone/address)
    const [profileForm, setProfileForm] = useState({
        hoVaTen: '',
        email: '',
        diaChi: '',
    });

    const [passwordForm, setPasswordForm] = useState({
        matKhauCu: '',
        matKhauMoi: '',
        confirmPassword: '',
    });

    useEffect(() => {
        if (!user) {
            navigate('/');
        } else {
            setProfileForm({
                hoVaTen: user.fullname || user.hoVaTen || '',
                email:   user.email   || '',
                diaChi:  user.address || user.diaChi || '',
            });
        }
    }, [user, navigate]);

    if (!user) return null;

    const handleProfileChange = (e) => setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
    const handlePasswordChange = (e) => setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });

    const updateProfile = async (e) => {
        e.preventDefault();
        try {
            const res = await axiosClient.put('/users/profile', profileForm);
            // Cập nhật lại user trong context
            if (res.user) {
                const token = localStorage.getItem('token');
                silentLogin(res.user, token);
            }
            showToast('Cập nhật thông tin thành công!', 'success');
        } catch (error) {
            showToast(error.message || 'Lỗi cập nhật', 'error');
        }
    };

    const updatePassword = async (e) => {
        e.preventDefault();
        if (passwordForm.matKhauMoi !== passwordForm.confirmPassword) {
            showToast('Mật khẩu nhập lại không khớp!', 'warning');
            return;
        }
        try {
            await axiosClient.put('/users/password', {
                matKhauCu:  passwordForm.matKhauCu,
                matKhauMoi: passwordForm.matKhauMoi,
            });
            showToast('Đổi mật khẩu thành công!', 'success');
            setPasswordForm({ matKhauCu: '', matKhauMoi: '', confirmPassword: '' });
        } catch (error) {
            showToast(error.message || 'Lỗi đổi mật khẩu', 'error');
        }
    };

    return (
        <main className="main-wrapper">
            <div className="container" id="account-user">
                <div className="main-account active">
                    <div className="main-account-header">
                        <h3>Thông tin tài khoản của bạn</h3>
                        <p>Quản lý thông tin để bảo mật tài khoản</p>
                    </div>
                    <div className="main-account-body">
                        <div className="main-account-body-col">
                            <form id="profile-save" className="info-user" onSubmit={updateProfile}>
                                <div className="form-group">
                                    <label htmlFor="infoname" className="form-label">Họ và tên</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        name="hoVaTen"
                                        id="infoname"
                                        value={profileForm.hoVaTen}
                                        onChange={handleProfileChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="infophone" className="form-label">Số điện thoại</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        id="infophone"
                                        disabled
                                        value={user.phone || user.soDienThoai || ''}
                                        readOnly
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="infoemail" className="form-label">Email</label>
                                    <input
                                        className="form-control"
                                        type="email"
                                        name="email"
                                        id="infoemail"
                                        placeholder="Thêm địa chỉ email của bạn"
                                        value={profileForm.email}
                                        onChange={handleProfileChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="infoaddress" className="form-label">Địa chỉ</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        name="diaChi"
                                        id="infoaddress"
                                        placeholder="Thêm địa chỉ giao hàng của bạn"
                                        value={profileForm.diaChi}
                                        onChange={handleProfileChange}
                                    />
                                </div>
                            </form>
                        </div>
                        <div className="main-account-body-col">
                            <form id="password-save" className="change-password" onSubmit={updatePassword}>
                                <div className="form-group">
                                    <label htmlFor="password-cur-info" className="form-label w60">Mật khẩu hiện tại</label>
                                    <input
                                        className="form-control"
                                        type="password"
                                        name="matKhauCu"
                                        id="password-cur-info"
                                        placeholder="Nhập mật khẩu hiện tại"
                                        value={passwordForm.matKhauCu}
                                        onChange={handlePasswordChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password-after-info" className="form-label w60">Mật khẩu mới</label>
                                    <input
                                        className="form-control"
                                        type="password"
                                        name="matKhauMoi"
                                        id="password-after-info"
                                        placeholder="Nhập mật khẩu mới"
                                        value={passwordForm.matKhauMoi}
                                        onChange={handlePasswordChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password-comfirm-info" className="form-label w60">Xác nhận mật khẩu mới</label>
                                    <input
                                        className="form-control"
                                        type="password"
                                        name="confirmPassword"
                                        id="password-comfirm-info"
                                        placeholder="Nhập lại mật khẩu mới"
                                        value={passwordForm.confirmPassword}
                                        onChange={handlePasswordChange}
                                    />
                                </div>
                            </form>
                        </div>
                        <div className="main-account-body-row">
                            <div>
                                <button type="submit" form="profile-save" id="save-info-user">
                                    <i className="fa-regular fa-floppy-disk"></i> Lưu thay đổi
                                </button>
                            </div>
                            <div>
                                <button type="submit" form="password-save" id="save-password">
                                    <i className="fa-regular fa-key"></i> Đổi mật khẩu
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default AccountPage;
