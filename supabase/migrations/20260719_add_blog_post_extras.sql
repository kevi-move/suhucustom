-- AI Summary, Key Points, and FAQ structured fields for blog posts
ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS ai_summary TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS key_points JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS faqs JSONB NOT NULL DEFAULT '[]'::jsonb;

COMMENT ON COLUMN public.blog_posts.ai_summary IS 'AI-generated article overview shown at top of post';
COMMENT ON COLUMN public.blog_posts.key_points IS 'Array of key point strings for AI Summary tabs';
COMMENT ON COLUMN public.blog_posts.faqs IS 'Array of {question, answer} objects for FAQ accordion + schema';
