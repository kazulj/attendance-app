const { Pool } = require('pg');

// TEMPORARY: Fallback DATABASE_URL for testing Vercel environment variable issues
const FALLBACK_DATABASE_URL = 'postgresql://attendance_db_mh0w_user:yY8XVjfZtpZSm8DxLrTI0b1VIj5Vao9g@dpg-d3p4nkruibrs73epej2g-a.singapore-postgres.render.com/attendance_db_mh0w';

console.log('=== Database Connection Debug ===');
console.log('DATABASE_URL from process.env:', process.env.DATABASE_URL ? 'EXISTS' : 'UNDEFINED');
console.log('All env vars with DATABASE:', Object.keys(process.env).filter(k => k.includes('DATABASE')));
console.log('All env vars with DB:', Object.keys(process.env).filter(k => k.includes('DB')));
console.log('Total env vars count:', Object.keys(process.env).length);

// Use environment variable if available, otherwise fallback
const databaseUrl = process.env.DATABASE_URL || FALLBACK_DATABASE_URL;

if (!process.env.DATABASE_URL) {
  console.warn('WARNING: DATABASE_URL not found in environment, using fallback URL');
  console.warn('This should not happen in production!');
  console.warn('Please check Vercel Dashboard -> Settings -> Environment Variables');
} else {
  console.log('SUCCESS: DATABASE_URL loaded from environment');
}

console.log('Database host:', databaseUrl.split('@')[1]?.split('/')[0] || 'unknown');

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: databaseUrl.includes('render.com')
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
