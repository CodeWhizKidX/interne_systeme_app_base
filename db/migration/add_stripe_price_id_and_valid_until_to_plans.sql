-- Stripe Price IDカラムをplansテーブルに追加
-- 実行日時: 2024年（実行時に更新してください）

-- Stripe Price IDカラムを追加
ALTER TABLE plans
ADD COLUMN stripe_price_id VARCHAR(255);

-- インデックスを追加
CREATE INDEX idx_plans_stripe_price_id ON plans(stripe_price_id);

-- コメントを追加
COMMENT ON COLUMN plans.stripe_price_id IS 'StripeのPrice ID';
