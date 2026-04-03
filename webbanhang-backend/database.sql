-- ============================================================
-- Schema cơ sở dữ liệu hoàn chỉnh cho shop bán đồ chơi trẻ em
-- Cơ sở dữ liệu: MSSQL
-- Cập nhật: Thêm quy trình nhập hàng, nhà cung cấp đầy đủ
-- ============================================================

-- ============================================================
-- 1. DANH MỤC SẢN PHẨM
-- ============================================================
CREATE TABLE DanhMuc (
    id          INT IDENTITY(1,1) PRIMARY KEY,
    tenDanhMuc  NVARCHAR(100) NOT NULL UNIQUE,
    moTa        NTEXT,
    trangThai   TINYINT DEFAULT 1,          -- 0: ẩn, 1: hiện
    ngayTao     DATETIME2 DEFAULT GETDATE(),
    ngayCapNhat DATETIME2 DEFAULT GETDATE()
);

-- ============================================================
-- 2. SẢN PHẨM
-- ============================================================
CREATE TABLE SanPham (
    id          INT IDENTITY(1,1) PRIMARY KEY,
    tieuDe      NVARCHAR(255) NOT NULL,
    hinhAnh     NVARCHAR(500),
    idDanhMuc   INT NOT NULL,
    gia         BIGINT NOT NULL,            -- Giá bán lẻ hiện tại
    moTa        NTEXT,
    thuongHieu  NVARCHAR(100),
    tuoiPhuHop  NVARCHAR(50),              -- Vd: 3-6 tuổi
    chatLieu    NVARCHAR(100),
    kichThuoc   NVARCHAR(100),
    trongLuong  NVARCHAR(50),
    trangThai   TINYINT DEFAULT 1,          -- 0: ẩn, 1: hiện
    ngayTao     DATETIME2 DEFAULT GETDATE(),
    ngayCapNhat DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (idDanhMuc) REFERENCES DanhMuc(id)
);

-- ============================================================
-- 3. KHO HÀNG  (tồn kho theo từng sản phẩm)
-- ============================================================
CREATE TABLE KhoHang (
    id            INT IDENTITY(1,1) PRIMARY KEY,
    idSanPham     INT NOT NULL UNIQUE,      -- 1 sản phẩm – 1 dòng kho
    soLuongTon    INT DEFAULT 0,
    soLuongNhap   INT DEFAULT 0,            -- Tổng đã nhập
    soLuongXuat   INT DEFAULT 0,            -- Tổng đã xuất (bán)
    ngayCapNhat   DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (idSanPham) REFERENCES SanPham(id) ON DELETE CASCADE
);

-- ============================================================
-- 4. NHÀ CUNG CẤP
-- ============================================================
CREATE TABLE NhaCungCap (
    id               INT IDENTITY(1,1) PRIMARY KEY,
    maNhaCungCap     NVARCHAR(20) NOT NULL UNIQUE,   -- Mã rút gọn, vd: NCC001
    tenNhaCungCap    NVARCHAR(255) NOT NULL,
    nguoiDaiDien     NVARCHAR(100),
    soDienThoai      NVARCHAR(15),
    email            NVARCHAR(100),
    diaChi           NVARCHAR(255),
    ghiChu           NVARCHAR(500),
    trangThai        TINYINT DEFAULT 1,     -- 0: ngừng hợp tác, 1: đang hợp tác
    ngayTao          DATETIME2 DEFAULT GETDATE(),
    ngayCapNhat      DATETIME2 DEFAULT GETDATE()
);

-- ============================================================
-- 5. HÓA ĐƠN NHẬP HÀNG  (phiếu nhập – header)
-- ============================================================
CREATE TABLE HoaDonNhap (
    id               INT IDENTITY(1,1) PRIMARY KEY,
    maHoaDonNhap     NVARCHAR(20) NOT NULL UNIQUE,   -- Vd: HDN20240001
    idNhaCungCap     INT NOT NULL,
    idNguoiNhap      INT NOT NULL,                   -- Nhân viên / admin tạo phiếu
    ngayNhap         DATETIME2 DEFAULT GETDATE(),
    tongTienNhap     BIGINT NOT NULL DEFAULT 0,       -- Tổng tiền thanh toán NCC
    trangThai        TINYINT DEFAULT 0,
        -- 0: chờ duyệt, 1: đã duyệt, 2: đã nhận hàng, 3: hủy
    ghiChu           NVARCHAR(500),
    ngayTao          DATETIME2 DEFAULT GETDATE(),
    ngayCapNhat      DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (idNhaCungCap) REFERENCES NhaCungCap(id),
    FOREIGN KEY (idNguoiNhap)  REFERENCES NguoiDung(id)
);

