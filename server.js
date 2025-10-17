const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');

// 環境変数の読み込み
require('dotenv').config();

const authRoutes = require('./routes/auth');
const attendanceRoutes = require('./routes/attendance');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;

// Renderなどのリバースプロキシを信頼
app.set('trust proxy', 1);

// セッションストアの設定
let sessionStore;
if (process.env.DATABASE_URL) {
  // 本番環境: PostgreSQLセッションストア
  const pgSession = require('connect-pg-simple')(session);
  const { Pool } = require('pg');

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  sessionStore = new pgSession({
    pool: pool,
    tableName: 'session',
    createTableIfMissing: true
  });
} else {
  // 開発環境: メモリストア
  sessionStore = undefined;
}

// ミドルウェア
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  store: sessionStore,
  secret: process.env.SESSION_SECRET || 'attendance-app-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24時間
    sameSite: 'lax'
  }
}));

app.use(express.static('public'));

// ルート
app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/admin', adminRoutes);

// メインページ
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ダッシュボードページ
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// 管理者ページ
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`勤怠管理アプリがポート${PORT}で起動しました`);
  console.log(`環境: ${process.env.NODE_ENV || 'development'}`);
});
