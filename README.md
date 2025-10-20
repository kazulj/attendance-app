# 勤怠管理アプリ

Node.js + Express + PostgreSQLを使用した勤怠管理Webアプリケーション

## 機能

- ユーザー認証（ログイン/登録）
- 出勤/退勤/休憩の記録
- ダッシュボード（Chart.js統計グラフ）
- 管理者画面（ユーザー管理/勤怠記録閲覧）
- カラフルなUI（16色パレット、20+グラデーション）
- ダークモード対応
- レスポンシブデザイン

## Vercelデプロイ手順

### 1. GitHubリポジトリの準備

このリポジトリをGitHubにプッシュ済みであることを確認

### 2. Vercelプロジェクトの作成

1. [Vercel](https://vercel.com/) にアクセス
2. "New Project" をクリック
3. GitHubリポジトリを選択: `kazulj/attendance-app`
4. プロジェクト設定:
   - Framework Preset: `Other`
   - Root Directory: `./`
   - Build Command: (空欄)
   - Output Directory: `public`
   - Install Command: `npm install`

### 3. 環境変数の設定

Vercelプロジェクトの "Settings" → "Environment Variables" で以下を設定:

```
DATABASE_URL=postgresql://user:password@host:5432/database
SESSION_SECRET=your-random-secret-key-here
NODE_ENV=production
```

**PostgreSQLデータベース:**
- Vercel Postgres、Supabase、Neon などの無料PostgreSQLサービスを使用
- 推奨: [Neon](https://neon.tech/) (無料、簡単セットアップ)

### 4. デプロイ

"Deploy" ボタンをクリックしてデプロイ開始

### 5. データベースの初期化

デプロイ後、PostgreSQLデータベースに以下のテーブルを作成:

```sql
-- database/init-postgres.js の内容を実行
CREATE TABLE users (...)
CREATE TABLE attendance (...)
CREATE TABLE session (...)
```

## ローカル開発

```bash
# 依存関係のインストール
npm install

# 環境変数の設定
cp .env.example .env
# .env を編集してDATABASE_URLとSESSION_SECRETを設定

# サーバー起動
npm start

# 開発モード（自動リロード）
npm run dev
```

アプリケーションは http://localhost:3000 で起動します

## 技術スタック

- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **Authentication**: express-session, bcrypt
- **Frontend**: Vanilla JavaScript, Chart.js
- **Styling**: Custom CSS (16-color palette, gradients)
- **Deployment**: Vercel

## ライセンス

MIT
