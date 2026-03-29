# 滚动揭示与悬停交互 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为梆鼓咚非遗文化平台首页添加滚动揭示动画和悬停增强效果，提升用户探索体验，风格古典沉稳。

**Architecture:** 使用浏览器原生 IntersectionObserver API 实现一次性滚动揭示（zero-dependency）；CSS transition 驱动动画；悬停效果完全由 CSS 实现。`useScrollReveal` hook 定义在 `App.jsx` 组件外部，路由切换时重新绑定。

**Tech Stack:** React (hooks), IntersectionObserver API, CSS transitions

---

## File Map

| 文件 | 变更类型 | 职责 |
|---|---|---|
| `src/App.jsx` | 修改 | 添加 hook、hook 调用、目标元素类名、媒体报道卡片类名改为 `news-card` |
| `src/App.css` | 修改 | 添加 Scroll Reveal CSS 区块、悬停增强规则、修复 `.work-card` 缺少 `position: relative` |

---

### Task 1：添加 `useScrollReveal` Hook

**Files:**
- Modify: `src/App.jsx`（顶部，组件外，约第 1 行后）

- [ ] **Step 1：在 App.jsx 顶部（`import` 之后、`const IMG` 之前）插入 hook 定义**

```js
function useScrollReveal(selector, routeName, options = {}) {
  useEffect(() => {
    const elements = document.querySelectorAll(selector)
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.12, ...options })
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [selector, routeName])
}
```

- [ ] **Step 2：在 App 组件内、现有 `useEffect` 调用之后，添加四个 hook 调用**

```js
useScrollReveal('.section-heading', route)
useScrollReveal('.reveal-up', route)
useScrollReveal('.reveal-left', route)
useScrollReveal('.reveal-scale', route)
```

- [ ] **Step 3：手动验证**

打开浏览器，刷新页面，打开 DevTools → Elements，确认 `.section-heading` 等元素在滚动到视口时动态添加了 `.revealed` 类。

- [ ] **Step 4：Commit**

```bash
git add src/App.jsx
git commit -m "feat: add useScrollReveal hook"
```

---

### Task 2：添加 Scroll Reveal CSS 规则

**Files:**
- Modify: `src/App.css`（末尾追加新区块）

- [ ] **Step 1：在 App.css 末尾追加以下 CSS 区块**

```css
/* ── Scroll Reveal ──────────────────────────────────────────────────────────── */

/* 标题揭示 */
.reveal-heading {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.9s ease-out, transform 0.9s ease-out;
}
.reveal-heading.revealed {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 0.9s ease-out, transform 0.9s ease-out;
}

/* 卡片上移揭示 */
.reveal-up {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s ease-out, transform 0.8s ease-out;
}
.reveal-up.revealed {
  opacity: 1;
  transform: translateY(0);
  /* 揭示完成后恢复快速 hover 过渡，避免与现有卡片 hover 规则冲突 */
  transition: opacity 0.3s ease-out, transform 0.3s ease-out, box-shadow 0.2s ease-out;
  transition-delay: 0s;
}

/* 媒体报道左滑揭示 */
.reveal-left {
  opacity: 0;
  transform: translateX(-20px);
  transition: opacity 0.7s ease-out, transform 0.7s ease-out;
}
.reveal-left.revealed {
  opacity: 1;
  transform: translateX(0);
  transition: opacity 0.3s ease-out, transform 0.3s ease-out, box-shadow 0.2s ease-out;
  transition-delay: 0s;
}

/* 名言横幅缩放揭示 */
.reveal-scale {
  opacity: 0;
  transform: scale(0.97);
  transition: opacity 1.0s ease-out, transform 1.0s ease-out;
}
.reveal-scale.revealed {
  opacity: 1;
  transform: scale(1);
  transition: opacity 1.0s ease-out, transform 1.0s ease-out;
}

/* nth-child 错落延迟（第一个卡片无延迟，后续递增） */
.reveal-up:nth-child(2) { transition-delay: 0.10s; }
.reveal-up:nth-child(3) { transition-delay: 0.20s; }
.reveal-up:nth-child(4) { transition-delay: 0.30s; }

.reveal-left:nth-child(2) { transition-delay: 0.08s; }
.reveal-left:nth-child(3) { transition-delay: 0.16s; }

/* 无障碍：对动画敏感用户直接显示，跳过所有动画 */
@media (prefers-reduced-motion: reduce) {
  .reveal-heading,
  .reveal-up,
  .reveal-left,
  .reveal-scale {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
    transition-delay: 0s !important;
  }
}
```

- [ ] **Step 2：手动验证**

刷新页面，滚动首页，确认各区块元素从透明/偏移状态过渡到可见状态，动画缓慢流畅（约 0.8–1.0s）。

- [ ] **Step 3：Commit**

```bash
git add src/App.css
git commit -m "feat: add scroll reveal CSS rules"
```

---

### Task 3：给首页元素添加揭示类名

**Files:**
- Modify: `src/App.jsx`（`renderHome` 函数内，约第 583–764 行）

在 `renderHome` 函数中，对以下元素追加对应类名：

**3a. 所有 `.section-heading`**

将：
```jsx
<div className="section-heading">
```
改为：
```jsx
<div className="section-heading reveal-heading">
```
共有 5 处（精选作品、传承人风采、媒体报道、近期活动，加上名言横幅前后的任意其他 heading）。

- [ ] **Step 1：定位 `renderHome` 中所有 `section-heading` 并追加 `reveal-heading`**

搜索 `renderHome` 函数范围内的 `className="section-heading"` 并逐一替换为 `className="section-heading reveal-heading"`。

**3b. 精选作品卡片**

