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
| `NEXT_PUBLIC_SITE_URL` | `https://yourdomain.com` |
| `NOTIFY_TO_EMAIL` | Inquiry notification inbox |
| `RESEND_API_KEY` | Email delivery |
| `INQUIRY_FROM_EMAIL` | Verified domain sender |

**Optional:**

| Variable | Notes |
|----------|-------|
| `DEEPL_API_KEY` | Auto-translation |
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

## 6. Post-deploy smoke test

- [ ] Homepage loads (no broken images)
- [ ] `/robots.txt` and `/sitemap.xml` respond
- [ ] Contact form saves inquiry + sends email
- [ ] `/admin/login` — non-admin users blocked
- [ ] Blog CRUD in admin works
- [ ] CMS content save on homepage works

## 7. Content still to replace manually

Placeholder SVGs are used until real photos are uploaded. Run when ready:

```bash
npm run images:scan
npm run images:generate   # needs OPENAI_API_KEY
npm run images:apply
```

Or upload via admin CMS edit mode on editable pages.
