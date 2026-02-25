# Docker をローカルに入れずに Node.js アプリを Cloud Run にデプロイ したいということですね。

結論から言うと、Cloud Build を使えばローカルに Docker がなくてもデプロイ可能 です。

1. gcloud auth login

1. Cloud Run→Cloud SQL にアクセスさせるにはサービスアカウントに Cloud SQL クライアントを追加する
   　 GUI で自動的に追加されるかと思ったがそうでもなかった。。。手動で必要

1. prisma のフォーマットはこれを使うことでキャメルケースで利用できる
   https://qiita.com/Yamato1923/items/052c4d3303af6b2b4356

1. autoincrement している場合
   SELECT setval(
   pg_get_serial_sequence('prompts', 'id'),
   COALESCE((SELECT MAX(id) FROM prompts), 0) + 1,
   false
   );


DATABASE_URL="postgresql://postgres:XXX@35.197.24.207:5432/promptfukui?schema=uzuz"
