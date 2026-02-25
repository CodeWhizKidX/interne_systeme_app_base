# Node.js 公式の軽量版を使用
FROM node:20-slim

# 作業ディレクトリ
WORKDIR /usr/src/app

# package.json と lockファイルをコピーして依存関係インストール
COPY package*.json ./
RUN npm ci

# ★ 追加: prismaフォルダとschema.prismaをコピー (prisma:generateの前に必須)
# ※ prismaフォルダがルートにある場合
COPY prisma ./prisma

# ソースコードと tsconfig をコピー
COPY tsconfig.json ./
COPY src ./src

# TypeScript をビルド
RUN npm run build

# 本番用の不要ファイル削除
RUN npm prune --production

# Cloud Run 用ポート（8080固定）
EXPOSE 8080

# 起動コマンド
CMD ["npm", "start"]
