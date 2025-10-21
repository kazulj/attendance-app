// Vercel Serverless Function - Main Entry Point
const express = require('express');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const { Pool } = require('pg');
const path = require('path');
require('dotenv').config();

// Database pool for session store
const DATABASE_URL = 'postgresql://attendance_db_mh0w_user:yY8XVjfZtpZSm8DxLrTI0b1VIj5Vao9g@dpg-d3p4nkruibrs73epej2g-a.singapore-postgres.render.com/attendance_db_mh0w';
const sessionPool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Import routes
const authRoutes = require('../routes/auth');
const attendanceRoutes = require('../routes/attendance');
const adminRoutes = require('../routes/admin');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration with PostgreSQL store for Vercel
app.use(session({
  store: new pgSession({
    pool: sessionPool,
    tableName: 'session',
    createTableIfMissing: true
  }),
  secret: process.env.SESSION_SECRET || '6l0cEulmh0a78fJmVpyznHbiEWYudsXboJATosS2nwM=',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to false to work with both HTTP and HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: 'lax'
  }
}));

// Static files
app.use(express.static(path.join(__dirname, '../public')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/admin', adminRoutes);

// Serve HTML files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'dashboard.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'admin.html'));
});

module.exports = app;
