# Blog Article Import Format

When preparing Markdown in `文章输出/`, include these sections so import creates **AI Summary**, **Key Points**, and **FAQ accordion + schema** automatically.

## Required front matter (before `---`)

```markdown
# Article Title

**SEO Title:** ...
**Meta Description:** ...
**URL Slug:** your-slug-here

---
```

YAML front matter at the top is also supported:

```yaml
---
seo_title: "..."
meta_description: "..."
url_slug: your-slug-here
---
```

When using YAML front matter, do **not** rely on `---` lines inside the article body — they are removed on import. Use blank lines between sections instead.

## Recommended body sections

```markdown
Intro paragraph one...

Intro paragraph two...

## Key Points

- First key takeaway
- Second key takeaway

## Main content starts here

...

## FAQ

**First question here?**

Answer paragraph here.

**Second question here?**

Answer paragraph here.
```

### FAQ format (important)

Use either:

```markdown
**Question here?**

Answer here.
```

or:

```markdown
### Question here?

Answer here.
```

Do **not** put FAQ only as `###` headings without a `## FAQ` section wrapper — the importer looks for `## FAQ` first.

## Do NOT include in the article body

| Avoid | Why |
|-------|-----|
| `## HowTo JSON-LD` / `## FAQPage JSON-LD` blocks | Stripped on import; FAQ schema is generated automatically |
| `- [ ]` task-list checkboxes | Converted to plain bullets automatically |
| Standalone `---` lines | Removed (they render as horizontal rules) |
| `<details>` JSON-LD appendix | Removed on import |

## Import behavior

| Section | Frontend result |
|--------|------------------|
| Intro paragraphs | Used as **AI Summary → Overview** if no `## AI Summary` section |
| `## AI Summary` | **AI Summary → Overview** tab |
| `## Key Points` / `## Key Takeaways` | **AI Summary → Key Points** tab |
| `## FAQ` | Collapsible FAQ accordion + **FAQPage JSON-LD schema** |
| FAQ in body | Removed from main content during import (rendered separately) |

## Import command

```powershell
cd D:\UserData\Work\kevi_work\admin-test\apex-main\figma-ref\suhucustom
node scripts/import-blog-draft.mjs "D:\UserData\Work\kevi_work\admin-test\文章输出\your-article.md"
```

Posts are saved as **draft**. Upload images in `/admin/blog`, then publish when ready.
