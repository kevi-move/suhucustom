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

## Recommended body sections

```markdown
Intro paragraph one...

Intro paragraph two...

## Key Points

- First key takeaway
- Second key takeaway
- Third key takeaway

## Main content starts here

...

## FAQ

**First question here?**

Answer paragraph here.

**Second question here?**

Answer paragraph here.
```

## Import behavior

| Section | Frontend result |
|--------|------------------|
| Intro paragraphs | Used as **AI Summary → Overview** if no `## AI Summary` section |
| `## AI Summary` | **AI Summary → Overview** tab |
| `## Key Points` | **AI Summary → Key Points** tab |
| `## FAQ` | Collapsible FAQ accordion + **FAQPage JSON-LD schema** |
| FAQ in body | Removed from main content during import (rendered separately) |

## Import command

```powershell
cd D:\UserData\Work\kevi_work\admin-test\apex-main\figma-ref\suhucustom
node scripts/import-blog-draft.mjs "D:\UserData\Work\kevi_work\admin-test\文章输出\your-article.md"
```

Posts are saved as **draft**. Upload images in `/admin/blog`, then publish when ready.
