const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { connectDB } = require('./config/database');

// Load tất cả models + associations
require('./models');

const app = express();

// Middleware
app.use(cors({
  origin: true,                     // cho phép mọi origin (dev)
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const apiRootHtml = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>MD ToyStore API</title>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      font-family: "Segoe UI", system-ui, sans-serif;
      background: linear-gradient(145deg, #fafafa 0%, #f0f0f0 50%, #fff 100%);
      color: #1a1a1a;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    .card {
      max-width: 560px;
      width: 100%;
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.08);
      border: 1px solid #e8e8e8;
      overflow: hidden;
    }
    .head { background: #b5292f; color: #fff; padding: 28px 24px; }
    .head h1 { margin: 0 0 8px; font-size: 1.35rem; font-weight: 600; }
    .head p  { margin: 0; opacity: 0.9; font-size: 0.95rem; }
    .body { padding: 24px; }
    .routes { margin: 0; padding-left: 1.2rem; line-height: 1.9; font-size: 0.93rem; }
    .routes code { background: #f5f5f5; padding: 2px 8px; border-radius: 4px; font-size: 0.85rem; }
    .badge { display:inline-block; font-size:0.72rem; padding:1px 6px; border-radius:3px; margin-left:6px; vertical-align:middle; }
    .admin { background:#ffeaea; color:#b5292f; }
    .foot { padding: 0 24px 24px; font-size: 0.82rem; color: #888; }
  </style>
</head>
<body>
  <div class="card">
    <div class="head">
      <h1>MD ToyStore — Backend API</h1>
      <p>Server đang chạy và sẵn sàng phục vụ ứng dụng React.</p>
    </div>
    <div class="body">
      <p style="margin-top:0">Các nhóm endpoint:</p>
      <ul class="routes">
        <li><code>/api/auth</code> — Đăng ký, đăng nhập, xem profile</li>
        <li><code>/api/products</code> — Sản phẩm</li>
        <li><code>/api/categories</code> — Danh mục sản phẩm</li>
        <li><code>/api/orders</code> — Đơn hàng bán</li>
        <li><code>/api/users</code> — Người dùng <span class="badge admin">Admin</span></li>
        <li><code>/api/suppliers</code> — Nhà cung cấp <span class="badge admin">Admin</span></li>
        <li><code>/api/imports</code> — Phiếu nhập hàng <span class="badge admin">Admin</span></li>
        <li><code>/api/reviews</code> — Đánh giá sản phẩm</li>
        <li><code>/api/coupons</code> — Mã khuyến mãi</li>
      </ul>
    </div>
    <div class="foot">MD ToyStore – Backend v2.0 (Schema tiếng Việt)</div>
  </div>
</body>
</html>`;

app.get('/', (req, res) => res.type('html').send(apiRootHtml));

// ── Routes ────────────────────────────────────────────────────
app.use('/api/auth',       require('./routes/auth'));
app.use('/api/products',   require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/orders',     require('./routes/orders'));
app.use('/api/users',      require('./routes/users'));
app.use('/api/suppliers',  require('./routes/suppliers'));
app.use('/api/imports',    require('./routes/imports'));
app.use('/api/reviews',    require('./routes/reviews'));
app.use('/api/coupons',    require('./routes/coupons'));

// 404 handler
app.use((req, res) => res.status(404).json({ message: `Route ${req.path} không tồn tại` }));

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
  });
};

startServer();
