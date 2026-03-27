const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { connectDB } = require('./config/database');

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parses incoming JSON
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
      max-width: 520px;
      width: 100%;
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.08);
      border: 1px solid #e8e8e8;
      overflow: hidden;
    }
    .head {
      background: #b5292f;
      color: #fff;
      padding: 28px 24px;
    }
    .head h1 {
      margin: 0 0 8px;
      font-size: 1.35rem;
      font-weight: 600;
    }
    .head p {
      margin: 0;
      opacity: 0.95;
      font-size: 0.95rem;
    }
    .body {
      padding: 24px;
    }
    .routes {
      margin: 0;
      padding-left: 1.2rem;
      line-height: 1.8;
      font-size: 0.95rem;
    }
    .routes code {
      background: #f5f5f5;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 0.88rem;
    }
    .foot {
      padding: 0 24px 24px;
      font-size: 0.85rem;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="head">
      <h1>MD ToyStore — Backend API</h1>
      <p>Server đang chạy và sẵn sàng phục vụ ứng dụng React.</p>
    </div>
    <div class="body">
      <p style="margin-top:0">Các nhóm endpoint chính:</p>
      <ul class="routes">
        <li><code>/api/auth</code> — Đăng ký, đăng nhập</li>
        <li><code>/api/products</code> — Sản phẩm</li>
        <li><code>/api/orders</code> — Đơn hàng</li>
        <li><code>/api/users</code> — Người dùng (quản trị)</li>
      </ul>
    </div>
    <div class="foot">
      Giao diện này chỉ để kiểm tra nhanh; cửa hàng dùng frontend React với theme giống bản Webbanhang-main.
    </div>
  </div>
</body>
</html>`;

app.get('/', (req, res) => {
  res.type('html').send(apiRootHtml);
});

// Import Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/users', require('./routes/users'));

const PORT = process.env.PORT || 5000;

// Connect DB & Start Server
const startServer = async () => {
  await connectDB();

  // // Sync database (chỉ bật khi muốn tạo bảng theo model)
  // await sequelize.sync({ alter: true });
  // console.log('Database synced');

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

startServer();
