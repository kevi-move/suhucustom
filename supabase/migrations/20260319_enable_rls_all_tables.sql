-- Enable RLS on all public tables that were missing it
-- These tables are not actively used by the app, so we lock them down to authenticated only.

-- analytics_snapshots
ALTER TABLE IF EXISTS public.analytics_snapshots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated only" ON public.analytics_snapshots
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- audiences
ALTER TABLE IF EXISTS public.audiences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated only" ON public.audiences
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- categories
ALTER TABLE IF EXISTS public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON public.categories
  FOR SELECT USING (true);
CREATE POLICY "Authenticated write" ON public.categories
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- content_types
ALTER TABLE IF EXISTS public.content_types ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated only" ON public.content_types
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- image_styles
ALTER TABLE IF EXISTS public.image_styles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated only" ON public.image_styles
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- integrations
ALTER TABLE IF EXISTS public.integrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated only" ON public.integrations
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- keywords
ALTER TABLE IF EXISTS public.keywords ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated only" ON public.keywords
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- seo_settings
ALTER TABLE IF EXISTS public.seo_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON public.seo_settings
  FOR SELECT USING (true);
CREATE POLICY "Authenticated write" ON public.seo_settings
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- optimization_analyses
ALTER TABLE IF EXISTS public.optimization_analyses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated only" ON public.optimization_analyses
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- review_prompts
ALTER TABLE IF EXISTS public.review_prompts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated only" ON public.review_prompts
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- writing_styles
ALTER TABLE IF EXISTS public.writing_styles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated only" ON public.writing_styles
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- content_suggestions
ALTER TABLE IF EXISTS public.content_suggestions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated only" ON public.content_suggestions
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- oauth_states (sensitive - restrict tightly)
ALTER TABLE IF EXISTS public.oauth_states ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated only" ON public.oauth_states
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- articles
ALTER TABLE IF EXISTS public.articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read published" ON public.articles
  FOR SELECT USING (true);
CREATE POLICY "Authenticated write" ON public.articles
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Fix users table: remove overly permissive public policies, restrict to authenticated
DROP POLICY IF EXISTS "Allow public read" ON public.users;
DROP POLICY IF EXISTS "Allow public insert" ON public.users;
DROP POLICY IF EXISTS "Allow public update" ON public.users;
DROP POLICY IF EXISTS "Allow public delete" ON public.users;

CREATE POLICY "Authenticated read" ON public.users
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated insert" ON public.users
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated update" ON public.users
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated delete" ON public.users
  FOR DELETE TO authenticated USING (true);
