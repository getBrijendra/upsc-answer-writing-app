-- Create payment_plans table for credit packages and subscriptions
CREATE TABLE IF NOT EXISTS payment_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  credits INTEGER, -- NULL for subscriptions
  price_inr INTEGER NOT NULL, -- Price in INR (paise)
  plan_type TEXT NOT NULL CHECK (plan_type IN ('one_time', 'monthly', 'yearly')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payments table to track all payment transactions
CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES payment_plans(id),
  razorpay_order_id TEXT UNIQUE,
  razorpay_payment_id TEXT UNIQUE,
  amount INTEGER NOT NULL, -- Amount in paise
  status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subscriptions table for recurring subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES payment_plans(id),
  status TEXT NOT NULL CHECK (status IN ('active', 'cancelled', 'expired')),
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default payment plans
INSERT INTO payment_plans (name, description, credits, price_inr, plan_type) VALUES
  ('Starter Pack', '50 credits for answer reviews and MCQ generation', 50, 9900, 'one_time'),
  ('Standard Pack', '150 credits with 20% bonus', 150, 24900, 'one_time'),
  ('Premium Pack', '300 credits with 30% bonus', 300, 44900, 'one_time'),
  ('Pro Pack', '500 credits with 40% bonus', 500, 69900, 'one_time'),
  ('Monthly Subscription', 'Unlimited answer reviews + 200 credits/month', 200, 49900, 'monthly'),
  ('Yearly Subscription', 'Unlimited answer reviews + 2500 credits/year', 2500, 499900, 'yearly')
ON CONFLICT DO NOTHING;

-- Enable Row Level Security
ALTER TABLE payment_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for payment_plans (public read)
CREATE POLICY "Anyone can view payment plans" ON payment_plans
  FOR SELECT USING (is_active = true);

-- RLS Policies for payments
CREATE POLICY "Users can view their own payments" ON payments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own payments" ON payments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for subscriptions
CREATE POLICY "Users can view their own subscriptions" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscriptions" ON subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Add triggers for updated_at
CREATE TRIGGER update_payment_plans_updated_at BEFORE UPDATE ON payment_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
