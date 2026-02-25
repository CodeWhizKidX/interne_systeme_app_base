# prompt

## 環境構築

- node バージョン：20.19.5
- java version "22" 2024-03-19

## tailwind の導入方法（つまづいた。。）

https://zenn.dev/mishima3141/articles/65668245241953

## GCP デプロイ方法

https://zenn.dev/collabostyle/articles/29126921a59a59

↓GPT から。「GET https://storage.googleapis.com/assets/index-Dg3YartA.js net::ERR_ABORTED 404 (Not Found)」⇐ このように存在しないパスを指定することになる
// https://vite.dev/config/
export default defineConfig({
plugins: [react(), tailwindcss()],
base: "./", // ← 相対パスに変更
});

↓ForeStore になるかも
https://www.takatechskill.com/archives/542

npm install -g firebase-tools
firebase login
firebase init
firebase deploy

↓ 別のアカウントで再ログインしてプロジェクト init しようとするとキャッシュが残っていてエラーになるので以下の対応が必要
✅ ステップ 2：グローバル Firebase CLI の設定キャッシュを削除

Firebase CLI はユーザー単位で設定キャッシュを保存しています。
以下のフォルダを削除またはリネームしてください：

C:\Users\tatsu\.config\configstore\firebase-tools.json
