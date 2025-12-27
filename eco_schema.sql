-- ECO CREDIT SYSTEM TABLES

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Main users table
CREATE TABLE IF NOT EXISTS eco_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    carbon_score INTEGER DEFAULT 0,
    eco_credits INTEGER DEFAULT 0,
    badge VARCHAR(50) DEFAULT 'Bronze',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Logs for footprint history
CREATE TABLE IF NOT EXISTS eco_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES eco_users(id) ON DELETE CASCADE,
    date DATE DEFAULT CURRENT_DATE,
    footprint JSONB, -- Stores detailed calculation (travel, electricity, diet, plastic, AC)
    score INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Wallet for balance and transactions
CREATE TABLE IF NOT EXISTS eco_wallet (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES eco_users(id) ON DELETE CASCADE,
    balance INTEGER DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Rewards definition (predefined actions)
CREATE TABLE IF NOT EXISTS eco_rewards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action VARCHAR(255) NOT NULL,
    credits INTEGER NOT NULL,
    description TEXT
);

-- Seed some rewards
INSERT INTO eco_rewards (action, credits, description) VALUES
('Carpooling to work', 20, 'Shared a ride with colleagues'),
('Used reusable bags', 5, 'Ditched single-use plastic'),
('Switched to LED bulbs', 30, 'Installed energy-efficient lighting'),
('Composting waste', 15, 'Recycled organic waste at home'),
('Planting a tree', 50, 'Added green cover to the planet');

-- Create a simulation user if none exists
INSERT INTO eco_users (name, carbon_score, eco_credits, badge)
VALUES ('Eco Warrior', 0, 0, 'Bronze')
ON CONFLICT DO NOTHING;

-- Link simulation user to wallet
INSERT INTO eco_wallet (user_id, balance)
SELECT id, 0 FROM eco_users WHERE name = 'Eco Warrior'
ON CONFLICT DO NOTHING;
