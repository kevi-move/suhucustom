# 服务页前台可视化编辑规范

本文约定 `/services/*` 前台「可视化编辑」的架构，避免再出现：改文案不保留、文案串版、浅底白字、Tab/轮播点击失效等问题被拆东墙补西墙式修补。

## 1. 保存与展示的单一事实来源

| 情况 | CMS | 页面如何渲染 |
|------|-----|----------------|
| 新保存 | `mode: "visual-v2"` + `autoHtml` | **整页用保存的 HTML**（含文案与图片） |
| 旧数据 | 仅有旧 `autoHtml`（非 v2） | React 组件默认文案 + **只恢复已上传图片** |
| 无 CMS | — | React 组件默认 |

- 保存接口：`PUT /api/cms/content/`，写入时合并已有 JSON，并设置 `mode: "visual-v2"`。
- **禁止**再按「文字节点顺序」把旧 HTML 贴回新 React 树（会导致 Features/Process/FAQ 串文）。

## 2. 交互板块必须可水合（hydrate）

用 HTML 快照展示时，React 的 `onClick` / `useState` 会丢失。交互必须带稳定 `data-vedit-*`，并在 `VisualPageEditor` 里绑定：

| 板块 | 必需属性 |
|------|----------|
| 报价按钮 | `data-vedit-quote` / `data-vedit-quote-category` / `data-vedit-quote-title` |
| Customization | `data-vedit-customization-root` / `tab` / `id` / `detail`；**所有 Tab 的图+文案面板都要挂载**，非当前项用 CSS 隐藏 |
| Craftsmanship 横滑 | `data-vedit-features-root` / `data-vedit-features-scroller` / `data-vedit-features-scroll` |

新增交互控件时：**同一 PR** 补属性 + hydrate，禁止先上线再补点击。

## 3. 保存清洗

- 统一走 `captureSanitizedHtml` / `stripVisualEditArtifacts`。
- 去掉 `contenteditable` 与编辑态虚线框。
- 浅色背景（`bg-white` / `bg-slate-50` 等）上不得残留 `text-white` 或内联白色 `color`（编辑器/错误快照会导致「没颜色」）。
- 整页 HTML 可能较大，接口体积上限需覆盖（当前 5MB）。

## 4. 改动纪律

每次改可视化 CMS 前先写清要守住的不变量（文案持久化 / 图片 / Tab / 横滑 / 对比度），并只改相关文件。

上线后在 `/services/t-shirts/` 至少手测：

1. 改文案 → 保存 → 退出 → 刷新 → 文案仍在且可读  
2. Customization 左右 Tab 可切换图文  
3. Craftsmanship 左右箭头可横滑  
4. Get a Quote 可打开弹窗  

About / Home 的 `EditableText` 路径编辑是另一套系统，不要与服务页 HTML 快照混用同一套「临时补丁」逻辑。

## 5. 相关代码

- `src/components/cms/VisualPageEditor.tsx`
- `src/components/services/ServicePageClient.tsx`
- `src/lib/visualPageHtml.ts`
- `src/lib/serviceVisualMode.ts`
- Cursor 规则：`.cursor/rules/service-visual-cms.mdc`
