# 全站艺术字体 — 设计文档

**日期：** 2026-03-25
**项目：** chuyi-feiyi（梆鼓咚非遗文化网站）

---

## 需求

将全站所有文字替换为楷书风格艺术字体，提升视觉美感，与网站古典非遗主题相符。

---

## 字体方案

使用 **Ma Shan Zheng（马善政楷体）**，via Google Fonts CDN。

- 风格：楷书，古典雅致，所有尺寸均可读
- 加载：`font-display: swap`（已内含于 Google Fonts URL），不阻塞首屏渲染
- Fallback：`'STKaiti', 'KaiTi', cursive`（系统楷体，网络不可用时降级）
- 注意：Ma Shan Zheng 为单字重字体，无粗体变体，浏览器对 `font-weight: 700` 会做合成加粗，视觉上可接受

---

## 文件改动

**仅改动 `src/index.css`，共 3 处：**

### 1. 替换 Google Fonts 导入（第 1 行）

旧：
```css
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&family=Noto+Serif+SC:wght@600;700&display=swap');
```

新：
```css
@import url('https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&display=swap');
```

移除不再使用的 Noto Sans SC 和 Noto Serif SC，避免无用字体加载。

### 2. 更新 `--font-body` CSS 变量（`:root` 内，第 23 行）

旧：
```css
--font-body: 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif;
```

新：
```css
--font-body: 'Ma Shan Zheng', 'STKaiti', 'KaiTi', cursive;
```

### 3. 更新 `--font-display` CSS 变量（`:root` 内，第 24 行）

旧：
```css
--font-display: 'Noto Serif SC', 'STSong', serif;
```

新：
```css
--font-display: 'Ma Shan Zheng', 'STKaiti', 'KaiTi', cursive;
```

---

## 传播机制

- `:root` 上的 `font-family: var(--font-body)` 通过 CSS 继承覆盖全站正文
- `h1, h2, h3` 的 `font-family: var(--font-display)` 同步更新
- `App.css` 中约 14 处引用 `var(--font-body)` / `var(--font-display)` 的规则自动跟随变量更新，无需单独修改
- `App.css:1505` 处已有 `'Ma Shan Zheng', cursive` 硬编码，与新方案一致，无需改动
