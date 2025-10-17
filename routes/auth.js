const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../database/init-postgres');

// ユーザー登録
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, full_name } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    // 既存ユーザー数を確認
    const countResult = await pool.query('SELECT COUNT(*) FROM users');
    const userCount = parseInt(countResult.rows[0].count);

    // ユーザーが0人の場合は管理者、それ以外は通常ユーザー
    const role = userCount === 0 ? 'admin' : 'user';

    const result = await pool.query(
      'INSERT INTO users (username, email, password, full_name, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, username, role',
      [username, email, hashedPassword, full_name, role]
    );

    const user = result.rows[0];
    req.session.userId = user.id;
    req.session.username = user.username;
    req.session.role = user.role;

    const message = role === 'admin'
      ? '登録成功！最初のユーザーとして管理者権限が付与されました。'
      : '登録成功';

    res.json({ message, user: { id: user.id, username: user.username, role: user.role } });
  } catch (error) {
    res.status(400).json({ error: 'ユーザー登録に失敗しました: ' + error.message });
  }
});

// ログイン
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'ユーザー名またはパスワードが正しくありません' });
    }

    const user = result.rows[0];
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({ error: 'ユーザー名またはパスワードが正しくありません' });
    }

    req.session.userId = user.id;
    req.session.username = user.username;
    req.session.role = user.role;

    res.json({ message: 'ログイン成功', user: { id: user.id, username: user.username, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: 'ログインに失敗しました' });
  }
});

// ログアウト
router.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ message: 'ログアウトしました' });
});

// 現在のユーザー情報
router.get('/me', (req, res) => {
  if (req.session && req.session.userId) {
    res.json({
      id: req.session.userId,
      username: req.session.username,
      role: req.session.role
    });
  } else {
    res.status(401).json({ error: '未ログイン' });
  }
});

module.exports = router;
