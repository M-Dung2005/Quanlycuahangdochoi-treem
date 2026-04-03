// Middleware kiểm tra quyền Admin/Nhân viên
// loaiNguoiDung: 0 = Khách hàng, 1 = Nhân viên, 2 = Admin
const isAdmin = (req, res, next) => {
    if (req.user && req.user.loaiNguoiDung >= 1) {
        next();
    } else {
        return res.status(403).json({ message: 'Quyền truy cập bị từ chối. Bắt buộc phải là Admin hoặc Nhân viên.' });
    }
};

module.exports = { isAdmin };