-- ============================================================
-- 6. CHI TIẾT HÓA ĐƠN NHẬP  (từng dòng sản phẩm trong phiếu nhập)
-- ============================================================
CREATE TABLE ChiTietHoaDonNhap (
    id           INT IDENTITY(1,1) PRIMARY KEY,
    idHoaDonNhap INT NOT NULL,
    idSanPham    INT NOT NULL,
    soLuong      INT NOT NULL CHECK (soLuong > 0),
    giaNhap      BIGINT NOT NULL,           -- Đơn giá nhập
    thanhTien    AS (soLuong * giaNhap) PERSISTED,  -- Thành tiền (tính tự động)
    ghiChu       NVARCHAR(500),
    FOREIGN KEY (idHoaDonNhap) REFERENCES HoaDonNhap(id) ON DELETE CASCADE,
    FOREIGN KEY (idSanPham)    REFERENCES SanPham(id)
);

-- ============================================================
-- 7. NGƯỜI DÙNG  (đặt sau các bảng tham chiếu hoặc dùng ALTER sau)
--    Thực tế cần tạo trước HoaDonNhap; xem thứ tự cuối file.
-- ============================================================
CREATE TABLE NguoiDung (
    id              INT IDENTITY(1,1) PRIMARY KEY,
    hoVaTen         NVARCHAR(100) NOT NULL,
    soDienThoai     NVARCHAR(15) NOT NULL UNIQUE,
    matKhau         NVARCHAR(255) NOT NULL,
    email           NVARCHAR(100),
    diaChi          NVARCHAR(255),
    loaiNguoiDung   TINYINT DEFAULT 0,      -- 0: khách hàng, 1: nhân viên, 2: admin
    trangThai       TINYINT DEFAULT 1,      -- 0: khóa, 1: hoạt động
    ngayTao         DATETIME2 DEFAULT GETDATE(),
    ngayCapNhat     DATETIME2 DEFAULT GETDATE()
);

-- ============================================================
-- 8. ĐƠN HÀNG (hóa đơn bán – header)
-- ============================================================
CREATE TABLE DonHang (
    id                       NVARCHAR(20) PRIMARY KEY,   -- Mã đơn, vd: DH240001
    idNguoiDung              INT NOT NULL,
    tenNguoiNhan             NVARCHAR(100) NOT NULL,
    soDienThoaiNguoiNhan     NVARCHAR(15) NOT NULL,
    diaChi                   NVARCHAR(255) NOT NULL,
    loaiGiaoHang             NVARCHAR(50),   -- Giao tận nơi / Tự đến lấy
    thoiGianGiaoHang         NVARCHAR(50),
    phuongThucThanhToan      NVARCHAR(50),   -- Tiền mặt / MoMo / ZaloPay …
    maKhuyenMai              NVARCHAR(50),   -- Mã KM đã áp dụng (nếu có)
    tongGia                  BIGINT NOT NULL, -- Tổng giá trị hàng hóa
    phiGiaoHang              BIGINT DEFAULT 0,
    giamGia                  BIGINT DEFAULT 0,
    thanhToanCuoiCung        AS (tongGia + phiGiaoHang - giamGia) PERSISTED,
    ghiChu                   NVARCHAR(500),
    trangThai                TINYINT DEFAULT 0,
        -- 0: chờ xử lý, 1: đã xác nhận, 2: đang giao, 3: hoàn thành, 4: hủy
    ngayTao                  DATETIME2 DEFAULT GETDATE(),
    ngayCapNhat              DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (idNguoiDung) REFERENCES NguoiDung(id)
);

-- ============================================================
-- 9. CHI TIẾT HÓA ĐƠN BÁN  (từng dòng sản phẩm trong đơn hàng)
-- ============================================================
CREATE TABLE ChiTietDonHang (
    id          INT IDENTITY(1,1) PRIMARY KEY,
    idDonHang   NVARCHAR(20) NOT NULL,
    idSanPham   INT NOT NULL,
    soLuong     INT NOT NULL CHECK (soLuong > 0),
    donGia      BIGINT NOT NULL,            -- Giá bán tại thời điểm đặt
    thanhTien   AS (soLuong * donGia) PERSISTED,  -- Thành tiền (tính tự động)
    ghiChu      NVARCHAR(500),
    FOREIGN KEY (idDonHang) REFERENCES DonHang(id) ON DELETE CASCADE,
    FOREIGN KEY (idSanPham) REFERENCES SanPham(id)
);