将：
```jsx
<a key={work.id} href="#/works" className="work-card">
```
改为：
```jsx
<a key={work.id} href="#/works" className="work-card reveal-up">
```

**3c. 传承人卡片**

将：
```jsx
<div key={person.id} className="inheritor-card">
```
改为：
```jsx
<div key={person.id} className="inheritor-card reveal-up">
```

**3d. 近期活动卡片**（`activitiesData.map` 内）

将：
```jsx
<div key={act.id} className="activity-card">
```
改为：
```jsx
<div key={act.id} className="activity-card reveal-up">
```

**3e. 名言横幅**

将：
```jsx
<div className="xi-quote-banner">
```
改为：
```jsx
<div className="xi-quote-banner reveal-scale">
```

- [ ] **Step 2：手动验证**

刷新首页，滚动页面，确认精选作品卡片、传承人卡片、活动卡片、名言横幅均有揭示动画，且错落有序（卡片间有 0.1s 延迟）。

- [ ] **Step 3：Commit**

```bash
git add src/App.jsx
git commit -m "feat: add reveal class names to home page elements"
```

---

### Task 4：改造媒体报道卡片（news-card）

**Files:**
- Modify: `src/App.jsx`（`renderHome` 函数内，媒体报道区块，约第 684–730 行）

媒体报道卡片当前使用 `activity-card` 类名，需改为 `news-card` 以区分动画方向（左滑入 vs 上移入）。

- [ ] **Step 1：将媒体报道的 `.map` 渲染中 `activity-card` 改为 `news-card reveal-left`**

定位：`{/* 媒体报道 */}` 区块内的 `.map((n) => (` 回调，将：
```jsx
<div key={n.id} className="activity-card">
```
改为：
```jsx
<div key={n.id} className="news-card reveal-left">
```

- [ ] **Step 2：在 App.css 中为 `news-card` 添加样式继承**

在 `src/App.css` 中找到现有的 `.activity-card` 规则（约第 731 行），在选择器中添加 `.news-card`，让 `news-card` 复用所有 `activity-card` 的样式。将：
```css
.activity-card {
```
改为：
```css
.activity-card,
.news-card {
```

对所有含 `.activity-card` 的 CSS 规则（包括 `.activity-card:hover`、`.activity-card .activity-img` 等子选择器）均同步追加 `.news-card` 变体，确保样式一致。

- [ ] **Step 3：手动验证**

刷新首页，确认媒体报道三张卡片从左侧滑入（而非从下方上移），样式与之前一致。

- [ ] **Step 4：Commit**

```bash
git add src/App.jsx src/App.css
git commit -m "feat: rename media cards to news-card for left-slide reveal"
```

---

### Task 5：悬停增强效果

**Files:**
- Modify: `src/App.css`（在现有卡片规则之后追加 hover 增强）

- [ ] **Step 1：修复 `.work-card` 缺少 `position: relative`**

找到 `src/App.css` 第 591 行的 `.work-card {` 规则，在其中添加 `position: relative;`。

- [ ] **Step 2：追加作品卡片悬停渐变遮罩**

在 `.work-card` 的现有 hover 规则之后追加：

```css
.work-card::after {
  content: '';
  pointer-events: none;
  position: absolute;
  inset: 0;
  background: linear-gradient(transparent 50%, rgba(122, 14, 14, 0.45));
  opacity: 0;
  transition: opacity 0.35s ease-out;
}
.work-card:hover::after {
  opacity: 1;
}
.work-card:hover .work-card-img img {
  transform: scale(1.04);
}
```

- [ ] **Step 3：追加传承人卡片悬停效果**

在 `.inheritor-card` 的现有 hover 规则之后追加：

```css
.inheritor-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 28px rgba(192, 57, 43, 0.18);
}
.inheritor-card:hover .inheritor-avatar {
  box-shadow: 0 0 0 3px #C8A415;
  transition: box-shadow 0.35s ease-out;
}
```

- [ ] **Step 4：追加活动卡片悬停效果（inset 左线 + 按钮浮起）**

在 `.activity-card` 的现有 hover 规则之后追加：

```css
.activity-card:hover,
.news-card:hover {
  box-shadow: inset 3px 0 0 #C0392B, 0 6px 20px rgba(0, 0, 0, 0.12);
}
.activity-card:hover .activity-btn,
.news-card:hover .activity-btn {
  opacity: 1;
  transform: translateY(-2px);
}
```

- [ ] **Step 5：手动验证**

在桌面端浏览器中，悬停各卡片：
- 作品卡片：底部出现红色渐变遮罩，图片轻微放大
- 传承人卡片：整体上浮 4px，头像出现金色圆圈
- 活动/媒体卡片：左侧出现朱红竖线，卡片阴影加深

- [ ] **Step 6：Commit**

```bash
git add src/App.css
git commit -m "feat: add hover enhancement effects to cards"
```

---

### Task 6：最终验收

- [ ] **Step 1：完整浏览首页**

从顶部滚动到底部，确认：
1. 名言横幅缩放淡入
2. 各区块标题从下淡入
3. 精选作品、传承人、活动卡片错落上移淡入
4. 媒体报道卡片从左滑入
5. 所有动画只触发一次（向上滚动后再向下，不重复播放）

- [ ] **Step 2：切换路由再返回首页**

点击导航切换到"非遗作品"页，再点击"首页"，确认回到首页后动画重新播放。

- [ ] **Step 3：（可选）测试 `prefers-reduced-motion`**

在 DevTools → Rendering → Emulate CSS media feature → `prefers-reduced-motion: reduce`，刷新页面，确认所有元素直接显示，无动画。

- [ ] **Step 4：最终 Commit**

```bash
git add src/App.jsx src/App.css
git commit -m "feat: complete scroll reveal and hover interaction enhancements"
```
