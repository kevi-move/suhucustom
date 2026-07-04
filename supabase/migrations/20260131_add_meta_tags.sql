-- Add meta fields to blog_posts table
ALTER TABLE blog_posts
ADD COLUMN IF NOT EXISTS meta_title TEXT,
ADD COLUMN IF NOT EXISTS meta_description TEXT;

-- Create page_meta table for static page SEO settings
CREATE TABLE IF NOT EXISTS page_meta (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_slug TEXT UNIQUE NOT NULL,
  meta_title TEXT NOT NULL DEFAULT '',
  meta_description TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on page_slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_page_meta_slug ON page_meta(page_slug);

-- Enable RLS on page_meta
ALTER TABLE page_meta ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read page_meta
CREATE POLICY "Anyone can read page_meta" ON page_meta
  FOR SELECT USING (true);

-- Policy: Only authenticated users can modify page_meta
CREATE POLICY "Authenticated users can insert page_meta" ON page_meta
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update page_meta" ON page_meta
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete page_meta" ON page_meta
  FOR DELETE USING (auth.role() = 'authenticated');

-- =============================================
-- Admin Users Table
-- =============================================

-- Create admin_users table to track admin emails
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);

-- Enable RLS on admin_users
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can check if an email is admin (needed for auth check)
CREATE POLICY "Anyone can read admin_users" ON admin_users
  FOR SELECT USING (true);

-- Policy: Only existing admins can add new admins
-- Note: For the first admin, you'll need to insert directly via Supabase dashboard
CREATE POLICY "Only admins can insert admin_users" ON admin_users
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE email = current_setting('request.jwt.claims', true)::json->>'email')
  );

CREATE POLICY "Only admins can delete admin_users" ON admin_users
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM admin_users WHERE email = current_setting('request.jwt.claims', true)::json->>'email')
  );
