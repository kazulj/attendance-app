const { Pool } = require('pg');

// HARDCODED DATABASE_URL - Temporary solution to bypass environment variable issues
const DATABASE_URL = 'postgresql://attendance_db_mh0w_user:yY8XVjfZtpZSm8DxLrTI0b1VIj5Vao9g@dpg-d3p4nkruibrs73epej2g-a.singapore-postgres.render.com/attendance_db_mh0w';

console.log('Database connection initialized');
console.log('Database host:', DATABASE_URL.split('@')[1]?.split('/')[0]);

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// テーブルを作成
const initDatabase = async () => {
  try {
    // ユーザーテーブル
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        full_name VARCHAR(100) NOT NULL,
        role VARCHAR(20) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 勤怠記録テーブル
    await pool.query(`
      CREATE TABLE IF NOT EXISTS attendance (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        clock_in TIMESTAMP,
        clock_out TIMESTAMP,
        break_start TIMESTAMP,
        break_end TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    console.log('Database tables created successfully');
  } catch (error) {
    console.error('Error creating database tables:', error);
  }
};

// アプリ起動時にテーブルを作成
initDatabase();

module.exports = pool;
