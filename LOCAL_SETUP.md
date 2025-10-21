# ローカル開発環境セットアップ手順

## 📋 前提条件

- Node.js 18.x 以上がインストールされていること
- PostgreSQL がインストールされていること
- Git がインストールされていること

---

## 🚀 セットアップ手順

### 1. 依存関係のインストール

```bash
npm install
```

### 2. PostgreSQLデータベースの準備

#### PostgreSQLのインストール（WSL2/Ubuntuの場合）

```bash
# PostgreSQLのインストール
sudo apt update
sudo apt install postgresql postgresql-contrib

# PostgreSQLサービスの起動
sudo service postgresql start

# PostgreSQLユーザーでログイン
sudo -u postgres psql
```

#### データベースとユーザーの作成

PostgreSQLにログイン後、以下を実行:

```sql
-- データベース作成
CREATE DATABASE attendance_app;

-- ユーザー作成（パスワード: postgres）
CREATE USER postgres WITH PASSWORD 'postgres';

-- 権限付与
GRANT ALL PRIVILEGES ON DATABASE attendance_app TO postgres;

-- 終了
\q
```

#### テーブルの作成

```bash
# データベースに接続
psql -U postgres -d attendance_app

# または環境変数を使用
export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/attendance_app"
```

以下のSQLを実行してテーブルを作成:

```sql
-- usersテーブル
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- attendanceテーブル
CREATE TABLE attendance (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  clock_in TIMESTAMP,
  clock_out TIMESTAMP,
  break_start TIMESTAMP,
  break_end TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- sessionテーブル
CREATE TABLE session (
  sid VARCHAR NOT NULL PRIMARY KEY,
  sess JSON NOT NULL,
  expire TIMESTAMP(6) NOT NULL
);

CREATE INDEX IDX_session_expire ON session (expire);

-- 終了
\q
```

### 3. 環境変数の設定

`.env`ファイルが作成済みです。必要に応じて編集:

```bash
# .envファイルの内容
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/attendance_app
SESSION_SECRET=local-development-secret-key-change-in-production
NODE_ENV=development
PORT=3000
```

### 4. アプリケーションの起動

```bash
# 通常起動
npm start

# または開発モード（自動リロード）
npm run dev
```

### 5. ブラウザでアクセス

```
http://localhost:3000
```

---

## 📊 動作確認

1. **トップページ**: カラフルなデザインが表示される
2. **新規登録**: ユーザーアカウントを作成
3. **ログイン**: 作成したアカウントでログイン
4. **ダッシュボード**: 勤怠記録、Chart.jsグラフが表示される
5. **管理者**: 最初のユーザーを管理者に昇格する場合:

```sql
-- PostgreSQLで実行
UPDATE users SET role = 'admin' WHERE id = 1;
```

---

## 🔧 トラブルシューティング

### PostgreSQLが起動しない

```bash
# WSL2の場合
sudo service postgresql start

# ステータス確認
sudo service postgresql status
```

### データベース接続エラー

```bash
# PostgreSQLが起動しているか確認
sudo service postgresql status

# データベースが存在するか確認
psql -U postgres -l

# 接続テスト
psql -U postgres -d attendance_app
```

### ポート3000が使用中

```bash
# ポートを使用しているプロセスを確認
lsof -ti:3000

# プロセスを終了
kill -9 $(lsof -ti:3000)

# または別のポートを使用
PORT=3001 npm start
```

### node_modulesの再インストール

```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 🎨 含まれる機能

- ✅ 16色カラーパレット
- ✅ 20+グラデーション
- ✅ カラフルなKPIカード（Indigo, Cyan, Purple, Orange）
- ✅ レインボーChart.jsグラフ
- ✅ ダークモードのネオングロー
- ✅ カラフルなサイドバーアイコン
- ✅ レスポンシブデザイン
- ✅ キーボードショートカット（Ctrl+K: コマンドパレット）
- ✅ 通知センター
- ✅ パスワード強度メーター

---

## 📝 開発用コマンド

```bash
# 通常起動
npm start

# 開発モード（nodemon使用）
npm run dev

# 依存関係の確認
npm list

# PostgreSQL接続テスト
psql $DATABASE_URL
```

---

## 🌐 本番環境デプロイ

- **Vercel**: `README.md` を参照
- **Render**: 環境変数に `DATABASE_URL` と `SESSION_SECRET` を設定

---

## 📚 関連ファイル

- `server.js` - メインサーバーファイル
- `api/index.js` - Vercel Serverless Function
- `routes/` - APIルート定義
- `database/` - データベース初期化スクリプト
- `public/` - 静的ファイル（HTML/CSS/JS）
- `.env` - 環境変数（Gitに含めない）
- `.env.example` - 環境変数のサンプル
