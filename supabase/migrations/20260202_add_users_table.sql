-- Users table for user management
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  display_name VARCHAR(255),
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'super_admin')),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login_at TIMESTAMP WITH TIME ZONE
);

-- Index for email lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Index for role filtering
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- RLS Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Allow public read access (for auth checks)
CREATE POLICY "Allow public read" ON users FOR SELECT USING (true);

-- Allow public insert (for user sync from Firebase)
CREATE POLICY "Allow public insert" ON users FOR INSERT WITH CHECK (true);

-- Allow public update (for admin management)
CREATE POLICY "Allow public update" ON users FOR UPDATE USING (true);

-- Allow public delete (for admin management)
CREATE POLICY "Allow public delete" ON users FOR DELETE USING (true);