-- ============================================================
-- 10. THANH TOÁN  (chi tiết giao dịch thanh toán cho đơn hàng)
-- ============================================================
CREATE TABLE ThanhToan (
    id              INT IDENTITY(1,1) PRIMARY KEY,
    idDonHang       NVARCHAR(20) NOT NULL,
    soTien          BIGINT NOT NULL,
    phuongThuc      NVARCHAR(50),           -- MoMo, ZaloPay, Tiền mặt …
    maGiaoDich      NVARCHAR(100),          -- Mã GD từ cổng thanh toán
    trangThai       TINYINT DEFAULT 0,      -- 0: chờ, 1: thành công, 2: thất bại
    ngayThanhToan   DATETIME2,
    ngayTao         DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (idDonHang) REFERENCES DonHang(id)
);

-- ============================================================
-- 11. KHUYẾN MÃI
-- ============================================================
CREATE TABLE KhuyenMai (
    id               INT IDENTITY(1,1) PRIMARY KEY,
    maKhuyenMai      NVARCHAR(50) NOT NULL UNIQUE,
    tenKhuyenMai     NVARCHAR(255) NOT NULL,
    moTa             NTEXT,
    loaiGiamGia      NVARCHAR(20),          -- 'phantram' | 'tienmat'
    giaTriGiam       BIGINT NOT NULL,
    giaTriToiThieu   BIGINT DEFAULT 0,      -- Giá trị đơn tối thiểu để áp dụng
    soLuongSuDung    INT DEFAULT -1,        -- -1: không giới hạn
    soLuongDaDung    INT DEFAULT 0,
    ngayBatDau       DATETIME2,
    ngayKetThuc      DATETIME2,
    trangThai        TINYINT DEFAULT 1,     -- 0: tắt, 1: bật
    ngayTao          DATETIME2 DEFAULT GETDATE(),
    ngayCapNhat      DATETIME2 DEFAULT GETDATE()
);

-- ============================================================
-- 12. ĐÁNH GIÁ SẢN PHẨM
-- ============================================================
CREATE TABLE DanhGia (
    id          INT IDENTITY(1,1) PRIMARY KEY,
    idSanPham   INT NOT NULL,
    idNguoiDung INT NOT NULL,
    soSao       TINYINT NOT NULL CHECK (soSao BETWEEN 1 AND 5),
    noiDung     NTEXT,
    trangThai   TINYINT DEFAULT 1,          -- 0: ẩn, 1: hiện
    ngayTao     DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (idSanPham)   REFERENCES SanPham(id) ON DELETE CASCADE,
    FOREIGN KEY (idNguoiDung) REFERENCES NguoiDung(id)
);

-- ============================================================
-- THỨ TỰ TẠO BẢNG ĐÚNG (chạy theo thứ tự này):
--   1. DanhMuc
--   2. NguoiDung
--   3. SanPham          (FK → DanhMuc)
--   4. KhoHang          (FK → SanPham)
--   5. NhaCungCap
--   6. HoaDonNhap       (FK → NhaCungCap, NguoiDung)
--   7. ChiTietHoaDonNhap(FK → HoaDonNhap, SanPham)
--   8. KhuyenMai
--   9. DonHang          (FK → NguoiDung)
--  10. ChiTietDonHang   (FK → DonHang, SanPham)
--  11. ThanhToan        (FK → DonHang)
--  12. DanhGia          (FK → SanPham, NguoiDung)
-- ============================================================

-- ============================================================
-- DỮ LIỆU MẪU (SEED DATA)
-- ============================================================

-- ------------------------------------------------------------
-- DanhMuc (7 danh mục)
-- ------------------------------------------------------------
SET IDENTITY_INSERT DanhMuc ON;
INSERT INTO DanhMuc (id, tenDanhMuc, moTa, trangThai) VALUES
(1, N'LEGO',          N'Đồ chơi lắp ráp LEGO chính hãng', 1),
(2, N'Siêu Robot',    N'Robot biến hình và siêu anh hùng', 1),
(3, N'GUNDAM',        N'Mô hình lắp ráp Gundam đến từ Nhật Bản', 1),
(4, N'Xe đồ chơi',   N'Xe mô hình, xe điều khiển các loại', 1),
(5, N'Búp bê',        N'Búp bê Barbie và các dòng búp bê', 1),
(6, N'Động vật',      N'Mô hình động vật, robot động vật', 1),
(7, N'Đồ chơi khác', N'Các loại đồ chơi khác', 1);
SET IDENTITY_INSERT DanhMuc OFF;

