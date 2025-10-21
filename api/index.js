// Vercel Serverless Function - Main Entry Point
const express = require('express');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

// Debug: Log environment variables availability
console.log('=== Vercel Environment Variables Check ===');
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
console.log('SESSION_SECRET exists:', !!process.env.SESSION_SECRET);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('All env vars starting with DATABASE:', Object.keys(process.env).filter(k => k.includes('DATABASE')));

// Import routes (database/init-postgres.js will handle DATABASE_URL with fallback)
const authRoutes = require('../routes/auth');
const attendanceRoutes = require('../routes/attendance');
const adminRoutes = require('../routes/admin');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration for Vercel
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
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
