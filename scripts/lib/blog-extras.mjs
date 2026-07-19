export function injectBlogExtrasIntoContent(content, extras) {
  const cleaned = stripBlogExtrasFromContent(content);
  const marker = `<div data-blog-extras="${encodeURIComponent(JSON.stringify(extras))}" hidden aria-hidden="true"></div>`;
  return `${marker}\n${cleaned}`.trim();
}

export function stripBlogExtrasFromContent(content) {
  if (!content) return "";
  return content
    .replace(
      /<div\s+data-blog-extras="[^"]*"\s+hidden\s+aria-hidden="true"\s*><\/div>\s*/i,
      ""
    )
    .trim();
}