-- ------------------------------------------------------------
-- NguoiDung (2 tài khoản Admin – mật khẩu: 123456)
-- Hash bcrypt của "123456" với salt=10
-- ------------------------------------------------------------
SET IDENTITY_INSERT NguoiDung ON;
INSERT INTO NguoiDung (id, hoVaTen, soDienThoai, matKhau, email, diaChi, loaiNguoiDung, trangThai) VALUES
(1, N'Nguyễn Mạnh Dũng', N'md26022005',
 '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHY6',
 N'dungluffy1997@gmail.com', NULL, 2, 1),
(2, N'Trần Khánh Toàn', N'0123456789',
 '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHY6',
 NULL, NULL, 2, 1);
SET IDENTITY_INSERT NguoiDung OFF;

-- ------------------------------------------------------------
-- NhaCungCap (3 nhà cung cấp mẫu)
-- ------------------------------------------------------------
SET IDENTITY_INSERT NhaCungCap ON;
INSERT INTO NhaCungCap (id, maNhaCungCap, tenNhaCungCap, nguoiDaiDien, soDienThoai, email, diaChi, trangThai) VALUES
(1, N'NCC001', N'Công ty TNHH Đồ Chơi Việt Nam', N'Nguyễn Văn A', N'0901234567', N'doichoivn@gmail.com', N'123 Lý Thường Kiệt, Q.10, TP.HCM', 1),
(2, N'NCC002', N'LEGO Vietnam Distribution',     N'Trần Thị B',  N'0912345678', N'lego.vn@example.com', N'45 Đinh Tiên Hoàng, Q.1, TP.HCM', 1),
(3, N'NCC003', N'Bandai Namco Vietnam',           N'Lê Văn C',    N'0923456789', N'bandai.vn@example.com',N'67 Nguyễn Huệ, Q.1, TP.HCM', 1);
SET IDENTITY_INSERT NhaCungCap OFF;

