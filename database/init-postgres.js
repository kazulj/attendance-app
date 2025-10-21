const { Pool } = require('pg');

// Ensure DATABASE_URL is available
if (!process.env.DATABASE_URL) {
  console.error('CRITICAL ERROR: DATABASE_URL environment variable is not set!');
  console.error('Available env vars:', Object.keys(process.env).filter(k => k.includes('DATA') || k.includes('DB')));
  throw new Error('DATABASE_URL is required but not found in environment variables');
}

console.log('Database connection string detected:', process.env.DATABASE_URL ? 'Yes' : 'No');
console.log('Database host:', process.env.DATABASE_URL?.split('@')[1]?.split('/')[0] || 'unknown');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('render.com')
    ? { rejectUnauthorized: false }
    : (process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false)
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
