# Google Cloud Console 設定ガイド

## OAuth 2.0 Client IDの作成と設定

### 1. OAuth 2.0 Client IDの作成

1. [Google Cloud Console](https://console.cloud.google.com/)にアクセス
2. プロジェクトを選択（または新規作成）
3. **APIとサービス** > **認証情報** に移動
4. **認証情報を作成** > **OAuth クライアント ID** を選択
5. **アプリケーションの種類**: **ウェブアプリケーション** を選択
6. **名前**を入力（例: "システム名 Web Client"）

### 2. 承認済みのJavaScript生成元（重要！）

⚠️ **これが最も重要なセキュリティ設定です**

許可されたドメインのみを追加してください：

```
https://your-production-domain.com
https://www.your-production-domain.com
http://localhost:5173  (開発環境のみ)
```

**絶対にやってはいけないこと**:
- ❌ ワイルドカード（`*`）を使用する
- ❌ 不特定多数のドメインを追加する
- ❌ 本番環境のドメインを開発環境に追加する（逆も同様）

### 3. 承認済みのリダイレクトURI

Google Identity Servicesを使用する場合、通常はリダイレクトURIは不要ですが、
念のため設定しておくことを推奨します：

```
https://your-production-domain.com/callback
http://localhost:5173/callback  (開発環境のみ)
```

### 4. Client IDの取得

設定完了後、**Client ID**が表示されます。これを環境変数に設定してください：

**バックエンド**:
```env
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
```

**フロントエンド**:
```env
VITE_GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
```

## セキュリティチェックリスト

設定後、以下を確認してください：

- [ ] 承認済みのJavaScript生成元に、本番環境のドメインのみが設定されている
- [ ] 開発環境のドメイン（localhost）は開発時のみ使用
- [ ] ワイルドカード（`*`）が使用されていない
- [ ] Client IDが環境変数に正しく設定されている
- [ ] `ALLOWED_ORGANIZATION_DOMAINS`が正しく設定されている

## よくある質問

### Q: Client IDが漏洩しても大丈夫？

**A: はい、大丈夫です。** ただし、以下の条件を満たしている必要があります：

1. **承認済みのJavaScript生成元**が厳密に設定されている
2. **ALLOWED_ORGANIZATION_DOMAINS**が設定されている
3. **CORS設定**で許可されたオリジンのみを許可している

これらの設定により、許可されていないドメインからはClient IDを使用できません。

### Q: 複数の環境（開発・ステージング・本番）で同じClient IDを使ってもいい？

**A: 推奨しません。** 各環境で別々のClient IDを作成することを推奨します。

理由：
- 環境ごとに異なるドメインを設定できる
- 一つの環境で問題が発生しても、他の環境に影響しない
- セキュリティ監査が容易

### Q: Client Secretは必要？

**A: 現在の実装では不要です。**

IDトークンベースの認証を使用しているため、Client Secretは不要です。
Client Secretが必要なのは、Authorization Code Flowでアクセストークンを交換する場合のみです。