-- ------------------------------------------------------------
-- SanPham (60 sản phẩm)
-- ------------------------------------------------------------
SET IDENTITY_INSERT SanPham ON;
INSERT INTO SanPham (id, tieuDe, hinhAnh, idDanhMuc, gia, moTa, thuongHieu, trangThai) VALUES
( 1, N'Đồ chơi lắp ráp Hoa thủy tiên LEGO®',                                    N'./assets/img/products/s1.jpg',  1,  200000, N'Trải nghiệm trồng hoa và tìm kiếm niềm vui với những bông hoa LEGO® lấy cảm hứng từ mùa xuân ấm áp.', N'LEGO', 1),
( 2, N'Đồ chơi lắp ráp Dinh thự của gia đình Gru LEGO',                         N'./assets/img/products/s2.jpg',  1, 2267000, N'Ngôi nhà của Gru được bao phủ những bí ẩn kì lạ từ dưới cho đến tận mái nhà tóp nhọn vui nhộn.', N'LEGO', 1),
( 3, N'Đồ chơi lắp ráp Xe tải Minions Siêu cấp LEGO MINIONS',                   N'./assets/img/products/s3.jpg',  1,  989000, N'Bộ lắp ráp sáng tạo dành cho trẻ em này bao gồm một chiếc xe buýt đa năng.', N'LEGO', 1),
( 4, N'Đồ chơi lắp ráp Máy ảnh Retro LEGO CREATOR',                             N'./assets/img/products/s4.jpg',  1,  619000, N'Bộ trò chơi 3 trong 1 – Bé có thể xây dựng và xây dựng lại 3 món đồ chơi công nghệ cổ điển khác nhau.', N'LEGO', 1),
( 5, N'Đồ chơi lắp ráp Ngôi nhà ếch LEGO MINECRAFT',                            N'./assets/img/products/s5.jpg',  1, 1334000, N'Đồ chơi LEGO® Minecraft® – Các phụ kiện phổ biến của Minecraft.', N'LEGO', 1),
( 6, N'Đồ Chơi Lắp Ráp Siêu Rô Bốt LEGO CREATOR',                              N'./assets/img/products/s6.jpg',  1,  299000, N'Đồ chơi 3 trong 1 – Siêu Robot (31124) cho phép trẻ thỏa sức chơi với trí tưởng tượng.', N'LEGO', 1),
( 7, N'Đồ chơi lắp ráp Mô hình người nhện LEGO SUPERHEROES',                    N'./assets/img/products/s7.jpg',  1, 1099000, N'Tham gia hành động với Đồ chơi lắp ráp Mô hình người nhện LEGO® Marvel!', N'LEGO', 1),
( 8, N'Đồ Chơi Lắp Ráp Mô Hình Người Dơi Và Siêu Xe Batpod LEGO SUPERHEROES',  N'./assets/img/products/s8.jpg',  1, 2439000, N'Mô hình Người Dơi và siêu xe Batpod từ LEGO® DC (76273).', N'LEGO', 1),
( 9, N'Robot Siêu Cảnh Sát Tuần Tra Patrol Cop Điện Năng Miniforce',             N'./assets/img/products/s9.jpg',  2,  359000, N'Robot siêu cảnh sát tuần tra Patrol Cop điện năng.', N'Miniforce', 1),
(10, N'Robot Siêu Cảnh Sát Bầu Trời Jet Cop Phong Năng Miniforce',              N'./assets/img/products/s10.jpg', 2,   25000, N'Robot siêu cảnh sát bầu trời Jet Cop phong năng.', N'Miniforce', 1),
(11, N'Đồ chơi lắp ráp mô hình MASTER GRADE SD FREEDOM GUNDAM',                N'./assets/img/products/s11.jpg', 3,   60000, N'Mô hình lắp ráp chất lượng cao đến từ Nhật Bản.', N'Bandai', 1),
(12, N'Đồ Chơi Lắp Ráp Rồng Thần Sức Mạnh Thunderfang LEGO NINJAGO',           N'./assets/img/products/s12.jpg', 1, 2399000, N'Hợp tác cùng các anh hùng ninja để ngăn chặn Tyr và Nokt.', N'LEGO', 1),
(13, N'Đồ Chơi Lắp Ráp Chiến Giáp Kết Hợp Của Zane LEGO NINJAGO',             N'./assets/img/products/s13.jpg', 1, 3249000, N'Hợp sức cùng các ninja hùng mạnh để tạo ra một trong những robot chiến đấu tuyệt vời nhất.', N'LEGO', 1),
(14, N'Đồ Chơi Lắp Ráp Chiến Giáp Và Máy Bay Chiến Đấu Của Arin LEGO NINJAGO',N'./assets/img/products/s14.jpg', 1, 1629000, N'Trận Chiến Trên Bầu Trời Cùng Arin, Ras và Máy Bay Phản Lực.', N'LEGO', 1),
(15, N'Đồ Chơi Lắp Ráp Chiến Giáp Rồng Titan Của Cole LEGO NINJAGO',           N'./assets/img/products/s15.jpg', 1, 2437000, N'Chiến giáp rồng titan của Cole.', N'LEGO', 1),
(16, N'Đồ Chơi Lắp Ráp Chiến Giáp Titan Của Jay LEGO NINJAGO',                 N'./assets/img/products/s16.jpg', 1, 1942000, N'Chiến giáp Titan của Jay.', N'LEGO', 1),
(17, N'Đồ Chơi Lắp Ráp Rồng Lửa Bóng Đêm Của Kai LEGO NINJAGO',               N'./assets/img/products/s17.jpg', 1, 3652000, N'Rồng lửa bóng đêm của Kai.', N'LEGO', 1),
(18, N'Đồ chơi lắp ráp Rồng đỏ may mắn LEGO CREATOR',                          N'./assets/img/products/s18.jpg', 1,  209000, N'Sẵn sàng cho chuyến phiêu lưu đến với vùng đất diệu kỳ.', N'LEGO', 1),
(19, N'Đồ Chơi Lắp Ráp Đấu Trường Ninjago LEGO NINJAGO',                        N'./assets/img/products/s19.jpg', 1, 1629000, N'Bộ Đấu trường Ninjago chi tiết này tái hiện lại trận đấu cuối cùng.', N'LEGO', 1),
(20, N'Đồ chơi lắp ráp Ngôi Đền Rồng Đá LEGO NINJAGO',                         N'./assets/img/products/s20.jpg', 1, 3839000, N'Bộ trò chơi LEGO® NINJAGO®.', N'LEGO', 1),
(21, N'Đồ chơi lắp ráp Tu viện bóng tối của mặt nạ sói LEGO NINJAGO',          N'./assets/img/products/s21.jpg', 1, 3839000, N'Cùng những chiến binh NINJAGO® đột kích Võ đường Bóng tối.', N'LEGO', 1),
(22, N'Đồ chơi lắp ráp Rồng thần sư phụ Wu LEGO NINJAGO',                      N'./assets/img/products/s22.jpg', 1, 1619000, N'Hãy sẵn sàng tiến vào trận chiến với Rồng thần sư phụ Wu!', N'LEGO', 1),
(23, N'Đồ chơi lắp ráp mô hình HG 1/144 GUNDAM PHARACT',                        N'./assets/img/products/s23.jpg', 3,  599000, N'Mô hình lắp ráp chất lượng cao Gundam.', N'Bandai', 1),
(24, N'Đồ chơi lắp ráp mô hình HG 1/144 HEINDREE GUNDAM',                      N'./assets/img/products/s24.jpg', 3,  519000, N'Mô hình lắp ráp chất lượng cao Gundam.', N'Bandai', 1),
(25, N'Đồ chơi lắp ráp mô hình HG 1/144 MICHAELIS GUNDAM',                     N'./assets/img/products/s25.jpg', 3,  519000, N'Mô hình lắp ráp chất lượng cao Gundam.', N'Bandai', 1),
(26, N'Siêu Robot Biến Hình Kết Hợp Raptor Chyron Kiên Cố DINOSTER',            N'./assets/img/products/s26.jpg', 2, 1299000, N'Siêu Robot biến hình kết hợp Raptor Chyron Kiên Cố.', N'Dinoster', 1),
(27, N'Siêu Robot Biến Hình Mosa Storm Bão Tố DINOSTER',                         N'./assets/img/products/s27.jpg', 2,  639000, N'Siêu robot biến hình Mosa Storm Bão Tố.', N'Dinoster', 1),
(28, N'Đồ Chơi Mô Hình Xe Jeep Big Wheel SIKU',                                 N'./assets/img/products/s28.jpg', 4,  149000, N'Mạnh mẽ, bon bon về đích nào!', N'SIKU', 1),
(29, N'Đồ Chơi Siêu Xe Ultra Hots - 65 Pontiac Gto HOT WHEELS',                 N'./assets/img/products/s29.jpg', 4,  119000, N'Siêu xe Hot Wheels Ultra Hots – 65 Pontiac Gto.', N'Hot Wheels', 1),
(30, N'Búp Bê Barbie Và Mái Tóc Sành Điệu BARBIE',                              N'./assets/img/products/s30.jpg', 5,  909000, N'Khám phá Búp bê Barbie và mái tóc sành điệu.', N'Barbie', 1),
(31, N'Búp Bê Barbie Cutie Reveal - Zebra BARBIE',                               N'./assets/img/products/s31.jpg', 5, 1109000, N'Búp bê Barbie Cutie Reveal – Zebra.', N'Barbie', 1),
(32, N'Búp Bê Barbie Pop Reveal Boba - Bé Mochi Xoài BARBIE',                   N'./assets/img/products/s32.jpg', 5,  869000, N'Búp bê Barbie Pop Reveal Boba – Bé mochi xoài.', N'Barbie', 1),
(33, N'Búp Bê Pop Reveal Boba - Bé Sữa Khoai Môn BARBIE',                       N'./assets/img/products/s33.jpg', 5,  869000, N'Búp bê Barbie Pop Reveal Boba – Bé sữa khoai môn.', N'Barbie', 1),
(34, N'Búp Bê Nghề Nghiệp - Điều Dưỡng BARBIE',                                 N'./assets/img/products/s34.jpg', 5,  899000, N'Khám phá thế giới của bác sĩ nhi khoa.', N'Barbie', 1),
(35, N'Búp Bê Barbie Cutie Reveal - Bunny BARBIE',                               N'./assets/img/products/s35.jpg', 5, 1109000, N'Búp bê Barbie Cutie Reveal – Bunny.', N'Barbie', 1),
(36, N'Mô Hình Kéo Giãn Động Vật Hoang Dã Oinky STRETCHAPALZ',                 N'./assets/img/products/s36.jpg', 6,  129000, N'Mô hình Stretchapalz kéo giãn.', N'Stretchapalz', 1),
(37, N'Mô Hình Kéo Giãn Động Vật Hoang Dã Howly STRETCHAPALZ',                 N'./assets/img/products/s37.jpg', 6,  129000, N'Hãy thử thách xem bạn có thể kéo dài.', N'Stretchapalz', 1),
(38, N'Mô Hình Kéo Giãn Động Vật Hoang Dã Growly STRETCHAPALZ',                N'./assets/img/products/s38.jpg', 6,  129000, N'Mô hình Stretchapalz kéo giãn.', N'Stretchapalz', 1),
(39, N'Đồ Chơi Robot Tự Động - Nhện VECTO VT9902B',                             N'./assets/img/products/s39.jpg', 6,  129000, N'Đồ chơi Robot tự động – Nhện từ VECTO.', N'Vecto', 1),
(40, N'Đồ Chơi Robot Tự Động - Chuột VECTO',                                    N'./assets/img/products/s40.jpg', 6,  129000, N'Đồ chơi Robot tự động – Chuột từ VECTO.', N'Vecto', 1),
(41, N'Đồ Chơi Mô Hình Thiên Mã Hừng Đông Bé Nhỏ SCHLEICH',                   N'./assets/img/products/s41.jpg', 6,  209000, N'Schleich là thương hiệu đồ chơi đến từ Đức.', N'Schleich', 1),
(42, N'Bộ khảo cổ Bonezalive khai quật xương sống dòng lớn BONEZALIVE',        N'./assets/img/products/s42.jpg', 6,  150000, N'Bonezalive – Những bộ xương "còn sống".', N'Bonezalive', 1),
(43, N'Bộ khảo cổ Bonezalive khai quật xương sống dòng cơ bản BONEZALIVE',     N'./assets/img/products/s43.jpg', 6,  100000, N'Bonezalive cơ bản.', N'Bonezalive', 1),
(44, N'Mô hình Movie 7 Rhinox dòng Voyager TRANSFORMERS',                        N'./assets/img/products/s44.jpg', 6, 1499000, N'Thương hiệu đồ chơi trẻ em Transformers đến từ Mỹ.', N'Transformers', 1),
(45, N'Mô hình AIRAZOR dòng Studio Deluxe TRANSFORMERS',                         N'./assets/img/products/s45.jpg', 6,  740000, N'Những nhân vật hành động sưu tập 4,5 inch.', N'Transformers', 1),
(46, N'Đồ Chơi Lắp Ráp Rồng Arc LEGO NINJAGO',                                  N'./assets/img/products/s46.jpg', 1, 3249000, N'Lao vào hành động cùng ninja.', N'LEGO', 1),
(47, N'Đồ chơi lắp ráp con quay Arin và phe ác LEGO NINJAGO',                   N'./assets/img/products/s47.jpg', 1,  629000, N'Trận chiến SpinJitzu.', N'LEGO', 1),
(48, N'Đồ chơi lắp ráp Chiến hạm Bounty - Cuộc chiến thời gian LEGO NINJAGO',  N'./assets/img/products/s48.jpg', 1, 4679000, N'Hãy bay lên bầu trời cùng ninja.', N'LEGO', 1),
(49, N'Đồ chơi lắp ráp Chiến giáp của Lloyd và Arin LEGO NINJAGO',             N'./assets/img/products/s49.jpg', 1, 2599000, N'Khi ninja bị tấn công bởi ác quỷ Rapton.', N'LEGO', 1),
(50, N'Đồ chơi lắp ráp Rồng nguyên tố đối đầu chiến giáp đế vương LEGO NINJAGO',N'./assets/img/products/s50.jpg',1, 3299000, N'Chuẩn bị cho cuộc đọ sức.', N'LEGO', 1),
(51, N'Siêu Drone Chiến binh bầu trời VECTO',                                    N'./assets/img/products/s51.jpg', 7,  500000, N'Bao phủ bên ngoài là một màu vàng sang trọng.', N'Vecto', 1),
(52, N'Đồ Chơi Xe Kéo Cứu Hộ ADAC SIKU',                                        N'./assets/img/products/s52.jpg', 4,  129000, N'Được nhiều bạn trẻ yêu thích!!', N'SIKU', 1),
(53, N'Đồ Chơi Mô Hình Siêu Xe HOT WHEELS',                                     N'./assets/img/products/s53.jpg', 4,   69000, N'Xe sưu tập die-cast Hot Wheels.', N'Hot Wheels', 1),
(54, N'Đồ Chơi Xe Chở Rác Man TGS BRUDER',                                      N'./assets/img/products/s54.jpg', 4, 2339000, N'Bé cùng vui vừa học vừa chơi.', N'Bruder', 1),
(55, N'Đồ Chơi Xe Điều Khiển 1:24 Ferrari F40 Đỏ',                              N'./assets/img/products/s55.jpg', 4,  499000, N'Xe điều khiển 1:24 Ferrari F40.', N'Ferrari RC', 1),
(56, N'Đồ Chơi Siêu Xe Boulevard - 69 Dodge Charger HOT WHEELS',                N'./assets/img/products/s56.jpg', 4,  279000, N'Bộ sưu tập Hot Wheels Boulevard.', N'Hot Wheels', 1),
(57, N'Đồ Chơi Xe Cứu Hộ Jungle Marshall PAW PATROL',                           N'./assets/img/products/s57.jpg', 4,  599000, N'Bạn đã sẵn sàng cho những cuộc phiêu lưu.', N'Paw Patrol', 1),
(58, N'Đồ Chơi Xe Cứu Hộ Jungle Rocky PAW PATROL',                              N'./assets/img/products/s58.jpg', 4,  599000, N'Xe của Rocky có khả năng biến hình.', N'Paw Patrol', 1),
(59, N'Đồ Chơi Xe Cứu Hộ Jungle Chase PAW PATROL',                              N'./assets/img/products/s59.jpg', 4,  599000, N'Hãy sẵn sàng cho những cuộc phiêu lưu giải cứu.', N'Paw Patrol', 1),
(60, N'Robot mèo con thông thái VECTO',                                           N'./assets/img/products/s60.jpg', 7,  499000, N'Đáng yêu và nhí nhảnh, nghịch ngợm và thông thái.', N'Vecto', 1);
SET IDENTITY_INSERT SanPham OFF;

