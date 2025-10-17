// 認証が必要なルートを保護
function requireAuth(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  }
  return res.status(401).json({ error: 'ログインが必要です' });
}

// 管理者権限が必要なルートを保護
function requireAdmin(req, res, next) {
  if (req.session && req.session.userId && req.session.role === 'admin') {
    return next();
  }
  return res.status(403).json({ error: '管理者権限が必要です' });
}

module.exports = { requireAuth, requireAdmin };
