const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');

const productsData = [
    { title: 'Đồ chơi lắp ráp Hoa thủy tiên LEGO®', img: './assets/img/products/s1.jpg', category: 'LEGO', price: 200000, desc: 'Trải nghiệm trồng hoa và tìm kiếm niềm vui với những bông hoa LEGO® lấy cảm hứng từ mùa xuân ấm áp.' },
    { title: 'Đồ chơi lắp ráp Dinh thự của gia đình Gru LEGO', img: './assets/img/products/s2.jpg', category: 'LEGO', price: 2267000 , desc: 'Ngôi nhà của Gru được bao phủ những bí ẩn kì lạ từ dưới cho đến tận mái nhà tóp nhọn vui nhộn.' },
    { title: 'Đồ chơi lắp ráp Xe tải Minions Siêu cấp LEGO MINIONS', img: './assets/img/products/s3.jpg', category: 'LEGO', price: 989000, desc: 'Bộ lắp ráp sáng tạo dành cho trẻ em này bao gồm một chiếc xe buýt đa năng.' },
    { title: 'Đồ chơi lắp ráp Máy ảnh Retro LEGO CREATOR', img: './assets/img/products/s4.jpg', category: 'LEGO', price: 619000, desc: 'Bộ trò chơi 3 trong 1 hộp - Bé có thể xây dựng và xây dựng lại 3 món đồ chơi công nghệ cổ điển khác nhau.' },
    { title: 'Đồ chơi lắp ráp Ngôi nhà ếch LEGO MINECRAFT', img: './assets/img/products/s5.jpg', category: 'LEGO', price: 1334000, desc: 'Đồ chơi LEGO® Minecraft® - Các phụ kiện phổ biến của Minecraft.' },
    { title: 'Đồ Chơi Lắp Ráp Siêu Rô Bốt LEGO CREATOR', img: './assets/img/products/s6.jpg', category: 'LEGO', price: 299000, desc: 'Đồ chơi 3 trong 1 - Siêu Robot (31124) cho phép trẻ thỏa sức chơi với trí tưởng tượng.' },
    { title: 'Đồ chơi lắp ráp Mô hình người nhện LEGO SUPERHEROES', category: 'LEGO', img: './assets/img/products/s7.jpg', price: 1099000, desc: 'Tham gia hành động với Đồ chơi lắp ráp Mô hình người nhện LEGO® Marvel!' },
    { title: 'Đồ Chơi Lắp Ráp Mô Hình Người Dơi Và Siêu Xe Batpod LEGO SUPERHEROES', img: './assets/img/products/s8.jpg', category: 'LEGO', price: 2439000, desc: 'Mô hình Người Dơi và siêu xe Batpod từ LEGO® DC (76273).' },
    { title: 'Robot Siêu Cảnh Sát Tuần Tra Patrol Cop Điện Năng Miniforce', category: "Siêu Robot", img: './assets/img/products/s9.jpg', price: 359000, desc: 'Robot siêu cảnh sát tuần tra Patrol Cop điện năng.' },
    { title: 'Robot Siêu Cảnh Sát Bầu Trời Jet Cop Phong Năng Miniforce ', category: "Siêu Robot", img: './assets/img/products/s10.jpg', price: 25000, desc: 'Robot siêu cảnh sát bầu trời Jet Cop phong năng.' },
    { title: 'Đồ chơi lắp ráp mô hình MASTER GRADE SD FREEDOM GUNDAM GUNDAM', category: 'GUNDAM', img: './assets/img/products/s11.jpg', price: 60000, desc: 'Mô hình lắp ráp chất lượng cao đến từ Nhật Bản.' },
    { title: 'Đồ Chơi Lắp Ráp Rồng Thần Sức Mạnh Thunderfang LEGO NINJAGO', img: './assets/img/products/s12.jpg', category: 'LEGO', price: 2399000, desc: 'Hợp tác cùng các anh hùng ninja để ngăn chặn Tyr và Nokt.' },
    { title: 'Đồ Chơi Lắp Ráp Chiến Giáp Kết Hợp Của Zane LEGO NINJAGO', img: './assets/img/products/s13.jpg', category: 'LEGO', price: 3249000, desc: 'Hợp sức cùng các ninja hùng mạnh để tạo ra một trong những robot chiến đấu tuyệt vời nhất.' },
    { title: 'Đồ Chơi Lắp Ráp Chiến Giáp Và Máy Bay Chiến Đấu Của Arin LEGO NINJAGO', img: './assets/img/products/s14.jpg', category: 'LEGO', price: 1629000, desc: 'Trận Chiến Trên Bầu Trời Cùng Arin, Ras và Máy Bay Phản Lực.' },
    { title: 'Đồ Chơi Lắp Ráp Chiến Giáp Rồng Titan Của Cole LEGO NINJAGO', img: './assets/img/products/s15.jpg', category: 'LEGO', price: 2437000, desc: 'Chiến giáp rồng titan của Cole.' },
    { title: 'Đồ Chơi Lắp Ráp Chiến Giáp Titan Của Jay LEGO NINJAGO', img: './assets/img/products/s16.jpg', category: 'LEGO', price: 1942000, desc: 'Chiến giáp Titan của Jay.' },
    { title: 'Đồ Chơi Lắp Ráp Rồng Lửa Bóng Đêm Của Kai LEGO NINJAGO', img: './assets/img/products/s17.jpg', category: 'LEGO', price: 3652000, desc: 'Rồng lửa bóng đêm của Kai.' },
    { title: 'Đồ chơi lắp ráp Rồng đỏ may mắn LEGO CREATOR', img: './assets/img/products/s18.jpg', category: 'LEGO', price: 209000, desc: 'Sẵn sàng cho chuyến phiêu lưu đến với vùng đất diệu kỳ.' },
    { title: 'Đồ Chơi Lắp Ráp Đấu Trường Ninjago LEGO NINJAGO', img: './assets/img/products/s19.jpg', category: 'LEGO', price: 1629000, desc: 'Bộ Đấu trường Ninjago chi tiết này tái hiện lại trận đấu cuối cùng.' },
    { title: 'Đồ chơi lắp ráp Ngôi Đền Rồng Đá LEGO NINJAGO', img: './assets/img/products/s20.jpg', category: 'LEGO', price: 3839000, desc: 'Bộ trò chơi LEGO® NINJAGO®.' },
    { title: 'Đồ chơi lắp ráp Tu viện bóng tối của mặt nạ sói LEGO NINJAGO', category: 'LEGO', img: './assets/img/products/s21.jpg', price: 3839000, desc: 'Cùng những chiến binh NINJAGO® đột kích Võ đường Bóng tối.' },
    { title: 'Đồ chơi lắp ráp Rồng thần sư phụ Wu LEGO NINJAGO', category: 'LEGO', img: './assets/img/products/s22.jpg', price: 1619000, desc: 'Hãy sẵn sàng tiến vào trận chiến với Rồng thần sư phụ Wu!' },
    { title: 'Đồ chơi lắp ráp mô hình HG 1/144 GUNDAM PHARACT', category: 'GUNDAM', img: './assets/img/products/s23.jpg', price: 599000, desc: 'Mô hình lắp ráp chất lượng cao Gundam.' },
    { title: 'Đồ chơi lắp ráp mô hình HG 1/144 HEINDREE GUNDAM', img: './assets/img/products/s24.jpg', category: 'GUNDAM', price: 519000, desc: 'Mô hình lắp ráp chất lượng cao Gundam.' },
    { title: 'Đồ chơi lắp ráp mô hình HG 1/144 MICHAELIS GUNDAM', img: './assets/img/products/s25.jpg', category: 'GUNDAM', price: 519000, desc: 'Mô hình lắp ráp chất lượng cao Gundam.' },
    { title: 'Siêu Robot Biến Hình Kết Hợp Raptor Chyron Kiên Cố DINOSTER', category: 'Siêu Robot', img: './assets/img/products/s26.jpg', price: 1299000, desc: 'Siêu Robot biến hình kết hợp Raptor Chyron Kiên Cố.' },
    { title: 'Siêu Robot Biến Hình Mosa Storm Bão Tố DINOSTER', category: 'Siêu Robot', img: './assets/img/products/s27.jpg', price: 639000, desc: 'Siêu robot biến hình Mosa Storm Bão Tố.' },
    { title: 'Đồ Chơi Mô Hình Xe Jeep Big Wheel SIKU', category: 'Xe đồ chơi', img: './assets/img/products/s28.jpg', price: 149000, desc: 'Mạnh mẽ, bon bon về đích nào!' },
    { title: 'Đồ Chơi Siêu Xe Ultra Hots - 65 Pontiac Gto HOT WHEELS', category: 'Xe đồ chơi', img: './assets/img/products/s29.jpg', price: 119000, desc: 'Siêu xe Hot Wheels Ultra Hots - 65 Pontiac Gto.' },
    { title: 'Búp Bê Barbie Và Mái Tóc Sành Điệu BARBIE', category: 'Búp bê', img: './assets/img/products/s30.jpg', price: 909000, desc: 'Khám phá Búp bê Barbie và mái tóc sành điệu.' },
    { title: 'Búp Bê Barbie Cutie Reveal - Zebra BARBIE', category: 'Búp bê', img: './assets/img/products/s31.jpg', price: 1109000, desc: 'Búp bê Barbie Cutie Reveal - Zebra.' },
    { title: 'Búp Bê Barbie Pop Reveal Boba - Bé Mochi Xoài BARBIE', category: 'Búp bê', img: './assets/img/products/s32.jpg', price: 869000, desc: 'Búp bê Barbie Pop Reveal Boba - Bé mochi xoài.' },
    { title: 'Búp Bê Pop Reveal Boba - Bé Sữa Khoai Môn BARBIE', category: 'Búp bê', img: './assets/img/products/s33.jpg', price: 869000, desc: 'Búp bê Barbie Pop Reveal Boba - Bé sữa khoai môn.' },
    { title: 'Búp Bê Nghề Nghiệp - Điều Dưỡng BARBIE', category: 'Búp bê', img: './assets/img/products/s34.jpg', price: 899000, desc: 'Khám phá thế giới của bác sĩ nhi khoa.' },
    { title: 'Búp Bê Barbie Cutie Reveal - Bunny BARBIE', category: 'Búp bê', img: './assets/img/products/s35.jpg', price: 1109000, desc: 'Búp bê Barbie Cutie Reveal - Bunny.' },
    { title: 'Mô Hình Kéo Giãn Động Vật Hoang Dã Oinky STRETCHAPALZ', category: 'Động vật', img: './assets/img/products/s36.jpg', price: 129000, desc: 'Mô hình Stretchapalz kéo giãn.' },
    { title: 'Mô Hình Kéo Giãn Động Vật Hoang Dã Howly STRETCHAPALZ', category: 'Động vật', img: './assets/img/products/s37.jpg', price: 129000, desc: 'Hãy thử thách xem bạn có thể kéo dài.' },
    { title: 'Mô Hình Kéo Giãn Động Vật Hoang Dã Growly STRETCHAPALZ', category: 'Động vật', img: './assets/img/products/s38.jpg', price: 129000, desc: 'Mô hình Stretchapalz kéo giãn.' },
    { title: 'Đồ Chơi Robot Tự Động - Nhện VECTO VT9902B', category: 'Động vật', img: './assets/img/products/s39.jpg', price: 129000, desc: 'Đồ chơi Robot tự động - Nhện từ VECTO.' },
    { title: 'Đồ Chơi Robot Tự Động - Chuột VECTO', category: 'Động vật', img: './assets/img/products/s40.jpg', price: 129000, desc: 'Đồ chơi Robot tự động - Chuột từ VECTO.' },
    { title: 'Đồ Chơi Mô Hình Thiên Mã Hừng Đông Bé Nhỏ SCHLEICH', category: 'Động vật', img: './assets/img/products/s41.jpg', price: 209000, desc: 'Schleich là thương hiệu đồ chơi đến từ Đức.' },
    { title: 'Bộ khảo cổ Bonezalive khai quật xương sống dòng lớn BONEZALIVE', category: "Động vật", img: './assets/img/products/s42.jpg', price: 150000, desc: 'Bonezalive - Những bộ xương "còn sống".' },
    { title: 'Bộ khảo cổ Bonezalive khai quật xương sống dòng cơ bản BONEZALIVE', category: "Động vật", img: './assets/img/products/s43.jpg', price: 100000, desc: 'Bonezalive cơ bản.' },
    { title: 'Mô hình Movie 7 Rhinox dòng Voyager TRANSFORMERS', category: "Động vật", img: './assets/img/products/s44.jpg', price: 1499000, desc: 'Thương hiệu đồ chơi trẻ em Transformers đến từ Mỹ.' },
    { title: 'Mô hình AIRAZOR dòng Studio Deluxe TRANSFORMERS', category: "Động vật", img: './assets/img/products/s45.jpg', price: 740000, desc: 'Những nhân vật hành động sưu tập 4,5 inch.' },
    { title: 'Đồ Chơi Lắp Ráp Rồng Arc LEGO NINJAGO', category: "LEGO", img: './assets/img/products/s46.jpg', price: 3249000, desc: 'Lao vào hành động cùng ninja.' },
    { title: 'Đồ chơi lắp ráp con quay Arin và phe ác LEGO NINJAGO', category: "LEGO", img: './assets/img/products/s47.jpg', price: 629000, desc: 'Trận chiến SpinJitzu.' },
    { title: 'Đồ chơi lắp ráp Chiến hạm Bounty - Cuộc chiến thời gian LEGO NINJAGO', category: "LEGO", img: './assets/img/products/s48.jpg', price: 4679000, desc: 'Hãy bay lên bầu trời cùng ninja.' },
    { title: 'Đồ chơi lắp ráp Chiến giáp của Lloyd và Arin LEGO NINJAGO', category: "LEGO", img: './assets/img/products/s49.jpg', price: 2599000, desc: 'Khi ninja bị tấn công bởi ác quỷ Rapton.' },
    { title: 'Đồ chơi lắp ráp Rồng nguyên tố đối đầu chiến giáp đế vương LEGO NINJAGO', category: "LEGO", img: './assets/img/products/s50.jpg', price: 3299000, desc: 'Chuẩn bị cho cuộc đọ sức.' },
    { title: 'Siêu Drone Chiến binh bầu trời VECTO', category: "Đồ chơi khác", img: './assets/img/products/s51.jpg', price: 500000, desc: 'Bao phủ bên ngoài là một màu vàng sang trọng.' },
    { title: 'Đồ Chơi Xe Kéo Cứu Hộ ADAC SIKU', category: "Xe đồ chơi", img: './assets/img/products/s52.jpg', price: 129000, desc: 'Được nhiều bạn trẻ yêu thích!!' },
    { title: 'Đồ Chơi Mô Hình Siêu Xe HOT WHEELS', category: "Xe đồ chơi", img: './assets/img/products/s53.jpg', price: 69000, desc: 'Xe sưu tập die-cast Hot Wheels.' },
    { title: 'Đồ Chơi Xe Chở Rác Man TGS BRUDER', category: "Xe đồ chơi", img: './assets/img/products/s54.jpg', price: 2339000, desc: 'Bé cùng vui vừa học vừa chơi.' },
    { title: 'Đồ Chơi Xe Điều Khiển 1:24 Ferrari F40 Đỏ', category: "Xe đồ chơi", img: './assets/img/products/s55.jpg', price: 499000, desc: 'Xe điều khiển 1:24 Ferrari F40.' },
    { title: 'Đồ Chơi Siêu Xe Boulevard - 69 Dodge Charger HOT WHEELS', category: "Xe đồ chơi", img: './assets/img/products/s56.jpg', price: 279000, desc: 'Bộ sưu tập Hot Wheels Boulevard.' },
    { title: 'Đồ Chơi Xe Cứu Hộ Jungle Marshall PAW PATROL', category: "Xe đồ chơi", img: './assets/img/products/s57.jpg', price: 599000, desc: 'Bạn đã sẵn sàng cho những cuộc phiêu lưu.' },
    { title: 'Đồ Chơi Xe Cứu Hộ Jungle Rocky PAW PATROL', category: "Xe đồ chơi", img: './assets/img/products/s58.jpg', price: 599000, desc: 'Xe của Rocky có khả năng biến hình.' },
    { title: 'Đồ Chơi Xe Cứu Hộ Jungle Chase PAW PATROL', category: 'Xe đồ chơi', img: './assets/img/products/s59.jpg', price: 599000, desc: 'Hãy sẵn sàng cho những cuộc phiêu lưu giải cứu.' },
    { title: 'Robot mèo con thông thái VECTO', category: 'Đồ chơi khác', img: './assets/img/products/s60.jpg', price: 499000, desc: 'Đáng yêu và nhí nhảnh, nghịch ngợm và thông thái.' }
];