-- ------------------------------------------------------------
-- KhoHang – tồn kho ban đầu 50 mỗi sản phẩm
-- ------------------------------------------------------------
SET IDENTITY_INSERT KhoHang ON;
INSERT INTO KhoHang (id, idSanPham, soLuongTon, soLuongNhap, soLuongXuat) VALUES
( 1,  1, 50, 50, 0),( 2,  2, 50, 50, 0),( 3,  3, 50, 50, 0),( 4,  4, 50, 50, 0),( 5,  5, 50, 50, 0),
( 6,  6, 50, 50, 0),( 7,  7, 50, 50, 0),( 8,  8, 50, 50, 0),( 9,  9, 50, 50, 0),(10, 10, 50, 50, 0),
(11, 11, 50, 50, 0),(12, 12, 50, 50, 0),(13, 13, 50, 50, 0),(14, 14, 50, 50, 0),(15, 15, 50, 50, 0),
(16, 16, 50, 50, 0),(17, 17, 50, 50, 0),(18, 18, 50, 50, 0),(19, 19, 50, 50, 0),(20, 20, 50, 50, 0),
(21, 21, 50, 50, 0),(22, 22, 50, 50, 0),(23, 23, 50, 50, 0),(24, 24, 50, 50, 0),(25, 25, 50, 50, 0),
(26, 26, 50, 50, 0),(27, 27, 50, 50, 0),(28, 28, 50, 50, 0),(29, 29, 50, 50, 0),(30, 30, 50, 50, 0),
(31, 31, 50, 50, 0),(32, 32, 50, 50, 0),(33, 33, 50, 50, 0),(34, 34, 50, 50, 0),(35, 35, 50, 50, 0),
(36, 36, 50, 50, 0),(37, 37, 50, 50, 0),(38, 38, 50, 50, 0),(39, 39, 50, 50, 0),(40, 40, 50, 50, 0),
(41, 41, 50, 50, 0),(42, 42, 50, 50, 0),(43, 43, 50, 50, 0),(44, 44, 50, 50, 0),(45, 45, 50, 50, 0),
(46, 46, 50, 50, 0),(47, 47, 50, 50, 0),(48, 48, 50, 50, 0),(49, 49, 50, 50, 0),(50, 50, 50, 50, 0),
(51, 51, 50, 50, 0),(52, 52, 50, 50, 0),(53, 53, 50, 50, 0),(54, 54, 50, 50, 0),(55, 55, 50, 50, 0),
(56, 56, 50, 50, 0),(57, 57, 50, 50, 0),(58, 58, 50, 50, 0),(59, 59, 50, 50, 0),(60, 60, 50, 50, 0);
SET IDENTITY_INSERT KhoHang OFF;