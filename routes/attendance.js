const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const pool = require('../database/init-postgres');

// 出勤
router.post('/clock-in', requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;
    const now = new Date().toISOString();

    const result = await pool.query(
      'INSERT INTO attendance (user_id, clock_in) VALUES ($1, $2) RETURNING id',
      [userId, now]
    );

    res.json({ message: '出勤しました', id: result.rows[0].id });
  } catch (error) {
    res.status(500).json({ error: '出勤記録に失敗しました' });
  }
});

// 退勤
router.post('/clock-out', requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;
    const now = new Date().toISOString();

    const result = await pool.query(
      `UPDATE attendance SET clock_out = $1
       WHERE id = (
         SELECT id FROM attendance
         WHERE user_id = $2 AND clock_out IS NULL
         ORDER BY id DESC LIMIT 1
       ) RETURNING id`,
      [now, userId]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: '出勤記録が見つかりません' });
    }

    res.json({ message: '退勤しました' });
  } catch (error) {
    res.status(500).json({ error: '退勤記録に失敗しました' });
  }
});

// 休憩開始
router.post('/break-start', requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;
    const now = new Date().toISOString();

    const result = await pool.query(
      `UPDATE attendance SET break_start = $1
       WHERE id = (
         SELECT id FROM attendance
         WHERE user_id = $2 AND clock_out IS NULL AND break_start IS NULL
         ORDER BY id DESC LIMIT 1
       ) RETURNING id`,
      [now, userId]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: '出勤記録が見つかりません' });
    }

    res.json({ message: '休憩を開始しました' });
  } catch (error) {
    res.status(500).json({ error: '休憩開始記録に失敗しました' });
  }
});

// 休憩終了
router.post('/break-end', requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;
    const now = new Date().toISOString();

    const result = await pool.query(
      `UPDATE attendance SET break_end = $1
       WHERE id = (
         SELECT id FROM attendance
         WHERE user_id = $2 AND clock_out IS NULL AND break_start IS NOT NULL AND break_end IS NULL
         ORDER BY id DESC LIMIT 1
       ) RETURNING id`,
      [now, userId]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: '休憩中の記録が見つかりません' });
    }

    res.json({ message: '休憩を終了しました' });
  } catch (error) {
    res.status(500).json({ error: '休憩終了記録に失敗しました' });
  }
});

// 現在のステータス
router.get('/status', requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;

    const result = await pool.query(
      'SELECT * FROM attendance WHERE user_id = $1 AND clock_out IS NULL ORDER BY id DESC LIMIT 1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.json({ status: 'none', message: '未出勤' });
    }

    const record = result.rows[0];

    if (record.break_start && !record.break_end) {
      return res.json({ status: 'on_break', message: '休憩中', record });
    }

    if (record.clock_in && !record.clock_out) {
      return res.json({ status: 'working', message: '勤務中', record });
    }

    res.json({ status: 'none', message: '未出勤' });
  } catch (error) {
    res.status(500).json({ error: 'ステータス取得に失敗しました' });
  }
});

// 勤怠記録一覧
router.get('/records', requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;

    const result = await pool.query(
      'SELECT * FROM attendance WHERE user_id = $1 ORDER BY id DESC LIMIT 30',
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: '記録取得に失敗しました' });
  }
});

module.exports = router;
