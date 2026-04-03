import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate, Link } from 'react-router-dom';
import axiosClient from '../api/axios';
import { vnd, formatDate, normalizeProduct, normalizeUser, normalizeOrder } from '../utils/helpers';

function AdminPage() {
    const { user, showToast } = useApp();
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('dashboard');

    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);

    // user đã normalize → user.userType (0=KH, 1=NV, 2=Admin)
    useEffect(() => {
        if (!user || user.userType < 1) {
            navigate('/');
        }
    }, [user, navigate]);

    useEffect(() => {
        if (!user || user.userType < 1) return;

        const fetchData = async () => {
            try {
                if (activeSection === 'dashboard') {
                    const [p, o, u] = await Promise.all([
                        axiosClient.get('/products/all'),   // admin route: lấy cả sp ẩn
                        axiosClient.get('/orders/all'),
                        axiosClient.get('/users'),
                    ]);
                    setProducts((Array.isArray(p) ? p : []).map(normalizeProduct));
                    setOrders((Array.isArray(o) ? o : []).map(normalizeOrder));
                    setUsers((Array.isArray(u) ? u : []).map(normalizeUser));
                } else if (activeSection === 'products') {
                    const data = await axiosClient.get('/products/all');  // admin route
                    setProducts((Array.isArray(data) ? data : []).map(normalizeProduct));
                } else if (activeSection === 'orders') {
                    const data = await axiosClient.get('/orders/all');
                    setOrders((Array.isArray(data) ? data : []).map(normalizeOrder));
                } else if (activeSection === 'users') {
                    const data = await axiosClient.get('/users');
                    setUsers((Array.isArray(data) ? data : []).map(normalizeUser));
                }
            } catch (err) {
                console.error('Admin fetch error:', err);
                showToast('Lỗi khi tải dữ liệu trang quản trị', 'error');
            }
        };
        fetchData();
    }, [activeSection, user, showToast]);

    const toggleProductStatus = async (id, currentStatus) => {
        try {
            await axiosClient.put(`/products/${id}`, { trangThai: currentStatus === 1 ? 0 : 1 });
            setProducts(products.map((p) =>
                p.id === id ? { ...p, status: currentStatus === 1 ? 0 : 1, trangThai: currentStatus === 1 ? 0 : 1 } : p
            ));
            showToast('Đã cập nhật trạng thái sản phẩm', 'success');
        } catch {
            showToast('Lỗi cập nhật', 'error');
        }
    };

    const deleteProduct = async (id) => {
        if (!window.confirm('Bạn có chắc muốn ẩn sản phẩm này?')) return;
        try {
            await axiosClient.delete(`/products/${id}`);
            setProducts(products.map((p) => (p.id === id ? { ...p, status: 0 } : p)));
            showToast('Đã ẩn sản phẩm', 'success');
        } catch {
            showToast('Lỗi xóa sản phẩm', 'error');
        }
    };

    const confirmOrder = async (id) => {
        try {
            await axiosClient.put(`/orders/${id}/status`, { trangThai: 1 });
            setOrders(orders.map((o) => (o.id === id ? { ...o, status: 1 } : o)));
            showToast('Đã duyệt đơn hàng', 'success');
        } catch {
            showToast('Lỗi duyệt đơn', 'error');
        }
    };

    const toggleUserStatus = async (id, currentStatus) => {
        try {
            await axiosClient.put(`/users/${id}/status`, { trangThai: currentStatus === 1 ? 0 : 1 });
            setUsers(users.map((u) =>
                u.id === id ? { ...u, status: currentStatus === 1 ? 0 : 1 } : u
            ));
            showToast('Đã cập nhật trạng thái khách hàng', 'success');
        } catch {
            showToast('Lỗi cập nhật', 'error');
        }
    };

    const revenue = orders.reduce((sum, o) => sum + (Number(o.totalPrice) || 0), 0);

    if (!user || user.userType < 1) return null;

    const userTypeLabel = (t) => {
        if (t >= 2) return 'Admin';
        if (t === 1) return 'Nhân viên';
        return 'Khách hàng';
    };

    const orderStatusLabel = (s) => {
        const map = { 0: 'Chưa xử lý', 1: 'Đã xác nhận', 2: 'Đang giao', 3: 'Hoàn thành', 4: 'Đã hủy' };
        return map[s] ?? 'Không rõ';
    };

    return (
        <>
            <header className="header">
                <button type="button" className="menu-icon-btn" aria-label="Menu">
                    <div className="menu-icon"><i className="fa-regular fa-bars"></i></div>
                </button>
            </header>
            <div className="container">
                <aside className="sidebar open">
                    <div className="top-sidebar">
                        <a href="/" className="channel-logo">
                            <img src="/assets/img/favicon.png" alt="" />
                        </a>
                        <div className="hidden-sidebar your-channel">
                            <img src="/assets/img/admin/mdtoystore-title.png" style={{ height: '30px' }} alt="MD ToyStore" />
                        </div>
                    </div>
                    <div className="middle-sidebar">
                        <ul className="sidebar-list">
                            {[
                                { key: 'dashboard', icon: 'fa-house', label: 'Trang tổng quan' },
                                { key: 'products',  icon: 'fa-pot-food', label: 'Sản phẩm' },
                                { key: 'users',     icon: 'fa-users', label: 'Khách hàng' },
                                { key: 'orders',    icon: 'fa-basket-shopping', label: 'Đơn hàng' },
                            ].map(({ key, icon, label }) => (
                                <li key={key} className={`sidebar-list-item tab-content ${activeSection === key ? 'active' : ''}`}>
                                    <button type="button" className="sidebar-link" onClick={() => setActiveSection(key)}>
                                        <div className="sidebar-icon"><i className={`fa-light ${icon}`}></i></div>
                                        <div className="hidden-sidebar">{label}</div>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="bottom-sidebar">
                        <ul className="sidebar-list">
                            <li className="sidebar-list-item user-logout">
                                <Link to="/" className="sidebar-link">
                                    <div className="sidebar-icon"><i className="fa-thin fa-circle-chevron-left"></i></div>
                                    <div className="hidden-sidebar">Trang chủ</div>
                                </Link>
                            </li>
                            <li className="sidebar-list-item user-logout">
                                <span className="sidebar-link" style={{ cursor: 'default' }}>
                                    <div className="sidebar-icon"><i className="fa-light fa-circle-user"></i></div>
                                    <div className="hidden-sidebar">{user.fullname}</div>
                                </span>
                            </li>
                        </ul>
                    </div>
                </aside>

                <main className="content">
                    {/* Dashboard */}
                    <div className={`section ${activeSection === 'dashboard' ? 'active' : ''}`}>
                        <h1 className="page-title">Trang tổng quan cửa hàng MD ToyStore</h1>
                        <div className="cards">
                            <div className="card-single"><div className="box">
                                <h2 id="amount-user">{users.length}</h2>
                                <div className="on-box">
                                    <img src="/assets/img/admin/s1.png" alt="" style={{ width: '200px' }} />
                                    <h3>Khách hàng</h3>
                                    <p>Tổng số tài khoản đã đăng ký trên hệ thống.</p>
                                </div>
                            </div></div>
                            <div className="card-single"><div className="box">
                                <div className="on-box">
                                    <img src="/assets/img/admin/s2.png" alt="" style={{ width: '200px' }} />
                                    <h2 id="amount-product">{products.length}</h2>
                                    <h3>Sản phẩm</h3>
                                    <p>Số lượng mặt hàng trong kho (bao gồm cả đã ẩn).</p>
                                </div>
                            </div></div>
                            <div className="card-single"><div className="box">
                                <h2 id="doanh-thu">{vnd(revenue)}</h2>
                                <div className="on-box">
                                    <img src="/assets/img/admin/s3.png" alt="" style={{ width: '200px' }} />
                                    <h3>Doanh thu</h3>
                                    <p>Tổng giá trị các đơn hàng đã ghi nhận.</p>
                                </div>
                            </div></div>
                        </div>
                    </div>

                    {/* Products */}
                    <div className={`section product-all ${activeSection === 'products' ? 'active' : ''}`}>
                        <div className="admin-control">
                            <div className="admin-control-left"><span style={{ fontWeight: 600 }}>Danh sách sản phẩm</span></div>
                            <div className="admin-control-right">
                                <button type="button" className="btn-control-large" onClick={() => setActiveSection('products')}>
                                    <i className="fa-light fa-rotate-right"></i> Làm mới
                                </button>
                            </div>
                        </div>
                        <div className="table">
                            <table width="100%">
                                <thead><tr>
                                    <td>ID</td><td>Hình</td><td>Tên</td><td>Giá</td><td>Trạng thái</td><td>Thao tác</td>
                                </tr></thead>
                                <tbody>
                                    {products.map((item) => (
                                        <tr key={item.id}>
                                            <td>{item.id}</td>
                                            <td><img src={item.img} alt="" className="prd-img-tbl" /></td>
                                            <td>{item.title}</td>
                                            <td>{vnd(item.price)}</td>
                                            <td>{item.status === 1 ? 'Đang bán' : 'Đã ẩn'}</td>
                                            <td>
                                                <button type="button" className="btn-control-large" style={{ marginRight: 8 }}
                                                    onClick={() => toggleProductStatus(item.id, item.status)}>
                                                    <i className="fa-light fa-wrench"></i>
                                                </button>
                                                <button type="button" className="btn-control-large" onClick={() => deleteProduct(item.id)}>
                                                    <i className="fa-light fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Users */}
                    <div className={`section ${activeSection === 'users' ? 'active' : ''}`}>
                        <div className="admin-control">
                            <div className="admin-control-left"><span style={{ fontWeight: 600 }}>Khách hàng</span></div>
                        </div>
                        <div className="table">
                            <table width="100%">
                                <thead><tr>
                                    <td>STT</td><td>Họ và tên</td><td>Liên hệ</td><td>Email</td><td>Quyền</td><td>Tình trạng</td><td></td>
                                </tr></thead>
                                <tbody>
                                    {users.map((u, idx) => (
                                        <tr key={u.id}>
                                            <td>{idx + 1}</td>
                                            <td>{u.fullname}</td>
                                            <td>{u.phone}</td>
                                            <td>{u.email || '—'}</td>
                                            <td>{userTypeLabel(u.userType)}</td>
                                            <td>{u.status === 1 ? 'Hoạt động' : 'Bị khóa'}</td>
                                            <td>
                                                {u.userType === 0 && (
                                                    <button type="button" className="btn-control-large"
                                                        onClick={() => toggleUserStatus(u.id, u.status)}>
                                                        {u.status === 1 ? 'Khóa' : 'Mở khóa'}
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Orders */}
                    <div className={`section ${activeSection === 'orders' ? 'active' : ''}`}>
                        <div className="admin-control">
                            <div className="admin-control-left"><span style={{ fontWeight: 600 }}>Đơn hàng</span></div>
                        </div>
                        <div className="table">
                            <table width="100%">
                                <thead><tr>
                                    <td>Mã đơn</td><td>Khách hàng</td><td>Ngày đặt</td>
                                    <td>Tổng tiền</td><td>Trạng thái</td><td>Thao tác</td>
                                </tr></thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <tr key={order.id}>
                                            <td>{order.id}</td>
                                            <td>
                                                {order.receiverName}<br />
                                                <small>{order.receiverPhone}</small>
                                            </td>
                                            <td>{formatDate(order.createdAt)}</td>
                                            <td>{vnd(order.totalPrice)}</td>
                                            <td>{orderStatusLabel(order.status)}</td>
                                            <td>
                                                {order.status === 0 && (
                                                    <button type="button" className="btn-control-large"
                                                        onClick={() => confirmOrder(order.id)}>
                                                        Duyệt
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}

export default AdminPage;
