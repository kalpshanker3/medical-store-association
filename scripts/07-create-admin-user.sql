-- Create Admin User with password: Kiddo#17
-- This script creates the admin user with the bcrypt hash for password 'Kiddo#17'

-- First, ensure the users table has the required columns
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';
ALTER TABLE users ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';

-- Insert admin user with bcrypt hash for 'Kiddo#17'
-- Hash generated with bcrypt (cost 10): $2b$10$t16B2q0So9HK3X.iXRxXOuNZaAKtYTafqFo8njDPcebVjO7Ai8T.6
INSERT INTO users (
  name,
  phone,
  password_hash,
  role,
  status,
  created_at,
  updated_at
) VALUES (
  'Kalp',
  '9936460026',
  '$2b$10$t16B2q0So9HK3X.iXRxXOuNZaAKtYTafqFo8njDPcebVjO7Ai8T.6',
  'admin',
  'active',
  NOW(),
  NOW()
) ON CONFLICT (phone) DO UPDATE SET
  name = EXCLUDED.name,
  password_hash = EXCLUDED.password_hash,
  role = EXCLUDED.role,
  status = EXCLUDED.status,
  updated_at = NOW();

-- Verify admin user was created
SELECT 
  id,
  name,
  phone,
  role,
  status,
  created_at
FROM users 
WHERE phone = '9936460026' 
AND role = 'admin'; 