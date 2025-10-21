# Vercel環境変数の設定手順

## データベース接続エラーの修正

Vercelにデプロイした後、データベース接続エラーが発生する場合は、環境変数が設定されていないことが原因です。

---

## 🔧 環境変数の設定手順

### 1. Vercelダッシュボードにアクセス

1. [Vercel Dashboard](https://vercel.com/dashboard) にアクセス
2. プロジェクト `attendance-app` を選択
3. **Settings** タブをクリック

### 2. Environment Variables を設定

1. 左サイドバーから **Environment Variables** を選択
2. 以下の3つの環境変数を追加:

#### DATABASE_URL
```
Name: DATABASE_URL
Value: postgresql://attendance_db_mh0w_user:yY8XVjfZtpZSm8DxLrTI0b1VIj5Vao9g@dpg-d3p4nkruibrs73epej2g-a.singapore-postgres.render.com/attendance_db_mh0w
Environment: Production, Preview, Development (全て選択)
```

#### SESSION_SECRET
```
Name: SESSION_SECRET
Value: 6l0cEulmh0a78fJmVpyznHbiEWYudsXboJATosS2nwM=
Environment: Production, Preview, Development (全て選択)
```

#### NODE_ENV
```
Name: NODE_ENV
Value: production
Environment: Production のみ選択
```

### 3. 再デプロイ

環境変数を設定したら、必ず再デプロイが必要です:

1. **Deployments** タブをクリック
2. 最新のデプロイの右側にある **...** (3点メニュー) をクリック
3. **Redeploy** を選択
4. **Redeploy** ボタンをクリックして確定

---

## 📋 設定完了の確認

### 再デプロイ後の確認手順:

1. デプロイが完了するまで待つ（通常1-2分）
2. Vercelが提供するURLにアクセス（例: `https://attendance-app-xxx.vercel.app`）
3. トップページが正常に表示されることを確認
4. **新規登録** をクリック
5. テストユーザーを作成して登録できるか確認
6. ログインして **ダッシュボード** が表示されるか確認

### 動作確認チェックリスト:

- [ ] トップページが表示される
- [ ] カラフルなデザインが適用されている
- [ ] 新規登録フォームが動作する
- [ ] ユーザー登録が成功する
- [ ] ログインが成功する
- [ ] ダッシュボードにChart.jsグラフが表示される
- [ ] 勤怠記録が登録できる

---

## 🔍 トラブルシューティング

### エラー: `getaddrinfo ENOTFOUND`

**原因**: DATABASE_URL が設定されていない、または間違っている

**解決策**:
1. Vercel Dashboard → Settings → Environment Variables を確認
2. DATABASE_URL が正しく設定されているか確認
3. 値が Render External Database URL と一致しているか確認
4. 再デプロイ

### エラー: `session secret required`

**原因**: SESSION_SECRET が設定されていない

**解決策**:
1. Vercel Dashboard → Settings → Environment Variables を確認
2. SESSION_SECRET を追加
3. 再デプロイ

### ログの確認方法

1. Vercel Dashboard → Deployments
2. 最新のデプロイをクリック
3. **Runtime Logs** タブでエラーログを確認
4. **Build Logs** タブでビルドログを確認

---

## 📚 環境変数の説明

### DATABASE_URL
- **用途**: PostgreSQLデータベース接続文字列
- **形式**: `postgresql://user:password@host:port/database`
- **重要**: Render の **External Database URL** を使用すること（Internal URLは使用不可）

### SESSION_SECRET
- **用途**: Express Sessionの暗号化キー
- **形式**: ランダムな文字列（最低32文字推奨）
- **セキュリティ**: 本番環境では強力なランダム文字列を使用すること

### NODE_ENV
- **用途**: 実行環境の指定
- **値**: `production` (本番環境), `development` (開発環境)
- **影響**: セッションのsecure cookieなどの設定に影響

---

## 🌐 Vercel URLの確認

デプロイが成功したら、以下のURLでアクセスできます:

- **本番URL**: `https://attendance-app.vercel.app` (カスタムドメイン設定時)
- **プレビューURL**: `https://attendance-app-xxx.vercel.app` (自動生成)

---

## ⚠️ 重要な注意事項

1. **環境変数を変更したら必ず再デプロイ**が必要です
2. **DATABASE_URL は必ず External URL** を使用してください
3. **SESSION_SECRET は本番環境では強力な値**に変更してください
4. 環境変数には**機密情報が含まれる**ため、公開リポジトリにコミットしないでください

---

## 📞 サポート

問題が解決しない場合:

1. **Vercel Runtime Logs** を確認
2. **Render Database** が稼働中か確認
3. **DATABASE_URL** の接続テスト:
   ```bash
   psql "postgresql://attendance_db_mh0w_user:yY8XVjfZtpZSm8DxLrTI0b1VIj5Vao9g@dpg-d3p4nkruibrs73epej2g-a.singapore-postgres.render.com/attendance_db_mh0w"
   ```