const seedData = async () => {
    try {
        console.log("♻️ Kết nối database để seed...");
        // Bật force: true để xóa hết data cũ rồi tạo lại từ đầu (cẩn thận khi dùng trên prod)
        await sequelize.sync({ force: true });
        console.log("✅ Đã tạo các bảng (Users, Products, Orders, OrderItems).");

        // 1. Import danh sách sản phẩm
        await Product.bulkCreate(productsData);
        console.log(`✅ Đã thêm ${productsData.length} sản phẩm vào cơ sở dữ liệu.`);

        // 2. Import Admin
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('123456', salt);

        await User.bulkCreate([
            {
                fullname: "Nguyễn Mạnh Dũng",
                phone: "md26022005",
                password: hashedPassword,
                email: 'dungluffy1997@gmail.com',
                userType: 1
            },
            {
                fullname: "Trần Khánh Toàn",
                phone: "0123456789",
                password: hashedPassword,
                email: '',
                userType: 1
            }
        ]);
        console.log("✅ Đã tạo 2 tài khoản quản trị viện (Admin).");

        console.log("🚀 Quá trình Seed Data hoàn tất!");
        process.exit();
    } catch (error) {
        console.error("❌ Lỗi khi seed dữ liệu:", error);
        process.exit(1);
    }
};

seedData();
