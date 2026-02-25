-- Stripe顧客IDカラムをusersテーブルに追加
-- 実行日時: 2024年（実行時に更新してください）

-- stripe_customer_idカラムを追加（NULL許可、一意性制約なし）
ALTER TABLE users
ADD COLUMN stripe_customer_id VARCHAR(255);

-- インデックスを追加（Stripe顧客IDでの検索を高速化）
CREATE INDEX idx_users_stripe_customer_id ON users(stripe_customer_id);

-- コメントを追加（オプション）
COMMENT ON COLUMN users.stripe_customer_id IS 'Stripe顧客ID（Stripe上で作成された顧客の一意な識別子）';
