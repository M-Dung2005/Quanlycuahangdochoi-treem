// Middleware kiểm tra quyền Admin
const isAdmin = (req, res, next) => {
    // req.user được set từ middleware verifyToken
    if (req.user && req.user.userType === 1) {
        next();
    } else {
        return res.status(403).json({ message: 'Quyền truy cập bị từ chối. Bắt buộc phải là Admin.' });
    }
};

module.exports = { isAdmin };
