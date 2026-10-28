# Suhu Custom — Production Deploy Checklist

## 1. Supabase database

Run all SQL files in `supabase/migrations/` **in filename order** via Supabase Dashboard → SQL Editor.

Or paste the combined script if you maintain one. Required tables: `users`, `blog_posts`, `categories`, `authors`, `inquiries`, `page_content`, `page_meta`, storage bucket `cms`.

After migrations, confirm the first admin exists:

```sql
SELECT email, role, status FROM users WHERE role IN ('admin', 'super_admin');
```

Default seed: `suhujing3@gmail.com` as `super_admin`.

## 2. Environment variables (Vercel / hosting)

Copy `.env.local.example` → production env. **Required:**

| Variable | Notes |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only; inquiries + uploads |
| `NEXT_PUBLIC_SITE_URL` | `https://www.suhucustom.com` (or apex). Used by sitemap/robots absolute URLs |
| `NOTIFY_TO_EMAIL` | Inquiry notification inbox |
| `RESEND_API_KEY` | Email delivery |
| `INQUIRY_FROM_EMAIL` | Verified domain sender |

**Optional:**

| Variable | Notes |
|----------|-------|
| `GEMINI_API_KEY` | Free auto-translation (preferred) — https://aistudio.google.com/app/apikey |
| `DEEPL_API_KEY` | Optional translation fallback |
| `WECOM_WEBHOOK_URL` | WeCom group webhook for instant inquiry alerts |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | E.164 digits, e.g. `8613800138000` |
| `NEXT_PUBLIC_ADMIN_LOCAL_GATE` | Use username/password gate instead of Supabase auth |

**Never enable in production:**

- `NEXT_PUBLIC_ADMIN_BYPASS=true`

## 3. Supabase Auth settings

Add redirect URLs:

- `https://yourdomain.com/auth/callback`
- `http://localhost:3000/auth/callback` (dev)

Disable public sign-up in Supabase Dashboard → Authentication → Providers if you rely on Google/email invite only.

## 4. Resend email

1. Verify your domain in Resend
2. Set `INQUIRY_FROM_EMAIL=Suhu Custom <no-reply@yourdomain.com>`
3. Submit a test inquiry on `/contact-us`

## 5. Deploy

```bash
npm run build
npm run start
```

Recommended: Vercel with Node 20+, root directory `apex-main/figma-ref/suhucustom`.

## 6. SEO host redirects (required for Google indexing)

Canonical form: `https://www.suhucustom.com` + trailing slash (e.g. `/blog/slug/`).

App middleware already does apex → www + trailing slash in **one** 301. Vercel’s domain-level “Redirect to www” adds a second hop with a `Refresh: 0` header, which Google reports as soft/auto redirects.

**Vercel `.vercel.app` alias:** keep `suhucustom.vercel.app` off Google. Production middleware 301s `*.vercel.app` to `www`. In team Domains, do not mark the `.vercel.app` alias as a second Production site if you can avoid it.

**In Vercel → team sidebar → Domains:**

1. Confirm primary domain is `www.suhucustom.com`.
2. For `suhucustom.com` (apex): do **not** use Vercel’s built-in “Redirect to www”. Leave apex pointing at the same project **without** a platform redirect, so middleware owns the 301.
3. Env: `NEXT_PUBLIC_SITE_URL=https://www.suhucustom.com` (no trailing slash).
4. `suhucustom.vercel.app` should 301 to www (middleware). Do not treat it as a second public site.

**After deploy, verify (expect one 301, no `refresh` header):**

```bash
curl -sI "https://suhucustom.com/blog/leggings-size-chart" | grep -iE 'HTTP|location|refresh'
# → 301 Location: https://www.suhucustom.com/blog/leggings-size-chart/
curl -sI "https://www.suhucustom.com/blog/leggings-size-chart" | grep -iE 'HTTP|location|refresh'
# → 301 Location: …/blog/leggings-size-chart/
```

Then in Google Search Console: URL Inspection on a few canonical URLs → Request indexing. Soft-redirect reports clear over days/weeks.

## 7. Post-deploy smoke test

- [ ] Homepage loads (no broken images)
- [ ] `/robots.txt` and `/sitemap.xml` respond
- [ ] Contact form saves inquiry + sends email
- [ ] `/admin/login` — non-admin users blocked
- [ ] Blog CRUD in admin works
- [ ] CMS content save on homepage works
- [ ] Apex + slashless URLs: single 301, no `Refresh` header (see §6)

## 8. Content still to replace manually

Placeholder SVGs are used until real photos are uploaded. Run when ready:

```bash
npm run images:scan
npm run images:generate   # needs OPENAI_API_KEY
npm run images:apply
```

Or upload via admin CMS edit mode on editable pages.
