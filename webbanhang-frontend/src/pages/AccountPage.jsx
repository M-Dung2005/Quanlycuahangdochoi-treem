import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axios';

function AccountPage() {
    const { user, showToast } = useApp();
    const navigate = useNavigate();

    const [profileForm, setProfileForm] = useState({
        fullname: '',
        email: '',
        address: '',
    });

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    useEffect(() => {
        if (!user) {
            navigate('/');
        } else {
            setProfileForm({
                fullname: user.fullname || '',
                email: user.email || '',
                address: user.address || '',
            });
        }
    }, [user, navigate]);

    if (!user) return null;

    const handleProfileChange = (e) => setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
    const handlePasswordChange = (e) => setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });

    const updateProfile = async (e) => {
        e.preventDefault();
        try {
            await axiosClient.put('/users/profile', profileForm);
            showToast('Cập nhật thông tin thành công!', 'success');
        } catch (error) {
            showToast(error.message || 'Lỗi cập nhật', 'error');
        }
    };

    const updatePassword = async (e) => {
        e.preventDefault();
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            showToast('Mật khẩu nhập lại không khớp!', 'warning');
            return;
        }

        try {
            await axiosClient.put('/users/password', passwordForm);
            showToast('Đổi mật khẩu thành công!', 'success');
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
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
                                    <label htmlFor="infoname" className="form-label">
                                        Họ và tên
                                    </label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        name="fullname"
                                        id="infoname"
                                        value={profileForm.fullname}
                                        onChange={handleProfileChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="infophone" className="form-label">
                                        Số điện thoại
                                    </label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        name="infophone"
                                        id="infophone"
                                        disabled
                                        value={user.phone || ''}
                                        readOnly
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="infoemail" className="form-label">
                                        Email
                                    </label>
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
                                    <label htmlFor="infoaddress" className="form-label">
                                        Địa chỉ
                                    </label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        name="address"
                                        id="infoaddress"
                                        placeholder="Thêm địa chỉ giao hàng của bạn"
                                        value={profileForm.address}
                                        onChange={handleProfileChange}
                                    />
                                </div>
                            </form>
                        </div>
                        <div className="main-account-body-col">
                            <form id="password-save" className="change-password" onSubmit={updatePassword}>
                                <div className="form-group">
                                    <label htmlFor="password-cur-info" className="form-label w60">
                                        Mật khẩu hiện tại
                                    </label>
                                    <input
                                        className="form-control"
                                        type="password"
                                        name="currentPassword"
                                        id="password-cur-info"
                                        placeholder="Nhập mật khẩu hiện tại"
                                        value={passwordForm.currentPassword}
                                        onChange={handlePasswordChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password-after-info" className="form-label w60">
                                        Mật khẩu mới
                                    </label>
                                    <input
                                        className="form-control"
                                        type="password"
                                        name="newPassword"
                                        id="password-after-info"
                                        placeholder="Nhập mật khẩu mới"
                                        value={passwordForm.newPassword}
                                        onChange={handlePasswordChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password-comfirm-info" className="form-label w60">
                                        Xác nhận mật khẩu mới
                                    </label>
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
