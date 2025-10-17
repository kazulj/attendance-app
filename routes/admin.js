const express = require('express');
const router = express.Router();
const { requireAuth, requireAdmin } = require('../middleware/auth');
const pool = require('../database/init-postgres');

// 全ユーザー一覧
router.get('/users', requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, username, email, full_name, role, created_at FROM users ORDER BY id DESC'
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'ユーザー一覧の取得に失敗しました' });
  }
});

// 全勤怠記録
router.get('/attendance', requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT a.*, u.username, u.full_name
      FROM attendance a
      JOIN users u ON a.user_id = u.id
      ORDER BY a.id DESC
      LIMIT 100
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: '勤怠記録の取得に失敗しました' });
  }
});

// 特定ユーザーの勤怠記録
router.get('/users/:userId/attendance', requireAdmin, async (req, res) => {
  try {
    const userId = req.params.userId;
    const result = await pool.query(
      'SELECT * FROM attendance WHERE user_id = $1 ORDER BY id DESC',
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: '勤怠記録の取得に失敗しました' });
  }
});

// ユーザーを管理者に昇格
router.post('/users/:userId/promote', requireAdmin, async (req, res) => {
  try {
    const userId = req.params.userId;
    const result = await pool.query(
      'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, username, role',
      ['admin', userId]
    );
    res.json({ message: 'ユーザーを管理者に昇格しました', user: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: '昇格に失敗しました' });
  }
});

module.exports = router;
