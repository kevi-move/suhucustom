-- Restrict users table writes to active admins (reads remain public for auth checks)
-- Also align older `users` tables that may be missing columns from 20260202 migration.

ALTER TABLE public.users ADD COLUMN IF NOT EXISTS display_name VARCHAR(255);
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ;

DROP POLICY IF EXISTS "Allow public insert" ON public.users;
DROP POLICY IF EXISTS "Allow public update" ON public.users;
DROP POLICY IF EXISTS "Allow public delete" ON public.users;
DROP POLICY IF EXISTS "Authenticated insert" ON public.users;
DROP POLICY IF EXISTS "Authenticated update" ON public.users;
DROP POLICY IF EXISTS "Authenticated delete" ON public.users;

CREATE POLICY "Admin insert users" ON public.users
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.email = lower(auth.jwt() ->> 'email')
        AND u.role IN ('admin', 'super_admin')
        AND u.status = 'active'
    )
  );

CREATE POLICY "Admin update users" ON public.users
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.email = lower(auth.jwt() ->> 'email')
        AND u.role IN ('admin', 'super_admin')
        AND u.status = 'active'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.email = lower(auth.jwt() ->> 'email')
        AND u.role IN ('admin', 'super_admin')
        AND u.status = 'active'
    )
  );

CREATE POLICY "Admin delete users" ON public.users
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.email = lower(auth.jwt() ->> 'email')
        AND u.role IN ('admin', 'super_admin')
        AND u.status = 'active'
    )
  );

-- Older Supabase projects may have `id` without a default; fix before seeding.
ALTER TABLE public.users ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Seed first admin (safe to re-run). Explicit id for tables missing column default.
INSERT INTO public.users (id, email, role, status, display_name)
VALUES (gen_random_uuid(), 'suhujing3@gmail.com', 'super_admin', 'active', 'Site Admin')
ON CONFLICT (email) DO UPDATE
  SET
    role = 'super_admin',
    status = 'active',
    display_name = COALESCE(public.users.display_name, 'Site Admin'),
    updated_at = NOW();
