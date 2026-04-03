/** Đường dẫn ảnh từ API (./assets/... hoặc /assets/...) → URL hiển thị trên Vite */
export const productImgUrl = (img) => {
    if (!img) return '/assets/img/blank-image.png';
    if (img.startsWith('http://') || img.startsWith('https://')) return img;
    if (img.startsWith('/')) return img;
    return `/${String(img).replace(/^\.\//, '')}`;
};

// Hàm định dạng tiền tệ VNĐ
export const vnd = (price) => {
    const n = typeof price === 'string' ? Number(price) : price;
    return (Number.isFinite(n) ? n : 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
};

// Hàm định dạng ngày tháng
export const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = `0${date.getDate()}`.slice(-2);
    const month = `0${date.getMonth() + 1}`.slice(-2);
    const year = date.getFullYear();
    const hours = `0${date.getHours()}`.slice(-2);
    const minutes = `0${date.getMinutes()}`.slice(-2);
    return `${hours}:${minutes} ${day}/${month}/${year}`;
};

// Hàm chuyển Tiếng Việt có dấu thành không dấu (để search)
export const removeVietnameseTones = (str) => {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    return str.toLowerCase();
};

// ─── ADAPTER FUNCTIONS ─────────────────────────────────────────
// Map schema mới (tiếng Việt) → shape cũ mà toàn bộ components đang dùng

/**
 * SanPham → product shape { id, title, img, price, category, status, soLuongTon }
 */
export const normalizeProduct = (p) => {
    if (!p) return null;
    if (p.title !== undefined) return p; // đã normalize
    return {
        ...p,
        title:      p.tieuDe    ?? '',
        img:        p.hinhAnh   ?? '',
        price:      Number(p.gia ?? 0),
        category:   p.danhMuc?.tenDanhMuc ?? '',
        status:     p.trangThai ?? 1,
        soLuongTon: p.khoHang?.soLuongTon ?? 0,
    };
};

/**
 * NguoiDung → user shape { id, fullname, phone, email, address, userType, status }
 */
export const normalizeUser = (u) => {
    if (!u) return null;
    if (u.fullname !== undefined) return u; // đã normalize
    return {
        ...u,
        fullname: u.hoVaTen       ?? '',
        phone:    u.soDienThoai   ?? '',
        email:    u.email         ?? '',
        address:  u.diaChi        ?? '',
        userType: u.loaiNguoiDung ?? 0,
        status:   u.trangThai     ?? 1,
    };
};

/**
 * DonHang → order shape { id, receiverName, receiverPhone, address,
 *   deliveryType, deliveryTime, totalPrice, status, createdAt, items[] }
 */
export const normalizeOrder = (o) => {
    if (!o) return null;
    if (o.receiverName !== undefined) return o; // đã normalize
    const items = (o.chiTiets ?? o.items ?? []).map((ct) => ({
        ...ct,
        qty:   ct.soLuong ?? ct.qty ?? 1,
        price: Number(ct.donGia ?? ct.price ?? 0),
        product: ct.sanPham
            ? {
                ...ct.sanPham,
                title: ct.sanPham.tieuDe  ?? ct.sanPham.title ?? '',
                img:   ct.sanPham.hinhAnh ?? ct.sanPham.img   ?? '',
              }
            : ct.product ?? null,
    }));
    return {
        ...o,
        receiverName:  o.tenNguoiNhan           ?? '',
        receiverPhone: o.soDienThoaiNguoiNhan    ?? '',
        address:       o.diaChi                 ?? '',
        deliveryType:  o.loaiGiaoHang           ?? '',
        deliveryTime:  o.thoiGianGiaoHang        ?? '',
        totalPrice:    Number(o.tongGia          ?? 0),
        status:        o.trangThai              ?? 0,
        createdAt:     o.ngayTao                ?? o.createdAt ?? null,
        items,
    };
};
